<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'ref_code' => $user->ref_code,
                    'referred_by' => $user->referred_by,
                    'wallet_balance' => (float) ($user->balance ?? 0),
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

        $totalBalanceAllUsers = (float) User::query()->sum('balance');

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

        $amount = (float) $data['amount'];

        $result = DB::transaction(function () use ($data, $amount) {
            $user = User::query()->lockForUpdate()->findOrFail($data['user_id']);
            $currentBalance = (float) ($user->balance ?? 0);

            if ($data['type'] === 'subtract' && $currentBalance < $amount) {
                return response()->json([
                    'message' => 'Số dư không đủ để trừ',
                ], 422)->throwResponse();
            }

            $transactionType = $data['type'] === 'add' ? 'deposit' : 'payment';

            $newBalance = $data['type'] === 'add'
                ? $currentBalance + $amount
                : $currentBalance - $amount;

            $walletTransaction = WalletTransaction::create([
                'user_id' => $user->id,
                'title' => $data['type'] === 'add' ? 'Admin cộng tiền ví' : 'Admin trừ tiền ví',
                'amount' => $amount,
                'type' => $transactionType,
                'status' => 'completed',
                'payment_method' => 'admin_adjust',
                'note' => $data['note'] ?? null,
            ]);

            $user->balance = $newBalance;
            $user->save();

            return [
                'user_id' => $user->id,
                'balance' => (float) $newBalance,
                'wallet_transaction_id' => $walletTransaction->id,
            ];
        });

        return response()->json([
            'message' => 'Điều chỉnh ví thành công',
            'data' => $result,
        ]);
    }
}