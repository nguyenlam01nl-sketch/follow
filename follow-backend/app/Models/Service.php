<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'platform',
        'group_key',
        'service_key',
        'name',
        'slug',
        'description',
        'mode',
        'price',
        'min_quantity',
        'max_quantity',
        'unit',
        'requires_quantity',
        'requires_link',
        'requires_note',
        'form_schema',
        'status',
    ];

    protected $casts = [
        'requires_quantity' => 'boolean',
        'requires_link' => 'boolean',
        'requires_note' => 'boolean',
        'price' => 'integer',
        'form_schema' => 'array',
    ];
}