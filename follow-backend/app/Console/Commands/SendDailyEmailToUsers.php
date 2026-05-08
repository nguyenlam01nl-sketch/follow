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
        'subject' => '🔥 Giảm 10% tăng follow',
        'title' => '🎉 Khuyến mãi hôm nay',
        'content' => 'Giảm ngay 10% dịch vụ tăng follow hôm nay.',
    ],

    [
        'subject' => '⚡ Sale follow TikTok',
        'title' => '📈 TikTok giảm giá',
        'content' => 'Giảm giá nhiều gói follow TikTok.',
    ],

    [
        'subject' => '🎁 Tặng thêm follow',
        'title' => '🔥 Ưu đãi follow',
        'content' => 'Đặt follow hôm nay được cộng thêm số lượng.',
    ],

    [
        'subject' => '💥 Giảm giá tăng like',
        'title' => '👍 Sale tương tác',
        'content' => 'Nhiều gói tăng like đang giảm mạnh.',
    ],

    [
        'subject' => '🚀 Sale view TikTok',
        'title' => '🎬 Tăng view giá tốt',
        'content' => 'Giảm giá dịch vụ tăng view TikTok hôm nay.',
    ],

    [
        'subject' => '🔥 Giảm giá Instagram',
        'title' => '📸 Khuyến mãi IG',
        'content' => 'Sale follow và like Instagram hôm nay.',
    ],

    [
        'subject' => '⚡ Sale Facebook',
        'title' => '👍 Facebook ưu đãi',
        'content' => 'Nhiều dịch vụ Facebook đang giảm giá.',
    ],

    [
        'subject' => '🎉 Khuyến mãi social media',
        'title' => '🔥 Deal hôm nay',
        'content' => 'Nhiều dịch vụ social đang có ưu đãi.',
    ],

    [
        'subject' => '💎 Giảm 5% toàn bộ dịch vụ',
        'title' => '🔥 Ưu đãi toàn web',
        'content' => 'Giảm giá nhiều dịch vụ hôm nay.',
    ],

    [
        'subject' => '🚀 Follow giá rẻ hôm nay',
        'title' => '📈 Deal follow',
        'content' => 'Nhiều gói tăng follow đang giảm giá.',
    ],

    [
        'subject' => '🔥 Sale mắt livestream',
        'title' => '👀 Livestream ưu đãi',
        'content' => 'Giảm giá dịch vụ mắt livestream.',
    ],

    [
        'subject' => '🎁 Tặng thêm lượt xem',
        'title' => '🎬 View khuyến mãi',
        'content' => 'Đặt view hôm nay được cộng thêm lượt xem.',
    ],

    [
        'subject' => '⚡ TikTok đang giảm giá',
        'title' => '🎵 Deal TikTok',
        'content' => 'Nhiều gói TikTok giá tốt hôm nay.',
    ],

    [
        'subject' => '🔥 Instagram sale lớn',
        'title' => '📸 IG giảm giá',
        'content' => 'Follow Instagram đang có giá ưu đãi.',
    ],

    [
        'subject' => '💥 Facebook giảm mạnh',
        'title' => '👍 Sale Facebook',
        'content' => 'Nhiều dịch vụ Facebook đang giảm sâu.',
    ],

    [
        'subject' => '🎉 Tăng follow siêu rẻ',
        'title' => '📈 Ưu đãi follow',
        'content' => 'Giảm giá follow trên nhiều nền tảng.',
    ],

    [
        'subject' => '🚀 Deal TikTok hôm nay',
        'title' => '🎵 TikTok khuyến mãi',
        'content' => 'Nhiều gói TikTok đang có ưu đãi.',
    ],

    [
        'subject' => '🔥 Sale tăng tương tác',
        'title' => '❤️ Khuyến mãi tương tác',
        'content' => 'Like, follow, view đều đang giảm giá.',
    ],

    [
        'subject' => '⚡ Giảm giá view video',
        'title' => '🎬 View ưu đãi',
        'content' => 'Tăng view video với giá tốt hôm nay.',
    ],

    [
        'subject' => '🎁 Khuyến mãi follow IG',
        'title' => '📸 Instagram deal',
        'content' => 'Nhiều gói Instagram đang sale.',
    ],

    [
        'subject' => '💥 TikTok giá tốt',
        'title' => '🎵 TikTok social',
        'content' => 'Sale nhiều dịch vụ TikTok hôm nay.',
    ],

    [
        'subject' => '🔥 Follow Facebook giảm giá',
        'title' => '👍 Facebook follow',
        'content' => 'Giảm giá follow Facebook hôm nay.',
    ],

    [
        'subject' => '🚀 Deal social hôm nay',
        'title' => '🔥 Social media',
        'content' => 'Nhiều dịch vụ đang có giá ưu đãi.',
    ],

    [
        'subject' => '⚡ Sale follow cực mạnh',
        'title' => '📈 Follow khuyến mãi',
        'content' => 'Nhiều gói follow đang giảm sâu.',
    ],

    [
        'subject' => '🎉 Tăng view đang sale',
        'title' => '🎬 Deal lượt xem',
        'content' => 'Giảm giá dịch vụ tăng view hôm nay.',
    ],

    [
        'subject' => '🔥 Khuyến mãi Instagram',
        'title' => '📸 IG social',
        'content' => 'Nhiều gói Instagram đang ưu đãi.',
    ],

    [
        'subject' => '💎 Sale tăng like',
        'title' => '❤️ Like giá rẻ',
        'content' => 'Giảm giá nhiều gói tăng like.',
    ],

    [
        'subject' => '🚀 Follow TikTok ưu đãi',
        'title' => '🎵 TikTok follow',
        'content' => 'Follow TikTok đang có giá tốt.',
    ],

    [
        'subject' => '🔥 Deal Facebook hôm nay',
        'title' => '👍 Facebook social',
        'content' => 'Sale nhiều dịch vụ Facebook.',
    ],

    [
        'subject' => '⚡ View TikTok giảm mạnh',
        'title' => '🎬 TikTok view',
        'content' => 'Nhiều gói tăng view đang sale.',
    ],

    [
        'subject' => '🎁 Khuyến mãi toàn hệ thống',
        'title' => '🔥 Deal social',
        'content' => 'Nhiều dịch vụ social đang ưu đãi.',
    ],

    [
        'subject' => '💥 Giảm giá follow Instagram',
        'title' => '📸 IG ưu đãi',
        'content' => 'Instagram hôm nay đang giảm giá.',
    ],

    [
        'subject' => '🚀 Sale follow Facebook',
        'title' => '👍 Facebook deal',
        'content' => 'Nhiều gói Facebook giá tốt hôm nay.',
    ],

    [
        'subject' => '🔥 Ưu đãi tăng mắt live',
        'title' => '👀 Livestream deal',
        'content' => 'Mắt livestream đang giảm giá mạnh.',
    ],

    [
        'subject' => '⚡ TikTok sale hôm nay',
        'title' => '🎵 TikTok ưu đãi',
        'content' => 'Nhiều dịch vụ TikTok đang khuyến mãi.',
    ],

    [
        'subject' => '🎉 Tăng tương tác giá tốt',
        'title' => '❤️ Social ưu đãi',
        'content' => 'Nhiều gói tăng tương tác đang sale.',
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