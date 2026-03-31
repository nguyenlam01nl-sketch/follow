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
                serviceKey: 'lay-lai-facebook-bi-hack',
                name: 'LẤY LẠI FACEBOOK BỊ HACK',
                price: 450000,
                schema: [
                    $this->textField('account_info', 'NHẬP MAIL HOẶC SĐT FB + PASSWORD FB', 'hotieubao@gmail.com + 0978899999 + pass', true),
                    $this->textField('contact', 'NHẬP THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để thông báo đơn hàng', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option(
                            'Lấy Lại Facebook Bị Hack',
                            'lay-lai-facebook-bi-hack',
                            450000,
                            $this->desc([
                                'Dịch vụ khôi phục tài khoản Facebook bị hack hoặc bị chiếm quyền.',
                                'Yêu cầu có thiết bị đã đăng nhập và sử dụng thường xuyên trên 6 tháng.',
                                'Thực hiện quy trình xác minh để lấy lại quyền truy cập tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Lấy Lại Facebook Bị Hack + Bảo Vệ TK Khỏi Nguy Cơ Hack',
                            'lay-lai-facebook-bi-hack-bao-ve',
                            950000,
                            $this->desc([
                                'Dịch vụ khôi phục tài khoản Facebook bị hack và thiết lập bảo vệ tài khoản.',
                                'Yêu cầu có thiết bị đã đăng nhập và sử dụng thường xuyên trên 6 tháng.',
                                'Sau khi lấy lại sẽ thiết lập bảo mật để hạn chế nguy cơ bị hack lại.',
                            ])
                        ),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'facebook',
                groupKey: 'support',
                serviceKey: 'mo-khoa-fb-dang-956-ket-sat-o-khoa-tim',
                name: 'MỞ KHÓA FB DẠNG 956 ( KÉT SẮT TÍM & Ổ KHÓA TÍM )',
                price: 450000,
                schema: [
                    $this->textField('account_info', 'NHẬP MAIL HOẶC SĐT FB + PASSWORD FB', 'hotieubao@gmail.com + 0978899999 + pass', true),
                    $this->textField('contact', 'NHẬP THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram) để thông báo đơn hàng', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option(
                            'Mở Khóa FB Dạng 956 Két Sắt Chính Chủ',
                            'ket-sat-chinh-chu',
                            450000,
                            $this->desc([
                                'Dịch vụ mở khóa tài khoản Facebook bị khóa 956 dạng két sắt.',
                                'Yêu cầu có thiết bị đã đăng nhập và sử dụng thường xuyên trên 6 tháng.',
                                'Thực hiện quy trình xác minh chính chủ để khôi phục quyền truy cập tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Mở Khóa FB Dạng 956 Ổ Khóa Chính Chủ',
                            'o-khoa-chinh-chu',
                            450000,
                            $this->desc([
                                'Dịch vụ mở khóa tài khoản Facebook bị khóa 956 dạng ổ khóa.',
                                'Yêu cầu có thiết bị đã đăng nhập và sử dụng thường xuyên trên 6 tháng.',
                                'Thực hiện quy trình xác minh chính chủ để khôi phục quyền truy cập tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Mở Khóa FB Dạng 956 Két Sắt Không Chính Chủ',
                            'ket-sat-khong-chinh-chu',
                            1900000,
                            $this->desc([
                                'Dịch vụ mở khóa tài khoản Facebook bị khóa 956 dạng két sắt khi không chính chủ.',
                                'Quy trình xử lý phức tạp, thời gian mở khóa lâu khoảng 15–45 ngày.',
                                'Phù hợp cho tài khoản bị khóa nặng và cần xử lý khôi phục quyền truy cập.',
                            ])
                        ),
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
                        $this->option(
                            'Verify Bảo Vệ Tài Khoản FB ( Loại Thường )',
                            'loai-thuong',
                            399000,
                            $this->desc([
                                'Dịch vụ xác minh và thiết lập bảo vệ tài khoản Facebook loại thường.',
                                'Giúp tăng độ tin cậy và hạn chế checkpoint hoặc khóa tài khoản.',
                                'Phù hợp cho người quản lý nhiều tài khoản hoặc cần tăng bảo mật.',
                            ])
                        ),
                        $this->option(
                            'Verify Bảo Vệ Tài Khoản FB ( Loại VIP )',
                            'loai-vip',
                            1900000,
                            $this->desc([
                                'Dịch vụ xác minh và thiết lập bảo vệ tài khoản Facebook mức VIP.',
                                'Tăng độ tin cậy tài khoản và hạn chế checkpoint, khóa hoặc hạn chế tính năng.',
                                'Phù hợp cho tài khoản quan trọng, người làm dịch vụ hoặc quản lý nhiều tài khoản.',
                            ])
                        ),
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
                        $this->option(
                            'Chọc Bạn Bè FB Full List Friend',
                            'full-list-friend',
                            99000,
                            $this->desc([
                                'Dịch vụ tự động chọc toàn bộ bạn bè trong danh sách Facebook.',
                                'Giúp tăng tương tác và nhắc bạn bè quay lại profile.',
                                'Phù hợp cho tài khoản cần kích hoạt tương tác với full list friend.',
                            ])
                        ),
                        $this->option(
                            'Chọc Bạn Bè Gói 1 Tháng',
                            'goi-1-thang',
                            390000,
                            $this->desc([
                                'Dịch vụ tự động chọc bạn bè Facebook trong thời gian 1 tháng.',
                                'Hoạt động định kỳ giúp duy trì và tăng tương tác với bạn bè.',
                                'Phù hợp cho tài khoản bán hàng hoặc xây dựng profile hoạt động thường xuyên.',
                            ])
                        ),
                        $this->option(
                            'Chọc Bạn Bè Gói 3 Tháng',
                            'goi-3-thang',
                            670000,
                            $this->desc([
                                'Dịch vụ tự động chọc bạn bè Facebook trong thời gian 3 tháng.',
                                'Hoạt động định kỳ giúp duy trì và tăng tương tác với danh sách bạn bè.',
                                'Phù hợp cho tài khoản bán hàng hoặc xây dựng profile hoạt động lâu dài.',
                            ])
                        ),
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
                        $this->option(
                            'Lọc Bạn Bè FB Không Tương Tác',
                            'khong-tuong-tac',
                            99000,
                            $this->desc([
                                'Dịch vụ lọc và gỡ bạn bè Facebook không có tương tác trong danh sách.',
                                'Giúp làm sạch danh sách bạn bè và tối ưu tương tác tài khoản.',
                                'Phù hợp cho người xây dựng profile bán hàng hoặc phát triển thương hiệu cá nhân.',
                            ])
                        ),
                        $this->option(
                            'Lọc Bạn Bè FB Không Avatar',
                            'khong-avatar',
                            99000,
                            $this->desc([
                                'Dịch vụ lọc và gỡ bạn bè Facebook không có ảnh đại diện avatar.',
                                'Giúp làm sạch danh sách bạn bè và hạn chế tài khoản ảo.',
                                'Phù hợp cho tài khoản bán hàng hoặc xây dựng profile chất lượng.',
                            ])
                        ),
                        $this->option(
                            'Lọc Bạn Bè FB ( AI phân tích )',
                            'ai-phan-tich',
                            199000,
                            $this->desc([
                                'Dịch vụ lọc bạn bè Facebook bằng hệ thống AI phân tích.',
                                'Tự động xác định tài khoản ít tương tác, tài khoản ảo hoặc không phù hợp.',
                                'Giúp tối ưu danh sách bạn bè và tăng chất lượng tương tác tài khoản.',
                            ])
                        ),
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
                        $this->option(
                            'TUT RIP + Script RIP FB',
                            'tut-rip-script-rip-fb',
                            1699000,
                            $this->desc([
                                'Tài liệu hướng dẫn report RIP tài khoản Facebook kèm công cụ tự động.',
                                'Bao gồm script hỗ trợ gửi report tự động để tối ưu thời gian xử lý.',
                                'Phù hợp cho người làm dịch vụ Facebook hoặc xử lý tài khoản giả mạo.',
                            ])
                        ),
                        $this->option(
                            'TUT Lên Tick Xanh Profile Full Thể Loại',
                            'tut-len-tick-xanh-profile-full-the-loai',
                            1999000,
                            $this->desc([
                                'Tài liệu hướng dẫn lên tick xanh Facebook cho nhiều lĩnh vực khác nhau.',
                                'Chia sẻ quy trình chuẩn bị hồ sơ và tối ưu hồ sơ xác minh.',
                                'Phù hợp cho cá nhân, KOL hoặc người làm dịch vụ Facebook.',
                            ])
                        ),
                        $this->option(
                            'TUT Back Tài Khoản',
                            'tut-back-tai-khoan',
                            399000,
                            $this->desc([
                                'Tài liệu hướng dẫn lấy lại back tài khoản khi mất quyền truy cập.',
                                'Chia sẻ các phương pháp khôi phục và quy trình xử lý từng trường hợp.',
                                'Phù hợp cho người quản lý nhiều tài khoản hoặc làm dịch vụ hỗ trợ Facebook.',
                            ])
                        ),
                        $this->option(
                            'TUT Mở Khóa Tài Khoản Khóa 956',
                            'tut-mo-khoa-tai-khoan-khoa-956',
                            399999,
                            $this->desc([
                                'Tài liệu hướng dẫn xử lý tài khoản Facebook bị khóa dạng 956.',
                                'Chia sẻ quy trình gửi xác minh và kháng nghị để mở lại tài khoản.',
                                'Phù hợp cho người quản lý nhiều tài khoản hoặc làm dịch vụ Facebook.',
                            ])
                        ),
                        $this->option(
                            'TUT Mở Khóa Tài Khoản Khóa 282',
                            'tut-mo-khoa-tai-khoan-khoa-282',
                            650000,
                            $this->desc([
                                'Tài liệu hướng dẫn xử lý tài khoản Facebook bị khóa dạng 282.',
                                'Chia sẻ quy trình xác minh và gửi kháng nghị để mở lại tài khoản.',
                                'Phù hợp cho người quản lý nhiều tài khoản hoặc làm dịch vụ Facebook.',
                            ])
                        ),
                        $this->option(
                            'TUT Verify Bảo Vệ Tài Khoản FB',
                            'tut-verify-bao-ve-tai-khoan-fb',
                            999000,
                            $this->desc([
                                'Tài liệu hướng dẫn xác minh và tăng bảo mật tài khoản Facebook.',
                                'Chia sẻ cách thiết lập các lớp bảo vệ để hạn chế checkpoint và khóa tài khoản.',
                                'Phù hợp cho người quản lý nhiều tài khoản hoặc làm dịch vụ Facebook.',
                            ])
                        ),
                        $this->option(
                            'TUT Đổi Tên Facebook Trước 60 ngày',
                            'tut-doi-ten-facebook-truoc-60-ngay',
                            250000,
                            $this->desc([
                                'Tài liệu hướng dẫn đổi tên Facebook khi chưa đủ 60 ngày.',
                                'Chia sẻ các phương pháp xử lý để gửi yêu cầu đổi tên sớm.',
                                'Phù hợp cho người cần chỉnh sửa tên gấp hoặc làm dịch vụ Facebook.',
                            ])
                        ),
                        $this->option(
                            'TUT Đổi Ngày Tháng Năm Sinh Không Giới Hạn',
                            'tut-doi-ngay-thang-nam-sinh-khong-gioi-han',
                            40000,
                            $this->desc([
                                'Tài liệu hướng dẫn thay đổi ngày tháng năm sinh Facebook nhiều lần.',
                                'Chia sẻ cách gửi yêu cầu chỉnh sửa thông tin để tránh bị giới hạn hệ thống.',
                                'Phù hợp cho người cần chỉnh sửa thông tin cá nhân hoặc làm dịch vụ Facebook.',
                            ])
                        ),
                        $this->option(
                            'TUT Kick Thiết Bị Lạ',
                            'tut-kick-thiet-bi-la',
                            40000,
                            $this->desc([
                                'Tài liệu hướng dẫn đăng xuất các thiết bị lạ khỏi tài khoản Facebook.',
                                'Chia sẻ cách kiểm tra phiên đăng nhập và bảo vệ tài khoản.',
                                'Phù hợp cho người quản lý nhiều tài khoản hoặc cần tăng bảo mật.',
                            ])
                        ),
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
                        $this->option(
                            'Lên Tick Xanh Profile FB ( chậm )',
                            'profile-cham',
                            390000,
                            $this->desc([
                                'Dịch vụ hỗ trợ lên tick xanh cho profile Facebook.',
                                'Tốc độ xử lý chậm, nhận kết quả sau khoảng 48 giờ.',
                                'Không bảo hành, phù hợp cho khách cần chi phí tối ưu.',
                            ])
                        ),
                        $this->option(
                            'Lên Tick Xanh Profile FB ( nhanh )',
                            'profile-nhanh',
                            690000,
                            $this->desc([
                                'Dịch vụ hỗ trợ lên tick xanh cho profile Facebook.',
                                'Tốc độ xử lý nhanh, ưu tiên xét duyệt hồ sơ.',
                                'Phù hợp cho cá nhân, KOL hoặc thương hiệu cần xác minh tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Lên Tick Xanh Profile FB ( Bảo Hành )',
                            'profile-bao-hanh',
                            990000,
                            $this->desc([
                                'Dịch vụ hỗ trợ lên tick xanh cho profile Facebook.',
                                'Có bảo hành, hỗ trợ xử lý nếu phát sinh vấn đề.',
                                'Phù hợp cho cá nhân, KOL hoặc thương hiệu cần xác minh tài khoản ổn định.',
                            ])
                        ),
                        $this->option(
                            'Lên Tick Xanh Chính Chủ ( Không Bảo Hành )',
                            'chinh-chu-khong-bao-hanh',
                            1200000,
                            $this->desc([
                                'Dịch vụ hỗ trợ lên tick xanh Facebook bằng thông tin chính chủ.',
                                'Quy trình xác minh dựa trên giấy tờ và thông tin tài khoản thật.',
                                'Không bảo hành, phù hợp cho cá nhân cần xác minh tài khoản.',
                                'Không cần cung cấp CCCD.',
                                'Thời gian lên tick từ 15–60 ngày.',
                            ])
                        ),
                        $this->option(
                            'Lên Tick Xanh Chính Chủ ( Có Bảo Hành )',
                            'chinh-chu-co-bao-hanh',
                            1950000,
                            $this->desc([
                                'Dịch vụ hỗ trợ lên tick xanh Facebook bằng thông tin chính chủ.',
                                'Quy trình xác minh dựa trên giấy tờ và thông tin tài khoản thật.',
                                'Có bảo hành, phù hợp cho cá nhân cần xác minh tài khoản.',
                                'Không cần cung cấp CCCD.',
                                'Thời gian lên tick từ 15–60 ngày.',
                            ])
                        ),
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
                        $this->option(
                            'RIP Tài Khoản Profile Thường',
                            'rip-profile-thuong',
                            280000,
                            $this->desc([
                                'Dịch vụ xử lý report RIP tài khoản Facebook profile thường theo yêu cầu.',
                                'Áp dụng cho tài khoản giả mạo, tài khoản cũ mất quyền truy cập hoặc gây ảnh hưởng xấu.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý tài khoản.',
                                'Thời gian xử lý tối đa 72h, không bảo hành, khi hoàn thành sẽ gửi Noti đầy đủ, rip random 956, 282, faq.',
                                'Thời gian Done trong vòng 30 phút đến 3 ngày, khi die thì bot sẽ tự động phản hồi qua zalo hoặc telegram.',
                            ])
                        ),
                        $this->option(
                            'RIP Tài Khoản Profile Chuyên Nghiệp',
                            'rip-profile-chuyen-nghiep',
                            390000,
                            $this->desc([
                                'Dịch vụ xử lý report RIP tài khoản Facebook profile chuyên nghiệp theo yêu cầu.',
                                'Áp dụng cho tài khoản giả mạo, tài khoản cũ mất quyền truy cập hoặc gây ảnh hưởng xấu.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý tài khoản.',
                                'Thời gian xử lý tối đa 72h, không bảo hành, khi hoàn thành sẽ gửi Noti đầy đủ, rip random 956, 282, faq.',
                                'Thời gian Done trong vòng 30 phút đến 3 ngày, khi die thì bot sẽ tự động phản hồi qua zalo hoặc telegram.',
                            ])
                        ),
                        $this->option(
                            'RIP Tài Khoản Facebook Locked',
                            'rip-facebook-locked',
                            490000,
                            $this->desc([
                                'Dịch vụ xử lý report RIP tài khoản Facebook đang ở trạng thái Locked.',
                                'Áp dụng cho tài khoản giả mạo, tài khoản cũ mất quyền truy cập hoặc gây ảnh hưởng xấu.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý tài khoản.',
                                'Thời gian xử lý tối đa 72h, không bảo hành, khi hoàn thành sẽ gửi Noti đầy đủ, rip random 956, 282, faq.',
                                'Thời gian Done trong vòng 30 phút đến 3 ngày, khi die thì bot sẽ tự động phản hồi qua zalo hoặc telegram.',
                            ])
                        ),
                        $this->option(
                            'RIP Tài Khoản Facebook Không AVT',
                            'rip-facebook-khong-avt',
                            999000,
                            $this->desc([
                                'Dịch vụ xử lý report RIP tài khoản Facebook không có ảnh đại diện.',
                                'Áp dụng cho tài khoản giả mạo, tài khoản cũ mất quyền truy cập hoặc gây ảnh hưởng xấu.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý tài khoản.',
                                'Thời gian xử lý tối đa 72h, không bảo hành, khi hoàn thành sẽ gửi Noti đầy đủ, rip random 956, 282, faq.',
                                'Thời gian Done trong vòng 30 phút đến 3 ngày, khi die thì bot sẽ tự động phản hồi qua zalo hoặc telegram.',
                            ])
                        ),
                        $this->option(
                            'RIP Fanpage Facebook',
                            'rip-fanpage-facebook',
                            999000,
                            $this->desc([
                                'Dịch vụ xử lý report RIP fanpage Facebook theo yêu cầu.',
                                'Áp dụng cho fanpage giả mạo, fanpage cũ mất quyền quản lý hoặc gây ảnh hưởng xấu.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý fanpage.',
                                'Thời gian xử lý tối đa 72h, không bảo hành, khi hoàn thành sẽ gửi Noti đầy đủ, rip random 956, 282, faq.',
                                'Thời gian Done trong vòng 30 phút đến 3 ngày, khi die thì bot sẽ tự động phản hồi qua zalo hoặc telegram.',
                            ])
                        ),
                        $this->option(
                            'Rip 2 Part Profile thường',
                            'rip-2-part-profile-thuong',
                            560000,
                            $this->desc([
                                'Dịch vụ xử lý report tài khoản 2 lần sẽ khó lấy về hơn.',
                                'Áp dụng cho tài khoản giả mạo, tài khoản cũ mất quyền truy cập hoặc gây ảnh hưởng xấu.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý tài khoản.',
                                'Thời gian xử lý tối đa 72h, không bảo hành, khi hoàn thành sẽ gửi Noti đầy đủ, rip random 956, 282, faq.',
                                'Thời gian Done trong vòng 30 phút đến 3 ngày, khi die thì bot sẽ tự động phản hồi qua zalo hoặc telegram.',
                            ])
                        ),
                        $this->option(
                            'Rip 2 Part Profile Chuyên Nghiệp',
                            'rip-2-part-profile-chuyen-nghiep',
                            780000,
                            $this->desc([
                                'Dịch vụ xử lý report tài khoản 2 lần sẽ khó lấy về hơn.',
                                'Áp dụng cho tài khoản giả mạo, tài khoản cũ mất quyền truy cập hoặc gây ảnh hưởng xấu.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý tài khoản.',
                                'Thời gian xử lý tối đa 72h, không bảo hành, khi hoàn thành sẽ gửi Noti đầy đủ, rip random 956, 282, faq.',
                                'Thời gian Done trong vòng 30 phút đến 3 ngày, khi die thì bot sẽ tự động phản hồi qua zalo hoặc telegram.',
                            ])
                        ),
                        $this->option(
                            'Rip 2 Part Facebook Locked',
                            'rip-2-part-facebook-locked',
                            980000,
                            $this->desc([
                                'Dịch vụ xử lý report tài khoản 2 lần sẽ khó lấy về hơn.',
                                'Áp dụng cho tài khoản giả mạo, tài khoản cũ mất quyền truy cập hoặc gây ảnh hưởng xấu.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý tài khoản.',
                                'Thời gian xử lý tối đa 72h, không bảo hành, khi hoàn thành sẽ gửi Noti đầy đủ, rip random 956, 282, faq.',
                                'Thời gian Done trong vòng 30 phút đến 3 ngày, khi die thì bot sẽ tự động phản hồi qua zalo hoặc telegram.',
                            ])
                        ),
                        $this->option(
                            'Rip 2 Part Facebook Không AVT',
                            'rip-2-part-facebook-khong-avt',
                            1990000,
                            $this->desc([
                                'Dịch vụ xử lý report tài khoản 2 lần sẽ khó lấy về hơn.',
                                'Áp dụng cho tài khoản giả mạo, tài khoản cũ mất quyền truy cập hoặc gây ảnh hưởng xấu.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý tài khoản.',
                                'Thời gian xử lý tối đa 72h, không bảo hành, khi hoàn thành sẽ gửi Noti đầy đủ, rip random 956, 282, faq.',
                                'Thời gian Done trong vòng 30 phút đến 3 ngày, khi die thì bot sẽ tự động phản hồi qua zalo hoặc telegram.',
                            ])
                        ),
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
                        $this->option(
                            'Lên Tick Xanh Chính Chủ ( Không Bảo Hành )',
                            'khong-bao-hanh',
                            1200000,
                            $this->desc([
                                'Dịch vụ hỗ trợ lên tick xanh Facebook bằng thông tin chính chủ.',
                                'Quy trình xác minh dựa trên giấy tờ và thông tin tài khoản thật.',
                                'Không bảo hành, phù hợp cho cá nhân cần xác minh tài khoản.',
                                'Không cần cung cấp CCCD.',
                                'Thời gian lên tick từ 15–60 ngày.',
                            ])
                        ),
                        $this->option(
                            'Lên Tick Xanh Chính Chủ ( Có Bảo Hành )',
                            'co-bao-hanh',
                            1950000,
                            $this->desc([
                                'Dịch vụ hỗ trợ lên tick xanh Facebook bằng thông tin chính chủ.',
                                'Quy trình xác minh dựa trên giấy tờ và thông tin tài khoản thật.',
                                'Có bảo hành, phù hợp cho cá nhân cần xác minh tài khoản.',
                                'Không cần cung cấp CCCD.',
                                'Thời gian lên tick từ 15–60 ngày.',
                            ])
                        ),
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
                        $this->option(
                            'Xóa All Tin Nhắn',
                            'xoa-all-tin-nhan',
                            99000,
                            $this->desc([
                                'Dịch vụ xóa toàn bộ tin nhắn trên tài khoản Facebook hoặc Messenger.',
                                'Giúp dọn sạch lịch sử chat và bảo vệ quyền riêng tư.',
                                'Phù hợp cho tài khoản cần làm sạch toàn bộ dữ liệu tin nhắn nhanh chóng.',
                            ])
                        ),
                        $this->option(
                            'Out All group',
                            'out-all-group',
                            99000,
                            $this->desc([
                                'Dịch vụ thoát toàn bộ group nhóm trên tài khoản Facebook.',
                                'Giúp làm sạch tài khoản và giảm spam thông báo từ các nhóm.',
                                'Phù hợp cho tài khoản cần tối ưu lại hoạt động và quản lý group.',
                            ])
                        ),
                        $this->option(
                            'Hủy Follow All',
                            'huy-follow-all',
                            99000,
                            $this->desc([
                                'Dịch vụ hủy theo dõi toàn bộ tài khoản đang follow trên Facebook.',
                                'Giúp làm sạch bảng tin và tối ưu nội dung hiển thị.',
                                'Phù hợp cho tài khoản cần reset lại danh sách theo dõi.',
                            ])
                        ),
                        $this->option(
                            'Kick Nút Meta Verify',
                            'kick-nut-meta-verify',
                            299000,
                            $this->desc([
                                'Dịch vụ kích hoạt nút đăng ký Meta Verified trên tài khoản Facebook.',
                                'Giúp tài khoản đủ điều kiện đăng ký và sử dụng dịch vụ tick xanh trả phí.',
                                'Phù hợp cho tài khoản cần mở quyền xác minh Meta Verified.',
                            ])
                        ),
                        $this->option(
                            'Ngâm Chính Chủ Ra Form Dự Phòng',
                            'ngam-chinh-chu-ra-form-du-phong',
                            129000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản Facebook để xuất hiện form dự phòng.',
                                'Áp dụng cho tài khoản có thông tin chính chủ nhưng chưa hiện form hỗ trợ.',
                                'Giúp tăng khả năng gửi yêu cầu kháng nghị và khôi phục tài khoản.',
                                'Thời gian ngâm khoảng 6 tháng, xong 6 tháng sẽ tự động có form.',
                                'Form sẽ ở trên máy chủ riêng của hệ thống.',
                            ])
                        ),
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
                        $this->option(
                            'Mở FB die 180 ngày ( lần đầu có mail )',
                            'die-180-ngay-lan-dau-co-mail',
                            350000,
                            $this->desc([
                                'Dịch vụ xử lý mở lại tài khoản Facebook bị die dạng 180 ngày.',
                                'Áp dụng cho tài khoản vẫn còn quyền truy cập email liên kết.',
                                'Thực hiện quy trình gửi yêu cầu để khôi phục lại tài khoản.',
                                'Time: 1–15 ngày khi xử lý.',
                            ])
                        ),
                        $this->option(
                            'Mở FB die 180 ngày ( lần đầu ko mail )',
                            'die-180-ngay-lan-dau-khong-mail',
                            650000,
                            $this->desc([
                                'Dịch vụ xử lý mở lại tài khoản Facebook bị die dạng 180 ngày.',
                                'Áp dụng cho tài khoản không còn quyền truy cập email liên kết.',
                                'Thực hiện quy trình xác minh để khôi phục quyền truy cập tài khoản.',
                                'Time: 1–15 ngày khi xử lý.',
                            ])
                        ),
                        $this->option(
                            'Mở FB die 180 ngày ( lần 2 trở lên ) ( chính chủ )',
                            'die-180-ngay-lan-2-tro-len-chinh-chu',
                            950000,
                            $this->desc([
                                'Dịch vụ xử lý mở lại tài khoản Facebook bị die 180 ngày từ lần thứ 2 trở lên.',
                                'Áp dụng cho tài khoản có thông tin chính chủ để xác minh.',
                                'Thời gian xử lý khoảng 1–7 ngày để khôi phục quyền truy cập tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Mở FB đình chỉ ( lồng bản quyền )',
                            'dinh-chi-long-ban-quyen',
                            5500000,
                            $this->desc([
                                'Dịch vụ xử lý mở lại tài khoản Facebook bị đình chỉ do vi phạm lồng bản quyền.',
                                'Thực hiện quy trình gửi yêu cầu và xác minh với hệ thống.',
                                'Giúp khôi phục quyền truy cập tài khoản sau khi bị đình chỉ.',
                                'Time: 7–30 ngày.',
                            ])
                        ),
                        $this->option(
                            'Mở FB đình chỉ ( lồng CMTFB đình chỉ / lồng CMT )',
                            'dinh-chi-long-cmtfb-long-cmt',
                            5500000,
                            $this->desc([
                                'Dịch vụ xử lý mở lại tài khoản Facebook bị đình chỉ do vi phạm lồng CMT.',
                                'Thực hiện quy trình gửi yêu cầu và xác minh với hệ thống.',
                                'Giúp khôi phục quyền truy cập tài khoản sau khi bị đình chỉ.',
                                'Time: 7–30 ngày.',
                            ])
                        ),
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
                        $this->option(
                            'Tick Xanh IG Chính Chủ Không BH',
                            'khong-bh',
                            1500000,
                            $this->desc([
                                'Dịch vụ hỗ trợ lên tick xanh Instagram bằng thông tin chính chủ.',
                                'Thời gian xử lý khoảng 20–60 ngày tùy quá trình xét duyệt.',
                                'Không bảo hành sau khi thực hiện.',
                            ])
                        ),
                        $this->option(
                            'Tick Xanh IG Chính Chủ Có BH',
                            'co-bh',
                            2200000,
                            $this->desc([
                                'Dịch vụ hỗ trợ lên tick xanh Instagram bằng thông tin chính chủ.',
                                'Thời gian xử lý khoảng 20–60 ngày tùy quá trình xét duyệt.',
                                'Có bảo hành trong quá trình sử dụng.',
                            ])
                        ),
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
                        $this->option(
                            'Mở khóa đình chỉ tài khoản ( chính chủ )',
                            'dinh-chi-tai-khoan-chinh-chu',
                            555000,
                            $this->desc([
                                'Dịch vụ xử lý mở khóa tài khoản Instagram bị khóa hoặc hạn chế.',
                                'Áp dụng cho tài khoản có thông tin chính chủ để xác minh.',
                                'Thực hiện quy trình gửi yêu cầu để khôi phục quyền truy cập tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Mở khóa insta vô hiệu hóa ( cổng )',
                            'insta-vo-hieu-hoa-cong',
                            19800000,
                            $this->desc([
                                'Dịch vụ xử lý mở lại tài khoản Instagram bị vô hiệu hóa qua cổng hỗ trợ.',
                                'Áp dụng cho tài khoản bị disable nhưng còn đủ điều kiện gửi yêu cầu.',
                                'Thực hiện quy trình xác minh để khôi phục quyền truy cập tài khoản.',
                            ])
                        ),
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
                        $this->option(
                            'Dame TikTok dưới 10k FL',
                            'duoi-10k-fl',
                            1999000,
                            $this->desc([
                                'Dịch vụ xử lý report dame tài khoản TikTok dưới 10.000 follower.',
                                'Áp dụng cho tài khoản cũ mất quyền truy cập hoặc tài khoản giả mạo.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý tài khoản.',
                                'Thời gian xử lý: 15 phút – 24h.',
                                'Mặc định MD – TCCD.',
                            ])
                        ),
                        $this->option(
                            'Dame TikTok 10 - 20k FL',
                            '10-20k-fl',
                            2587000,
                            $this->desc([
                                'Dịch vụ xử lý report dame tài khoản TikTok từ 10.000 – 20.000 follower.',
                                'Áp dụng cho tài khoản giả mạo, tài khoản cũ mất quyền truy cập hoặc gây ảnh hưởng.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý tài khoản.',
                                'Thời gian xử lý: 15 phút – 24h.',
                                'Mặc định MD – TCCD.',
                            ])
                        ),
                        $this->option(
                            'Dame TikTok 20 - 50k FL',
                            '20-50k-fl',
                            3950000,
                            $this->desc([
                                'Dịch vụ xử lý report dame tài khoản TikTok từ 20.000 – 50.000 follower.',
                                'Áp dụng cho tài khoản giả mạo, tài khoản cũ mất quyền truy cập hoặc gây ảnh hưởng.',
                                'Thực hiện quy trình báo cáo để hệ thống xem xét và xử lý tài khoản.',
                                'Thời gian xử lý: 15 phút – 24h.',
                                'Mặc định MD – TCCD.',
                            ])
                        ),
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
                        $this->option(
                            'Mở khóa dạng mạo danh ( Chưa Kháng )',
                            'mao-danh-chua-khang',
                            950000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị khóa do báo cáo mạo danh nhưng chưa gửi kháng nghị.',
                                'Thực hiện quy trình mở khóa với xác minh thông tin chính chủ.',
                                'Phù hợp cho tài khoản bị report mạo danh và còn đủ điều kiện gửi appeal.',
                            ])
                        ),
                        $this->option(
                            'Mở khóa dạng tiêu chuẩn cộng đồng ( Chưa Kháng )',
                            'tieu-chuan-cong-dong-chua-khang',
                            1500000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị khóa do vi phạm tiêu chuẩn cộng đồng.',
                                'Thực hiện quy trình gửi appeal và xét duyệt để mở lại tài khoản.',
                                'Phù hợp cho tài khoản mới bị khóa và còn đủ điều kiện kháng nghị lần đầu.',
                            ])
                        ),
                        $this->option(
                            'Mở khóa dạng tái phạm ( Chưa Kháng )',
                            'tai-pham-chua-khang',
                            4980000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị khóa do vi phạm nhiều lần.',
                                'Thực hiện quy trình gửi appeal để xét duyệt và mở lại tài khoản.',
                                'Phù hợp cho tài khoản bị khóa nhiều lần nhưng vẫn còn khả năng kháng nghị.',
                            ])
                        ),
                        $this->option(
                            'Mở khóa 13 tuổi',
                            '13-tuoi',
                            200000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị khóa do hệ thống xác định dưới 13 tuổi.',
                                'Thực hiện quy trình xác minh và gửi yêu cầu xét duyệt để mở lại tài khoản.',
                                'Phù hợp cho tài khoản bị khóa nhầm do lỗi nhận diện độ tuổi.',
                            ])
                        ),
                        $this->option(
                            'Mở khóa dạng hàng hóa',
                            'hang-hoa',
                            3636000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị hạn chế hoặc khóa do vi phạm chính sách hàng hóa.',
                                'Thực hiện quy trình gửi xét duyệt để mở lại tài khoản từ hệ thống.',
                                'Phù hợp cho tài khoản bán hàng hoặc đăng nội dung liên quan sản phẩm.',
                            ])
                        ),
                        $this->option(
                            'Mở khóa dạng Lách Luật ( Chưa Kháng )',
                            'lach-luat-chua-khang',
                            3636000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị khóa do vi phạm dạng lách luật.',
                                'Thực hiện quy trình gửi appeal để xét duyệt và mở lại tài khoản.',
                                'Phù hợp cho tài khoản mới bị khóa và còn đủ điều kiện kháng nghị.',
                            ])
                        ),
                        $this->option(
                            'Mở khóa dạng Khác ( có nút khiếu nại )',
                            'khac-co-nut-khieu-nai',
                            4000000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị khóa do các vi phạm khác nhưng vẫn còn nút khiếu nại.',
                                'Thực hiện gửi appeal và theo dõi xét duyệt để mở lại tài khoản.',
                                'Phù hợp cho tài khoản còn quyền kháng nghị trực tiếp từ hệ thống.',
                            ])
                        ),
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
                        $this->option(
                            'Kháng Video TikTok',
                            'khang-video',
                            380000,
                            $this->desc([
                                'Dịch vụ kháng nghị khi video TikTok bị gỡ hoặc đánh dấu vi phạm.',
                                'Thực hiện gửi yêu cầu xét duyệt lại để khôi phục video.',
                                'Phù hợp cho creator, người bán hàng và người vận hành nhiều tài khoản TikTok.',
                            ])
                        ),
                        $this->option(
                            'Kháng Video ( không thể khiếu nại )',
                            'khang-video-khong-the-khieu-nai',
                            3000000,
                            $this->desc([
                                'Dịch vụ xử lý video TikTok bị gỡ nhưng không còn nút khiếu nại.',
                                'Thực hiện các phương pháp xử lý đặc biệt để khôi phục nội dung.',
                                'Phù hợp cho video quan trọng cần khôi phục nhưng đã mất quyền appeal.',
                            ])
                        ),
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
                        $this->option(
                            'Kháng Livestream 13T',
                            'livestream-13t',
                            200000,
                            $this->desc([
                                'Dịch vụ kháng nghị khi livestream TikTok bị chặn do vi phạm 13+ độ tuổi.',
                                'Thực hiện gửi yêu cầu xét duyệt lại để mở lại quyền LIVE.',
                                'Phù hợp cho tài khoản bán hàng, creator bị khóa livestream do lỗi hệ thống hoặc nhận diện nhầm.',
                                'Tăng tỉ lệ về lên đến 70%.',
                                'Nếu muốn kháng khoảng 95% thì nên chọn mục chat support TikTok để liên kết tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Kháng Livestream vĩnh viễn',
                            'livestream-vinh-vien',
                            2850000,
                            $this->desc([
                                'Dịch vụ kháng nghị khi tài khoản TikTok bị cấm livestream vĩnh viễn.',
                                'Thực hiện gửi yêu cầu xét duyệt và xử lý để mở lại quyền LIVE.',
                                'Phù hợp cho tài khoản bán hàng, creator hoặc kênh từng vi phạm nhiều lần.',
                                'Tăng tỉ lệ về lên đến 70%.',
                                'Nếu muốn kháng khoảng 95% thì nên chọn mục chat support TikTok để liên kết tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Kháng Livesteam cấm 1 ngày',
                            'livestream-cam-1-ngay',
                            300000,
                            $this->desc([
                                'Dịch vụ kháng nghị khi livestream TikTok bị cấm 24 giờ do vi phạm.',
                                'Thực hiện gửi yêu cầu xét duyệt để mở lại quyền LIVE sớm hơn.',
                                'Phù hợp cho tài khoản bán hàng hoặc creator cần livestream liên tục.',
                                'Tăng tỉ lệ về lên đến 70%.',
                                'Nếu muốn kháng khoảng 95% thì nên chọn mục chat support TikTok để liên kết tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Kháng Livesteam cấm 3 ngày',
                            'livestream-cam-3-ngay',
                            500000,
                            $this->desc([
                                'Dịch vụ kháng nghị khi livestream TikTok bị cấm 3 ngày do vi phạm.',
                                'Thực hiện gửi yêu cầu xét duyệt để mở lại quyền LIVE nhanh hơn.',
                                'Phù hợp cho tài khoản bán hàng và creator cần duy trì livestream liên tục.',
                                'Tăng tỉ lệ về lên đến 70%.',
                                'Nếu muốn kháng khoảng 95% thì nên chọn mục chat support TikTok để liên kết tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Kháng Livesteam cấm 7 ngày',
                            'livestream-cam-7-ngay',
                            680000,
                            $this->desc([
                                'Tăng tỉ lệ về lên đến 70% thì hãy chọn dịch vụ này.',
                                'Nếu bạn muốn kháng khoảng 95% đáp thì hãy chọn mục chat support TikTok để liên kết tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Kháng hạn chế Livesteam',
                            'khang-han-che-livestream',
                            8000000,
                            $this->desc([
                                'Dịch vụ kháng nghị khi livestream TikTok bị hạn chế tính năng hoặc giảm phân phối.',
                                'Thực hiện gửi yêu cầu xét duyệt để khôi phục lại quyền livestream bình thường.',
                                'Phù hợp cho tài khoản bán hàng, creator hoặc kênh livestream thường xuyên.',
                                'Time: 1–10 ngày.',
                            ])
                        ),
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
                        $this->option(
                            'Mở khóa dạng mạo danh ( Tạch )',
                            'mao-danh-tach',
                            2950000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị dính dạng mạo danh nhưng kháng nghị thất bại tạch.',
                                'Kiểm tra và thực hiện quy trình mở khóa lại tài khoản từ hệ thống.',
                                'Phù hợp cho tài khoản bị báo cáo mạo danh nhiều lần hoặc đã gửi kháng nghị trước đó.',
                                'Time: 2–10 ngày.',
                            ])
                        ),
                        $this->option(
                            'Mở khóa dạng tiêu chuẩn cộng đồng ( Tạch )',
                            'tieu-chuan-cong-dong-tach',
                            4500000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị khóa do vi phạm tiêu chuẩn cộng đồng nhưng kháng nghị thất bại.',
                                'Thực hiện quy trình mở khóa và gửi yêu cầu xét duyệt lại từ hệ thống.',
                                'Phù hợp cho tài khoản đã kháng nghị trước đó nhưng không được duyệt tạch.',
                                'Time: 2–15 ngày.',
                            ])
                        ),
                        $this->option(
                            'Mở khóa dạng hàng hóa',
                            'hang-hoa-tach',
                            4500000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị hạn chế hoặc khóa do vi phạm chính sách hàng hóa.',
                                'Kiểm tra và thực hiện quy trình mở lại tài khoản từ hệ thống.',
                                'Phù hợp cho tài khoản bán hàng hoặc đăng nội dung liên quan đến sản phẩm.',
                                'Time: 2–10 ngày.',
                            ])
                        ),
                        $this->option(
                            'Mở khóa dạng Lách Luật ( Tạch )',
                            'lach-luat-tach',
                            5500000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị khóa do vi phạm dạng lách luật nhưng kháng nghị thất bại.',
                                'Thực hiện kiểm tra và gửi quy trình mở khóa lại từ hệ thống.',
                                'Phù hợp cho tài khoản đã kháng nghị trước đó nhưng bị từ chối tạch.',
                                'Time: 2–10 ngày.',
                            ])
                        ),
                        $this->option(
                            'Mở khóa dạng Khác ( Tạch )',
                            'khac-tach',
                            7000000,
                            $this->desc([
                                'Dịch vụ xử lý tài khoản TikTok bị khóa các dạng vi phạm khác khi kháng nghị thất bại.',
                                'Kiểm tra nguyên nhân và thực hiện quy trình mở khóa lại từ hệ thống.',
                                'Phù hợp cho tài khoản đã gửi appeal trước đó nhưng không được duyệt tạch.',
                                'Time: 2–10 ngày.',
                            ])
                        ),
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
                        $this->option(
                            'Auto UnFollow All',
                            'auto-unfollow-all',
                            99000,
                            $this->desc([
                                'Dịch vụ tự động hủy theo dõi unfollow hàng loạt trên TikTok.',
                                'Giúp dọn danh sách following nhanh, tối ưu lại tỉ lệ follow tài khoản.',
                                'Phù hợp cho người nuôi tài khoản, xây kênh hoặc làm dịch vụ TikTok.',
                            ])
                        ),
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
                        $this->option(
                            'TUT Verify TikTok Tránh Dame/ Rip',
                            'verify-tranh-dame-rip',
                            490000,
                            $this->desc([
                                'Hướng dẫn cách verify tài khoản TikTok an toàn, hạn chế bị đánh dấu hệ thống.',
                                'Chia sẻ phương pháp tránh dame hoặc rip khi làm số lượng lớn.',
                                'Phù hợp cho người làm dịch vụ, nuôi và quản lý nhiều tài khoản TikTok.',
                            ])
                        ),
                        $this->option(
                            'TUT Mở Khóa Dạng Mạo Danh TikTok',
                            'mo-khoa-mao-danh-tiktok',
                            490000,
                            $this->desc([
                                'Hướng dẫn xử lý tài khoản TikTok bị báo mạo danh và cách gửi kháng nghị mở khóa.',
                                'Chia sẻ quy trình chỉnh sửa thông tin, xác minh để tăng tỷ lệ duyệt lại.',
                                'Phù hợp cho người làm dịch vụ TikTok, nuôi và quản lý nhiều tài khoản.',
                            ])
                        ),
                        $this->option(
                            'TUT Fix Lỗi Mở Live TikTok',
                            'fix-loi-mo-live-tiktok',
                            90000,
                            $this->desc([
                                'Hướng dẫn khắc phục lỗi không bật được LIVE TikTok dù tài khoản đủ điều kiện.',
                                'Chia sẻ các bước kiểm tra, chỉnh tài khoản và phương pháp kích hoạt lại tính năng LIVE.',
                                'Phù hợp cho người làm nội dung, bán hàng hoặc nuôi tài khoản TikTok.',
                            ])
                        ),
                        $this->option(
                            'TUT Kháng Video TikTok',
                            'tut-khang-video-tiktok',
                            290000,
                            $this->desc([
                                'Hướng dẫn kháng nghị video TikTok khi bị vi phạm, bóp tương tác hoặc gỡ video.',
                                'Chia sẻ quy trình gửi appeal đúng cách để tăng tỷ lệ được duyệt lại.',
                                'Phù hợp cho người làm nội dung, bán hàng và vận hành nhiều tài khoản TikTok.',
                            ])
                        ),
                        $this->option(
                            'TUT Kháng Livesteam TikTok',
                            'tut-khang-livestream-tiktok',
                            290000,
                            $this->desc([
                                'Hướng dẫn kháng nghị khi livestream TikTok bị chặn, tắt live hoặc vi phạm.',
                                'Chia sẻ cách gửi appeal đúng quy trình để tăng tỷ lệ mở lại quyền livestream.',
                                'Phù hợp cho người bán hàng, creator và người làm dịch vụ TikTok.',
                            ])
                        ),
                        $this->option(
                            'TUT Lách Content ADS TikTok',
                            'tut-lach-content-ads-tiktok',
                            290000,
                            $this->desc([
                                'Hướng dẫn chỉnh sửa và xây dựng nội dung quảng cáo TikTok để hạn chế bị từ chối.',
                                'Chia sẻ các cách tối ưu video, chữ và kịch bản để tăng tỷ lệ duyệt ADS.',
                                'Phù hợp cho người chạy quảng cáo, bán hàng và làm dịch vụ TikTok Ads.',
                            ])
                        ),
                        $this->option(
                            'TUT Lên Tài Khoản Công Ty',
                            'tut-len-tai-khoan-cong-ty',
                            99999,
                            $this->desc([
                                'Hướng dẫn chuyển đổi tài khoản TikTok sang tài khoản công ty business đúng cách.',
                                'Chia sẻ cách tối ưu thông tin và thiết lập để sử dụng các tính năng kinh doanh.',
                                'Phù hợp cho người bán hàng, xây dựng thương hiệu và làm dịch vụ TikTok.',
                            ])
                        ),
                        $this->option(
                            'TUT fix lỗi không thể kháng nghị video',
                            'tut-fix-loi-khong-the-khang-nghi-video',
                            290000,
                            $this->desc([
                                'Hướng dẫn xử lý khi video TikTok bị vi phạm nhưng không hiện nút kháng nghị.',
                                'Chia sẻ cách mở lại mục appeal và gửi yêu cầu xét duyệt thủ công.',
                                'Phù hợp cho người làm nội dung, bán hàng và vận hành nhiều tài khoản TikTok.',
                            ])
                        ),
                        $this->option(
                            'TUT refund xu TikTok',
                            'tut-refund-xu-tiktok',
                            290000,
                            $this->desc([
                                'Hướng dẫn cách yêu cầu hoàn xu TikTok khi nạp nhầm hoặc gặp lỗi giao dịch.',
                                'Chia sẻ quy trình gửi yêu cầu hỗ trợ để tăng tỷ lệ được hoàn xu.',
                                'Phù hợp cho người dùng TikTok thường xuyên nạp xu tặng quà livestream.',
                            ])
                        ),
                        $this->option(
                            'TUT kháng tài khoản Ads TikTok',
                            'tut-khang-tai-khoan-ads-tiktok',
                            290000,
                            $this->desc([
                                'Hướng dẫn kháng nghị khi tài khoản quảng cáo TikTok bị khóa hoặc hạn chế.',
                                'Chia sẻ quy trình gửi appeal và chuẩn bị thông tin để tăng tỷ lệ mở lại.',
                                'Phù hợp cho người chạy quảng cáo, agency và dịch vụ TikTok Ads.',
                            ])
                        ),
                        $this->option(
                            'TUT lách quẹt IP TikTok',
                            'tut-lach-quet-ip-tiktok',
                            190000,
                            $this->desc([
                                'Hướng dẫn hạn chế bị TikTok quét và đánh dấu IP khi đăng nhập nhiều tài khoản.',
                                'Chia sẻ cách cấu hình môi trường, IP và thiết bị để giảm rủi ro checkpoint.',
                                'Phù hợp cho người nuôi tài khoản, làm dịch vụ và vận hành hệ thống TikTok số lượng lớn.',
                            ])
                        ),
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
                        $this->option(
                            'Lên Tài Khoản Công Ty',
                            'tai-khoan-cong-ty',
                            299000,
                            $this->desc([
                                'Dịch vụ chuyển đổi tài khoản TikTok sang tài khoản Công Ty Business.',
                                'Phù hợp cho người bán hàng, creator hoặc thương hiệu trên TikTok.',
                            ])
                        ),
                        $this->option(
                            'Lên Tài Khoản Nghệ Sỹ',
                            'tai-khoan-nghe-sy',
                            199000,
                            $this->desc([
                                'Dịch vụ chuyển đổi tài khoản TikTok sang dạng tài khoản Nghệ Sỹ hoặc Creator.',
                                'Giúp mở thêm các tính năng hỗ trợ sáng tạo nội dung và xây dựng thương hiệu cá nhân.',
                                'Phù hợp cho người sáng tạo nội dung, KOL hoặc nghệ sĩ hoạt động trên TikTok.',
                            ])
                        ),
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
                        $this->option(
                            'Bypass 2fa chính chủ',
                            'bypass-2fa-chinh-chu',
                            999000,
                            $this->desc([
                                'Dịch vụ xử lý bypass xác thực 2 lớp 2FA cho tài khoản Facebook chính chủ.',
                                'Áp dụng khi mất quyền truy cập ứng dụng xác thực hoặc thiết bị 2FA.',
                                'Thực hiện quy trình xác minh để khôi phục quyền đăng nhập tài khoản.',
                            ])
                        ),
                        $this->option(
                            'Fix lỗi login quá thường xuyên',
                            'fix-loi-login-qua-thuong-xuyen',
                            999000,
                            $this->desc([
                                'Dịch vụ xử lý lỗi Facebook hoặc TikTok báo đăng nhập quá thường xuyên.',
                                'Khắc phục tình trạng bị chặn đăng nhập do hệ thống phát hiện hoạt động bất thường.',
                                'Giúp khôi phục khả năng đăng nhập và sử dụng tài khoản bình thường.',
                            ])
                        ),
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
                        $this->option(
                            'Rename TikTok Trước 7 Ngày',
                            'rename-truoc-7-ngay',
                            489000,
                            $this->desc([
                                'Chưa có mô tả cho gói này.',
                            ])
                        ),
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
                    $this->textField('tiktok_id', 'NHẬP ID TIKTOK', '@solamvietnam', true),
                    $this->textField('contact', 'NHẬP THÔNG TIN LIÊN HỆ', '097.......', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option(
                            'Xác Minh Độ Tuổi',
                            'xac-minh-do-tuoi',
                            150000,
                            $this->desc([
                                'Chưa có mô tả cho gói này.',
                            ])
                        ),
                        $this->option(
                            'Xác Minh Độ Tuổi Full Bảo Hành',
                            'xac-minh-do-tuoi-full-bao-hanh',
                            280000,
                            $this->desc([
                                'Chưa có mô tả cho gói này.',
                            ])
                        ),
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
                    $this->textField('tiktok_id', 'NHẬP ID TIKTOK', '@solamvietnam', true),
                    $this->textField('contact', 'NHẬP THÔNG TIN TÀI KHOẢN', 'Sđt (Zalo) hoặc id (Telegram)', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option(
                            'Fix Hạn Chế Live',
                            'fix-han-che-live',
                            999999,
                            $this->desc([
                                'Fix hạn chế khi cứ mở live lên là trong 30 giây đầu sẽ bị hạn chế, đây là một lỗi khó khắc phục.',
                                'Thời gian fix chỉ từ 2–6 tiếng.',
                            ])
                        ),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'x-twitter',
                groupKey: 'support',
                serviceKey: 'dich-vu-x-twitter',
                name: 'DỊCH VỤ',
                price: 100000,
                schema: [
                    $this->textField('link', 'NHẬP LINK TÀI KHOẢN / BÀI VIẾT', 'https://x.com/...', true),
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram)', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option(
                            'Dịch vụ X Twitter',
                            'dich-vu-x-twitter',
                            100000,
                            $this->desc([
                                'Chưa có mô tả cho gói này.',
                            ])
                        ),
                    ]),
                    $this->agreeField(),
                ]
            ),

            $this->makeService(
                platform: 'youtube',
                groupKey: 'support',
                serviceKey: 'dich-vu-youtube',
                name: 'DỊCH VỤ YOUTUBE',
                price: 100000,
                schema: [
                    $this->textField('link', 'NHẬP LINK KÊNH / VIDEO', 'https://youtube.com/...', true),
                    $this->textField('contact', 'THÔNG TIN LIÊN HỆ', 'Sđt (Zalo) hoặc id (Telegram)', true),
                    $this->radioField('package', 'CHỌN MÁY CHỦ DỊCH VỤ', [
                        $this->option(
                            'Dịch vụ YouTube',
                            'dich-vu-youtube',
                            100000,
                            $this->desc([
                                'Chưa có mô tả cho gói này.',
                            ])
                        ),
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
            'price' => $price * 3,
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
        int $price,
        ?string $description = null
    ): array {
        return [
            'label' => $label,
            'value' => $value,
            'price' => $price * 3,
            'description' => $description,
        ];
    }

    private function desc(array $lines): string
    {
        return implode("\n", $lines);
    }
}