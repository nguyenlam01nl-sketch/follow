<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ServiceNotification;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ExternalServiceController extends Controller
{
    private function getExternalServicesData()
    {
        return cache()->remember('external_services', 3600, function () {
            $baseUrl = config('services.external_api.base_url');
            $apiKey = config('services.external_api.token');

            if (!$baseUrl || !$apiKey) {
                return null;
            }

            $response = Http::asForm()->post($baseUrl, [
                'key' => $apiKey,
                'action' => 'services',
            ]);

            if (!$response->successful()) {
                return null;
            }

            return $response->json();
        });
    }

    private function findExternalService(int $serviceId): ?array
    {
        $data = $this->getExternalServicesData();

        if (!$data || !is_array($data)) {
            return null;
        }

        // Nếu API trả về dạng { data: [...] }
        $services = isset($data['data']) && is_array($data['data'])
            ? $data['data']
            : $data;

        foreach ($services as $service) {
            if ((int) ($service['service'] ?? 0) === $serviceId) {
                return $service;
            }
        }

        return null;
    }

    private function validateLinkFormat(?array $service, string $link): ?string
    {
        if (!$service || empty($service['desc'])) {
            return null;
        }

        $description = $service['desc'];

        if (preg_match_all('/https?:\/\/[^\s<>"\'`]+|www\.[^\s<>"\'`]+/', $description, $matches)) {
            $patterns = $matches[0];

            foreach ($patterns as $pattern) {
                if ($this->linkMatchesPattern($link, $pattern)) {
                    return null;
                }
            }

            if (!empty($patterns)) {
                return 'Link không đúng định dạng. Vui lòng nhập link dạng: ' . $patterns[0];
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

    public function getServices()
    {
        $baseUrl = config('services.external_api.base_url');
        $apiKey = config('services.external_api.token');

        if (!$baseUrl || !$apiKey) {
            return response()->json([
                'message' => 'Thiếu EXTERNAL_API_BASE_URL hoặc EXTERNAL_API_TOKEN trong .env',
            ], 500);
        }

        $response = Http::asForm()->post($baseUrl, [
            'key' => $apiKey,
            'action' => 'services',
        ]);

        return response()->json($response->json(), $response->status());
    }

    public function createOrder(Request $request)
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Chưa đăng nhập hoặc token không hợp lệ',
            ], 401);
        }

        $data = $request->validate([
            'service' => ['required'],
            'link' => ['required', 'string'],
            'quantity' => ['required', 'integer', 'min:1'],
            'comments' => ['nullable', 'string'],
            'note' => ['nullable', 'string'],
        ]);

        $serviceId = (int) $data['service'];
        $quantity = (int) $data['quantity'];

        $externalService = $this->findExternalService($serviceId);

        if (!$externalService) {
            return response()->json([
                'message' => 'Không tìm thấy dịch vụ external',
            ], 404);
        }

        $linkError = $this->validateLinkFormat($externalService, $data['link']);
        if ($linkError) {
            return response()->json([
                'message' => $linkError,
            ], 422);
        }

        $min = isset($externalService['min']) ? (int) $externalService['min'] : 0;
        $max = isset($externalService['max']) ? (int) $externalService['max'] : 0;

        if ($min > 0 && $quantity < $min) {
            return response()->json([
                'message' => "Số lượng tối thiểu là {$min}",
            ], 422);
        }

        if ($max > 0 && $quantity > $max) {
            return response()->json([
                'message' => "Số lượng tối đa là {$max}",
            ], 422);
        }

        $serviceType = strtolower((string) ($externalService['type'] ?? ''));
        $serviceNameLower = strtolower((string) ($externalService['name'] ?? ''));
        $serviceCategoryLower = strtolower((string) ($externalService['category'] ?? ''));

        $isCommentService =
            str_contains($serviceType, 'comment') ||
            str_contains($serviceNameLower, 'comment') ||
            str_contains($serviceCategoryLower, 'comment');

        if ($isCommentService && empty($data['comments'] ?? null)) {
            return response()->json([
                'message' => 'Dịch vụ comment bắt buộc phải nhập nội dung comment',
            ], 422);
        }

        $baseUrl = config('services.external_api.base_url');
        $apiKey = config('services.external_api.token');

        if (!$baseUrl || !$apiKey) {
            return response()->json([
                'message' => 'Thiếu EXTERNAL_API_BASE_URL hoặc EXTERNAL_API_TOKEN trong .env',
            ], 500);
        }

        $rate = isset($externalService['rate']) ? (float) $externalService['rate'] : 0;
        $totalPrice = $rate * $quantity;

        $user = $request->user();

        if ((float) $user->balance < (float) $totalPrice) {
            return response()->json([
                'message' => 'Số dư không đủ để thực hiện giao dịch',
            ], 422);
        }

        $payload = [
            'key' => $apiKey,
            'action' => 'add',
            'service' => $serviceId,
            'link' => $data['link'],
            'quantity' => $quantity,
        ];

        if (!empty($data['comments'] ?? null)) {
            $payload['comments'] = $data['comments'];
        }

        $response = Http::asForm()->post($baseUrl, $payload);

        if (!$response->successful()) {
            return response()->json(
                $response->json() ?: ['message' => 'Không thể tạo đơn ở external API'],
                $response->status()
            );
        }

        try {
            $order = DB::transaction(function () use ($request, $data, $serviceId, $quantity, $externalService, $rate, $totalPrice, $response, $user) {
                $serviceName = $externalService['name'] ?? ('#' . $serviceId);

                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'service_id' => null,
                    'service_name' => $serviceName,
                    'platform' => $externalService['platform'] ?? 'External',
                    'mode' => 'api',
                    'target_link' => $data['link'],
                    'quantity' => $quantity,
                    'unit_price' => $rate,
                    'total_price' => $totalPrice,
                    'note' => $data['note'] ?? null,
                    'form_data' => !empty($data['comments'] ?? null)
                        ? ['comments' => $data['comments']]
                        : null,
                    'selected_price' => $rate,
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
                        'unit_price' => $order->unit_price,
                        'total_price' => $order->total_price,
                        'external_api_response' => $response->json(),
                    ], JSON_UNESCAPED_UNICODE),
                    'status' => 'pending',
                ]);

                return $order;
            });

            return response()->json([
                'message' => 'Đã tạo đơn thành công',
                'order' => $order,
                'external_response' => $response->json(),
                'balance' => (float) $request->user()->fresh()->balance,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi lưu đơn vào database',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
