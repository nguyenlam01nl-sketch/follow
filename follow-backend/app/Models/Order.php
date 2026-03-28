<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
];
    protected $casts = [
        'form_data' => 'array',
    ];
}
