<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AdminMailService
{
    public function send(string $view, array $data, string $subject, array $context = []): void
    {
        try {
            $adminEmails = config('admin.emails', []);

            if (empty($adminEmails)) {
                Log::warning('Không có email admin trong config(admin.emails)', $context);
                return;
            }

            Mail::send($view, $data, function ($message) use ($adminEmails, $subject) {
                $message->to($adminEmails)->subject($subject);
            });
        } catch (\Exception $e) {
            Log::error('Gửi email admin thất bại: ' . $e->getMessage(), array_merge($context, [
                'view' => $view,
                'subject' => $subject,
            ]));
        }
    }
}