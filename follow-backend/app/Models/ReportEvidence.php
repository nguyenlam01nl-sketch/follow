<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportEvidence extends Model
{
    protected $table = 'report_evidences';
    
    protected $fillable = [
        'report_id',
        'file_path',
        'file_name',
        'mime_type',
        'file_size',
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }
}