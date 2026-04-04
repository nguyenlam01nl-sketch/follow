<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReferralCommission;
use App\Models\User;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function myReferralData(Request $request)
    {
        $user = $request->user();

        $totalReferrals = User::where('referred_by', $user->id)->count();

        $totalDepositedReferrals = User::where('referred_by', $user->id)
            ->whereHas('walletTransactions', function ($query) {
                $query->where('type', 'deposit')
                    ->where('status', 'completed')
                    ->where('payment_method', '!=', 'signup_bonus')
                    ->where('payment_method', '!=', 'admin_adjust');
            })
            ->count();

        $totalCommission = ReferralCommission::where('referrer_id', $user->id)
            ->sum('commission_amount');

        $commissions = ReferralCommission::with(['referredUser:id,name,username'])
            ->where('referrer_id', $user->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'ref_code' => $user->ref_code,
            'ref_link' => config('app.frontend_url') . '/register?ref=' . $user->ref_code,
            'stats' => [
                'total_referrals' => $totalReferrals,
                'total_deposited_referrals' => $totalDepositedReferrals,
                'total_commission' => (float) $totalCommission,
            ],
            'commissions' => $commissions,
        ]);
    }

    public function applyReferralCode(Request $request)
    {
        $validated = $request->validate([
            'ref_code' => ['required', 'string', 'max:50'],
        ]);

        $user = $request->user();
        $refCode = trim($validated['ref_code']);

        if ($user->referred_by) {
            return response()->json([
                'message' => 'Tài khoản đã có người giới thiệu trước đó.',
            ], 422);
        }

        if ($user->ref_code === $refCode) {
            return response()->json([
                'message' => 'Bạn không thể tự nhập mã giới thiệu của chính mình.',
            ], 422);
        }

        $referrer = User::where('ref_code', $refCode)
            ->where('id', '!=', $user->id)
            ->first();

        if (!$referrer) {
            return response()->json([
                'message' => 'Mã giới thiệu không hợp lệ.',
            ], 422);
        }

        if (
            !empty($referrer->register_ip) &&
            !empty($user->register_ip) &&
            $referrer->register_ip === $user->register_ip
        ) {
            return response()->json([
                'message' => 'Không thể áp dụng mã giới thiệu từ cùng một mạng hoặc thiết bị.',
            ], 422);
        }

        $user->update([
            'referred_by' => $referrer->id,
        ]);

        return response()->json([
            'message' => 'Áp dụng mã giới thiệu thành công.',
            'data' => [
                'referrer_id' => $referrer->id,
                'referrer_name' => $referrer->name,
                'referrer_username' => $referrer->username,
            ],
        ]);
    }
}