<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Services\AdminMailService;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request, AdminMailService $adminMailService)
    {
        $request->validate([
            'type' => 'nullable|string|max:50',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $user = $request->user();

        $feedback = Feedback::create([
            'user_id' => $user->id,
            'type' => $request->type,
            'title' => $request->title,
            'content' => $request->content,
            'status' => 'pending',
        ]);

        $adminMailService->send(
            'emails.admin-feedback-notification',
            [
                'feedback' => $feedback,
                'user' => $user,
            ],
            'Có feedback mới từ người dùng - Sola Vietnam',
            [
                'feedback_id' => $feedback->id ?? null,
                'user_id' => $user->id ?? null,
                'type' => 'feedback',
            ]
        );

        return response()->json([
            'message' => 'Gửi đóng góp ý kiến thành công',
            'data' => $feedback,
        ], 201);
    }

    public function history(Request $request)
    {
        $query = Feedback::where('user_id', $request->user()->id)
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $feedbacks = $query->paginate(10);

        return response()->json($feedbacks);
    }

    public function show(Request $request, $id)
    {
        $feedback = Feedback::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($feedback);
    }

    // ADMIN: lấy toàn bộ feedback
    public function index(Request $request)
    {
        $query = Feedback::with(['user:id,name,email'])->latest();

        if ($request->filled('keyword')) {
            $keyword = trim($request->keyword);

            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                    ->orWhere('content', 'like', "%{$keyword}%")
                    ->orWhereHas('user', function ($userQuery) use ($keyword) {
                        $userQuery->where('name', 'like', "%{$keyword}%")
                            ->orWhere('email', 'like', "%{$keyword}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->paginate(10));
    }

    // ADMIN: cập nhật trạng thái
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewed,resolved,rejected',
        ]);

        $feedback = Feedback::findOrFail($id);

        $feedback->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Cập nhật trạng thái góp ý thành công',
            'data' => $feedback,
        ]);
    }
}