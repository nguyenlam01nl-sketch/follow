<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Report extends Model
{
    protected $fillable = [
        'subject_id',
        'user_id',
        'target_type',
        'target_value',
        'title',
        'content',
        'amount',
        'status',
        'reviewed_at',
    ];

    protected $casts = [
        'amount' => 'float',
        'reviewed_at' => 'datetime',
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function evidences(): HasMany
    {
        return $this->hasMany(ReportEvidence::class);
    }
}