<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>User mới - Sola Vietnam</title>
</head>
<body style="margin:0;padding:0;background-color:#071327;font-family:Arial,Helvetica,sans-serif;color:#e5eefc;">
    <div style="width:100%;background-color:#071327;padding:32px 16px;">
        <div style="max-width:680px;margin:0 auto;background:#0b1730;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.35);">

            <div style="padding:28px 32px;background:linear-gradient(135deg,#0f1f42 0%, #102b5c 100%);border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8fb8ff;font-weight:700;">
                    SOLA VIETNAM
                </div>
                <h1 style="margin:10px 0 0;font-size:28px;color:#ffffff;">
                    🔥 Có  người dùng mới đăng ký
                </h1>
                <p style="margin:10px 0 0;font-size:14px;color:#b9c8e8;">
                    Hệ thống vừa ghi nhận một tài khoản mới.
                </p>
            </div>

            <div style="padding:28px 32px;">
                <div style="margin-bottom:20px;padding:18px 20px;border-radius:18px;background:rgba(47,128,237,0.08);border:1px solid rgba(47,128,237,0.18);">
                    <div style="font-size:13px;color:#8fb8ff;margin-bottom:8px;">User ID</div>
                    <div style="font-size:26px;font-weight:700;color:#ffffff;">#{{ $user->id }}</div>
                </div>

                <div style="margin-bottom:24px;">
                    <div style="font-size:15px;font-weight:700;color:#ffffff;margin-bottom:14px;">Thông tin user</div>

                    <table width="100%" style="border-collapse:collapse;">
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#8ea3c7;">Username</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#ffffff;font-weight:600;">
                                {{ $user->username }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#8ea3c7;">Email</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#ffffff;">
                                {{ $user->email }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;color:#8ea3c7;">Thời gian</td>
                            <td style="padding:12px 0;color:#34d399;font-weight:700;">
                                {{ now() }}
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);font-size:13px;color:#8ea3c7;">
                    Thông báo tự động từ hệ thống <b style="color:#ffffff;">Sola Vietnam</b>.
                </div>
            </div>
        </div>
    </div>
</body>
</html>