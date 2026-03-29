<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

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
    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
