<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'phone',
        'balance',
        'role',
        'ref_code',
        'referred_by',
        'ref_rewarded_at',
        'register_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function referrals()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function referralCommissions()
    {
        return $this->hasMany(\App\Models\ReferralCommission::class, 'referrer_id');
    }

    public function walletTransactions()
    {
        return $this->hasMany(\App\Models\WalletTransaction::class);
    }
}