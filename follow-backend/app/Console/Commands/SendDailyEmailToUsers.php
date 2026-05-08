<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendDailyEmailToUsers extends Command
{
    protected $signature = 'email:send-daily-users';

    protected $description = 'Gửi email giới thiệu website mỗi ngày tới toàn bộ user';

    public function handle()
    {
        $campaigns = [
            [
                'subject' => 'Tăng follow nhanh chóng tại Sola Vietnam',
                'title' => 'Dịch vụ tăng follow tiện lợi',
                'content' => 'Sola Vietnam hỗ trợ tăng follow Facebook, Instagram, TikTok với hệ thống xử lý nhanh chóng, giao diện dễ sử dụng và phù hợp cho người cần phát triển kênh mạng xã hội.',
            ],
            [
                'subject' => 'Tăng tương tác mạng xã hội dễ dàng',
                'title' => 'Tăng like, follow và lượt xem',
                'content' => 'Bạn có thể sử dụng Sola Vietnam để hỗ trợ tăng like, tăng follow, tăng view và nhiều loại tương tác khác trên các nền tảng mạng xã hội phổ biến.',
            ],
            [
                'subject' => 'Hỗ trợ xử lý tài khoản mạng xã hội',
                'title' => 'Dịch vụ hỗ trợ tài khoản',
                'content' => 'Sola Vietnam cung cấp các dịch vụ hỗ trợ liên quan đến tài khoản Facebook, Instagram, TikTok như mở khóa, xử lý tài khoản và các nhu cầu hỗ trợ khác.',
            ],
            [
                'subject' => 'Tăng lượt xem video nhanh chóng',
                'title' => 'Dịch vụ tăng view video',
                'content' => 'Nếu bạn muốn video có thêm lượt xem, Sola Vietnam hỗ trợ tăng view cho TikTok, Reels và các nội dung mạng xã hội khác một cách tiện lợi.',
            ],
            [
                'subject' => 'Sola Vietnam hoạt động 24/7',
                'title' => 'Hệ thống social media tự động',
                'content' => 'Website hoạt động liên tục, giúp người dùng có thể đặt dịch vụ bất cứ lúc nào và theo dõi đơn hàng trực tiếp trên dashboard.',
            ],
            [
                'subject' => 'Hỗ trợ xoá tài khoản mạng xã hội',
                'title' => 'Dịch vụ xoá tài khoản',
                'content' => 'Sola Vietnam hỗ trợ các nhu cầu liên quan đến xoá tài khoản Facebook, Instagram, TikTok và các vấn đề tài khoản cần xử lý nhanh chóng.',
            ],
            [
                'subject' => 'Phát triển kênh social dễ dàng hơn',
                'title' => 'Giải pháp cho người làm mạng xã hội',
                'content' => 'Với các dịch vụ tăng follow, tăng tương tác và hỗ trợ tài khoản, Sola Vietnam giúp người dùng quản lý nhu cầu social media thuận tiện hơn.',
            ],
            [
                'subject' => 'Tăng follow Instagram tiện lợi',
                'title' => 'Dịch vụ Instagram tại Sola Vietnam',
                'content' => 'Bạn có thể sử dụng Sola Vietnam để hỗ trợ tăng follow Instagram, tăng tương tác bài viết và cải thiện độ hiển thị cho tài khoản.',
            ],
            [
                'subject' => 'Tăng follow TikTok nhanh chóng',
                'title' => 'Dịch vụ TikTok',
                'content' => 'Sola Vietnam hỗ trợ tăng follow TikTok, tăng lượt xem video và các dịch vụ tương tác giúp kênh TikTok phát triển ổn định hơn.',
            ],
            [
                'subject' => 'Tăng tương tác Facebook tiện lợi',
                'title' => 'Dịch vụ Facebook',
                'content' => 'Hệ thống hỗ trợ tăng like, follow, tương tác bài viết và nhiều dịch vụ khác liên quan đến Facebook.',
            ],
            [
                'subject' => 'Cập nhật nhiều dịch vụ social mới',
                'title' => 'Dịch vụ mới tại Sola Vietnam',
                'content' => 'Sola Vietnam thường xuyên cập nhật thêm các dịch vụ social media mới để đáp ứng nhu cầu tăng trưởng và hỗ trợ tài khoản của người dùng.',
            ],
            [
                'subject' => 'Đặt dịch vụ social chỉ trong vài bước',
                'title' => 'Giao diện dễ sử dụng',
                'content' => 'Người dùng có thể chọn dịch vụ, nhập thông tin cần thiết và theo dõi tiến trình đơn hàng ngay trên hệ thống Sola Vietnam.',
            ],
            [
                'subject' => 'Tăng view TikTok dễ dàng',
                'title' => 'Hỗ trợ tăng lượt xem TikTok',
                'content' => 'Dịch vụ tăng view TikTok giúp video có thêm lượt tiếp cận, phù hợp cho người muốn phát triển nội dung nhanh hơn.',
            ],
            [
                'subject' => 'Khám phá website Sola Vietnam',
                'title' => 'Nền tảng hỗ trợ social media',
                'content' => 'Sola Vietnam là website hỗ trợ các dịch vụ mạng xã hội như tăng follow, tăng tương tác, hỗ trợ tài khoản và nhiều tiện ích khác.',
            ],
            [
                'subject' => 'Hỗ trợ mở khóa tài khoản',
                'title' => 'Xử lý vấn đề tài khoản',
                'content' => 'Nếu tài khoản mạng xã hội gặp vấn đề, Sola Vietnam có các dịch vụ hỗ trợ xử lý và mở khóa tài khoản theo nhu cầu.',
            ],
            [
                'subject' => 'Tăng like bài viết nhanh chóng',
                'title' => 'Dịch vụ tăng like',
                'content' => 'Sola Vietnam hỗ trợ tăng like bài viết trên nhiều nền tảng, giúp nội dung có thêm độ tin cậy và tương tác ban đầu.',
            ],
            [
                'subject' => 'Tăng mắt xem livestream',
                'title' => 'Hỗ trợ livestream',
                'content' => 'Website hỗ trợ các dịch vụ liên quan đến livestream như tăng mắt xem, tăng tương tác và hỗ trợ hiển thị tốt hơn.',
            ],
            [
                'subject' => 'Dịch vụ social cho cá nhân và shop',
                'title' => 'Phù hợp nhiều nhu cầu',
                'content' => 'Sola Vietnam phù hợp cho cá nhân, người bán hàng, shop online hoặc người làm nội dung cần tăng trưởng kênh mạng xã hội.',
            ],
            [
                'subject' => 'Theo dõi đơn hàng dễ dàng',
                'title' => 'Quản lý đơn ngay trên dashboard',
                'content' => 'Sau khi đặt dịch vụ, người dùng có thể theo dõi trạng thái đơn hàng và lịch sử giao dịch trực tiếp trên tài khoản của mình.',
            ],
            [
                'subject' => 'Nạp ví và sử dụng dịch vụ tiện lợi',
                'title' => 'Thanh toán dễ dàng',
                'content' => 'Sola Vietnam hỗ trợ nạp ví và sử dụng số dư để đặt các dịch vụ social media nhanh chóng hơn.',
            ],
            [
                'subject' => 'Tăng độ uy tín cho tài khoản',
                'title' => 'Hỗ trợ xây dựng hình ảnh social',
                'content' => 'Các dịch vụ tăng follow và tăng tương tác có thể giúp tài khoản mạng xã hội trông chuyên nghiệp và đáng tin cậy hơn.',
            ],
            [
                'subject' => 'Hỗ trợ dịch vụ Facebook đa dạng',
                'title' => 'Nhiều lựa chọn cho Facebook',
                'content' => 'Sola Vietnam cung cấp nhiều dịch vụ liên quan đến Facebook như tăng follow, tăng like, tăng tương tác và hỗ trợ xử lý tài khoản.',
            ],
            [
                'subject' => 'Dịch vụ Instagram cho người bán hàng',
                'title' => 'Hỗ trợ phát triển Instagram',
                'content' => 'Nếu bạn bán hàng hoặc xây dựng thương hiệu cá nhân trên Instagram, Sola Vietnam có các dịch vụ hỗ trợ tăng trưởng tài khoản.',
            ],
            [
                'subject' => 'Tăng tương tác cho bài đăng mới',
                'title' => 'Hỗ trợ nội dung mới đăng',
                'content' => 'Khi có bài đăng mới, bạn có thể sử dụng dịch vụ tăng like, tăng view hoặc tăng tương tác để nội dung có tín hiệu tốt hơn.',
            ],
            [
                'subject' => 'Dịch vụ TikTok cho nhà sáng tạo nội dung',
                'title' => 'Hỗ trợ phát triển TikTok',
                'content' => 'Sola Vietnam hỗ trợ tăng follow, tăng view và tương tác TikTok cho người làm nội dung, bán hàng hoặc xây dựng thương hiệu.',
            ],
            [
                'subject' => 'Xử lý nhu cầu tăng follow nhanh hơn',
                'title' => 'Một nơi cho nhiều dịch vụ',
                'content' => 'Thay vì tìm nhiều nơi khác nhau, người dùng có thể sử dụng Sola Vietnam để đặt nhiều dịch vụ social media trong cùng một hệ thống.',
            ],
            [
                'subject' => 'Hỗ trợ tài khoản bị khóa',
                'title' => 'Dịch vụ hỗ trợ tài khoản',
                'content' => 'Sola Vietnam có các dịch vụ hỗ trợ xử lý tài khoản mạng xã hội khi gặp vấn đề như bị khóa, hạn chế hoặc cần kiểm tra tình trạng.',
            ],
            [
                'subject' => 'Tăng follow cho thương hiệu cá nhân',
                'title' => 'Xây dựng hình ảnh online',
                'content' => 'Nếu bạn đang xây dựng thương hiệu cá nhân, tăng follow và tương tác là một phần giúp tài khoản có hình ảnh chuyên nghiệp hơn.',
            ],
            [
                'subject' => 'Sola Vietnam hỗ trợ nhiều nền tảng',
                'title' => 'Facebook, Instagram, TikTok',
                'content' => 'Website tập trung vào các dịch vụ social media phổ biến như Facebook, Instagram, TikTok và các nhu cầu hỗ trợ tài khoản liên quan.',
            ],
            [
                'subject' => 'Trải nghiệm dịch vụ social tiện lợi',
                'title' => 'Bắt đầu với Sola Vietnam',
                'content' => 'Đăng nhập vào Sola Vietnam để xem danh sách dịch vụ, nạp ví, đặt đơn và theo dõi tiến trình xử lý ngay trên website.',
            ],
        ];

        $selected = $campaigns[array_rand($campaigns)];

        $users = User::query()
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->select('id', 'name', 'username', 'email')
            ->get();

        if ($users->isEmpty()) {
            $this->info('Không có user nào có email.');
            return Command::SUCCESS;
        }

        $successCount = 0;
        $failCount = 0;

        foreach ($users as $user) {
            try {
                Mail::send('emails.admin-broadcast', [
                    'user' => $user,
                    'mailTitle' => $selected['title'],
                    'mailContent' => $selected['content'],
                ], function ($message) use ($user, $selected) {
                    $message->to($user->email)
                        ->subject($selected['subject']);
                });

                $successCount++;
            } catch (\Exception $e) {
                $failCount++;

                Log::error('Gửi email hằng ngày thất bại', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        Log::info('Hoàn tất gửi email hằng ngày', [
            'subject' => $selected['subject'],
            'total_users' => $users->count(),
            'success_count' => $successCount,
            'fail_count' => $failCount,
        ]);

        $this->info("Đã gửi xong. Thành công: {$successCount}, lỗi: {$failCount}");

        return Command::SUCCESS;
    }
}