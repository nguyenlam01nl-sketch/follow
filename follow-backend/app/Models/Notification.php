<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'title',
        'content',
        'is_popup',
        'is_active',
            'link',

    ];

    protected $casts = [
        'is_popup' => 'boolean',
        'is_active' => 'boolean',
    ];
}