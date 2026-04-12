<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiAnalysis;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AiAnalyzeController extends Controller
{
    public function analyze(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'url' => ['required', 'string', 'max:500'],
        ], [
            'url.required' => 'Vui lòng nhập link cần phân tích.',
            'url.string' => 'Link không hợp lệ.',
            'url.max' => 'Link quá dài.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $url = trim((string) $request->url);
        $platform = $this->detectPlatform($url);

        if ($platform === 'unknown') {
            return response()->json([
                'message' => 'Chỉ hỗ trợ link YouTube, Instagram hoặc TikTok.',
            ], 422);
        }

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Chưa đăng nhập hoặc token không hợp lệ.',
            ], 401);
        }

        $analyzePrice = 10000;

        if ((float) $user->balance < (float) $analyzePrice) {
            return response()->json([
                'message' => 'Số dư không đủ để thực hiện phân tích chuyên sâu.',
            ], 422);
        }

        $publicData = $this->fetchPublicProfileData($url, $platform);

        if (($publicData['status'] ?? null) === 'not_found') {
            return response()->json([
                'message' => 'Không tìm thấy kênh hoặc nội dung từ link này.',
            ], 404);
        }

        if (($publicData['status'] ?? null) === 'unreadable') {
            return response()->json([
                'message' => 'Không thể đọc dữ liệu công khai từ link này lúc này.',
            ], 422);
        }

        $rawData = $publicData['data'] ?? [];

        if (empty($rawData)) {
            return response()->json([
                'message' => 'Không thể đọc dữ liệu công khai từ link này lúc này.',
            ], 422);
        }

        $analysisResult = $this->analyzeWithOpenAI($url, $platform, $rawData);

        try {
            $saved = DB::transaction(function () use ($request, $user, $url, $platform, $rawData, $analysisResult, $analyzePrice) {
                $freshUser = $user->fresh();

                if (!$freshUser) {
                    throw new \Exception('Không tìm thấy người dùng.');
                }

                if ((float) $freshUser->balance < (float) $analyzePrice) {
                    throw new \Exception('Số dư không đủ để thực hiện phân tích chuyên sâu.');
                }

                $freshUser->balance = (float) $freshUser->balance - (float) $analyzePrice;
                $freshUser->save();

                WalletTransaction::create([
                    'user_id' => $freshUser->id,
                    'title' => 'Thanh toán phân tích chuyên sâu kênh',
                    'amount' => $analyzePrice,
                    'type' => 'payment',
                    'status' => 'completed',
                    'payment_method' => 'wallet',
                    'note' => 'Phân tích link: ' . $url,
                ]);

                return AiAnalysis::create([
                    'user_id' => $request->user()->id,
                    'url' => $url,
                    'platform' => $platform,
                    'account_name' => $analysisResult['account_name']
                        ?? data_get($rawData, 'profile.name')
                        ?? 'Kênh đã phân tích',
                    'health_score' => $analysisResult['health_score'] ?? 0,
                    'raw_data' => $rawData,
                    'result' => $analysisResult,
                ]);
            });
        } catch (\Throwable $e) {
            Log::error('AI_ANALYZE_SAVE_FAILED', [
                'message' => $e->getMessage(),
                'url' => $url,
                'user_id' => $user->id ?? null,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => $e->getMessage() ?: 'Không thể hoàn tất phân tích lúc này.',
            ], 500);
        }

        return response()->json([
            'message' => 'Phân tích thành công',
            'data' => [
                'id' => $saved->id,
                'platform' => $platform,
                'account_name' => $analysisResult['account_name']
                    ?? data_get($rawData, 'profile.name')
                    ?? 'Kênh đã phân tích',
                'account_url' => $url,
                'health_score' => (int) ($analysisResult['health_score'] ?? 0),

                'summary' => $analysisResult['summary']
                    ?? 'Đã phân tích kênh thành công.',
                'mentor_note' => $analysisResult['mentor_note'] ?? '',
                'account_summary' => $analysisResult['account_summary'] ?? '',

                'issues' => $analysisResult['issues'] ?? [],
                'opportunities' => $analysisResult['opportunities'] ?? [],
                'plan_7_days' => $analysisResult['plan_7_days'] ?? [],
                'service_suggestions' => $analysisResult['service_suggestions'] ?? [],
                'channel_diagnosis' => $analysisResult['channel_diagnosis'] ?? [],
                'final_strategy' => $analysisResult['final_strategy'] ?? [],

                'channel_positioning' => $analysisResult['channel_positioning'] ?? [
                    'main_theme' => '',
                    'target_audience' => '',
                    'strongest_signal' => '',
                    'weakest_signal' => '',
                ],

                'content_pillars' => $analysisResult['content_pillars'] ?? [],
                'posting_strategy' => $analysisResult['posting_strategy'] ?? [
                    'videos_per_week' => '',
                    'best_time_slots' => [],
                    'formats_to_test' => [],
                ],
                'growth_actions' => $analysisResult['growth_actions'] ?? [],
                'hashtag_strategy' => $analysisResult['hashtag_strategy'] ?? [
                    'core_hashtags' => [],
                    'niche_hashtags' => [],
                    'branded_hashtags' => [],
                ],
                'audio_strategy' => $analysisResult['audio_strategy'] ?? [
                    'should_use_trending_audio' => '',
                    'recommended_audio_styles' => [],
                    'notes' => '',
                ],

                'profile' => data_get($rawData, 'profile', []),
                'posts' => data_get($rawData, 'posts', []),
                'post_recommendations' => $analysisResult['post_recommendations'] ?? [],
            ],
            'charged_amount' => $analyzePrice,
            'balance' => (float) $request->user()->fresh()->balance,
        ]);
    }

    private function detectPlatform(string $url): string
    {
        $lower = strtolower($url);

        if (str_contains($lower, 'youtube.com') || str_contains($lower, 'youtu.be')) {
            return 'youtube';
        }

        if (str_contains($lower, 'instagram.com')) {
            return 'instagram';
        }

        if (str_contains($lower, 'tiktok.com')) {
            return 'tiktok';
        }

        return 'unknown';
    }

    private function fetchPublicProfileData(string $url, string $platform): array
    {
        $username = $this->extractUsernameFromUrl($url, $platform);

        if (!$username) {
            return [
                'status' => 'not_found',
            ];
        }

        if ($platform === 'tiktok') {
            return $this->fetchTikTokFromScraper($url, $username);
        }

        if ($platform === 'instagram') {
            return [
                'status' => 'unreadable',
            ];
        }

        if ($platform === 'youtube') {
            return [
                'status' => 'unreadable',
            ];
        }

        return [
            'status' => 'unreadable',
        ];
    }

    private function analyzeWithOpenAI(string $url, string $platform, array $rawData): array
    {
        $apiKey = config('services.openai.key');

        if (!$apiKey) {
            return $this->fallbackAiResponse(
                $platform,
                $rawData,
                'Hệ thống chưa cấu hình OpenAI API key.'
            );
        }

        $prompt = $this->buildPrompt($platform, $rawData);

        try {
            $response = Http::withToken($apiKey)
                ->timeout(90)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o-mini',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'Bạn là AI mentor tăng trưởng mạng xã hội. Chỉ trả về JSON hợp lệ. Không markdown. Không giải thích thêm ngoài JSON.',
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'temperature' => 0.6,
                ]);

            if (!$response->successful()) {
                return $this->fallbackAiResponse(
                    $platform,
                    $rawData,
                    'Không gọi được OpenAI.'
                );
            }

            $content = $response->json('choices.0.message.content');

            if (!$content) {
                return $this->fallbackAiResponse(
                    $platform,
                    $rawData,
                    'AI không trả về nội dung hợp lệ.'
                );
            }

            $decoded = json_decode($content, true);

            if (!is_array($decoded)) {
                return $this->fallbackAiResponse(
                    $platform,
                    $rawData,
                    'AI trả về sai định dạng JSON.'
                );
            }

            $decoded['profile'] = data_get($rawData, 'profile', []);
            $decoded['posts'] = data_get($rawData, 'posts', []);
            $decoded['account_name'] = $decoded['account_name']
                ?? data_get($rawData, 'profile.name')
                ?? 'Kênh đã phân tích';

            $decoded['summary'] = $decoded['summary'] ?? 'Đã hoàn tất phân tích kênh.';
            $decoded['mentor_note'] = $decoded['mentor_note'] ?? '';
            $decoded['account_summary'] = $decoded['account_summary'] ?? '';

            $decoded['issues'] = is_array($decoded['issues'] ?? null) ? $decoded['issues'] : [];
            $decoded['opportunities'] = is_array($decoded['opportunities'] ?? null) ? $decoded['opportunities'] : [];
            $decoded['plan_7_days'] = is_array($decoded['plan_7_days'] ?? null) ? $decoded['plan_7_days'] : [];
            $decoded['service_suggestions'] = is_array($decoded['service_suggestions'] ?? null) ? $decoded['service_suggestions'] : [];
            $decoded['channel_diagnosis'] = is_array($decoded['channel_diagnosis'] ?? null) ? $decoded['channel_diagnosis'] : [];
            $decoded['final_strategy'] = is_array($decoded['final_strategy'] ?? null) ? $decoded['final_strategy'] : [];
            $decoded['content_pillars'] = is_array($decoded['content_pillars'] ?? null) ? $decoded['content_pillars'] : [];
            $decoded['growth_actions'] = is_array($decoded['growth_actions'] ?? null) ? $decoded['growth_actions'] : [];
            $decoded['post_recommendations'] = is_array($decoded['post_recommendations'] ?? null) ? $decoded['post_recommendations'] : [];

            $decoded['channel_positioning'] = is_array($decoded['channel_positioning'] ?? null)
                ? $decoded['channel_positioning']
                : [
                    'main_theme' => '',
                    'target_audience' => '',
                    'strongest_signal' => '',
                    'weakest_signal' => '',
                ];

            $decoded['posting_strategy'] = is_array($decoded['posting_strategy'] ?? null)
                ? $decoded['posting_strategy']
                : [
                    'videos_per_week' => '',
                    'best_time_slots' => [],
                    'formats_to_test' => [],
                ];

            $decoded['hashtag_strategy'] = is_array($decoded['hashtag_strategy'] ?? null)
                ? $decoded['hashtag_strategy']
                : [
                    'core_hashtags' => [],
                    'niche_hashtags' => [],
                    'branded_hashtags' => [],
                ];

            $decoded['audio_strategy'] = is_array($decoded['audio_strategy'] ?? null)
                ? $decoded['audio_strategy']
                : [
                    'should_use_trending_audio' => '',
                    'recommended_audio_styles' => [],
                    'notes' => '',
                ];

            return $decoded;
        } catch (\Throwable $e) {
            return $this->fallbackAiResponse(
                $platform,
                $rawData,
                'Có lỗi khi xử lý AI.'
            );
        }
    }

    private function buildPrompt(string $platform, array $rawData): string
    {
        $profile = data_get($rawData, 'profile', []);
        $posts = collect(data_get($rawData, 'posts', []))
            ->take(6)
            ->map(function ($post) {
                return [
                    'title' => mb_substr((string) ($post['title'] ?? ''), 0, 100),
                    'views' => (int) ($post['views'] ?? 0),
                    'likes' => (int) ($post['likes'] ?? 0),
                    'comments' => (int) ($post['comments'] ?? 0),
                    'is_pinned' => (bool) ($post['is_pinned'] ?? false),
                ];
            })
            ->values()
            ->all();

        $input = [
            'platform' => $platform,
            'profile' => [
                'name' => $profile['name'] ?? null,
                'username' => $profile['username'] ?? null,
                'followers' => $profile['followers'] ?? null,
                'following' => $profile['following'] ?? null,
                'likes' => $profile['likes'] ?? null,
                'posts_count' => $profile['posts_count'] ?? null,
                'bio' => $profile['bio'] ?? null,
            ],
            'posts' => $posts,
        ];

        return "
Phân tích kênh social media bằng tiếng Việt theo vai trò AI mentor tăng trưởng.

Dữ liệu đầu vào:
" . json_encode($input, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "

Yêu cầu:
- Chỉ trả về JSON object hợp lệ
- Không markdown
- Không giải thích ngoài JSON
- Không tự tạo lại profile
- Không tự tạo lại posts
- Không sửa title bài viết
- Không sửa views bài viết
- Chỉ phân tích dựa trên dữ liệu có sẵn
- Giọng văn phải giống một mentor sản phẩm đang tư vấn sâu, rõ, thực tế, có định hướng hành động

Các key bắt buộc:

account_name
health_score
summary
mentor_note
account_summary

channel_positioning {
  main_theme
  target_audience
  strongest_signal
  weakest_signal
}

content_pillars [
  { pillar, description, priority }
]

posting_strategy {
  videos_per_week
  best_time_slots
  formats_to_test
}

growth_actions [
  { title, current_views, suggested_target_range, reason }
]

hashtag_strategy {
  core_hashtags
  niche_hashtags
  branded_hashtags
}

audio_strategy {
  should_use_trending_audio
  recommended_audio_styles
  notes
}

issues
opportunities
plan_7_days
service_suggestions
channel_diagnosis
final_strategy

post_recommendations [
  {
    title,
    views,
    action,
    reason
  }
]

Quy tắc:
- health_score là số nguyên từ 0 đến 100
- issues: đúng 3 ý
- opportunities: đúng 3 ý
- plan_7_days: đúng 7 ý
- service_suggestions: đúng 3 ý
- channel_diagnosis: đúng 3 ý
- final_strategy: đúng 4 ý
- content_pillars: 3 đến 5 phần tử
- best_time_slots: 3 khung giờ cụ thể
- growth_actions: 3 đến 5 phần tử, nên có suggested_target_range dạng ví dụ '500-800 views'
- hashtag_strategy: mỗi nhóm 4 đến 6 hashtag
- recommended_audio_styles: 3 đến 5 ý
- post_recommendations: tối đa 6 phần tử, action chỉ được là:
  increase_like
  increase_view
  increase_comment
  keep_natural

Mục tiêu phân tích:
- Chỉ ra kênh đang thiên về chủ đề gì
- Chỉ ra người xem phù hợp nhất
- Chỉ ra đang yếu ở đâu
- Gợi ý nên đăng mấy video/tuần
- Gợi ý khung giờ nên test
- Gợi ý format video nên làm
- Gợi ý hashtag đúng với chủ đề kênh
- Gợi ý kiểu nhạc hoặc audio nên dùng
- Gợi ý mức tăng hợp lý cho từng bài thay vì nói chung chung
- Phải tạo cảm giác đây là một AI mentor thật sự
";
    }

    private function fallbackAiResponse(string $platform, array $rawData, string $summary): array
    {
        $profile = data_get($rawData, 'profile', []);
        $posts = data_get($rawData, 'posts', []);

        $coreHashtags = $platform === 'tiktok'
            ? ['#xaykenhtiktok', '#marketingtiktok', '#dichvumangxahoi', '#tangtruongkenh']
            : ['#socialmedia', '#marketing', '#digitalcontent', '#growth'];

        $nicheHashtags = ['#socialproof', '#xaydungthuonghieu', '#kinhdoanhonline', '#videomarketing'];
        $brandedHashtags = ['#solavietnam', '#solatiktok', '#solagrowth', '#solamedia'];

        $postRecommendations = collect($posts)
            ->take(6)
            ->map(function ($post) {
                $views = (int) ($post['views'] ?? 0);
                $action = 'keep_natural';
                $reason = 'Giữ tự nhiên để tiếp tục theo dõi tín hiệu thật của bài viết.';

                if ($views > 0 && $views <= 120) {
                    $action = 'increase_view';
                    $reason = 'Bài có tín hiệu ban đầu nhưng còn quá thấp. Có thể test tăng view nhẹ để kiểm tra khả năng giữ người xem.';
                } elseif ($views > 120 && $views <= 250) {
                    $action = 'increase_like';
                    $reason = 'Bài có mức xem tương đối ổn so với tổng mặt bằng kênh, nên ưu tiên tăng like để tăng social proof.';
                }

                if (str_contains(mb_strtolower((string) ($post['title'] ?? '')), '❤️')) {
                    $action = 'increase_comment';
                    $reason = 'Bài mang sắc thái cảm xúc hoặc branding, nên khuyến khích comment để tạo cảm giác cộng đồng.';
                }

                return [
                    'title' => $post['title'] ?? 'Nội dung gần đây',
                    'views' => $views,
                    'action' => $action,
                    'reason' => $reason,
                ];
            })
            ->values()
            ->all();

        $growthActions = collect($posts)
            ->take(4)
            ->map(function ($post) {
                $views = (int) ($post['views'] ?? 0);

                $target = '300-500 views';
                if ($views <= 100) {
                    $target = '500-800 views';
                } elseif ($views <= 150) {
                    $target = '800-1200 views';
                } elseif ($views <= 300) {
                    $target = '1200-2000 views';
                }

                return [
                    'title' => $post['title'] ?? 'Nội dung gần đây',
                    'current_views' => $views,
                    'suggested_target_range' => $target,
                    'reason' => 'Nên tăng theo mức vừa phải để giữ cảm giác tự nhiên và kiểm tra độ hấp dẫn thật của nội dung.',
                ];
            })
            ->values()
            ->all();

        return [
            'account_name' => $profile['name'] ?? 'Kênh đã phân tích',
            'health_score' => 55,
            'summary' => $summary,
            'mentor_note' => 'Kênh của bạn chưa thiếu ý tưởng, nhưng đang thiếu cấu trúc nội dung và tín hiệu tăng trưởng ban đầu. Việc cần làm không phải đăng nhiều hơn ngay, mà là gom lại những chủ đề dễ hiểu, dễ nhận diện và tăng lực cho một vài video đại diện.',
            'account_summary' => 'Đây là bản phân tích dự phòng dựa trên dữ liệu công khai và cấu trúc hiện tại của kênh.',

            'channel_positioning' => [
                'main_theme' => 'Kênh đang thiên về giới thiệu dịch vụ social media, xây kênh và hình ảnh công nghệ.',
                'target_audience' => 'Người kinh doanh online, người mới xây kênh TikTok và nhóm cần dịch vụ social proof.',
                'strongest_signal' => 'Nội dung có định hướng rõ về ngành social media và thương hiệu riêng.',
                'weakest_signal' => 'Chưa đủ tín hiệu tương tác ban đầu để tạo đà tăng trưởng tự nhiên.',
            ],

            'content_pillars' => [
                [
                    'pillar' => 'Case thực tế xây kênh',
                    'description' => 'Chia sẻ trước-sau, lỗi thường gặp, cách xử lý từng vấn đề.',
                    'priority' => 'Cao',
                ],
                [
                    'pillar' => 'Giới thiệu dịch vụ theo tình huống',
                    'description' => 'Mỗi video chỉ nên giải quyết một nhu cầu cụ thể của khách hàng.',
                    'priority' => 'Cao',
                ],
                [
                    'pillar' => 'Build in public',
                    'description' => 'Quay quá trình làm web, hệ thống, dashboard, công nghệ để tăng độ tin cậy.',
                    'priority' => 'Vừa',
                ],
            ],

            'posting_strategy' => [
                'videos_per_week' => '4-6 video/tuần',
                'best_time_slots' => ['11:30-13:00', '19:00-21:00', '22:00-23:30'],
                'formats_to_test' => [
                    'Quay màn hình + voice-over',
                    'Talking head ngắn 20-35 giây',
                    'Before-after hoặc case study',
                    'Video hook bằng lỗi phổ biến',
                ],
            ],

            'growth_actions' => $growthActions,

            'hashtag_strategy' => [
                'core_hashtags' => $coreHashtags,
                'niche_hashtags' => $nicheHashtags,
                'branded_hashtags' => $brandedHashtags,
            ],

            'audio_strategy' => [
                'should_use_trending_audio' => 'Có, nhưng chỉ dùng chọn lọc khi không làm loãng thông điệp bán hàng.',
                'recommended_audio_styles' => [
                    'Voice-over rõ + nhạc nền nhỏ',
                    'Nhạc điện tử nhẹ mang cảm giác công nghệ',
                    'Audio trend remix vừa phải cho video hút reach',
                ],
                'notes' => 'Video giới thiệu dịch vụ nên ưu tiên giọng nói rõ, còn video build in public có thể dùng nhạc trend nhẹ để tăng cảm giác hiện đại.',
            ],

            'issues' => [
                'Kênh chưa có cấu trúc nội dung đủ rõ để người xem hiểu ngay giá trị cốt lõi.',
                'Tương tác hiện tại còn thấp, chưa tạo được social proof ban đầu.',
                'Thiếu chiến lược đăng đều và thiếu tối ưu hook cho 1-3 giây đầu.',
            ],

            'opportunities' => [
                'Ngách social media service vẫn có nhu cầu cao nếu nội dung đủ rõ và cụ thể.',
                'Video dạng case study và build in public rất hợp để tạo niềm tin.',
                'Chỉ cần một vài video được đẩy đúng cách là có thể cải thiện nhận diện nhanh.',
            ],

            'plan_7_days' => [
                'Ngày 1: xác định lại 3 trụ cột nội dung chính cho kênh.',
                'Ngày 2: lên 10 hook ngắn đánh vào nỗi đau xây kênh và thiếu tương tác.',
                'Ngày 3: quay 2 video dạng case study hoặc before-after.',
                'Ngày 4: quay 1 video giới thiệu dịch vụ theo tình huống thực tế.',
                'Ngày 5: đăng 1 video vào khung 19:00-21:00 và theo dõi tín hiệu 2 giờ đầu.',
                'Ngày 6: test 1 video build in public với nhạc công nghệ nhẹ.',
                'Ngày 7: xem bài nào giữ tín hiệu tốt nhất rồi tăng lực cho đúng bài đó.',
            ],

            'service_suggestions' => [
                'Tư vấn chiến lược nội dung TikTok theo từng trụ cột.',
                'Tăng view có kiểm soát cho video đại diện để test khả năng bật lên.',
                'Tăng tương tác nhẹ cho video branding hoặc video có tiềm năng chuyển đổi.',
            ],

            'channel_diagnosis' => [
                'Điểm nghẽn lớn nhất hiện tại là thiếu tín hiệu tăng trưởng ban đầu.',
                'Kênh có hướng đi rõ nhưng chưa đóng gói nội dung đủ sắc nét.',
                'Nếu gom đúng format và đúng khung giờ, kênh có thể cải thiện nhanh hơn hiện tại.',
            ],

            'post_recommendations' => $postRecommendations,

            'final_strategy' => [
                'Tập trung xây 1-2 format mạnh thay vì làm nhiều kiểu rời rạc.',
                'Dùng social proof vừa phải để đẩy bài đại diện thay vì dàn trải.',
                'Ưu tiên video giải quyết vấn đề thật của khách hàng hơn là giới thiệu chung chung.',
                'Đo hiệu suất theo từng khung giờ và từng format trong 2 tuần đầu.',
            ],
        ];
    }

    private function extractUsernameFromUrl(string $url, string $platform): ?string
    {
        $path = parse_url($url, PHP_URL_PATH);

        if (!$path) {
            return null;
        }

        $path = trim($path, '/');

        if ($platform === 'tiktok') {
            if (str_starts_with($path, '@')) {
                return ltrim(explode('/', $path)[0], '@');
            }
        }

        if ($platform === 'instagram') {
            $first = explode('/', $path)[0] ?? null;
            return $first ?: null;
        }

        if ($platform === 'youtube') {
            $parts = explode('/', $path);

            if (($parts[0] ?? null) === '@' && isset($parts[1])) {
                return $parts[1];
            }

            if (str_starts_with($parts[0] ?? '', '@')) {
                return ltrim($parts[0], '@');
            }

            if (($parts[0] ?? null) === 'channel' && isset($parts[1])) {
                return $parts[1];
            }

            if (($parts[0] ?? null) === 'c' && isset($parts[1])) {
                return $parts[1];
            }

            if (($parts[0] ?? null) === 'user' && isset($parts[1])) {
                return $parts[1];
            }
        }

        return null;
    }

    private function beautifyNameFromUsername(string $username): string
    {
        $name = str_replace(['.', '_', '-'], ' ', $username);
        return mb_convert_case($name, MB_CASE_TITLE, 'UTF-8');
    }

    private function fetchTikTokFromScraper(string $url, string $username): array
    {
        $baseUrl = rtrim((string) config('services.scraper.base_url'), '/');
        $token = (string) config('services.scraper.token');

        Log::info('SCRAPER CONFIG', [
            'base_url' => $baseUrl,
            'has_token' => !empty($token),
            'url' => $url,
        ]);

        if (!$baseUrl || !$token) {
            Log::warning('SCRAPER MISSING CONFIG');
            return [
                'status' => 'unreadable',
            ];
        }

        try {
            $response = Http::withToken($token)
                ->timeout(90)
                ->post($baseUrl . '/scrape/tiktok', [
                    'url' => $url,
                ]);

            Log::info('SCRAPER HTTP RESPONSE', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            if (!$response->successful()) {
                return [
                    'status' => 'unreadable',
                ];
            }

            $data = $response->json();

            if (!is_array($data)) {
                Log::warning('SCRAPER INVALID JSON', [
                    'data' => $data,
                ]);

                return [
                    'status' => 'unreadable',
                ];
            }

            $profile = data_get($data, 'profile', []);
            $posts = data_get($data, 'posts', []);

            if (empty($profile) && empty($posts)) {
                Log::warning('SCRAPER EMPTY DATA');
                return [
                    'status' => 'not_found',
                ];
            }

            return [
                'status' => 'ok',
                'data' => [
                    'platform' => 'tiktok',
                    'profile' => [
                        'name' => data_get($profile, 'name') ?: $this->beautifyNameFromUsername($username),
                        'username' => data_get($profile, 'username') ?: $username,
                        'avatar' => data_get($profile, 'avatar', ''),
                        'bio' => data_get($profile, 'bio', ''),
                        'followers' => (int) data_get($profile, 'followers', 0),
                        'following' => (int) data_get($profile, 'following', 0),
                        'likes' => (int) data_get($profile, 'likes', 0),
                        'posts_count' => (int) data_get($profile, 'posts_count', count($posts)),
                    ],
                    'posts' => collect($posts)
                        ->map(function ($post, $index) {
                            return [
                                'id' => data_get($post, 'id', 'tt_' . ($index + 1)),
                                'title' => data_get($post, 'title', 'TikTok post ' . ($index + 1)),
                                'thumbnail' => data_get($post, 'thumbnail', ''),
                                'views' => (int) data_get($post, 'views', 0),
                                'likes' => (int) data_get($post, 'likes', 0),
                                'comments' => (int) data_get($post, 'comments', 0),
                                'is_pinned' => (bool) data_get($post, 'is_pinned', false),
                                'url' => data_get($post, 'url', ''),
                            ];
                        })
                        ->filter(function ($post) {
                            return !empty($post['url']) || !empty($post['thumbnail']);
                        })
                        ->take(12)
                        ->values()
                        ->all(),
                ],
            ];
        } catch (\Throwable $e) {
            Log::error('SCRAPER EXCEPTION', [
                'message' => $e->getMessage(),
            ]);

            return [
                'status' => 'unreadable',
            ];
        }
    }
}