<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExternalServicePrice;
use Illuminate\Http\Request;

class AdminExternalServiceController extends Controller
{
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