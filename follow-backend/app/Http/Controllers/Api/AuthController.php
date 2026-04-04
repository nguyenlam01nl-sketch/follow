<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AdminMailService;
use App\Services\ReferralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private const MAX_ACCOUNTS_PER_IP = 3;

    private function sendRegisterEmail(User $user, AdminMailService $adminMailService): void
    {
        try {
            Mail::send('emails.register-success', [
                'user' => $user,
            ], function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Đăng ký tài khoản thành công - Sola Vietnam');
            });
        } catch (\Exception $e) {
            Log::error('Gửi email đăng ký cho user thất bại: ' . $e->getMessage(), [
                'user_id' => $user->id ?? null,
                'email' => $user->email ?? null,
            ]);
        }

        $adminMailService->send(
            'emails.admin-new-user',
            ['user' => $user],
            'Có user mới đăng ký - Sola Vietnam',
            [
                'user_id' => $user->id ?? null,
                'type' => 'register',
            ]
        );
    }

    private function sendSuspiciousActivityEmail(Request $request, ?string $reason = null): void
    {
        $emails = [
            'gmail1@example.com',
            'gmail2@example.com',
            'gmail3@example.com',
        ];

        $payload = [
            'reason' => $reason,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'ref_code' => $request->input('ref_code'),
            'time' => now()->toDateTimeString(),
        ];

        try {
            Mail::send('emails.suspicious-affiliate', $payload, function ($message) use ($emails) {
                $message->to($emails)
                    ->subject('Cảnh báo hoạt động bất thường - Affiliate Sola Vietnam');
            });
        } catch (\Exception $e) {
            Log::error('Gửi email cảnh báo hoạt động bất thường thất bại: ' . $e->getMessage(), [
                'payload' => $payload,
            ]);
        }

        Log::warning('Phát hiện hoạt động bất thường khi đăng ký', $payload);
    }

    public function register(
        Request $request,
        AdminMailService $adminMailService,
        ReferralService $referralService
    ) {
        $data = $request->validate([
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20|unique:users,phone',
            'password' => 'required|min:6',
            'ref_code' => 'nullable|string|max:50',
        ]);

        $registerIp = $request->ip();

        $accountsFromSameIp = User::query()
            ->where('register_ip', $registerIp)
            ->count();

        if ($accountsFromSameIp >= self::MAX_ACCOUNTS_PER_IP) {
            $this->sendSuspiciousActivityEmail(
                $request,
                'Tạo quá nhiều tài khoản từ cùng một IP'
            );

            return response()->json([
                'message' => 'Chúng tôi đã thấy hoạt động bất thường',
            ], 429);
        }

        $referrer = null;
        $refCode = trim((string) ($data['ref_code'] ?? ''));

        if ($refCode !== '') {
            $referrer = $referralService->findValidReferrerOrNull($refCode, $registerIp);

            if (!$referrer) {
                $this->sendSuspiciousActivityEmail(
                    $request,
                    'Đăng ký bằng mã affiliate không hợp lệ hoặc trùng IP với người giới thiệu'
                );

                return response()->json([
                    'message' => 'Mã giới thiệu không hợp lệ hoặc hoạt động bất thường',
                ], 422);
            }
        }

        $user = DB::transaction(function () use ($data, $registerIp, $referralService, $referrer) {
            $user = User::query()->create([
                'name' => $data['username'],
                'username' => $data['username'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password' => Hash::make($data['password']),
                'role' => 'user',
                'balance' => 0,
                'ref_code' => $referralService->generateUniqueRefCode($data['username']),
                'register_ip' => $registerIp,
                'referred_by' => $referrer?->id,
            ]);

            // Chỉ cộng thưởng khi thực sự có người giới thiệu hợp lệ
            if ($referrer && $user->referred_by) {
                $referralService->giveSignupCredit($user);
            }

            return $user->fresh();
        });

        $this->sendRegisterEmail($user, $adminMailService);

        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'balance' => (float) ($user->balance ?? 0),
                'ref_code' => $user->ref_code,
                'referred_by' => $user->referred_by,
            ],
            'token' => $token,
            'message' => 'Đăng ký thành công',
        ]);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        $login = trim($data['login']);

        $user = User::query()
            ->where('email', $login)
            ->orWhere('username', $login)
            ->orWhere('phone', $login)
            ->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Sai username, email, số điện thoại hoặc mật khẩu'],
            ]);
        }

        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'balance' => (float) ($user->balance ?? 0),
                'ref_code' => $user->ref_code,
                'referred_by' => $user->referred_by,
            ],
            'token' => $token,
            'message' => 'Đăng nhập thành công',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Đã logout',
        ]);
    }
}