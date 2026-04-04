<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AdminMailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
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

    public function register(Request $request, AdminMailService $adminMailService)
    {
        $data = $request->validate([
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20|unique:users,phone',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $data['username'],
            'username' => $data['username'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => Hash::make($data['password']),
            'role' => 'user',
        ]);

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

        $user = User::where('email', $login)
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