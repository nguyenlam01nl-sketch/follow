<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReferralCommission;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;

class AdminAffiliateController extends Controller
{
    private function ensureAdmin(Request $request): void
    {
        if ($request->user()->role !== 'admin') {
            response()->json([
                'message' => 'Không có quyền truy cập',
            ], 403)->throwResponse();
        }
    }

    public function overview(Request $request)
    {
        $this->ensureAdmin($request);

        $totalReferrers = User::query()
            ->whereHas('referrals')
            ->count();

        $totalReferredUsers = User::query()
            ->whereNotNull('referred_by')
            ->count();

        $totalDepositedReferredUsers = User::query()
            ->whereNotNull('referred_by')
            ->whereHas('walletTransactions', function ($query) {
                $query->where('type', 'deposit')
                    ->where('status', 'completed')
                    ->where('payment_method', '!=', 'signup_bonus');
            })
            ->count();

        $totalFirstDepositBonus = (float) ReferralCommission::query()
            ->where('type', 'first_deposit_bonus')
            ->sum('commission_amount');

        $totalDepositCommission = (float) ReferralCommission::query()
            ->where('type', 'deposit_commission')
            ->sum('commission_amount');

        $totalReferralCost = $totalFirstDepositBonus + $totalDepositCommission;

        return response()->json([
            'data' => [
                'total_referrers' => $totalReferrers,
                'total_referred_users' => $totalReferredUsers,
                'total_deposited_referred_users' => $totalDepositedReferredUsers,
                'total_first_deposit_bonus' => $totalFirstDepositBonus,
                'total_deposit_commission' => $totalDepositCommission,
                'total_referral_cost' => $totalReferralCost,
            ],
        ]);
    }

    public function referrers(Request $request)
    {
        $this->ensureAdmin($request);

        $referrers = User::query()
            ->whereHas('referrals')
            ->withCount('referrals')
            ->orderByDesc('id')
            ->get()
            ->map(function ($user) {
                $depositedReferrals = User::query()
                    ->where('referred_by', $user->id)
                    ->whereHas('walletTransactions', function ($query) {
                        $query->where('type', 'deposit')
                            ->where('status', 'completed')
                            ->where('payment_method', '!=', 'signup_bonus');
                    })
                    ->count();

                $totalCommission = (float) ReferralCommission::query()
                    ->where('referrer_id', $user->id)
                    ->sum('commission_amount');

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'ref_code' => $user->ref_code,
                    'total_referrals' => $user->referrals_count,
                    'total_deposited_referrals' => $depositedReferrals,
                    'total_commission' => $totalCommission,
                    'created_at' => $user->created_at,
                ];
            });

        return response()->json([
            'data' => $referrers,
        ]);
    }

    public function referrals(Request $request)
    {
        $this->ensureAdmin($request);

        $items = User::query()
            ->whereNotNull('referred_by')
            ->with(['referrer:id,name,username,email,ref_code'])
            ->latest()
            ->paginate(10);

        $items->getCollection()->transform(function ($user) {
            $totalDeposit = (float) WalletTransaction::query()
                ->where('user_id', $user->id)
                ->where('type', 'deposit')
                ->where('status', 'completed')
                ->where('payment_method', '!=', 'signup_bonus')
                ->sum('amount');

            $hasDeposited = $totalDeposit > 0;

            $hasFirstDepositBonus = ReferralCommission::query()
                ->where('referred_user_id', $user->id)
                ->where('type', 'first_deposit_bonus')
                ->exists();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'created_at' => $user->created_at,
                'ref_rewarded_at' => $user->ref_rewarded_at,
                'total_deposit' => $totalDeposit,
                'has_deposited' => $hasDeposited,
                'has_first_deposit_bonus' => $hasFirstDepositBonus,
                'referrer' => $user->referrer ? [
                    'id' => $user->referrer->id,
                    'name' => $user->referrer->name,
                    'username' => $user->referrer->username,
                    'email' => $user->referrer->email,
                    'ref_code' => $user->referrer->ref_code,
                ] : null,
            ];
        });

        return response()->json($items);
    }

    public function commissions(Request $request)
    {
        $this->ensureAdmin($request);

        $commissions = ReferralCommission::query()
            ->with([
                'referrer:id,name,username,email',
                'referredUser:id,name,username,email',
            ])
            ->latest()
            ->paginate(10);

        return response()->json($commissions);
    }
}