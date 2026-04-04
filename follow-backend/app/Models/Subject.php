<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    protected $fillable = [
        'type',
        'raw_value',
        'normalized_value',
        'display_value',
        'status',
        'risk_score',
        'report_count',
        'confirmed_report_count',
        'last_reported_at',
        'last_checked_at',
        'notes_internal',
    ];

    protected $casts = [
        'last_reported_at' => 'datetime',
        'last_checked_at' => 'datetime',
    ];

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}