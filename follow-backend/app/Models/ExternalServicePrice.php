<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExternalServicePrice extends Model
{
    protected $fillable = [
        'provider_service_id',
        'platform',
        'category',
        'name',
        'original_rate',
        'sell_rate',
        'rate_per',
        'min',
        'max',
        'desc',
        'status',
    ];

    protected $casts = [
        'original_rate' => 'decimal:2',
        'sell_rate' => 'decimal:2',
        'rate_per' => 'integer',
        'min' => 'integer',
        'max' => 'integer',
    ];
}