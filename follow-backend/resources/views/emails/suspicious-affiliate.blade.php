<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Cảnh báo hoạt động bất thường</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
    <h2>Cảnh báo hoạt động bất thường - Sola Vietnam</h2>

    <p>Hệ thống vừa phát hiện một lần đăng ký đáng ngờ.</p>

    <p><strong>Lý do:</strong> {{ $reason ?? 'Không xác định' }}</p>
    <p><strong>Thời gian:</strong> {{ $time ?? '' }}</p>
    <p><strong>IP:</strong> {{ $ip ?? '' }}</p>
    <p><strong>User Agent:</strong> {{ $user_agent ?? '' }}</p>

    <hr>

    <p><strong>Username:</strong> {{ $username ?? '' }}</p>
    <p><strong>Email:</strong> {{ $email ?? '' }}</p>
    <p><strong>Số điện thoại:</strong> {{ $phone ?? '' }}</p>
    <p><strong>Mã affiliate:</strong> {{ $ref_code ?? '' }}</p>

    <p>Vui lòng kiểm tra lại hệ thống nếu cần.</p>
</body>
</html>