<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminServiceController extends Controller
{
    public function index()
    {
        $services = Service::query()
            ->orderBy('platform')
            ->orderBy('group_key')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'data' => $services,
        ]);
    }

    public function show(Service $service)
    {
        return response()->json([
            'data' => $service,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'platform' => ['required', 'string', 'max:100'],
            'group_key' => ['required', 'string', 'max:100'],
            'service_key' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'mode' => ['required', Rule::in(['api', 'manual'])],
            'price' => ['required', 'numeric', 'min:0'],
            'min_quantity' => ['nullable', 'integer', 'min:0'],
            'max_quantity' => ['nullable', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:255'],
            'requires_quantity' => ['nullable', 'boolean'],
            'requires_link' => ['nullable', 'boolean'],
            'requires_note' => ['nullable', 'boolean'],
            'status' => ['required', 'string', 'max:50'],
            'form_schema' => ['nullable', 'array'],
        ]);

        $slug = $this->generateUniqueSlug(
            ($data['platform'] ?? '') . '-' . ($data['service_key'] ?? '')
        );

        $service = Service::create([
            'platform' => $data['platform'],
            'group_key' => $data['group_key'],
            'service_key' => $data['service_key'],
            'slug' => $slug,
            'name' => $data['name'],
            'description' => $data['description'] ?? 'Cung cấp đa dạng các gói dịch vụ chất lượng cao.',
            'mode' => $data['mode'],
            'price' => $data['price'],
            'min_quantity' => $data['min_quantity'] ?? null,
            'max_quantity' => $data['max_quantity'] ?? null,
            'unit' => $data['unit'] ?? 'gói',
            'requires_quantity' => (bool) ($data['requires_quantity'] ?? false),
            'requires_link' => (bool) ($data['requires_link'] ?? false),
            'requires_note' => (bool) ($data['requires_note'] ?? false),
            'status' => $data['status'],
            'form_schema' => $data['form_schema'] ?? $this->buildDefaultFormSchema(
                platform: $data['platform'],
                groupKey: $data['group_key'],
                serviceKey: $data['service_key'],
                serviceName: $data['name'],
                price: (float) $data['price']
            ),
        ]);

        return response()->json([
            'message' => 'Tạo dịch vụ thành công',
            'data' => $service,
        ], 201);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'platform' => ['required', 'string', 'max:100'],
            'group_key' => ['required', 'string', 'max:100'],
            'service_key' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('services', 'slug')->ignore($service->id),
            ],
            'description' => ['nullable', 'string'],
            'mode' => ['required', Rule::in(['api', 'manual'])],
            'price' => ['required', 'numeric', 'min:0'],
            'min_quantity' => ['nullable', 'integer', 'min:0'],
            'max_quantity' => ['nullable', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:255'],
            'requires_quantity' => ['nullable', 'boolean'],
            'requires_link' => ['nullable', 'boolean'],
            'requires_note' => ['nullable', 'boolean'],
            'status' => ['required', 'string', 'max:50'],
            'form_schema' => ['nullable', 'array'],
        ]);

        $slug = $data['slug'] ?? null;

        if (!$slug) {
            $slug = $this->generateUniqueSlug(
                ($data['platform'] ?? '') . '-' . ($data['service_key'] ?? ''),
                $service->id
            );
        }

        $service->update([
            'platform' => $data['platform'],
            'group_key' => $data['group_key'],
            'service_key' => $data['service_key'],
            'slug' => $slug,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'mode' => $data['mode'],
            'price' => $data['price'],
            'min_quantity' => $data['min_quantity'] ?? null,
            'max_quantity' => $data['max_quantity'] ?? null,
            'unit' => $data['unit'] ?? null,
            'requires_quantity' => (bool) ($data['requires_quantity'] ?? false),
            'requires_link' => (bool) ($data['requires_link'] ?? false),
            'requires_note' => (bool) ($data['requires_note'] ?? false),
            'status' => $data['status'],
            'form_schema' => $data['form_schema'] ?? null,
        ]);

        return response()->json([
            'message' => 'Cập nhật dịch vụ thành công',
            'data' => $service->fresh(),
        ]);
    }

    protected function generateUniqueSlug(string $text, ?int $ignoreId = null): string
    {
        $base = Str::slug($text);

        if (!$base) {
            $base = 'service-' . now()->timestamp;
        }

        $slug = $base;
        $i = 1;

        while (
            Service::query()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }

    protected function buildDefaultFormSchema(
        string $platform,
        string $groupKey,
        string $serviceKey,
        string $serviceName,
        float $price
    ): array {
        $platformKey = Str::lower($platform);
        $groupKey = Str::lower($groupKey);

        $fields = [];

        if (in_array($platformKey, ['facebook', 'instagram', 'tiktok'])) {
            $fields[] = [
                'name' => 'contact',
                'type' => 'text',
                'label' => 'THÔNG TIN LIÊN HỆ',
                'required' => true,
                'placeholder' => 'Sđt (Zalo) hoặc id (Telegram) để thông báo đơn hàng',
            ];
        }

        if ($platformKey === 'facebook') {
            if ($groupKey === 'support') {
                $fields[] = [
                    'name' => 'account_info',
                    'type' => 'text',
                    'label' => 'NHẬP MAIL HOẶC SĐT FB + PASSWORD FB',
                    'required' => true,
                    'placeholder' => 'hotieubao@gmail.com + 0978899999 + pass',
                ];
            } else {
                $fields[] = [
                    'name' => 'link',
                    'type' => 'text',
                    'label' => 'NHẬP LINK FACEBOOK',
                    'required' => true,
                    'placeholder' => 'https://facebook.com/...',
                ];
            }
        } elseif ($platformKey === 'instagram') {
            $fields[] = [
                'name' => 'account_info',
                'type' => 'text',
                'label' => 'NHẬP THÔNG TIN TÀI KHOẢN',
                'required' => true,
                'placeholder' => 'Cookie hoặc id|pass|2fa',
            ];
        } elseif ($platformKey === 'tiktok') {
            $fields[] = [
                'name' => 'tiktok_id',
                'type' => 'text',
                'label' => 'NHẬP ID TIKTOK',
                'required' => true,
                'placeholder' => 'ví dụ : @xxxxxxxxx',
            ];
        } elseif (in_array($platformKey, ['youtube', 'x-twitter', 'twitter', 'x'])) {
            $fields[] = [
                'name' => 'link',
                'type' => 'text',
                'label' => $platformKey === 'youtube'
                    ? 'NHẬP LINK KÊNH / VIDEO'
                    : 'NHẬP LINK TÀI KHOẢN / BÀI VIẾT',
                'required' => true,
                'placeholder' => $platformKey === 'youtube'
                    ? 'https://youtube.com/...'
                    : 'https://x.com/...',
            ];

            $fields[] = [
                'name' => 'contact',
                'type' => 'text',
                'label' => 'THÔNG TIN LIÊN HỆ',
                'required' => true,
                'placeholder' => 'Sđt (Zalo) hoặc id (Telegram)',
            ];
        } else {
            $fields[] = [
                'name' => 'contact',
                'type' => 'text',
                'label' => 'THÔNG TIN LIÊN HỆ',
                'required' => true,
                'placeholder' => 'Sđt (Zalo) hoặc Telegram',
            ];
        }

        $fields[] = [
            'name' => 'package',
            'type' => 'radio',
            'label' => 'CHỌN MÁY CHỦ DỊCH VỤ',
            'required' => true,
            'options' => [
                [
                    'label' => $serviceName,
                    'price' => $price,
                    'value' => Str::slug($serviceKey ?: $serviceName),
                    'description' => 'Chưa có mô tả cho gói này.',
                ],
            ],
        ];

        $fields[] = [
            'name' => 'agree',
            'type' => 'checkbox',
            'label' => 'TÔI XÁC NHẬN GÓI DỊCH VỤ VÀ CÁC ĐIỀU KHOẢN SỬ DỤNG.',
            'required' => true,
        ];

        return $fields;
    }
}