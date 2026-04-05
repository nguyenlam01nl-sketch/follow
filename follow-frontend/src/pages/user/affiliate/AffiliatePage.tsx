import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Copy, Share2, Users, Wallet, Link as LinkIcon, Gift } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";

type ReferralUser = {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
};

type CommissionItem = {
  id: number;
  type: "signup_bonus" | "first_deposit_bonus" | "deposit_commission";
  source_amount: number;
  commission_amount: number;
  commission_rate: number;
  note?: string;
  created_at: string;
  referred_user?: ReferralUser;
};

type ReferralResponse = {
  ref_code: string;
  ref_link: string;
  stats: {
    total_referrals: number;
    total_deposited_referrals: number;
    total_commission: number;
  };
  commissions: {
    data: CommissionItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

const formatMoney = (value: number) =>
  Number(value || 0).toLocaleString("vi-VN") + "đ";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("vi-VN");
};

const getTypeLabel = (type: CommissionItem["type"]) => {
  switch (type) {
    case "signup_bonus":
      return "Thưởng đăng ký";
    case "first_deposit_bonus":
      return "Thưởng nạp đầu";
    case "deposit_commission":
      return "Hoa hồng nạp tiền";
    default:
      return type;
  }
};

function AffiliatePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReferralResponse | null>(null);
  const [copying, setCopying] = useState(false);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/referral/me");
      setData(res.data);
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Không tải được dữ liệu",
        text:
          error?.response?.data?.message ||
          "Đã có lỗi xảy ra khi lấy dữ liệu affiliate",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const referralText = useMemo(() => {
    if (!data?.ref_link) return "";
    return `Đăng ký tại Sola Vietnam bằng link của mình nhé: ${data.ref_link}`;
  }, [data?.ref_link]);

  const handleCopy = async (text: string, successText: string) => {
    if (!text) return;
    try {
      setCopying(true);
      await navigator.clipboard.writeText(text);

      await Swal.fire({
        icon: "success",
        title: "Đã sao chép",
        text: successText,
        timer: 1400,
        showConfirmButton: false,
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Không thể sao chép",
        text: "Trình duyệt không hỗ trợ hoặc đã có lỗi xảy ra",
      });
    } finally {
      setCopying(false);
    }
  };

  const handleShare = async () => {
    if (!data?.ref_link) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Sola Vietnam",
          text: referralText,
          url: data.ref_link,
        });
        return;
      }

      await navigator.clipboard.writeText(data.ref_link);
      await Swal.fire({
        icon: "success",
        title: "Đã sao chép link chia sẻ",
        text: "Trình duyệt không hỗ trợ share trực tiếp, mình đã copy link cho ban rồi",
      });
    } catch {
      // user cancel share thì thôi
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 px-2.5 sm:px-4">
        <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-3 sm:rounded-[20px] sm:p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-[11px]">
                Affiliate
              </p>
              <h1 className="mt-1 text-lg font-bold text-white sm:text-xl">
                Giới thiệu bạn bè
              </h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-white/60 sm:text-sm">
                Mời bạn bè đăng ký qua link của bạn để nhận thưởng referral và theo dõi
                toàn bộ hoa hồng ngay tại đây.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  handleCopy(data?.ref_link || "", "Đã sao chép link giới thiệu")
                }
                disabled={copying || !data?.ref_link}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/15 disabled:opacity-60 sm:h-10 sm:text-sm"
              >
                <Copy size={16} />
                Sao chép link
              </button>

              <button
                onClick={handleShare}
                disabled={!data?.ref_link}
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-3 text-xs font-semibold text-white transition hover:scale-[1.01] disabled:opacity-60 sm:h-10 sm:text-sm"
              >
                <Share2 size={16} />
                Chia sẻ
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
          <div className="rounded-[16px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <Users size={18} />
            </div>
            <p className="text-[11px] text-white/55 sm:text-xs">Tổng người đã mời</p>
            <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
              {loading ? "..." : data?.stats?.total_referrals ?? 0}
            </h3>
          </div>

          <div className="rounded-[16px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
              <Gift size={18} />
            </div>
            <p className="text-[11px] text-white/55 sm:text-xs">Người đã nạp</p>
            <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
              {loading ? "..." : data?.stats?.total_deposited_referrals ?? 0}
            </h3>
          </div>

          <div className="rounded-[16px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <Wallet size={18} />
            </div>
            <p className="text-[11px] text-white/55 sm:text-xs">Tổng hoa hồng</p>
            <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
              {loading ? "..." : formatMoney(data?.stats?.total_commission ?? 0)}
            </h3>
          </div>

          <div className="rounded-[16px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
              <LinkIcon size={18} />
            </div>
            <p className="text-[11px] text-white/55 sm:text-xs">Mã giới thiệu</p>
            <h3 className="mt-1 break-all text-sm font-bold text-white sm:text-base">
              {loading ? "..." : data?.ref_code || "-"}
            </h3>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-3 sm:rounded-[20px] sm:p-4 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-white sm:text-base">
              Link giới thiệu của bạn
            </h2>
            <p className="mt-1 text-xs text-white/55 sm:text-sm">
              Chia sẻ link này cho bạn bè để hệ thống tự ghi nhận referral.
            </p>

            <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                Referral Link
              </p>
              <p className="mt-1.5 break-all text-xs text-cyan-200 sm:text-sm">
                {loading ? "Đang tải..." : data?.ref_link || "-"}
              </p>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                Nội dung gợi ý để share
              </p>
              <p className="mt-1.5 text-xs leading-6 text-white/75 sm:text-sm">
                {referralText || "Đăng ký tại Sola Vietnam bằng link của mình nhé."}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  handleCopy(data?.ref_code || "", "Đã sao chép mã giới thiệu")
                }
                disabled={copying || !data?.ref_code}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-60 sm:h-10 sm:text-sm"
              >
                <Copy size={16} />
                Sao chép mã
              </button>

              <button
                onClick={() =>
                  handleCopy(referralText, "Đã sao chép nội dung chia sẻ")
                }
                disabled={copying || !referralText}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-60 sm:h-10 sm:text-sm"
              >
                <Copy size={16} />
                Sao chép nội dung
              </button>
            </div>
          </div>

          <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-3 sm:rounded-[20px] sm:p-4 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-white sm:text-base">
              Cách hoạt động
            </h2>

            <div className="mt-3 space-y-2.5">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-semibold text-white sm:text-sm">
                  1. Chia sẻ link hoặc mã
                </p>
                <p className="mt-1 text-[11px] leading-5 text-white/65 sm:text-sm">
                  Bạn bè đăng ký qua link referral hoặc nhập mã giới thiệu của bạn.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-semibold text-white sm:text-sm">
                  2. Người mới nhận ưu đãi
                </p>
                <p className="mt-1 text-[11px] leading-5 text-white/65 sm:text-sm">
                  Tài khoản mới được nhận credit đăng ký để trải nghiệm dịch vụ.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-semibold text-white sm:text-sm">
                  3. Bạn nhận thưởng
                </p>
                <p className="mt-1 text-[11px] leading-5 text-white/65 sm:text-sm">
                  Khi người được giới thiệu nạp tiền thành công, hệ thống sẽ cộng thưởng
                  và lưu lịch sử hoa hồng cho bạn.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-3 sm:rounded-[20px] sm:p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white sm:text-base">
                Lịch sử hoa hồng
              </h2>
              <p className="mt-1 text-xs text-white/55 sm:text-sm">
                Theo dõi toàn bộ khoản thưởng referral đã ghi nhận.
              </p>
            </div>
          </div>

          <div className="mt-3">
            {!loading &&
              (!data?.commissions?.data || data.commissions.data.length === 0) && (
                <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-xs text-white/55 sm:text-sm">
                  Chưa có dữ liệu hoa hồng nào.
                </div>
              )}

            {!!data?.commissions?.data?.length && (
              <div className="rounded-[16px] border border-white/10 bg-black/20 overflow-hidden">
                <div className="grid grid-cols-[minmax(0,1.5fr)_110px] gap-2 border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-white/35 sm:grid-cols-[minmax(0,1.6fr)_120px_120px] sm:px-4">
                  <div>Nội dung</div>
                  <div className="text-right">Thưởng</div>
                  <div className="hidden sm:block text-right">Nguồn</div>
                </div>

                {data?.commissions?.data?.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1.5fr)_110px] gap-2 border-b border-white/10 px-3 py-2.5 text-xs last:border-b-0 hover:bg-white/[0.04] sm:grid-cols-[minmax(0,1.6fr)_120px_120px] sm:px-4"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-white">
                        {getTypeLabel(item.type)}
                      </div>

                      <div className="truncate text-[10px] text-white/45 sm:text-[11px]">
                        {item.referred_user?.username ||
                          item.referred_user?.name ||
                          "-"}
                      </div>

                      <div className="truncate text-[10px] text-white/35 sm:text-[11px]">
                        {formatDateTime(item.created_at)}
                        {item.note ? ` • ${item.note}` : ""}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-300">
                        {formatMoney(item.commission_amount)}
                      </div>
                      {!!Number(item.commission_rate) && (
                        <div className="mt-0.5 text-[10px] text-white/40 sm:text-[11px]">
                          {item.commission_rate}%
                        </div>
                      )}
                    </div>

                    <div className="hidden text-right sm:block">
                      <div className="text-xs text-white/70">
                        {Number(item.source_amount) > 0
                          ? formatMoney(item.source_amount)
                          : "-"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AffiliatePage;