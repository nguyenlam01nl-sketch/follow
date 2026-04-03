<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ServiceNotification;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\ExternalServicePrice;

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

     $response = Http::withOptions([
    'allow_redirects' => false,
])->asForm()->post($baseUrl, [
    'key' => $apiKey,
    'action' => 'services',
]);

Log::info('External services debug', [
    'url' => $baseUrl,
    'status' => $response->status(),
    'headers' => $response->headers(),
    'body' => $response->body(),
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

    private function extractExternalOrderId(array $responseData): ?string
    {
        $orderId =
            $responseData['order']
            ?? $responseData['data']['order']
            ?? $responseData['id']
            ?? $responseData['data']['id']
            ?? null;

        return $orderId !== null ? (string) $orderId : null;
    }

    private function extractExternalStatus(array $responseData): ?string
    {
        return $responseData['status']
            ?? $responseData['data']['status']
            ?? null;
    }

    private function extractApiCharge(array $responseData): ?float
    {
        $charge = $responseData['charge']
            ?? $responseData['data']['charge']
            ?? null;

        if ($charge === null || $charge === '') {
            return null;
        }

        return (float) str_replace(',', '', (string) $charge);
    }

    private function extractApiStartCount(array $responseData): ?int
    {
        $startCount = $responseData['start_count']
            ?? $responseData['data']['start_count']
            ?? null;

        if ($startCount === null || $startCount === '') {
            return null;
        }

        return (int) $startCount;
    }

    private function extractApiRemains(array $responseData): ?int
    {
        $remains = $responseData['remains']
            ?? $responseData['data']['remains']
            ?? null;

        if ($remains === null || $remains === '') {
            return null;
        }

        return (int) $remains;
    }

  private function sendOrderCreatedEmail(Order $order, array $responseData = []): void
{
    $recipients = [
        'nguyenlamit2001@gmail.com',
        'nguyenlam01nl@gmail.com',
        'leoshinenguyen36211@gmail.com',
    ];

    $subject = 'Có đơn hàng external mới - Sola Vietnam';

    $externalOrderId = $order->external_order_id ?? 'Không có';
    $externalStatus = $order->external_status ?? 'Không có';
    $apiCharge = $order->api_charge !== null ? $order->api_charge : 'Không có';
    $apiStartCount = $order->api_start_count !== null ? $order->api_start_count : 'Không có';
    $apiRemains = $order->api_remains !== null ? $order->api_remains : 'Không có';

    $comments = null;
    if (is_array($order->form_data) && !empty($order->form_data['comments'])) {
        $comments = $order->form_data['comments'];
    }

    Mail::send('emails.new-external-order', [
        'order' => $order,
        'comments' => $comments,
        'externalOrderId' => $externalOrderId,
        'externalStatus' => $externalStatus,
        'apiCharge' => $apiCharge,
        'apiStartCount' => $apiStartCount,
        'apiRemains' => $apiRemains,
        'rawResponse' => json_encode($responseData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
    ], function ($message) use ($recipients, $subject) {
        $message->to($recipients)->subject($subject);
    });
}

    public function getServices()
    {
        $data = $this->getExternalServicesData();

        if (!$data || !is_array($data)) {
            return response()->json([
                'message' => 'Không lấy được dịch vụ external'
            ], 500);
        }

        $services = isset($data['data']) && is_array($data['data'])
            ? $data['data']
            : $data;

        $priceRows = ExternalServicePrice::all()->keyBy('provider_service_id');

        $mapped = collect($services)->map(function ($item) use ($priceRows) {
            $serviceId = (int) ($item['service'] ?? 0);
            $override = $priceRows->get($serviceId);

            if ($override) {
                $item['name'] = $override->name ?? ($item['name'] ?? '');
                $item['desc'] = $override->desc ?? ($item['desc'] ?? '');
                $item['original_rate'] = $override->original_rate;
                $item['sell_rate'] = $override->sell_rate;
                $item['rate_per'] = $override->rate_per;
                $item['min'] = $override->min;
                $item['max'] = $override->max;
                $item['platform'] = $override->platform ?? ($item['platform'] ?? '');
                $item['category'] = $override->category ?? ($item['category'] ?? '');
                $item['status'] = $override->status ?? ($item['status'] ?? 'active');
            } else {
                $item['original_rate'] = $item['rate'] ?? 0;
                $item['sell_rate'] = $item['rate'] ?? 0;
                $item['rate_per'] = $item['rate_per'] ?? 1000;
            }

            return $item;
        })->values();

        return response()->json([
            'data' => $mapped
        ]);
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

        $priceOverride = ExternalServicePrice::query()
            ->where('provider_service_id', $serviceId)
            ->first();

        if ($priceOverride) {
            $externalService['name'] = $priceOverride->name ?? ($externalService['name'] ?? '');
            $externalService['desc'] = $priceOverride->desc ?? ($externalService['desc'] ?? '');
            $externalService['original_rate'] = $priceOverride->original_rate;
            $externalService['sell_rate'] = $priceOverride->sell_rate;
            $externalService['rate_per'] = $priceOverride->rate_per;
            $externalService['min'] = $priceOverride->min;
            $externalService['max'] = $priceOverride->max;
            $externalService['platform'] = $priceOverride->platform ?? ($externalService['platform'] ?? '');
            $externalService['category'] = $priceOverride->category ?? ($externalService['category'] ?? '');
            $externalService['status'] = $priceOverride->status ?? ($externalService['status'] ?? 'active');
        } else {
            $externalService['original_rate'] = $externalService['rate'] ?? 0;
            $externalService['sell_rate'] = $externalService['rate'] ?? 0;
            $externalService['rate_per'] = $externalService['rate_per'] ?? 1000;
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

        $rawRate = (float) ($externalService['sell_rate'] ?? $externalService['rate'] ?? 0);
        $ratePer = (int) ($externalService['rate_per'] ?? 1000);

        if ($ratePer <= 0) {
            $ratePer = 1000;
        }

        $unitPrice = $rawRate / $ratePer;
        $totalPrice = $unitPrice * $quantity;

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

     $response = Http::withOptions([
    'allow_redirects' => false,
])->asForm()->post($baseUrl, $payload);

Log::info('External create order debug', [
    'url' => $baseUrl,
    'payload' => $payload,
    'status' => $response->status(),
    'headers' => $response->headers(),
    'body' => $response->body(),
]);

$responseData = $response->json();

        if (!$response->successful()) {
            return response()->json(
                $responseData ?: ['message' => 'Không thể tạo đơn ở external API'],
                $response->status()
            );
        }

        try {
            $order = DB::transaction(function () use (
                $request,
                $data,
                $serviceId,
                $quantity,
                $externalService,
                $unitPrice,
                $totalPrice,
                $responseData,
                $user
            ) {
                $serviceName = $externalService['name'] ?? ('#' . $serviceId);

                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'service_id' => null,
                    'service_name' => $serviceName,
                    'platform' => $externalService['platform'] ?? 'External',
                    'mode' => 'api',
                    'target_link' => $data['link'],
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                    'note' => $data['note'] ?? null,
                    'form_data' => !empty($data['comments'] ?? null)
                        ? ['comments' => $data['comments']]
                        : null,
                    'selected_price' => $unitPrice,
                    'status' => 'pending',
                    'external_order_id' => $this->extractExternalOrderId($responseData),
                    'external_status' => $this->extractExternalStatus($responseData),
                    'api_charge' => $this->extractApiCharge($responseData),
                    'api_start_count' => $this->extractApiStartCount($responseData),
                    'api_remains' => $this->extractApiRemains($responseData),
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
                        'external_api_response' => $responseData,
                    ], JSON_UNESCAPED_UNICODE),
                    'status' => 'pending',
                ]);

                return $order;
            });

            try {
                $this->sendOrderCreatedEmail($order, is_array($responseData) ? $responseData : []);
            } catch (\Exception $mailException) {
                Log::error('Gửi email thông báo đơn hàng thất bại: ' . $mailException->getMessage(), [
                    'order_id' => $order->id ?? null,
                ]);
            }

            return response()->json([
                'message' => 'Đã tạo đơn thành công',
                'order' => $order,
                'external_response' => $responseData,
                'balance' => (float) $request->user()->fresh()->balance,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi lưu đơn vào database',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $serviceId)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'desc' => ['nullable', 'string'],
            'original_rate' => ['required', 'numeric', 'min:0'],
            'sell_rate' => ['required', 'numeric', 'min:0'],
            'rate_per' => ['required', 'integer', 'min:1'],
            'min' => ['nullable', 'integer', 'min:0'],
            'max' => ['nullable', 'integer', 'min:0'],
            'platform' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
        ]);

        $row = ExternalServicePrice::updateOrCreate(
            ['provider_service_id' => $serviceId],
            [
                'name' => $data['name'],
                'desc' => $data['desc'] ?? null,
                'original_rate' => $data['original_rate'],
                'sell_rate' => $data['sell_rate'],
                'rate_per' => $data['rate_per'],
                'min' => $data['min'] ?? null,
                'max' => $data['max'] ?? null,
                'platform' => $data['platform'] ?? null,
                'category' => $data['category'] ?? null,
                'status' => $data['status'],
            ]
        );

        return response()->json([
            'message' => 'Đã cập nhật giá bán dịch vụ',
            'data' => $row,
        ]);
    }
}