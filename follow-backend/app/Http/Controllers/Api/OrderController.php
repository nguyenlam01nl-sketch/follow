<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Service;
use App\Models\ServiceNotification;
use App\Models\WalletTransaction;
use App\Services\AdminMailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class OrderController extends Controller
{
    private function validateLinkFormat(Service $service, string $link): ?string
    {
        if ($service->mode !== 'manual' || !$service->description) {
            return null;
        }

        $description = $service->description;

        if (preg_match_all('/https?:\/\/[^\s<>"\'`]+|www\.[^\s<>"\'`]+/', $description, $matches)) {
            $patterns = $matches[0];

            foreach ($patterns as $pattern) {
                if ($this->linkMatchesPattern($link, $pattern)) {
                    return null;
                }
            }

            if (!empty($patterns)) {
                $exampleLink = $patterns[0];
                return 'Link không đúng định dạng. Vui lòng nhập link dạng: ' . $exampleLink;
            }
        }

        return null;
    }

    private function linkMatchesPattern(string $link, string $pattern): bool
    {
        if (preg_match('/(https?:\/\/)?([^\/]+)/', $pattern, $patternMatch)) {
            $patternDomain = $patternMatch[2];

            if (preg_match('/(https?:\/\/)?([^\/]+)/', $link, $linkMatch)) {
                $linkDomain = $linkMatch[2];

                $patternDomain = str_replace('www.', '', $patternDomain);
                $linkDomain = str_replace('www.', '', $linkDomain);

                return strpos($linkDomain, $patternDomain) !== false;
            }
        }

        return false;
    }

    private function findValueByKeywords(array $formData, array $keywords): mixed
    {
        foreach ($formData as $key => $value) {
            $keyLower = strtolower((string) $key);

            foreach ($keywords as $keyword) {
                if (str_contains($keyLower, strtolower($keyword))) {
                    return $value;
                }
            }
        }

        return null;
    }

    public function index(Request $request)
    {
        return response()->json(
            Order::query()
                ->where('user_id', $request->user()->id)
                ->latest()
                ->get()
        );
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Không có quyền truy cập'], 403);
        }

        return response()->json($order);
    }

    public function store(Request $request, AdminMailService $adminMailService)
    {
        $data = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'form_data' => ['nullable', 'array'],
            'selected_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        $service = Service::findOrFail($data['service_id']);
        $formData = $data['form_data'] ?? [];

        if (!empty($service->form_schema) && is_array($service->form_schema)) {
            foreach ($service->form_schema as $field) {
                $fieldName = $field['name'] ?? null;
                $isRequired = $field['required'] ?? false;
                $fieldType = $field['type'] ?? 'text';

                if (!$fieldName || !$isRequired) {
                    continue;
                }

                $value = $formData[$fieldName] ?? null;

                if ($fieldType === 'checkbox') {
                    if (!$value) {
                        return response()->json([
                            'message' => 'Vui lòng xác nhận: ' . ($field['label'] ?? $fieldName),
                        ], 422);
                    }
                } else {
                    if ($value === null || $value === '') {
                        return response()->json([
                            'message' => 'Vui lòng nhập/chọn: ' . ($field['label'] ?? $fieldName),
                        ], 422);
                    }

                    if (
                        $fieldType === 'text' &&
                        (
                            str_contains(strtolower($field['name'] ?? ''), 'link') ||
                            str_contains(strtolower($field['label'] ?? ''), 'link')
                        )
                    ) {
                        $linkError = $this->validateLinkFormat($service, (string) $value);
                        if ($linkError) {
                            return response()->json(['message' => $linkError], 422);
                        }
                    }
                }
            }
        }

        $targetLink = $this->findValueByKeywords($formData, ['link', 'url']);
        $quantityRaw = $this->findValueByKeywords($formData, ['quantity', 'so_luong', 'soluong', 'amount']);
        $note = $this->findValueByKeywords($formData, ['note', 'ghi_chu', 'ghichu', 'content', 'message']);

        if (!$targetLink) {
            $targetLink = $request->input('target_link');
        }

        if (!$quantityRaw) {
            $quantityRaw = $request->input('quantity');
        }

        if (!$note) {
            $note = $request->input('note');
        }

        if ($service->requires_link && empty($targetLink)) {
            return response()->json(['message' => 'Thiếu link mục tiêu'], 422);
        }

        if ($service->requires_link && !empty($targetLink)) {
            $linkError = $this->validateLinkFormat($service, (string) $targetLink);
            if ($linkError) {
                return response()->json(['message' => $linkError], 422);
            }
        }

        $quantity = 1;
        if ($service->requires_quantity) {
            $quantity = (int) ($quantityRaw ?? 0);

            if ($quantity < 1) {
                return response()->json(['message' => 'Thiếu số lượng hợp lệ'], 422);
            }
        }

        if ($service->requires_note && empty($note)) {
            return response()->json(['message' => 'Thiếu ghi chú'], 422);
        }

        $unitPrice = isset($data['selected_price'])
            ? (float) $data['selected_price']
            : (float) $service->price;

        $totalPrice = $service->requires_quantity
            ? ($unitPrice * $quantity)
            : $unitPrice;

        $user = $request->user();

        if ((float) $user->balance < (float) $totalPrice) {
            return response()->json([
                'message' => 'Số dư không đủ để thực hiện giao dịch',
            ], 422);
        }

        try {
            $order = DB::transaction(function () use (
                $request,
                $service,
                $formData,
                $targetLink,
                $quantity,
                $note,
                $unitPrice,
                $totalPrice,
                $user
            ) {
                Log::info('Order creation attempt', [
                    'user_id' => $request->user()->id,
                    'service_id' => $service->id,
                    'form_data' => $formData,
                    'target_link' => $targetLink,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ]);

                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'service_id' => $service->id,
                    'service_name' => $service->name,
                    'platform' => $service->platform ?? 'Unknown',
                    'mode' => $service->mode,
                    'target_link' => $targetLink ?: null,
                    'quantity' => $service->requires_quantity ? $quantity : null,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                    'note' => $note ?: null,
                    'form_data' => !empty($formData) ? $formData : null,
                    'selected_price' => (int) $unitPrice,
                    'status' => 'pending',
                ]);

                $user->balance = (float) $user->balance - (float) $totalPrice;
                $user->save();

                WalletTransaction::create([
                    'user_id' => $user->id,
                    'title' => 'Thanh toán đơn hàng: ' . $order->service_name,
                    'amount' => $totalPrice,
                    'type' => 'payment',
                    'status' => 'completed',
                    'payment_method' => 'wallet',
                    'note' => 'Order #' . $order->id,
                ]);

                ServiceNotification::create([
                    'order_id' => $order->id,
                    'channel' => 'telegram',
                    'payload' => json_encode([
                        'order_id' => $order->id,
                        'service_name' => $order->service_name,
                        'platform' => $order->platform,
                        'target_link' => $order->target_link,
                        'quantity' => $order->quantity,
                        'note' => $order->note,
                        'form_data' => $order->form_data,
                        'unit_price' => $order->unit_price,
                        'total_price' => $order->total_price,
                    ], JSON_UNESCAPED_UNICODE),
                    'status' => 'pending',
                ]);

                Log::info('Order created successfully', [
                    'order_id' => $order->id,
                ]);

                return $order;
            });

            $adminMailService->send(
                'emails.admin-order-notification',
                [
                    'order' => $order,
                    'user' => $user,
                ],
                'Có đơn hàng mới - Sola Vietnam',
                [
                    'order_id' => $order->id ?? null,
                    'user_id' => $user->id ?? null,
                    'type' => 'order',
                ]
            );
        } catch (\Exception $e) {
            Log::error('Order creation failed', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id,
                'service_id' => $service->id,
                'data' => $data,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Lỗi lưu đơn vào database: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Đã tạo đơn thành công',
            'order' => $order,
            'balance' => (float) $request->user()->fresh()->balance,
        ], 201);
    }

    public function refreshStatus(Request $request, $id)
    {
        $order = \App\Models\Order::findOrFail($id);

        if (!$order->external_order_id) {
            return response()->json([
                'message' => 'Không có external_order_id',
            ], 400);
        }

        try {
            $response = Http::asForm()->post(env('EXTERNAL_API_URL'), [
                'key' => env('EXTERNAL_API_KEY'),
                'action' => 'status',
                'order' => $order->external_order_id,
            ]);

            $data = $response->json();

            if (!$data || isset($data['error'])) {
                return response()->json([
                    'message' => 'API lỗi',
                    'error' => $data['error'] ?? null,
                ], 500);
            }

            $status = strtolower($data['status'] ?? '');

            if ($status === 'success') {
                $status = 'completed';
            }
            if ($status === 'processing') {
                $status = 'processing';
            }
            if ($status === 'pending') {
                $status = 'pending';
            }

            $order->update([
                'external_status' => $data['status'] ?? null,
                'status' => $status,
                'api_charge' => isset($data['charge']) ? (float) str_replace(',', '', $data['charge']) : null,
                'api_start_count' => isset($data['start_count']) ? (int) $data['start_count'] : null,
                'api_remains' => isset($data['remains']) ? (int) $data['remains'] : null,
            ]);

            return response()->json([
                'message' => 'OK',
                'order' => $order,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Lỗi gọi API',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function cancelOrder(Request $request, $id)
    {
        $order = \App\Models\Order::findOrFail($id);

        if (!$request->user() || $order->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Không có quyền thao tác đơn này',
            ], 403);
        }

        if (!$order->external_order_id) {
            return response()->json([
                'message' => 'Đơn không có mã external_order_id',
            ], 422);
        }

        $baseUrl = config('services.external_api.base_url');
        $apiKey = config('services.external_api.token');

        if (!$baseUrl || !$apiKey) {
            return response()->json([
                'message' => 'Thiếu cấu hình external api',
            ], 500);
        }

        try {
            $response = Http::asForm()->post($baseUrl, [
                'key' => $apiKey,
                'action' => 'cancel',
                'order' => $order->external_order_id,
            ]);

            $data = $response->json();

            if (
                !$response->successful() ||
                !$data ||
                (int) ($data['cancel'] ?? 0) !== 1
            ) {
                return response()->json([
                    'message' => 'Huỷ đơn thất bại',
                    'api_response' => $data,
                ], 422);
            }

            $order->update([
                'status' => 'cancelled',
                'external_status' => 'Cancelled',
            ]);

            return response()->json([
                'message' => 'Huỷ đơn thành công',
                'order' => $order->fresh(),
                'api_response' => $data,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Lỗi gọi API huỷ đơn',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}