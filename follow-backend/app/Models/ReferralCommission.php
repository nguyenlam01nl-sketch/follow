<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferralCommission extends Model
{
    protected $fillable = [
        'referrer_id',
        'referred_user_id',
        'wallet_transaction_id',
        'type',
        'source_amount',
        'commission_amount',
        'commission_rate',
        'note',
    ];

    protected $casts = [
        'source_amount' => 'float',
        'commission_amount' => 'float',
        'commission_rate' => 'float',
    ];

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referredUser()
    {
        return $this->belongsTo(User::class, 'referred_user_id');
    }

    public function walletTransaction()
    {
        return $this->belongsTo(WalletTransaction::class);
    }
}