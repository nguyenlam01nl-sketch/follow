<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Service;
use App\Models\ServiceNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class OrderController extends Controller
{
    /**
     * Validate link format from service description
     */
    private function validateLinkFormat(Service $service, string $link): ?string
    {
        if ($service->mode !== 'manual' || !$service->description) {
            return null;
        }

        $description = $service->description;

        // Extract link patterns from description
        // Look for patterns like: https://..., www...., or specific format hints
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

    public function store(Request $request)
    {
        $data = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'target_link' => ['nullable', 'string', 'max:255'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'note' => ['nullable', 'string'],
            'form_data' => ['nullable', 'array'],
            'selected_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        $service = Service::findOrFail($data['service_id']);
        $formData = $data['form_data'] ?? [];

        // Validate link format if service requires link
        if ($service->requires_link && !empty($data['target_link'])) {
            $linkError = $this->validateLinkFormat($service, $data['target_link']);
            if ($linkError) {
                return response()->json(['message' => $linkError], 422);
            }
        }

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

                    // Validate link format if field is for link
                    if ($fieldType === 'text' && (strpos($field['name'], 'link') !== false || strpos($field['label'] ?? '', 'link') !== false)) {
                        $linkError = $this->validateLinkFormat($service, $value);
                        if ($linkError) {
                            return response()->json(['message' => $linkError], 422);
                        }
                    }
                }
            }
        } else {
            if ($service->requires_link && empty($data['target_link'])) {
                return response()->json(['message' => 'Thiếu link mục tiêu'], 422);
            }

            if ($service->requires_quantity && empty($data['quantity'])) {
                return response()->json(['message' => 'Thiếu số lượng'], 422);
            }

            if ($service->requires_note && empty($data['note'])) {
                return response()->json(['message' => 'Thiếu ghi chú'], 422);
            }
        }

        $quantity = $service->requires_quantity ? ($data['quantity'] ?? 1) : 1;

        $unitPrice = isset($data['selected_price'])
            ? (float) $data['selected_price']
            : (float) $service->price;

        $totalPrice = $service->requires_quantity ? ($unitPrice * $quantity) : $unitPrice;

        try {
            Log::info('Order creation attempt', [
                'user_id' => $request->user()->id,
                'service_id' => $service->id,
                'form_data' => $formData,
                'unit_price' => $unitPrice,
                'total_price' => $totalPrice,
            ]);

            $order = Order::create([
                'user_id' => $request->user()->id,
                'service_id' => $service->id,
                'service_name' => $service->name,
                'platform' => $service->platform ?? 'Unknown',
                'mode' => $service->mode,
                'target_link' => $data['target_link'] ?? null,
                'quantity' => $service->requires_quantity ? $quantity : null,
                'unit_price' => $unitPrice,
                'total_price' => $totalPrice,
                'note' => $data['note'] ?? null,
                'form_data' => !empty($formData) ? $formData : null,
                'selected_price' => (int)$unitPrice,
                'status' => 'pending',
            ]);

            Log::info('Order created successfully', ['order_id' => $order->id]);
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

        return response()->json([
            'message' => 'Đã tạo đơn thành công',
            'order' => $order,
        ], 201);
    }
}
