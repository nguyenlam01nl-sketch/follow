<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;

class AdminFeedbackController extends Controller
{
    public function index(Request $request)
    {
        $query = Feedback::with('user')->latest();

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;

            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('content', 'like', "%{$keyword}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $feedbacks = $query->paginate(10);

        return response()->json($feedbacks);
    }

    public function show($id)
    {
        $feedback = Feedback::with('user')->findOrFail($id);

        return response()->json($feedback);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewed,resolved,rejected',
        ]);

        $feedback = Feedback::findOrFail($id);
        $feedback->status = $request->status;
        $feedback->save();

        return response()->json([
            'message' => 'Cập nhật trạng thái thành công',
            'data' => $feedback,
        ]);
    }
}