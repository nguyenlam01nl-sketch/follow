<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng ký thành công - Sola Vietnam</title>
</head>
<body style="margin:0;padding:0;background-color:#071327;font-family:Arial,Helvetica,sans-serif;color:#e5eefc;">
    <div style="width:100%;background-color:#071327;padding:32px 16px;">
        <div style="max-width:680px;margin:0 auto;background:#0b1730;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.35);">

            <div style="padding:28px 32px;background:linear-gradient(135deg,#0f1f42 0%, #102b5c 100%);border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8fb8ff;font-weight:700;">
                    SOLA VIETNAM
                </div>
                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.3;color:#ffffff;">
                    Đăng ký tài khoản thành công
                </h1>
                <p style="margin:10px 0 0;font-size:14px;line-height:1.7;color:#b9c8e8;">
                    Chào mừng bạn đến với hệ thống của Sola Vietnam.
                </p>
            </div>

            <div style="padding:28px 32px;">
                <div style="margin-bottom:20px;padding:18px 20px;border-radius:18px;background:rgba(47,128,237,0.08);border:1px solid rgba(47,128,237,0.18);">
                    <div style="font-size:13px;color:#8fb8ff;margin-bottom:8px;">Xin chào</div>
                    <div style="font-size:26px;font-weight:700;color:#ffffff;">{{ $user->name ?? $user->username }}</div>
                </div>

                <div style="margin-bottom:24px;">
                    <div style="font-size:15px;font-weight:700;color:#ffffff;margin-bottom:14px;">Thông tin tài khoản</div>

                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:38%;font-size:14px;color:#8ea3c7;">Họ tên</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;font-weight:600;">
                                {{ $user->name ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Username</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;font-weight:600;">
                                {{ $user->username ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Email</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;word-break:break-word;">
                                {{ $user->email ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;font-size:14px;color:#8ea3c7;">Vai trò</td>
                            <td style="padding:12px 0;font-size:14px;color:#34d399;font-weight:700;">
                                {{ ucfirst($user->role ?? 'user') }}
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="margin-bottom:24px;padding:18px 20px;border-radius:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);">
                    <div style="font-size:14px;font-weight:700;color:#ffffff;margin-bottom:10px;">Thông báo</div>
                    <div style="font-size:14px;line-height:1.8;color:#c6d4ef;">
                        Tài khoản của bạn đã được tạo thành công trên hệ thống Sola Vietnam.
                        <br><br>
                        Bây giờ bạn có thể đăng nhập để sử dụng các dịch vụ trên website.
                    </div>
                </div>

                <div style="margin-bottom:24px;padding:18px 20px;border-radius:18px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.18);">
                    <div style="font-size:14px;font-weight:700;color:#fbbf24;margin-bottom:10px;">Lưu ý bảo mật</div>
                    <div style="font-size:14px;line-height:1.8;color:#e5eefc;">
                        Vui lòng giữ an toàn thông tin đăng nhập của bạn và không chia sẻ mật khẩu cho người khác.
                    </div>
                </div>

                <div style="text-align:center;margin:30px 0 10px;">
                    <a href="https://solavietnam.com"
                       style="display:inline-block;padding:14px 26px;background:linear-gradient(135deg,#2563eb 0%, #3b82f6 100%);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;border-radius:14px;">
                        Truy cập Sola Vietnam
                    </a>
                </div>

                <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);font-size:13px;line-height:1.8;color:#8ea3c7;">
                    Đây là email tự động từ hệ thống <span style="color:#ffffff;font-weight:700;">Sola Vietnam</span>.
                </div>
            </div>
        </div>
    </div>
</body>
</html>