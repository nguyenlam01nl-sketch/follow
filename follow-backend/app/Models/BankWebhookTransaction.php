<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankWebhookTransaction extends Model
{
    protected $fillable = [
        'provider',
        'provider_transaction_id',
        'gateway',
        'account_number',
        'reference_number',
        'transfer_type',
        'amount',
        'payment_code',
        'content',
        'user_id',
        'is_processed',
        'processed_at',
        'payload',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_processed' => 'boolean',
        'processed_at' => 'datetime',
        'payload' => 'array',
    ];
}