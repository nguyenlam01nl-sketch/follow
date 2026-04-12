<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiAnalysis extends Model
{
    protected $fillable = [
        'user_id',
        'url',
        'platform',
        'account_name',
        'health_score',
        'raw_data',
        'result',
    ];

    protected $casts = [
        'raw_data' => 'array',
        'result' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}