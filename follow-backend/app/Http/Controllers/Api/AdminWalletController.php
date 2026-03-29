<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;

class AdminWalletController extends Controller
{
    public function users(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Không có quyền truy cập',
            ], 403);
        }

        $users = User::query()
            ->orderByDesc('id')
            ->get()
            ->map(function ($user) {
                $totalDeposit = WalletTransaction::query()
                    ->where('user_id', $user->id)
                    ->where('type', 'deposit')
                    ->where('status', 'completed')
                    ->sum('amount');

                $balance = WalletTransaction::query()
                    ->where('user_id', $user->id)
                    ->where('status', 'completed')
                    ->selectRaw("
                        COALESCE(SUM(
                            CASE
                                WHEN type = 'deposit' THEN amount
                                WHEN type = 'payment' THEN -amount
                                ELSE 0
                            END
                        ), 0) as balance
                    ")
                    ->value('balance');

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role,
                    'wallet_balance' => (float) ($balance ?? 0),
                    'total_deposit' => (float) ($totalDeposit ?? 0),
                ];
            });

        return response()->json([
            'data' => $users,
        ]);
    }

    public function stats(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Không có quyền truy cập',
            ], 403);
        }

        $totalDepositAll = WalletTransaction::query()
            ->where('type', 'deposit')
            ->where('status', 'completed')
            ->sum('amount');

        $totalPaymentAll = WalletTransaction::query()
            ->where('type', 'payment')
            ->where('status', 'completed')
            ->sum('amount');

        $totalBalanceAllUsers = (float) $totalDepositAll - (float) $totalPaymentAll;

        return response()->json([
            'data' => [
                'total_deposit_all' => (float) $totalDepositAll,
                'total_payment_all' => (float) $totalPaymentAll,
                'total_balance_all_users' => (float) $totalBalanceAllUsers,
            ],
        ]);
    }

    public function adjust(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Không có quyền truy cập',
            ], 403);
        }

        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'type' => ['required', 'in:add,subtract'],
            'amount' => ['required', 'numeric', 'min:1'],
            'note' => ['nullable', 'string'],
        ]);

        $user = User::findOrFail($data['user_id']);

        $currentBalance = WalletTransaction::query()
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->selectRaw("
                COALESCE(SUM(
                    CASE
                        WHEN type = 'deposit' THEN amount
                        WHEN type = 'payment' THEN -amount
                        ELSE 0
                    END
                ), 0) as balance
            ")
            ->value('balance');

        $currentBalance = (float) ($currentBalance ?? 0);
        $amount = (float) $data['amount'];

        if ($data['type'] === 'subtract' && $currentBalance < $amount) {
            return response()->json([
                'message' => 'Số dư không đủ để trừ',
            ], 422);
        }

        $transactionType = $data['type'] === 'add' ? 'deposit' : 'payment';

        WalletTransaction::create([
            'user_id' => $user->id,
            'title' => $data['type'] === 'add' ? 'Admin cộng tiền ví' : 'Admin trừ tiền ví',
            'amount' => $amount,
            'type' => $transactionType,
            'status' => 'completed',
            'payment_method' => 'admin_adjust',
            'note' => $data['note'] ?? null,
        ]);

        $newBalance = $data['type'] === 'add'
            ? $currentBalance + $amount
            : $currentBalance - $amount;

        return response()->json([
            'message' => 'Điều chỉnh ví thành công',
            'data' => [
                'user_id' => $user->id,
                'balance' => $newBalance,
            ],
        ]);
    }
}