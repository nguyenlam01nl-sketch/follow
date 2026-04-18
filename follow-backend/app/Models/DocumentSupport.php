<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentSupport extends Model
{
    use HasFactory;

    protected $table = 'document_supports';

    protected $fillable = [
        'user_id',
        'type',
        'phone',
        'note',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}