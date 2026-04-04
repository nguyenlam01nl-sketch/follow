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
        text: "Trình duyệt không hỗ trợ share trực tiếp, mình đã copy link cho bé rồi",
      });
    } catch {
      // user cancel share thì thôi
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                Affiliate
              </p>
              <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                Giới thiệu bạn bè
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/65">
                Mời bạn bè đăng ký qua link của bé để nhận thưởng referral và theo
                dõi toàn bộ hoa hồng ngay tại đây.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCopy(data?.ref_link || "", "Đã sao chép link giới thiệu")}
                disabled={copying || !data?.ref_link}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15 disabled:opacity-60"
              >
                <Copy size={18} />
                Sao chép link
              </button>

              <button
                onClick={handleShare}
                disabled={!data?.ref_link}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-4 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(34,211,238,0.22)] transition hover:scale-[1.01] disabled:opacity-60"
              >
                <Share2 size={18} />
                Chia sẻ ngay
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <Users size={22} />
            </div>
            <p className="text-sm text-white/55">Tổng người đã mời</p>
            <h3 className="mt-2 text-2xl font-bold text-white">
              {loading ? "..." : data?.stats?.total_referrals ?? 0}
            </h3>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
              <Gift size={22} />
            </div>
            <p className="text-sm text-white/55">Người đã nạp tiền</p>
            <h3 className="mt-2 text-2xl font-bold text-white">
              {loading ? "..." : data?.stats?.total_deposited_referrals ?? 0}
            </h3>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              <Wallet size={22} />
            </div>
            <p className="text-sm text-white/55">Tổng hoa hồng</p>
            <h3 className="mt-2 text-2xl font-bold text-white">
              {loading ? "..." : formatMoney(data?.stats?.total_commission ?? 0)}
            </h3>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
              <LinkIcon size={22} />
            </div>
            <p className="text-sm text-white/55">Mã giới thiệu</p>
            <h3 className="mt-2 break-all text-xl font-bold text-white">
              {loading ? "..." : data?.ref_code || "-"}
            </h3>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Link giới thiệu của bé</h2>
            <p className="mt-2 text-sm text-white/55">
              Chia sẻ link này cho bạn bè để họ đăng ký và hệ thống tự ghi nhận referral.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Referral Link
              </p>
              <p className="mt-2 break-all text-sm text-cyan-200">
                {loading ? "Đang tải..." : data?.ref_link || "-"}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Nội dung gợi ý để share
              </p>
              <p className="mt-2 text-sm leading-7 text-white/75">
                {referralText || "Đăng ký tại Sola Vietnam bằng link của mình nhé."}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => handleCopy(data?.ref_code || "", "Đã sao chép mã giới thiệu")}
                disabled={copying || !data?.ref_code}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
              >
                <Copy size={18} />
                Sao chép mã
              </button>

              <button
                onClick={() => handleCopy(referralText, "Đã sao chép nội dung chia sẻ")}
                disabled={copying || !referralText}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
              >
                <Copy size={18} />
                Sao chép nội dung
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Cách hoạt động</h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">1. Chia sẻ link hoặc mã</p>
                <p className="mt-2 text-sm leading-7 text-white/65">
                  Bạn bè đăng ký qua link referral hoặc nhập mã giới thiệu của bé.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">2. Người mới nhận ưu đãi</p>
                <p className="mt-2 text-sm leading-7 text-white/65">
                  Tài khoản mới được nhận credit đăng ký để trải nghiệm dịch vụ.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">3. Bé nhận thưởng</p>
                <p className="mt-2 text-sm leading-7 text-white/65">
                  Khi người được giới thiệu nạp tiền thành công, hệ thống sẽ cộng thưởng
                  và lưu lịch sử hoa hồng cho bé.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Lịch sử hoa hồng</h2>
              <p className="mt-1 text-sm text-white/55">
                Theo dõi toàn bộ khoản thưởng referral đã ghi nhận.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {!loading && (!data?.commissions?.data || data.commissions.data.length === 0) && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-white/55">
                Chưa có dữ liệu hoa hồng nào.
              </div>
            )}

            {data?.commissions?.data?.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {getTypeLabel(item.type)}
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      Từ người dùng:{" "}
                      <span className="font-medium text-cyan-200">
                        {item.referred_user?.username ||
                          item.referred_user?.name ||
                          "-"}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      Thời gian: {formatDateTime(item.created_at)}
                    </p>
                    {item.note && (
                      <p className="mt-1 text-sm text-white/60">
                        Ghi chú: {item.note}
                      </p>
                    )}
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm text-white/50">Tiền thưởng</p>
                    <p className="mt-1 text-lg font-bold text-emerald-300">
                      {formatMoney(item.commission_amount)}
                    </p>

                    {Number(item.source_amount) > 0 && (
                      <p className="mt-1 text-xs text-white/50">
                        Nguồn giao dịch: {formatMoney(item.source_amount)}
                        {Number(item.commission_rate) > 0
                          ? ` • ${item.commission_rate}%`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AffiliatePage;