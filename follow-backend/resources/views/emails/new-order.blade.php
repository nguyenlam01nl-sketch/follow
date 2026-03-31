<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Đơn hàng mới</title>
</head>
<body>
    <h2>Có đơn hàng mới</h2>

    <p><strong>Mã đơn:</strong> {{ $order->id }}</p>
    <p><strong>Dịch vụ:</strong> {{ $order->service_name ?? 'Không có' }}</p>
    <p><strong>Nền tảng:</strong> {{ $order->platform ?? 'Không có' }}</p>
    <p><strong>Link:</strong> {{ $order->target_link ?? 'Không có' }}</p>
    <p><strong>Số lượng:</strong> {{ $order->quantity ?? 'Không có' }}</p>
    <p><strong>Tổng tiền:</strong> {{ number_format($order->total_price ?? 0, 0, ',', '.') }}đ</p>
    <p><strong>Ghi chú:</strong> {{ $order->note ?? 'Không có' }}</p>

    <hr>

    <p>SOLA VIETNAM thông báo tự động từ hệ thống.</p>
</body>
</html>