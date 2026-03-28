<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WalletTransaction;
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

    public function createDeposit(Request $request)
    {
        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:1000'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'note' => ['nullable', 'string'],
        ]);

        $transaction = WalletTransaction::create([
            'user_id' => $request->user()->id,
            'title' => 'Nạp tiền vào ví',
            'amount' => $data['amount'],
            'type' => 'deposit',
            'status' => 'pending',
            'payment_method' => $data['payment_method'] ?? 'bank_transfer',
            'note' => $data['note'] ?? null,
        ]);

        return response()->json([
            'message' => 'Đã tạo yêu cầu nạp tiền',
            'transaction' => $transaction,
        ], 201);
    }
}