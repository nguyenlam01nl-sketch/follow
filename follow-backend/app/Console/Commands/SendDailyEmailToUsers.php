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
        'subject' => '🎉 Giảm ngay 5% hôm nay tại Sola Vietnam',
        'title' => '🔥 Ưu đãi social media',
        'content' => 'Giảm ngay 5% cho nhiều dịch vụ tăng follow và tăng tương tác hôm nay tại Sola Vietnam.',
    ],

    [
        'subject' => '🚀 Tặng thêm lượt follow khi đặt dịch vụ',
        'title' => '🎁 Bonus follow miễn phí',
        'content' => 'Một số dịch vụ hôm nay được tặng thêm follow miễn phí khi đặt đơn trên website.',
    ],

    [
        'subject' => '🔥 Flash sale dịch vụ TikTok',
        'title' => '📈 Ưu đãi tăng TikTok',
        'content' => 'Nhiều dịch vụ tăng follow TikTok đang giảm giá trong hôm nay.',
    ],

    [
        'subject' => '💎 Ưu đãi tăng tương tác Facebook',
        'title' => '👍 Tăng like tiện lợi',
        'content' => 'Giảm giá nhiều dịch vụ tăng like và tăng follow Facebook hôm nay.',
    ],

    [
        'subject' => '🎯 Tăng view TikTok giá tốt',
        'title' => '📊 Hỗ trợ tăng view',
        'content' => 'Các gói tăng view TikTok đang có giá ưu đãi trong thời gian ngắn.',
    ],

    [
        'subject' => '⚡ Giảm 10% dịch vụ Instagram',
        'title' => '📸 Ưu đãi Instagram',
        'content' => 'Nhiều dịch vụ Instagram hôm nay được giảm trực tiếp 10% trên hệ thống.',
    ],

    [
        'subject' => '🎁 Tặng thêm lượt xem video',
        'title' => '🎬 Bonus view',
        'content' => 'Đặt dịch vụ tăng view hôm nay có cơ hội được cộng thêm lượt xem miễn phí.',
    ],

    [
        'subject' => '🚀 Dịch vụ social media giá tốt',
        'title' => '🔥 Ưu đãi hôm nay',
        'content' => 'Nhiều dịch vụ social media đang có mức giá ưu đãi trên Sola Vietnam.',
    ],

    [
        'subject' => '💥 Deal hot tăng follow TikTok',
        'title' => '📈 Follow TikTok',
        'content' => 'Theo dõi các ưu đãi tăng follow TikTok mới nhất trên website.',
    ],

    [
        'subject' => '🎉 Giảm giá dịch vụ Facebook',
        'title' => '👍 Facebook social',
        'content' => 'Các gói tăng like và follow Facebook hôm nay đang có ưu đãi hấp dẫn.',
    ],

    [
        'subject' => '🔥 Tặng bonus khi nạp ví',
        'title' => '💰 Ưu đãi nạp ví',
        'content' => 'Một số mốc nạp ví hôm nay sẽ được cộng thêm số dư khuyến mãi.',
    ],

    [
        'subject' => '📢 Hỗ trợ tăng mắt livestream',
        'title' => '👀 Livestream social',
        'content' => 'Nhiều gói tăng mắt livestream đang được giảm giá hôm nay.',
    ],

    [
        'subject' => '🚀 Follow Instagram giá ưu đãi',
        'title' => '📸 Tăng follow IG',
        'content' => 'Các dịch vụ Instagram hiện đang có ưu đãi hấp dẫn trong hôm nay.',
    ],

    [
        'subject' => '🎁 Tặng thêm tương tác bài viết',
        'title' => '❤️ Bonus tương tác',
        'content' => 'Một số dịch vụ hôm nay được cộng thêm lượt tương tác miễn phí.',
    ],

    [
        'subject' => '💎 Deal social media hôm nay',
        'title' => '🔥 Flash sale social',
        'content' => 'Nhiều dịch vụ social media đang được cập nhật giá tốt hơn.',
    ],

    [
        'subject' => '⚡ Ưu đãi tăng like Facebook',
        'title' => '👍 Like Facebook',
        'content' => 'Giảm giá một số gói tăng like Facebook hôm nay.',
    ],

    [
        'subject' => '🎯 Khuyến mãi follow TikTok',
        'title' => '📈 TikTok deal',
        'content' => 'Theo dõi website để cập nhật các ưu đãi follow TikTok mới.',
    ],

    [
        'subject' => '🔥 Deal tăng view Reels',
        'title' => '🎬 Instagram Reels',
        'content' => 'Dịch vụ tăng view Reels đang có mức giá ưu đãi trong hôm nay.',
    ],

    [
        'subject' => '🚀 Hỗ trợ social media 24/7',
        'title' => '🌐 Sola Vietnam',
        'content' => 'Website hỗ trợ nhiều dịch vụ social media hoạt động liên tục mỗi ngày.',
    ],

    [
        'subject' => '🎁 Bonus follow miễn phí',
        'title' => '📈 Ưu đãi follow',
        'content' => 'Một số đơn hàng hôm nay sẽ được cộng thêm follow miễn phí.',
    ],

    [
        'subject' => '💥 Giảm giá dịch vụ TikTok',
        'title' => '🎵 TikTok social',
        'content' => 'Nhiều gói TikTok hiện đang được giảm giá trực tiếp.',
    ],

    [
        'subject' => '📢 Khuyến mãi social media',
        'title' => '🔥 Deal mới',
        'content' => 'Theo dõi Sola Vietnam để cập nhật thêm nhiều ưu đãi mới mỗi ngày.',
    ],

    [
        'subject' => '⚡ Ưu đãi follow Instagram',
        'title' => '📸 Instagram deal',
        'content' => 'Các gói follow Instagram đang được điều chỉnh giá ưu đãi.',
    ],

    [
        'subject' => '🎉 Tăng tương tác bài viết',
        'title' => '❤️ Social interaction',
        'content' => 'Nhiều dịch vụ tăng tương tác bài viết đang có khuyến mãi.',
    ],

    [
        'subject' => '🚀 Deal social media hot',
        'title' => '🔥 Ưu đãi hôm nay',
        'content' => 'Nhiều dịch vụ tăng follow và tăng tương tác đang được giảm giá.',
    ],

    [
        'subject' => '💰 Ưu đãi nạp ví hôm nay',
        'title' => '🎁 Bonus số dư',
        'content' => 'Một số mốc nạp ví được tặng thêm số dư khuyến mãi.',
    ],

    [
        'subject' => '🎯 Dịch vụ tăng follow giá tốt',
        'title' => '📈 Follow social',
        'content' => 'Nhiều gói tăng follow hiện đang có giá tốt hơn hôm nay.',
    ],

    [
        'subject' => '🔥 Ưu đãi tăng mắt livestream',
        'title' => '👀 Livestream deal',
        'content' => 'Theo dõi website để cập nhật các ưu đãi livestream mới nhất.',
    ],

    [
        'subject' => '🚀 Tăng view video nhanh chóng',
        'title' => '🎬 Video social',
        'content' => 'Nhiều dịch vụ tăng view đang có ưu đãi giới hạn.',
    ],

    [
        'subject' => '🎁 Quà tặng social media',
        'title' => '💎 Bonus ưu đãi',
        'content' => 'Một số dịch vụ hôm nay được cộng thêm bonus miễn phí.',
    ],

    [
        'subject' => '📢 Hệ thống social media tiện lợi',
        'title' => '🌐 Sola Vietnam',
        'content' => 'Đặt dịch vụ social media nhanh chóng trực tiếp trên website.',
    ],

    [
        'subject' => '⚡ Giảm giá tăng follow Facebook',
        'title' => '👍 Facebook deal',
        'content' => 'Nhiều gói Facebook hôm nay đang được giảm giá trực tiếp.',
    ],

    [
        'subject' => '🎉 Flash sale TikTok',
        'title' => '🎵 TikTok ưu đãi',
        'content' => 'Các gói tăng follow và view TikTok đang có giá ưu đãi.',
    ],

    [
        'subject' => '💥 Bonus tương tác miễn phí',
        'title' => '❤️ Tăng interaction',
        'content' => 'Một số dịch vụ hôm nay được cộng thêm tương tác miễn phí.',
    ],

    [
        'subject' => '🚀 Ưu đãi social mỗi ngày',
        'title' => '🔥 Daily deal',
        'content' => 'Theo dõi Sola Vietnam để cập nhật ưu đãi social media hằng ngày.',
    ],

    [
        'subject' => '🎁 Deal follow Instagram',
        'title' => '📸 Instagram social',
        'content' => 'Nhiều dịch vụ Instagram đang có giá ưu đãi hấp dẫn.',
    ],

    [
        'subject' => '⚡ Ưu đãi tăng view TikTok',
        'title' => '🎬 TikTok view',
        'content' => 'Dịch vụ tăng view TikTok hôm nay đang được giảm giá.',
    ],

    [
        'subject' => '🔥 Hỗ trợ social media giá tốt',
        'title' => '🌐 Sola Vietnam',
        'content' => 'Khám phá nhiều dịch vụ social media với mức giá tiện lợi hơn hôm nay.',
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