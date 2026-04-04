<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Subject;
use Illuminate\Http\Request;

class AdminReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::with(['user', 'subject', 'evidences'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $reports = $query->paginate(10);

        $reports->getCollection()->transform(function ($report) {
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
                'user' => $report->user ? [
                    'id' => $report->user->id,
                    'name' => $report->user->name,
                    'email' => $report->user->email,
                ] : null,
                'subject' => $report->subject ? [
                    'id' => $report->subject->id,
                    'type' => $report->subject->type,
                    'normalized_value' => $report->subject->normalized_value,
                    'status' => $report->subject->status,
                    'risk_score' => $report->subject->risk_score,
                    'report_count' => $report->subject->report_count,
                    'confirmed_report_count' => $report->subject->confirmed_report_count,
                ] : null,
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

    public function show($id)
    {
        $report = Report::with(['user', 'subject', 'evidences'])->findOrFail($id);

        return response()->json([
            'id' => $report->id,
            'target_type' => $report->target_type,
            'target_value' => $report->target_value,
            'title' => $report->title,
            'content' => $report->content,
            'amount' => $report->amount,
            'status' => $report->status,
            'created_at' => $report->created_at,
            'reviewed_at' => $report->reviewed_at,
            'user' => $report->user ? [
                'id' => $report->user->id,
                'name' => $report->user->name,
                'email' => $report->user->email,
            ] : null,
            'subject' => $report->subject ? [
                'id' => $report->subject->id,
                'type' => $report->subject->type,
                'normalized_value' => $report->subject->normalized_value,
                'status' => $report->subject->status,
                'risk_score' => $report->subject->risk_score,
                'report_count' => $report->subject->report_count,
                'confirmed_report_count' => $report->subject->confirmed_report_count,
            ] : null,
            'evidences' => $report->evidences->map(function ($evidence) {
                return [
                    'id' => $evidence->id,
                    'file_name' => $evidence->file_name,
                    'file_url' => asset('storage/' . $evidence->file_path),
                ];
            }),
        ]);
    }

    public function approve($id)
    {
        $report = Report::with('subject')->findOrFail($id);

        $report->update([
            'status' => 'approved',
            'reviewed_at' => now(),
        ]);

        $subject = $report->subject;

        if ($subject) {
            $confirmedCount = $subject->reports()->where('status', 'approved')->count();
            $totalCount = $subject->reports()->count();

            $riskScore = min(100, $confirmedCount * 25);

            $subject->update([
                'status' => $confirmedCount > 0 ? 'flagged' : 'clean',
                'report_count' => $totalCount,
                'confirmed_report_count' => $confirmedCount,
                'risk_score' => $riskScore,
                'last_reported_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Duyệt báo cáo thành công.',
        ]);
    }

    public function reject($id)
    {
        $report = Report::with('subject')->findOrFail($id);

        $report->update([
            'status' => 'rejected',
            'reviewed_at' => now(),
        ]);

        $subject = $report->subject;

        if ($subject) {
            $confirmedCount = $subject->reports()->where('status', 'approved')->count();
            $totalCount = $subject->reports()->count();

            $riskScore = min(100, $confirmedCount * 25);

            $subject->update([
                'status' => $confirmedCount > 0 ? 'flagged' : 'reviewing',
                'report_count' => $totalCount,
                'confirmed_report_count' => $confirmedCount,
                'risk_score' => $riskScore,
            ]);
        }

        return response()->json([
            'message' => 'Đã từ chối báo cáo.',
        ]);
    }
}