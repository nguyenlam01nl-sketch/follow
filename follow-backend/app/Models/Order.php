<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Service;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'service_id',
        'service_name',
        'platform',
        'mode',
        'target_link',
        'quantity',
        'unit_price',
        'total_price',
        'note',
        'form_data',
        'selected_price',
        'status',

        'external_order_id',
        'external_status',
        'api_charge',
        'api_start_count',
        'api_remains',
    ];

    protected $casts = [
        'form_data' => 'array',
        'unit_price' => 'float',
        'total_price' => 'float',
        'selected_price' => 'float',
        'api_charge' => 'float',
        'api_start_count' => 'integer',
        'api_remains' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}