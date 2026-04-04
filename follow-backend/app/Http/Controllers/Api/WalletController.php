<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WalletTransaction;
use App\Services\AdminMailService;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'balance' => (float) ($request->user()->balance ?? 0),
        ]);
    }

    public function transactions(Request $request)
    {
        $transactions = WalletTransaction::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($transactions);
    }

    public function createDeposit(Request $request, AdminMailService $adminMailService)
    {
        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:1000'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'content' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();

        $transferContent = $data['content']
            ?? ('solavietnam ' . ($user->username ?: $user->name ?: 'user'));

        $transaction = WalletTransaction::create([
            'user_id' => $user->id,
            'title' => 'Nạp tiền vào ví',
            'amount' => $data['amount'],
            'type' => 'deposit',
            'status' => 'pending',
            'payment_method' => $data['payment_method'] ?? 'bank_transfer',
            'note' => $transferContent,
        ]);

        $adminMailService->send(
            'emails.admin-deposit-notification',
            [
                'transaction' => $transaction,
                'user' => $user,
            ],
            'Có yêu cầu nạp tiền mới - Sola Vietnam',
            [
                'transaction_id' => $transaction->id ?? null,
                'user_id' => $user->id ?? null,
                'type' => 'deposit',
            ]
        );

        return response()->json([
            'message' => 'Đã tạo yêu cầu nạp tiền',
            'transaction' => $transaction,
            'qr_info' => [
                'bank_name' => 'Techcombank',
                'bank_code' => 'techcombank',
                'account_number' => '19037432671013',
                'account_name' => 'Nguyen Lam',
                'amount' => (float) $data['amount'],
                'content' => $transferContent,
            ],
        ], 201);
    }
}