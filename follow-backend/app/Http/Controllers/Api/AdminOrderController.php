<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Không có quyền truy cập'
            ], 403);
        }

        $search = $request->query('search');
        $status = $request->query('status');

        $orders = Order::query()
            ->with(['user', 'service'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('service_name', 'like', "%{$search}%")
                        ->orWhere('target_link', 'like', "%{$search}%")
                        ->orWhere('note', 'like', "%{$search}%")
                        ->orWhere('id', $search)
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")
                                ->orWhere('username', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10);

        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
                'user_id' => $order->user_id,
                'service_id' => $order->service_id,
                'code' => 'ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                'customer_name' => optional($order->user)->name ?? 'Không rõ',
                'customer_email' => optional($order->user)->email ?? '-',
                'service_name' => $order->service_name,
                'platform' => $order->platform,
                'mode' => $order->mode,
                'target_link' => $order->target_link,
                'quantity' => $order->quantity,
                'unit_price' => $order->unit_price,
                'total_price' => $order->total_price,
                'note' => $order->note,
                'form_data' => $order->form_data,
                'selected_price' => $order->selected_price,
                'status' => $order->status,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ];
        });

        return response()->json($orders);
    }

    public function update(Request $request, Order $order)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Không có quyền truy cập'
            ], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:pending,processing,completed,success,cancelled',
        ]);

        $order->update([
            'status' => $data['status'],
        ]);

        $order->load(['user', 'service']);

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => [
                'id' => $order->id,
                'user_id' => $order->user_id,
                'service_id' => $order->service_id,
                'code' => 'ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                'customer_name' => optional($order->user)->name ?? 'Không rõ',
                'customer_email' => optional($order->user)->email ?? '-',
                'service_name' => $order->service_name,
                'platform' => $order->platform,
                'mode' => $order->mode,
                'target_link' => $order->target_link,
                'quantity' => $order->quantity,
                'unit_price' => $order->unit_price,
                'total_price' => $order->total_price,
                'note' => $order->note,
                'form_data' => $order->form_data,
                'selected_price' => $order->selected_price,
                'status' => $order->status,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ]
        ]);
    }
}