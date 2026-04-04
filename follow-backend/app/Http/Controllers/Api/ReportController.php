<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportEvidence;
use App\Models\Subject;
use App\Services\NormalizeSubjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function store(Request $request, NormalizeSubjectService $normalizer)
    {
        $validated = $request->validate([
            'target_type' => ['required', 'string', 'in:bank_account,phone,facebook_link,other'],
            'target_value' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'evidences' => ['nullable', 'array', 'max:6'],
            'evidences.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $normalized = $normalizer->handle(
            $validated['target_value'],
            $validated['target_type']
        );

        $report = DB::transaction(function () use ($request, $validated, $normalized) {
            $subject = Subject::firstOrCreate(
                [
                    'type' => $normalized['type'],
                    'normalized_value' => $normalized['normalized_value'],
                ],
                [
                    'raw_value' => $normalized['raw_value'],
                    'display_value' => $normalized['display_value'],
                    'status' => 'reviewing',
                    'risk_score' => 0,
                ]
            );

            $report = Report::create([
                'subject_id' => $subject->id,
                'user_id' => $request->user()?->id,
                'target_type' => $validated['target_type'],
                'target_value' => $validated['target_value'],
                'title' => $validated['title'],
                'content' => $validated['content'],
                'amount' => $validated['amount'] ?? null,
                'status' => 'pending',
            ]);

            if ($request->hasFile('evidences')) {
                foreach ($request->file('evidences') as $file) {
                    $path = $file->store('report-evidences', 'public');

                    ReportEvidence::create([
                        'report_id' => $report->id,
                        'file_path' => $path,
                        'file_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            $subject->update([
                'report_count' => $subject->reports()->count(),
                'last_reported_at' => now(),
                'status' => 'reviewing',
            ]);

            return $report;
        });

        return response()->json([
            'message' => 'Gửi báo cáo thành công.',
            'data' => $report->load('evidences'),
        ], 201);
    }

  public function history(Request $request)
{
    $reports = Report::with('evidences')
        ->where('user_id', $request->user()->id)
        ->latest()
        ->get()
        ->map(function ($report) {
            return [
                'id' => $report->id,
                'target_type' => $report->target_type,
                'target_value' => $report->target_value,
                'title' => $report->title,
                'content' => $report->content,
                'amount' => $report->amount,
                'status' => $report->status,
                'created_at' => $report->created_at,
                'reviewed_at' => $report->reviewed_at,
                'evidences' => $report->evidences->map(function ($evidence) {
                    return [
                        'id' => $evidence->id,
                        'file_name' => $evidence->file_name,
                        'file_url' => asset('storage/' . $evidence->file_path),
                    ];
                }),
            ];
        });

    return response()->json($reports);
}
}