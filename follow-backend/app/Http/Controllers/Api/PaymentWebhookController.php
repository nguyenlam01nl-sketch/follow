<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BankWebhookTransaction;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentWebhookController extends Controller
{
    public function sepay(Request $request)
    {
        $payload = $request->all();

        Log::info('SePay webhook received', $payload);

        $providerTransactionId = (string) data_get($payload, 'id');
        $transferType = (string) data_get($payload, 'transferType');
        $amount = (float) data_get($payload, 'transferAmount', 0);
        $content = trim((string) data_get($payload, 'content', ''));
        $paymentCode = data_get($payload, 'code');

        if (!$providerTransactionId) {
            return response()->json(['message' => 'Missing transaction id'], 422);
        }

        // Chỉ nhận tiền vào
        if ($transferType !== 'in' || $amount <= 0) {
            return response()->json(['message' => 'Ignored'], 200);
        }

        // Nếu đã xử lý rồi thì bỏ qua
        $exists = BankWebhookTransaction::where('provider_transaction_id', $providerTransactionId)->first();
        if ($exists && $exists->is_processed) {
            return response()->json(['message' => 'Already processed'], 200);
        }

        $username = $this->extractUsernameFromContent($content);

        if (!$username) {
            BankWebhookTransaction::updateOrCreate(
                ['provider_transaction_id' => $providerTransactionId],
                [
                    'provider' => 'sepay',
                    'gateway' => data_get($payload, 'gateway'),
                    'account_number' => data_get($payload, 'accountNumber'),
                    'reference_number' => data_get($payload, 'referenceNumber'),
                    'transfer_type' => $transferType,
                    'amount' => $amount,
                    'payment_code' => $paymentCode,
                    'content' => $content,
                    'payload' => $payload,
                    'is_processed' => false,
                ]
            );

            return response()->json(['message' => 'Cannot detect username'], 200);
        }

        $user = User::where('username', $username)->first();

        if (!$user) {
            BankWebhookTransaction::updateOrCreate(
                ['provider_transaction_id' => $providerTransactionId],
                [
                    'provider' => 'sepay',
                    'gateway' => data_get($payload, 'gateway'),
                    'account_number' => data_get($payload, 'accountNumber'),
                    'reference_number' => data_get($payload, 'referenceNumber'),
                    'transfer_type' => $transferType,
                    'amount' => $amount,
                    'payment_code' => $paymentCode,
                    'content' => $content,
                    'payload' => $payload,
                    'is_processed' => false,
                ]
            );

            return response()->json(['message' => 'User not found'], 200);
        }

        DB::transaction(function () use ($providerTransactionId, $payload, $transferType, $amount, $content, $paymentCode, $user) {
            $webhookTx = BankWebhookTransaction::lockForUpdate()->firstOrCreate(
                ['provider_transaction_id' => $providerTransactionId],
                [
                    'provider' => 'sepay',
                    'gateway' => data_get($payload, 'gateway'),
                    'account_number' => data_get($payload, 'accountNumber'),
                    'reference_number' => data_get($payload, 'referenceNumber'),
                    'transfer_type' => $transferType,
                    'amount' => $amount,
                    'payment_code' => $paymentCode,
                    'content' => $content,
                    'user_id' => $user->id,
                    'payload' => $payload,
                    'is_processed' => false,
                ]
            );

            if ($webhookTx->is_processed) {
                return;
            }

            // cộng số dư user
            $user->increment('balance', $amount);

            // tạo transaction completed
            WalletTransaction::create([
                'user_id' => $user->id,
                'title' => 'Nạp tiền tự động qua chuyển khoản',
                'amount' => $amount,
                'type' => 'deposit',
                'status' => 'completed',
                'payment_method' => 'bank_transfer',
                'note' => $content,
            ]);

            $webhookTx->update([
                'user_id' => $user->id,
                'is_processed' => true,
                'processed_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Success'], 200);
    }

    private function extractUsernameFromContent(string $content): ?string
    {
        $normalized = Str::of($content)->lower()->squish()->value();

        if (!str_starts_with($normalized, 'solavietnam ')) {
            return null;
        }

        $username = trim(str_replace('solavietnam', '', $normalized));

        if ($username === '') {
            return null;
        }

        if (!preg_match('/^[a-zA-Z0-9._-]+$/', $username)) {
            return null;
        }

        return $username;
    }
}