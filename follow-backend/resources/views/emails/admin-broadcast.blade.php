<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>{{ $mailTitle }}</title>
</head>
<body style="margin:0;padding:0;background-color:#071327;font-family:Arial,Helvetica,sans-serif;color:#e5eefc;">
    <div style="width:100%;background-color:#071327;padding:32px 16px;">
        <div style="max-width:680px;margin:0 auto;background:#0b1730;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.35);">

            <div style="padding:28px 32px;background:linear-gradient(135deg,#0f1f42 0%, #102b5c 100%);border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8fb8ff;font-weight:700;">
                    SOLA VIETNAM
                </div>
                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.3;color:#ffffff;">
                    {{ $mailTitle }}
                </h1>
                <p style="margin:10px 0 0;font-size:14px;line-height:1.7;color:#b9c8e8;">
                    Xin chào {{ $user->name ?? $user->username ?? 'bạn' }},
                </p>
            </div>

            <div style="padding:28px 32px;">
                <div style="padding:18px 20px;border-radius:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);font-size:14px;line-height:1.9;color:#e5eefc;white-space:pre-line;">
                    {{ $mailContent }}
                </div>

                <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);font-size:13px;line-height:1.8;color:#8ea3c7;">
                    Đây là email thông báo tự động từ hệ thống <span style="color:#ffffff;font-weight:700;">Sola Vietnam</span>.
                </div>
            </div>
        </div>
    </div>
</body>
</html>