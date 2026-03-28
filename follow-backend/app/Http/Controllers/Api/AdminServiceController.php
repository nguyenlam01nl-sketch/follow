<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class AdminServiceController extends Controller
{
    public function show(Service $service)
    {
        return response()->json([
            'data' => $service
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:services,slug,' . $service->id],
            'description' => ['nullable', 'string'],
            'mode' => ['required', 'in:api,manual'],
            'price' => ['required', 'numeric', 'min:0'],
            'unit' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
            'form_schema' => ['nullable', 'array'],
        ]);

        $service->update([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'mode' => $data['mode'],
            'price' => $data['price'],
            'unit' => $data['unit'] ?? null,
            'status' => $data['status'],
            'form_schema' => $data['form_schema'] ?? null,
        ]);

        return response()->json([
            'message' => 'Cập nhật dịch vụ thành công',
            'data' => $service->fresh(),
        ]);
    }
}