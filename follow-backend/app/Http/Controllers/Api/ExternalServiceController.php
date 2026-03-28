<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ServiceNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ExternalServiceController extends Controller
{
    /**
     * Get cached external services or fetch from API
     */
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

            return $response->successful() ? $response->json() : null;
        });
    }

    /**
     * Find service by ID from external API data
     */
    private function findExternalService(int $serviceId)
    {
        $data = $this->getExternalServicesData();
        if (!$data || !isset($data['data'])) {
            return null;
        }

        $services = $data['data'];
        if (!is_array($services)) {
            return null;
        }

        foreach ($services as $service) {
            if (($service['service'] ?? null) == $serviceId) {
                return $service;
            }
        }

        return null;
    }

    /**
     * Validate link format from service description
     */
    private function validateLinkFormat(?array $service, string $link): ?string
    {
        if (!$service || empty($service['desc'])) {
            return null;
        }

        $description = $service['desc'];

        // Extract link patterns from description
        if (preg_match_all('/https?:\/\/[^\s<>"\'`]+|www\.[^\s<>"\'`]+/', $description, $matches)) {
            $patterns = $matches[0];

            // Validate against each pattern
            foreach ($patterns as $pattern) {
                if ($this->linkMatchesPattern($link, $pattern)) {
                    return null;
                }
            }

            // If we found patterns but link doesn't match any, return error
            if (!empty($patterns)) {
                $exampleLink = $patterns[0];
                return "Link không đúng định dạng. Vui lòng nhập link dạng: " . $exampleLink;
            }
        }

        return null;
    }

    /**
     * Check if link matches the pattern (domain + structure)
     */
    private function linkMatchesPattern(string $link, string $pattern): bool
    {
        // Extract domain from pattern
        if (preg_match('/(https?:\/\/)?([^\/]+)/', $pattern, $patternMatch)) {
            $patternDomain = $patternMatch[2];

            // Extract domain from link
            if (preg_match('/(https?:\/\/)?([^\/]+)/', $link, $linkMatch)) {
                $linkDomain = $linkMatch[2];

                // Check if domains match (with wildcards for subdomains)
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
                'message' => 'Thiếu EXTERNAL_API_BASE_URL hoặc EXTERNAL_API_TOKEN trong .env'
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
        $data = $request->validate([
            'service' => 'required',
            'link' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'comments' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        // Validate link format
        $externalService = $this->findExternalService($data['service']);
        $linkError = $this->validateLinkFormat($externalService, $data['link']);
        if ($linkError) {
            return response()->json(['message' => $linkError], 422);
        }

        $baseUrl = config('services.external_api.base_url');
        $apiKey = config('services.external_api.token');

        if (!$baseUrl || !$apiKey) {
            return response()->json([
                'message' => 'Thiếu EXTERNAL_API_BASE_URL hoặc EXTERNAL_API_TOKEN trong .env'
            ], 500);
        }

        $payload = [
            'key' => $apiKey,
            'action' => 'add',
            'service' => $data['service'],
            'link' => $data['link'],
            'quantity' => $data['quantity'],
        ];

        if (!empty($data['comments'])) {
            $payload['comments'] = $data['comments'];
        }

        $response = Http::asForm()->post($baseUrl, $payload);

        if (!$response->successful()) {
            return response()->json($response->json(), $response->status());
        }

        // Save order to database after external API success
        try {
            $serviceName = $externalService['name'] ?? '#' . $data['service'];
            $rate = isset($externalService['rate']) ? (int)$externalService['rate'] : 0;
            $totalPrice = $rate * $data['quantity'];

            $order = Order::create([
                'user_id' => $request->user()->id,
                'service_id' => $data['service'],
                'service_name' => $serviceName,
                'platform' => $externalService['platform'] ?? 'External',
                'mode' => 'api',
                'target_link' => $data['link'],
                'quantity' => $data['quantity'],
                'unit_price' => $rate,
                'total_price' => $totalPrice,
                'note' => $data['note'] ?? null,
                'form_data' => !empty($data['comments']) ? ['comments' => $data['comments']] : null,
                'selected_price' => $rate,
                'status' => 'pending',
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

            return response()->json([
                'message' => 'Đã tạo đơn thành công',
                'order' => $order,
                'external_response' => $response->json(),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi lưu đơn vào database',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}