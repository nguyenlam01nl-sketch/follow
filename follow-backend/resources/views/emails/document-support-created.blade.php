<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Yêu cầu hỗ trợ giấy tờ mới - Sola Vietnam</title>
</head>
<body style="margin:0;padding:0;background-color:#071327;font-family:Arial,Helvetica,sans-serif;color:#e5eefc;">
    <div style="width:100%;background-color:#071327;padding:32px 16px;">
        <div style="max-width:680px;margin:0 auto;background:#0b1730;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.35);">

            <div style="padding:28px 32px;background:linear-gradient(135deg,#0f1f42 0%, #102b5c 100%);border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8fb8ff;font-weight:700;">
                    SOLA VIETNAM
                </div>
                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.3;color:#ffffff;">
                    Có yêu cầu hỗ trợ giấy tờ mới
                </h1>
                <p style="margin:10px 0 0;font-size:14px;line-height:1.7;color:#b9c8e8;">
                    Hệ thống vừa ghi nhận một yêu cầu hỗ trợ giấy tờ mới từ người dùng.
                </p>
            </div>

            <div style="padding:28px 32px;">
                <div style="margin-bottom:20px;padding:18px 20px;border-radius:18px;background:rgba(47,128,237,0.08);border:1px solid rgba(47,128,237,0.18);">
                    <div style="font-size:13px;color:#8fb8ff;margin-bottom:8px;">Mã yêu cầu</div>
                    <div style="font-size:26px;font-weight:700;color:#ffffff;">#{{ $documentSupport->id }}</div>
                </div>

                <div style="margin-bottom:24px;">
                    <div style="font-size:15px;font-weight:700;color:#ffffff;margin-bottom:14px;">Thông tin người dùng</div>

                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:38%;font-size:14px;color:#8ea3c7;">User ID</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;font-weight:600;">
                                {{ $user->id ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Tên</td>
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

                <div style="margin-bottom:24px;">
                    <div style="font-size:15px;font-weight:700;color:#ffffff;margin-bottom:14px;">Thông tin yêu cầu</div>

                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:38%;font-size:14px;color:#8ea3c7;">Loại giấy tờ</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;font-weight:600;">
                                {{ $typeLabel ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Số điện thoại</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:16px;color:#f59e0b;font-weight:700;">
                                {{ $documentSupport->phone ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Trạng thái</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#34d399;font-weight:700;">
                                {{ $documentSupport->status ?? 'pending' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Giá</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;">
                                Liên hệ
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Mô tả</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;word-break:break-word;">
                                {{ $documentSupport->note ?: 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;font-size:14px;color:#8ea3c7;">Thời gian tạo</td>
                            <td style="padding:12px 0;font-size:14px;color:#ffffff;">
                                {{ $documentSupport->created_at }}
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);font-size:13px;line-height:1.8;color:#8ea3c7;">
                    Đây là email thông báo tự động từ hệ thống <span style="color:#ffffff;font-weight:700;">Sola Vietnam</span>.
                </div>
            </div>
        </div>
    </div>
</body>
</html>