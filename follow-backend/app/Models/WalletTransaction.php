<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'amount',
        'type',
        'status',
        'payment_method',
        'note',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];
}