<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đơn hàng mới - Sola Vietnam</title>
</head>
<body style="margin:0;padding:0;background-color:#071327;font-family:Arial,Helvetica,sans-serif;color:#e5eefc;">
    <div style="width:100%;background-color:#071327;padding:32px 16px;">
        <div style="max-width:680px;margin:0 auto;background:#0b1730;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.35);">

            <div style="padding:28px 32px;background:linear-gradient(135deg,#0f1f42 0%, #102b5c 100%);border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8fb8ff;font-weight:700;">
                    SOLA VIETNAM
                </div>
                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.3;color:#ffffff;">
                    Có đơn hàng mới
                </h1>
                <p style="margin:10px 0 0;font-size:14px;line-height:1.7;color:#b9c8e8;">
                    Hệ thống vừa ghi nhận một đơn hàng mới từ website.
                </p>
            </div>

            <div style="padding:28px 32px;">
                <div style="margin-bottom:20px;padding:18px 20px;border-radius:18px;background:rgba(47,128,237,0.08);border:1px solid rgba(47,128,237,0.18);">
                    <div style="font-size:13px;color:#8fb8ff;margin-bottom:8px;">Mã đơn hàng</div>
                    <div style="font-size:26px;font-weight:700;color:#ffffff;">#{{ $order->id }}</div>
                </div>

                <div style="margin-bottom:24px;">
                    <div style="font-size:15px;font-weight:700;color:#ffffff;margin-bottom:14px;">Thông tin người đặt</div>

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
                            <td style="padding:12px 0;font-size:14px;color:#8ea3c7;">Email</td>
                            <td style="padding:12px 0;font-size:14px;color:#ffffff;word-break:break-word;">
                                {{ $user->email ?? 'Không có' }}
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="margin-bottom:24px;">
                    <div style="font-size:15px;font-weight:700;color:#ffffff;margin-bottom:14px;">Thông tin đơn hàng</div>

                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:38%;font-size:14px;color:#8ea3c7;">Tên dịch vụ</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;font-weight:600;">
                                {{ $order->service_name ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Nền tảng</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;font-weight:600;">
                                {{ $order->platform ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Mode</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;">
                                {{ $order->mode ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Link</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;word-break:break-word;">
                                {{ $order->target_link ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Số lượng</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;font-weight:600;">
                                {{ $order->quantity ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Đơn giá</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#60a5fa;font-weight:700;">
                                {{ number_format((float) ($order->unit_price ?? 0), 0, ',', '.') }}đ
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Tổng tiền</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:16px;color:#f59e0b;font-weight:700;">
                                {{ number_format((float) ($order->total_price ?? 0), 0, ',', '.') }}đ
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#8ea3c7;">Ghi chú</td>
                            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;white-space:pre-line;">
                                {{ $order->note ?? 'Không có' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 0;font-size:14px;color:#8ea3c7;">Trạng thái</td>
                            <td style="padding:12px 0;font-size:14px;color:#34d399;font-weight:700;">
                                {{ $order->status ?? 'Không có' }}
                            </td>
                        </tr>
                    </table>
                </div>

                @if(!empty($order->form_data))
                    <div style="margin-bottom:24px;padding:18px 20px;border-radius:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);">
                        <div style="font-size:14px;font-weight:700;color:#ffffff;margin-bottom:10px;">Form data</div>
                        <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:1.7;color:#c6d4ef;">{{ json_encode($order->form_data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) }}</pre>
                    </div>
                @endif

                <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);font-size:13px;line-height:1.8;color:#8ea3c7;">
                    Đây là email thông báo tự động từ hệ thống <span style="color:#ffffff;font-weight:700;">Sola Vietnam</span>.
                </div>
            </div>
        </div>
    </div>
</body>
</html>