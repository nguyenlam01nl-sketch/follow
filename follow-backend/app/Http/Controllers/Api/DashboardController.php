<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Service;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $totalOrders = Order::where('user_id', $user->id)->count();

        $totalSpent = Order::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'processing', 'completed', 'success'])
            ->sum('total_price');

        $totalDeposits = WalletTransaction::where('user_id', $user->id)
            ->where('type', 'deposit')
            ->whereIn('status', ['pending', 'approved', 'completed', 'success'])
            ->sum('amount');

        $activeServices = Service::where('status', 'active')->count();

        $recentOrders = Order::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get([
                'id',
                'service_name',
                'status',
                'total_price',
                'created_at',
            ])
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'code' => 'ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                    'service_name' => $order->service_name,
                    'status' => $order->status,
                    'total_price' => (float) $order->total_price,
                    'created_at' => $order->created_at,
                ];
            });

        return response()->json([
            'data' => [
                'stats' => [
                    'total_orders' => $totalOrders,
                    'total_spent' => (float) $totalSpent,
                    'total_deposits' => (float) $totalDeposits,
                    'balance' => (float) $user->balance,
                    'active_services' => $activeServices,
                ],
                'recent_orders' => $recentOrders,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->username,
                ],
            ]
        ]);
    }
}