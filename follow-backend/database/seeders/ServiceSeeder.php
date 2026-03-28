<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            $this->makeService(
                platform: 'facebook',
                groupKey: 'support',
                serviceKey: 'mo-khoa-fb-dang-956',
                name: 'MỞ KHÓA FB DẠNG 956 ( KÉT SẮT TÍM & Ổ KHÓA TÍM )',
                price: 450000,
                schema: [
                    $this->textField('account_info', 'NHẬP MAIL HOẶC SĐT FB + PASSWORD FB', 'hotieubao@gmail.com + 0978899999 + pass', true),
                    $this->textField('contact', 'NHẬP THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để thông báo đơn hàng', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Mở Khóa FB Dạng 956 Két Sắt Chính Chủ', 'ket-sat-chinh-chu', 450000),
                        $this->option('Mở Khóa FB Dạng 956 Ổ Khóa Chính Chủ', 'o-khoa-chinh-chu', 450000),
                        $this->option('Mở Khóa FB Dạng 956 Két Sắt Không Chính Chủ', 'ket-sat-khong-chinh-chu', 1900000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'facebook',
                groupKey: 'support',
                serviceKey: 'verify-bao-ve-tai-khoan-facebook',
                name: 'VERIFY BẢO VỆ TÀI KHOẢN FACEBOOK',
                price: 399000,
                schema: [
                    $this->textField('cookie', 'NHẬP COOKIE FACEBOOK', 'Cookie hoặc id|pass|2fa', true),
                    $this->textField('contact', 'NHẬP THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để thông báo đơn hàng', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Verify Bảo Vệ Tài Khoản FB ( Loại Thường )', 'loai-thuong', 399000),
                        $this->option('Verify Bảo Vệ Tài Khoản FB ( Loại VIP )', 'loai-vip', 1900000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'facebook',
                groupKey: 'support',
                serviceKey: 'choc-ban-be-facebook',
                name: 'CHỌC BẠN BÈ FACEBOOK',
                price: 99000,
                schema: [
                    $this->textField('cookie', 'NHẬP COOKIE FACEBOOK', 'Cookie hoặc id|pass|2fa', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Chọc Bạn Bè FB Full List Friend', 'full-list-friend', 99000),
                        $this->option('Chọc Bạn Bè Gói 1 Tháng', 'goi-1-thang', 390000),
                        $this->option('Chọc Bạn Bè Gói 3 Tháng', 'goi-3-thang', 670000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'facebook',
                groupKey: 'support',
                serviceKey: 'loc-ban-be-facebook',
                name: 'LỌC BẠN BÈ FACEBOOK',
                price: 99000,
                schema: [
                    $this->textField('cookie', 'NHẬP COOKIE FACEBOOK', 'Cookie hoặc id|pass|2fa', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Lọc Bạn Bè FB Không Tương Tác', 'khong-tuong-tac', 99000),
                        $this->option('Lọc Bạn Bè FB Không Avatar', 'khong-avatar', 99000),
                        $this->option('Lọc Bạn Bè FB ( AI phân tích )', 'ai-phan-tich', 199000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'facebook',
                groupKey: 'support',
                serviceKey: 'tut-trick-fb',
                name: 'TUT TRICK FB',
                price: 40000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để bot tự động gửi đơn hàng', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('TUT RIP + Script RIP FB', 'tut-rip-script-rip-fb', 1699000),
                        $this->option('TUT Lên Tick Xanh Profile Full Thể Loại', 'tut-len-tick-xanh-profile-full-the-loai', 1999000),
                        $this->option('TUT Back Tài Khoản', 'tut-back-tai-khoan', 399000),
                        $this->option('TUT Mở Khóa Tài Khoản Khóa 956', 'tut-mo-khoa-tai-khoan-khoa-956', 399999),
                        $this->option('TUT Mở Khóa Tài Khoản Khóa 282', 'tut-mo-khoa-tai-khoan-khoa-282', 650000),
                        $this->option('TUT Verify Bảo Vệ Tài Khoản FB', 'tut-verify-bao-ve-tai-khoan-fb', 999000),
                        $this->option('TUT Đổi Tên Facebook Trước 60 ngày', 'tut-doi-ten-facebook-truoc-60-ngay', 250000),
                        $this->option('TUT Đổi Ngày Tháng Năm Sinh Không Giới Hạn', 'tut-doi-ngay-thang-nam-sinh-khong-gioi-han', 40000),
                        $this->option('TUT Kick Thiết Bị Lạ', 'tut-kick-thiet-bi-la', 40000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'facebook',
                groupKey: 'support',
                serviceKey: 'auto-len-tick-xanh-facebook-new-profile',
                name: 'AUTO LÊN TICK XANH FACEBOOK ( NEW PROFILE )',
                price: 390000,
                schema: [
                    $this->textField('display_name', 'TÊN', 'Nhập tên cần đặt cho tài khoản Facebook', true),
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram)', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Lên Tick Xanh Profile FB ( chậm )', 'profile-cham', 390000),
                        $this->option('Lên Tick Xanh Profile FB ( nhanh )', 'profile-nhanh', 690000),
                        $this->option('Lên Tick Xanh Profile FB ( Bảo Hành )', 'profile-bao-hanh', 990000),
                        $this->option('Lên Tick Xanh Chính Chủ ( Không Bảo Hành )', 'chinh-chu-khong-bao-hanh', 1200000),
                        $this->option('Lên Tick Xanh Chính Chủ ( Có Bảo Hành )', 'chinh-chu-co-bao-hanh', 1950000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'facebook',
                groupKey: 'support',
                serviceKey: 'dame-rip-facebook',
                name: 'DAME / RIP FACEBOOK',
                price: 280000,
                schema: [
                    $this->textField('fb_link', 'NHẬP LINK FB CẦN RIP', 'Link trang cá nhân hoặc id trang cá nhân', true),
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để thông báo đơn hàng', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('RIP Tài Khoản Profile Thường', 'rip-profile-thuong', 280000),
                        $this->option('RIP Tài Khoản Profile Chuyên Nghiệp', 'rip-profile-chuyen-nghiep', 390000),
                        $this->option('RIP Tài Khoản Facebook Locked', 'rip-facebook-locked', 490000),
                        $this->option('RIP Tài Khoản Facebook Không AVT', 'rip-facebook-khong-avt', 999000),
                        $this->option('RIP Fanpage Facebook', 'rip-fanpage-facebook', 999000),
                        $this->option('Rip 2 Part Profile thường', 'rip-2-part-profile-thuong', 560000),
                        $this->option('Rip 2 Part Profile Chuyên Nghiệp', 'rip-2-part-profile-chuyen-nghiep', 780000),
                        $this->option('Rip 2 Part Facebook Locked', 'rip-2-part-facebook-locked', 980000),
                        $this->option('Rip 2 Part Facebook Không AVT', 'rip-2-part-facebook-khong-avt', 1990000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'facebook',
                groupKey: 'support',
                serviceKey: 'auto-len-tick-xanh-facebook-chinh-chu',
                name: 'AUTO LÊN TICK XANH FACEBOOK ( CHÍNH CHỦ )',
                price: 1200000,
                schema: [
                    $this->textField('account_info', 'THÔNG TIN TÀI KHOẢN', 'Cookie hoặc id|pass|2fa', true),
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram)', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Lên Tick Xanh Chính Chủ ( Không Bảo Hành )', 'khong-bao-hanh', 1200000),
                        $this->option('Lên Tick Xanh Chính Chủ ( Có Bảo Hành )', 'co-bao-hanh', 1950000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'facebook',
                groupKey: 'support',
                serviceKey: 'auto-script-facebook',
                name: 'AUTO SCRIPT FACEBOOK',
                price: 99000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để bot auto gửi thông báo đơn hàng', true),
                    $this->textField('cookie', 'NHẬP COOKIE FACEBOOK', 'Cookie hoặc id|pass|2fa', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Xóa All Tin Nhắn', 'xoa-all-tin-nhan', 99000),
                        $this->option('Out All group', 'out-all-group', 99000),
                        $this->option('Hủy Follow All', 'huy-follow-all', 99000),
                        $this->option('Kick Nút Meta Verify', 'kick-nut-meta-verify', 299000),
                        $this->option('Ngâm Chính Chủ Ra Form Dự Phòng', 'ngam-chinh-chu-ra-form-du-phong', 129000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'facebook',
                groupKey: 'support',
                serviceKey: 'mo-khoa-dinh-chi-facebook',
                name: 'MỞ KHÓA ĐÌNH CHỈ FACEBOOK',
                price: 350000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để bot auto gửi thông báo đơn hàng', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Mở FB die 180 ngày ( lần đầu có mail )', 'die-180-ngay-lan-dau-co-mail', 350000),
                        $this->option('Mở FB die 180 ngày ( lần đầu ko mail )', 'die-180-ngay-lan-dau-khong-mail', 650000),
                        $this->option('Mở FB die 180 ngày ( lần 2 trở lên ) ( chính chủ )', 'die-180-ngay-lan-2-tro-len-chinh-chu', 950000),
                        $this->option('Mở FB đình chỉ ( lồng bản quyền )', 'dinh-chi-long-ban-quyen', 5500000),
                        $this->option('Mở FB đình chỉ ( lồng CMTFB đình chỉ / lồng CMT )', 'dinh-chi-long-cmtfb-long-cmt', 5500000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'instagram',
                groupKey: 'support',
                serviceKey: 'tick-xanh-instagram',
                name: 'TICK XANH INSTAGRAM',
                price: 1500000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để bot auto gửi thông báo đơn hàng', true),
                    $this->textField('account_info', 'NHẬP THÔNG TIN TÀI KHOẢN', 'Cookie hoặc id|pass|2fa', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Tick Xanh IG Chính Chủ Không BH', 'khong-bh', 1500000),
                        $this->option('Tick Xanh IG Chính Chủ Có BH', 'co-bh', 2200000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'instagram',
                groupKey: 'support',
                serviceKey: 'mo-khoa-instagram',
                name: 'MỞ KHÓA INSTAGRAM',
                price: 555000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để bot auto gửi thông báo đơn hàng', true),
                    $this->textField('account_info', 'NHẬP THÔNG TIN TÀI KHOẢN', 'Cookie hoặc id|pass|2fa', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Mở khóa đình chỉ tài khoản ( chính chủ )', 'dinh-chi-tai-khoan-chinh-chu', 555000),
                        $this->option('Mở khóa insta vô hiệu hóa ( cổng )', 'insta-vo-hieu-hoa-cong', 19800000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'dame-tiktok',
                name: 'DAME TIKTOK',
                price: 1999000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để bot auto gửi thông báo đơn hàng', true),
                    $this->textField('tiktok_id', 'NHẬP ID TIKTOK', 'ví dụ : @xxxxxxxxx', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Dame TikTok dưới 10k FL', 'duoi-10k-fl', 1999000),
                        $this->option('Dame TikTok 10 - 20k FL', '10-20k-fl', 2587000),
                        $this->option('Dame TikTok 20 - 50k FL', '20-50k-fl', 3950000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'unlock-tiktok-con-nut-khieu',
                name: 'UNLOCK TIKTOK ( CÒN NÚT KHIẾU )',
                price: 200000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để bot auto gửi thông báo đơn hàng', true),
                    $this->textField('tiktok_id', 'NHẬP ID TIKTOK', 'ví dụ : @xxxxxxxxx', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Mở khóa dạng mạo danh ( Chưa Kháng )', 'mao-danh-chua-khang', 950000),
                        $this->option('Mở khóa dạng tiêu chuẩn cộng đồng ( Chưa Kháng )', 'tieu-chuan-cong-dong-chua-khang', 1500000),
                        $this->option('Mở khóa dạng tái phạm ( Chưa Kháng )', 'tai-pham-chua-khang', 4980000),
                        $this->option('Mở khóa 13 tuổi', '13-tuoi', 200000),
                        $this->option('Mở khóa dạng hàng hóa', 'hang-hoa', 3636000),
                        $this->option('Mở khóa dạng Lách Luật ( Chưa Kháng )', 'lach-luat-chua-khang', 3636000),
                        $this->option('Mở khóa dạng Khác ( có nút khiếu nại )', 'khac-co-nut-khieu-nai', 4000000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'khang-video-tiktok',
                name: 'KHÁNG VIDEO TIKTOK',
                price: 380000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để bot gửi đơn hàng', true),
                    $this->textField('account_info', 'NHẬP THÔNG TIN TÀI KHOẢN', 'id|pass|2fa', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Kháng Video TikTok', 'khang-video', 380000),
                        $this->option('Kháng Video ( không thể khiếu nại )', 'khang-video-khong-the-khieu-nai', 3000000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'khang-livestream-tiktok',
                name: 'KHÁNG LIVESTREAM TIKTOK',
                price: 200000,
                schema: [
                    $this->textField('account_info', 'THÔNG TIN TÀI KHOẢN', 'Cookie hoặc TK|MK|2fa', true),
                    $this->textField('tiktok_id', 'NHẬP ID TIKTOK', 'ví dụ : @xxxxxxxxx', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Kháng Livestream 13T', 'livestream-13t', 200000),
                        $this->option('Kháng Livestream vĩnh viễn', 'livestream-vinh-vien', 2850000),
                        $this->option('Kháng Livesteam cấm 1 ngày', 'livestream-cam-1-ngay', 300000),
                        $this->option('Kháng Livesteam cấm 3 ngày', 'livestream-cam-3-ngay', 500000),
                        $this->option('Kháng Livesteam cấm 7 ngày', 'livestream-cam-7-ngay', 680000),
                        $this->option('Kháng hạn chế Livesteam', 'khang-han-che-livestream', 8000000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'unlock-tiktok-tach',
                name: 'UNLOCK TIKTOK ( TẠCH )',
                price: 2950000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để bot gửi đơn hàng', true),
                    $this->textField('tiktok_id', 'NHẬP ID TIKTOK', 'ví dụ : @xxxxxxxxx', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Mở khóa dạng mạo danh ( Tạch )', 'mao-danh-tach', 2950000),
                        $this->option('Mở khóa dạng tiêu chuẩn cộng đồng ( Tạch )', 'tieu-chuan-cong-dong-tach', 4500000),
                        $this->option('Mở khóa dạng hàng hóa', 'hang-hoa-tach', 4500000),
                        $this->option('Mở khóa dạng Lách Luật ( Tạch )', 'lach-luat-tach', 5500000),
                        $this->option('Mở khóa dạng Khác ( Tạch )', 'khac-tach', 7000000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'auto-unfollow-tiktok',
                name: 'AUTO UNFOLLOW TIKTOK',
                price: 99000,
                schema: [
                    $this->textField('account_info', 'THÔNG TIN TÀI KHOẢN', 'Tài Khoản | Mật Khẩu', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Auto UnFollow All', 'auto-unfollow-all', 99000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'tut-trick-tiktok',
                name: 'TUT TRICK TIKTOK',
                price: 90000,
                schema: [
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('TUT Verify TikTok Tránh Dame/ Rip', 'verify-tranh-dame-rip', 490000),
                        $this->option('TUT Mở Khóa Dạng Mạo Danh TikTok', 'mo-khoa-mao-danh-tiktok', 490000),
                        $this->option('TUT Fix Lỗi Mở Live TikTok', 'fix-loi-mo-live-tiktok', 90000),
                        $this->option('TUT Kháng Video TikTok', 'tut-khang-video-tiktok', 290000),
                        $this->option('TUT Kháng Livesteam TikTok', 'tut-khang-livestream-tiktok', 290000),
                        $this->option('TUT Lách Content ADS TikTok', 'tut-lach-content-ads-tiktok', 290000),
                        $this->option('TUT Lên Tài Khoản Công Ty', 'tut-len-tai-khoan-cong-ty', 99999),
                        $this->option('TUT fix lỗi không thể kháng nghị video', 'tut-fix-loi-khong-the-khang-nghi-video', 290000),
                        $this->option('TUT refund xu TikTok', 'tut-refund-xu-tiktok', 290000),
                        $this->option('TUT kháng tài khoản Ads TikTok', 'tut-khang-tai-khoan-ads-tiktok', 290000),
                        $this->option('TUT lách quẹt IP TikTok', 'tut-lach-quet-ip-tiktok', 190000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'update-tai-khoan-tiktok',
                name: 'UPDATE TÀI KHOẢN TIKTOK',
                price: 199000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để gửi đơn hàng', true),
                    $this->textField('account_info', 'THÔNG TIN TÀI KHOẢN', 'id|pass|2fa', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Lên Tài Khoản Công Ty', 'tai-khoan-cong-ty', 299000),
                        $this->option('Lên Tài Khoản Nghệ Sỹ', 'tai-khoan-nghe-sy', 199000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'fix-loi-tiktok',
                name: 'FIX LỖI TIKTOK',
                price: 999000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để bot auto gửi thông báo đơn hàng', true),
                    $this->textField('account_info', 'THÔNG TIN TÀI KHOẢN', 'id|pass|2fa', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Bypass 2fa chính chủ', 'bypass-2fa-chinh-chu', 999000),
                        $this->option('Fix lỗi login quá thường xuyên', 'fix-loi-login-qua-thuong-xuyen', 999000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'rename-doi-ten-tiktok',
                name: 'RENAME ĐỔI TÊN TIKTOK',
                price: 489000,
                schema: [
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để bot auto gửi thông báo đơn hàng', true),
                    $this->textField('new_name', 'NHẬP TÊN CẦN ĐỔI', 'Hồ Tiểu Bảo...', true),
                    $this->textField('account_info', 'THÔNG TIN TÀI KHOẢN', 'sđt|pass|2fa', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Rename TikTok Trước 7 Ngày', 'rename-truoc-7-ngay', 489000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'xac-minh-do-tuoi-tiktok',
                name: 'XÁC MINH ĐỘ TUỔI TIKTOK',
                price: 150000,
                schema: [
                    $this->textField('tiktok_id', 'NHẬP ID TIKTOK', '@hatokimedia', true),
                    $this->textField('contact', 'NHẬP THÔNG TIN LIÊN HỆ', '097.......', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Xác Minh Độ Tuổi', 'xac-minh-do-tuoi', 150000),
                        $this->option('Xác Minh Độ Tuổi Full Bảo Hành', 'xac-minh-do-tuoi-full-bao-hanh', 280000),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'tiktok',
                groupKey: 'support',
                serviceKey: 'han-che-live',
                name: 'HẠN CHẾ LIVE',
                price: 999999,
                schema: [
                    $this->textField('tiktok_id', 'NHẬP ID TIKTOK', '@hatokimedia', true),
                    $this->textField('contact', 'NHẬP THÔNG TIN TÀI KHOẢN', 'Sđt (Zalo) hoặc id (Telegram)', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option('Fix Hạn Chế Live', 'fix-han-che-live', 999999),
                    ]),
                    $this->agreeField(),
                ]
            ),
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['slug' => $service['slug']],
                $service
            );
        }
    }

    private function makeService(
        string $platform,
        string $groupKey,
        string $serviceKey,
        string $name,
        int $price,
        array $schema
    ): array {
        return [
            'platform' => $platform,
            'group_key' => $groupKey,
            'service_key' => $serviceKey,
            'name' => $name,
            'slug' => Str::slug($platform . '-' . $serviceKey),
            'description' => 'Cung cấp đa dạng các gói dịch vụ chất lượng cao.',
            'mode' => 'manual',
            'price' => $price,
            'min_quantity' => null,
            'max_quantity' => null,
            'unit' => 'gói',
            'requires_quantity' => false,
            'requires_link' => false,
            'requires_note' => false,
            'form_schema' => $schema,
            'status' => 'active',
        ];
    }

    private function textField(
        string $name,
        string $label,
        string $placeholder,
        bool $required = true
    ): array {
        return [
            'type' => 'text',
            'name' => $name,
            'label' => $label,
            'placeholder' => $placeholder,
            'required' => $required,
        ];
    }

    private function radioField(
        string $name,
        string $label,
        array $options
    ): array {
        return [
            'type' => 'radio',
            'name' => $name,
            'label' => $label,
            'required' => true,
            'options' => $options,
        ];
    }

    private function agreeField(): array
    {
        return [
            'type' => 'checkbox',
            'name' => 'agree',
            'label' => 'TÔI XÁC NHẬN GÓI DỊCH VỤ VÀ CÁC ĐIỀU KHOẢN SỬ DỤNG.',
            'required' => true,
        ];
    }

    private function option(
        string $label,
        string $value,
        int $price
    ): array {
        return [
            'label' => $label,
            'value' => $value,
            'price' => $price,
        ];
    }
}