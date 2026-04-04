<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AdminEmailNotificationController extends Controller
{
    public function sendToAllUsers(Request $request)
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $users = User::query()
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->select('id', 'name', 'username', 'email')
            ->get();

        if ($users->isEmpty()) {
            return response()->json([
                'message' => 'Không có người dùng nào có email để gửi',
            ], 422);
        }

        $successCount = 0;
        $failCount = 0;

        foreach ($users as $user) {
            try {
                Mail::send('emails.admin-broadcast', [
                    'user' => $user,
                    'mailTitle' => $data['title'],
                    'mailContent' => $data['content'],
                ], function ($message) use ($user, $data) {
                    $message->to($user->email)
                        ->subject($data['subject']);
                });

                $successCount++;
            } catch (\Exception $e) {
                $failCount++;

                Log::error('Gửi email broadcast thất bại', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return response()->json([
            'message' => 'Đã xử lý gửi email thông báo',
            'total_users' => $users->count(),
            'success_count' => $successCount,
            'fail_count' => $failCount,
        ]);
    }
}