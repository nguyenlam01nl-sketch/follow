<?php

namespace App\Services;

use App\Models\ReferralCommission;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReferralService
{
    public const NEW_USER_CREDIT = 10000;
    public const FIRST_DEPOSIT_BONUS = 20000;
    public const DEPOSIT_COMMISSION_RATE = 5; // 5%
    public const MIN_FIRST_DEPOSIT = 100000;

    public function generateUniqueRefCode(string $name = 'user'): string
    {
        do {
            $prefix = Str::upper(Str::slug(Str::limit($name, 8, ''), ''));
            $prefix = $prefix ?: 'USER';

            $code = $prefix . rand(1000, 9999);
        } while (User::where('ref_code', $code)->exists());

        return $code;
    }

    public function findValidReferrerOrNull(?string $refCode, ?string $registerIp, ?int $excludeUserId = null): ?User
    {
        if (!$refCode) {
            return null;
        }

        $refCode = trim($refCode);

        $query = User::query()->where('ref_code', $refCode);

        if ($excludeUserId) {
            $query->where('id', '!=', $excludeUserId);
        }

        $referrer = $query->first();

        if (!$referrer) {
            return null;
        }

        if (
            !empty($referrer->register_ip) &&
            !empty($registerIp) &&
            $referrer->register_ip === $registerIp
        ) {
            return null;
        }

        return $referrer;
    }

    public function assignReferrer(?string $refCode, User $newUser): void
    {
        if (!$refCode || $newUser->referred_by) {
            return;
        }

        $referrer = $this->findValidReferrerOrNull(
            $refCode,
            $newUser->register_ip,
            $newUser->id
        );

        if (!$referrer) {
            return;
        }

        $newUser->update([
            'referred_by' => $referrer->id,
        ]);
    }

    public function giveSignupCredit(User $user): void
    {
        DB::transaction(function () use ($user) {
            $lockedUser = User::query()->lockForUpdate()->findOrFail($user->id);

            $lockedUser->balance = (float) ($lockedUser->balance ?? 0) + self::NEW_USER_CREDIT;
            $lockedUser->save();

            WalletTransaction::create([
                'user_id' => $lockedUser->id,
                'title' => 'Thưởng đăng ký tài khoản mới',
                'amount' => self::NEW_USER_CREDIT,
                'type' => 'deposit',
                'status' => 'completed',
                'payment_method' => 'signup_bonus',
                'note' => 'Tặng 10.000đ cho tài khoản mới đăng ký',
            ]);
        });
    }

    public function processReferralRewardForDeposit(WalletTransaction $deposit): void
    {
        if ($deposit->type !== 'deposit' || $deposit->status !== 'completed') {
            return;
        }

        if (in_array($deposit->payment_method, ['admin_adjust', 'signup_bonus'])) {
            return;
        }

        $referredUser = User::with('referrer')->find($deposit->user_id);

        if (!$referredUser || !$referredUser->referred_by || !$referredUser->referrer) {
            return;
        }

        $referrer = $referredUser->referrer;

        if (
            !empty($referrer->register_ip) &&
            !empty($referredUser->register_ip) &&
            $referrer->register_ip === $referredUser->register_ip
        ) {
            return;
        }

        DB::transaction(function () use ($deposit, $referredUser, $referrer) {
            $lockedReferrer = User::query()->lockForUpdate()->findOrFail($referrer->id);

            $hasFirstDepositBonus = ReferralCommission::where('referred_user_id', $referredUser->id)
                ->where('type', 'first_deposit_bonus')
                ->exists();

            if (!$hasFirstDepositBonus && $deposit->amount >= self::MIN_FIRST_DEPOSIT) {
                $lockedReferrer->balance = (float) ($lockedReferrer->balance ?? 0) + self::FIRST_DEPOSIT_BONUS;
                $lockedReferrer->save();

                WalletTransaction::create([
                    'user_id' => $lockedReferrer->id,
                    'title' => 'Thưởng giới thiệu lần nạp đầu',
                    'amount' => self::FIRST_DEPOSIT_BONUS,
                    'type' => 'deposit',
                    'status' => 'completed',
                    'payment_method' => 'referral_first_deposit_bonus',
                    'note' => "Thưởng giới thiệu lần nạp đầu của {$referredUser->username}",
                ]);

                ReferralCommission::create([
                    'referrer_id' => $lockedReferrer->id,
                    'referred_user_id' => $referredUser->id,
                    'wallet_transaction_id' => $deposit->id,
                    'type' => 'first_deposit_bonus',
                    'source_amount' => $deposit->amount,
                    'commission_amount' => self::FIRST_DEPOSIT_BONUS,
                    'commission_rate' => 0,
                    'note' => 'Thưởng lần nạp đầu',
                ]);

                $referredUser->update([
                    'ref_rewarded_at' => now(),
                ]);

                return;
            }

            $alreadyCommissioned = ReferralCommission::where('wallet_transaction_id', $deposit->id)
                ->where('type', 'deposit_commission')
                ->exists();

            if ($alreadyCommissioned) {
                return;
            }

            $commissionAmount = round(($deposit->amount * self::DEPOSIT_COMMISSION_RATE) / 100, 2);

            if ($commissionAmount <= 0) {
                return;
            }

            $lockedReferrer->balance = (float) ($lockedReferrer->balance ?? 0) + $commissionAmount;
            $lockedReferrer->save();

            WalletTransaction::create([
                'user_id' => $lockedReferrer->id,
                'title' => 'Hoa hồng giới thiệu nạp tiền',
                'amount' => $commissionAmount,
                'type' => 'deposit',
                'status' => 'completed',
                'payment_method' => 'referral_deposit_commission',
                'note' => "Hoa hồng từ {$referredUser->username} nạp tiền",
            ]);

            ReferralCommission::create([
                'referrer_id' => $lockedReferrer->id,
                'referred_user_id' => $referredUser->id,
                'wallet_transaction_id' => $deposit->id,
                'type' => 'deposit_commission',
                'source_amount' => $deposit->amount,
                'commission_amount' => $commissionAmount,
                'commission_rate' => self::DEPOSIT_COMMISSION_RATE,
                'note' => 'Hoa hồng theo phần trăm nạp tiền',
            ]);
        });
    }
}