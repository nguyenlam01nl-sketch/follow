<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SearchLog extends Model
{
    protected $fillable = [
        'user_id',
        'subject_id',
        'query_raw',
        'query_normalized',
        'detected_type',
        'result_status',
        'result_risk_score',
        'result_report_count',
        'ip_address',
        'user_agent',
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}