<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SearchLog;
use App\Models\Subject;
use App\Services\NormalizeSubjectService;
use Illuminate\Http\Request;

class CheckController extends Controller
{
    public function check(Request $request, NormalizeSubjectService $normalizer)
    {
        $validated = $request->validate([
            'query' => ['required', 'string', 'max:255'],
        ]);

        $normalized = $normalizer->handle($validated['query']);

        $subject = Subject::where('type', $normalized['type'])
            ->where('normalized_value', $normalized['normalized_value'])
            ->first();

        $response = [
            'found' => false,
            'type' => $normalized['type'],
            'normalized_value' => $normalized['normalized_value'],
            'status' => 'clean',
            'risk_score' => 0,
            'report_count' => 0,
            'message' => 'Chưa ghi nhận cảnh báo rõ ràng cho dữ liệu này.',
            'last_reported_at' => null,
        ];

        if ($subject) {
            $subject->update([
                'last_checked_at' => now(),
            ]);

            $response = [
                'found' => true,
                'type' => $subject->type,
                'normalized_value' => $subject->display_value ?: $subject->normalized_value,
                'status' => $subject->status,
                'risk_score' => $subject->risk_score,
                'report_count' => $subject->confirmed_report_count,
                'message' => $subject->confirmed_report_count > 0
                    ? 'Đối tượng này đã có báo cáo trong hệ thống. Nên thận trọng trước khi giao dịch.'
                    : 'Chưa ghi nhận cảnh báo mạnh cho dữ liệu này.',
                'last_reported_at' => optional($subject->last_reported_at)?->toDateTimeString(),
            ];
        }

        SearchLog::create([
            'user_id' => $request->user()?->id,
            'subject_id' => $subject?->id,
            'query_raw' => $validated['query'],
            'query_normalized' => $normalized['normalized_value'],
            'detected_type' => $normalized['type'],
            'result_status' => $response['status'],
            'result_risk_score' => $response['risk_score'],
            'result_report_count' => $response['report_count'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json($response);
    }
}