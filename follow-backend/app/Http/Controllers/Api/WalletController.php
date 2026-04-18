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

   public function createDeposit(Request $request)
{
    $data = $request->validate([
        'amount' => ['required', 'numeric', 'min:1000'],
    ]);

    $user = $request->user();

    $transferContent = 'solavietnam ' . ($user->username ?: $user->name ?: 'user');

    return response()->json([
        'message' => 'Lấy thông tin QR thành công',
        'qr_info' => [
            'bank_name' => 'Techcombank',
            'bank_code' => 'techcombank',
            'account_number' => '19037432671013',
            'account_name' => 'Nguyen Lam',
            'amount' => (float) $data['amount'],
            'content' => $transferContent,
        ],
    ], 200);
}
}