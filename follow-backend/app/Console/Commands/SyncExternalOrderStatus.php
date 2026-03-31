<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Order;

class SyncExternalOrderStatus extends Command
{
    protected $signature = 'orders:sync-external-status';
    protected $description = 'Đồng bộ trạng thái đơn hàng external API';

    public function handle()
    {
        $baseUrl = config('services.external_api.base_url');
        $apiKey = config('services.external_api.token');

        if (!$baseUrl || !$apiKey) {
            $this->error('Thiếu EXTERNAL_API_BASE_URL hoặc EXTERNAL_API_TOKEN');
            return self::FAILURE;
        }

        $orders = Order::query()
            ->whereNotNull('external_order_id')
            ->whereIn('status', ['pending', 'processing', 'partial'])
            ->get();

        if ($orders->isEmpty()) {
            $this->info('Không có đơn nào cần đồng bộ.');
            return self::SUCCESS;
        }

        foreach ($orders as $order) {
            try {
                $response = Http::asForm()->post($baseUrl, [
                    'key' => $apiKey,
                    'action' => 'status',
                    'order' => $order->external_order_id,
                ]);

                $data = $response->json();

                if (!$response->successful() || !$data || isset($data['error'])) {
                    $this->warn("Order #{$order->id}: API lỗi hoặc dữ liệu không hợp lệ");
                    continue;
                }

                $apiStatus = $data['status']
                    ?? $data['data']['status']
                    ?? null;

                $mappedStatus = $this->mapStatus($apiStatus, $order->status);

                $order->update([
                    'status' => $mappedStatus,
                    'external_status' => $apiStatus,
                    'api_charge' => $this->parseCharge(
                        $data['charge'] ?? $data['data']['charge'] ?? null
                    ),
                    'api_start_count' => $this->parseInt(
                        $data['start_count'] ?? $data['data']['start_count'] ?? null
                    ),
                    'api_remains' => $this->parseInt(
                        $data['remains'] ?? $data['data']['remains'] ?? null
                    ),
                ]);

                $this->info("Đã đồng bộ Order #{$order->id} | external_order_id={$order->external_order_id} | status={$mappedStatus}");
            } catch (\Throwable $e) {
                $this->error("Lỗi Order #{$order->id}: " . $e->getMessage());
            }
        }

        return self::SUCCESS;
    }

    private function mapStatus(?string $apiStatus, string $currentStatus): string
    {
        $status = strtolower(trim((string) $apiStatus));

        return match ($status) {
            'pending' => 'pending',
            'processing', 'in progress' => 'processing',
            'partial' => 'partial',
            'success', 'completed', 'complete' => 'completed',
            'cancelled', 'canceled' => 'cancelled',
            'refunded' => 'refunded',
            'failed', 'error' => 'failed',
            default => $currentStatus,
        };
    }

    private function parseCharge($value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (float) str_replace(',', '', (string) $value);
    }

    private function parseInt($value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) $value;
    }
}