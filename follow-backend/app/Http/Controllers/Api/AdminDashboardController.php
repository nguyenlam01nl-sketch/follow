<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalOrders = Order::count();
        $totalRevenue = Order::whereIn('status', ['completed', 'success'])->sum('total_price');
        $pendingOrders = Order::whereIn('status', ['pending', 'processing'])->count();

        $recentOrders = Order::query()
            ->latest()
            ->take(5)
            ->get([
                'id',
                'service_name',
                'status',
                'total_price',
                'created_at',
                'user_id',
            ])
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'code' => 'ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                    'service' => $order->service_name,
                    'user' => optional($order->user)->name ?? 'Không rõ',
                    'amount' => $order->total_price,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                ];
            });

        $recentUsers = User::query()
            ->latest()
            ->take(5)
            ->get([
                'id',
                'name',
                'email',
                'created_at',
            ])
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'joined' => optional($user->created_at)->format('d/m/Y'),
                ];
            });

        $notifications = Notification::query()
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'data' => [
                'stats' => [
                    'total_users' => $totalUsers,
                    'total_orders' => $totalOrders,
                    'total_revenue' => (float) $totalRevenue,
                    'pending_orders' => $pendingOrders,
                ],
                'recent_orders' => $recentOrders,
                'recent_users' => $recentUsers,
                'notifications' => $notifications,
            ],
        ]);
    }

    public function storeNotification(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'is_popup' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $notification = Notification::create([
            'title' => $data['title'],
            'content' => $data['content'],
            'is_popup' => $data['is_popup'] ?? false,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Đăng thông báo thành công',
            'data' => $notification,
        ], 201);
    }

    public function notifications()
    {
        $notifications = Notification::query()
            ->latest()
            ->get();

        return response()->json([
            'data' => $notifications,
        ]);
    }

    public function userNotifications()
    {
        $notifications = Notification::query()
            ->where('is_active', true)
            ->latest()
            ->get();

        return response()->json([
            'data' => $notifications,
        ]);
    }
}