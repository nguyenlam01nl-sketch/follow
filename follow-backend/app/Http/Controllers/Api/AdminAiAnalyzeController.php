<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiAnalysis;

class AdminAiAnalyzeController extends Controller
{
    public function index()
    {
        $items = AiAnalysis::with('user:id,name,username,email')
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'url' => $item->url,
                    'platform' => $item->platform,
                    'user_name' => $item->user?->name
                        ?? $item->user?->username
                        ?? $item->user?->email
                        ?? 'N/A',
                    'created_at' => $item->created_at?->format('d/m/Y H:i'),
                ];
            });

        return response()->json([
            'data' => $items,
        ]);
    }
}