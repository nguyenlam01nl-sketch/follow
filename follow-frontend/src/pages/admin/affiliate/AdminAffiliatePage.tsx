import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Users,
  Wallet,
  BadgePercent,
  TrendingUp,
  RefreshCcw,
  Gift,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";

type TabKey = "overview" | "referrals" | "commissions";

type AdminAffiliateOverview = {
  total_referrers: number;
  total_referred_users: number;
  total_deposited_referred_users: number;
  total_first_deposit_bonus: number;
  total_deposit_commission: number;
  total_referral_cost: number;
};

type AdminReferralItem = {
  id: number;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  ref_rewarded_at?: string | null;
  total_deposit: number;
  has_deposited: boolean;
  has_first_deposit_bonus: boolean;
  referrer?: {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    ref_code?: string;
  } | null;
};

type AdminCommissionItem = {
  id: number;
  type: "signup_bonus" | "first_deposit_bonus" | "deposit_commission";
  source_amount: number;
  commission_amount: number;
  commission_rate: number;
  note?: string;
  created_at: string;
  referrer?: {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
  };
  referred_user?: {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
  };
};

type ReferralsResponse = {
  data: AdminReferralItem[];
  current_page: number;
  last_page: number;
  total: number;
};

type CommissionsResponse = {
  data: AdminCommissionItem[];
  current_page: number;
  last_page: number;
  total: number;
};

const formatMoney = (value: number) =>
  Number(value || 0).toLocaleString("vi-VN") + "đ";

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("vi-VN");
};

const getTypeLabel = (type: AdminCommissionItem["type"]) => {
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

function StatusBadge({
  active,
  trueText,
  falseText,
}: {
  active: boolean;
  trueText: string;
  falseText: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-400/15 text-emerald-300"
          : "bg-white/8 text-white/60"
      }`}
    >
      {active ? trueText : falseText}
    </span>
  );
}

function AdminAffiliatePage() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("overview");

  const [overview, setOverview] = useState<AdminAffiliateOverview | null>(null);
  const [referrals, setReferrals] = useState<ReferralsResponse | null>(null);
  const [commissions, setCommissions] = useState<CommissionsResponse | null>(null);

  const [referralsPage, setReferralsPage] = useState(1);
  const [commissionsPage, setCommissionsPage] = useState(1);

  const fetchOverview = async () => {
    const res = await api.get("/admin/affiliate/overview");
    setOverview(res.data?.data || null);
  };

  const fetchReferrals = async (page = 1) => {
    const res = await api.get(`/admin/affiliate/referrals?page=${page}`);
    setReferrals(res.data);
  };

  const fetchCommissions = async (page = 1) => {
    const res = await api.get(`/admin/affiliate/commissions?page=${page}`);
    setCommissions(res.data);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchOverview(),
        fetchReferrals(referralsPage),
        fetchCommissions(commissionsPage),
      ]);
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Không tải được dữ liệu affiliate",
        text:
          error?.response?.data?.message ||
          "Đã có lỗi xảy ra khi tải dữ liệu affiliate",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetchReferrals(referralsPage).catch(() => {});
  }, [referralsPage]);

  useEffect(() => {
    fetchCommissions(commissionsPage).catch(() => {});
  }, [commissionsPage]);

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <Users size={22} />
          </div>
          <p className="text-sm text-white/55">Tổng referrer</p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {loading ? "..." : overview?.total_referrers ?? 0}
          </h3>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
            <Users size={22} />
          </div>
          <p className="text-sm text-white/55">Tổng user được mời</p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {loading ? "..." : overview?.total_referred_users ?? 0}
          </h3>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
            <Gift size={22} />
          </div>
          <p className="text-sm text-white/55">User đã nạp</p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {loading ? "..." : overview?.total_deposited_referred_users ?? 0}
          </h3>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            <Wallet size={22} />
          </div>
          <p className="text-sm text-white/55">Thưởng nạp đầu</p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {loading ? "..." : formatMoney(overview?.total_first_deposit_bonus ?? 0)}
          </h3>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
            <BadgePercent size={22} />
          </div>
          <p className="text-sm text-white/55">Hoa hồng nạp tiền</p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {loading ? "..." : formatMoney(overview?.total_deposit_commission ?? 0)}
          </h3>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-400/10 text-pink-300">
            <TrendingUp size={22} />
          </div>
          <p className="text-sm text-white/55">Tổng chi phí affiliate</p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {loading ? "..." : formatMoney(overview?.total_referral_cost ?? 0)}
          </h3>
        </div>
      </div>
    </div>
  );

  const renderReferralsTab = () => (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6 backdrop-blur-xl">
      <h2 className="text-lg font-semibold text-white">User được giới thiệu</h2>
      <p className="mt-1 text-sm text-white/55">
        Danh sách toàn bộ tài khoản đăng ký bằng mã giới thiệu.
      </p>

      <div className="mt-5 space-y-4">
        {!loading && (!referrals?.data || referrals.data.length === 0) && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-white/55">
            Chưa có user nào đăng ký bằng referral.
          </div>
        )}

        {referrals?.data?.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {item.username || item.name || "-"}
                </p>
                <p className="mt-1 text-sm text-white/60">Email: {item.email || "-"}</p>
                <p className="mt-1 text-sm text-white/60">
                  Người giới thiệu:{" "}
                  <span className="font-medium text-cyan-200">
                    {item.referrer?.username || item.referrer?.name || "-"}
                  </span>
                  {item.referrer?.ref_code ? ` • ${item.referrer.ref_code}` : ""}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  Ngày đăng ký: {formatDateTime(item.created_at)}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  Thời gian thưởng first deposit: {formatDateTime(item.ref_rewarded_at)}
                </p>
              </div>

              <div className="space-y-2 xl:text-right">
                <p className="text-sm font-semibold text-emerald-300">
                  Tổng nạp: {formatMoney(item.total_deposit || 0)}
                </p>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <StatusBadge
                    active={item.has_deposited}
                    trueText="Đã nạp"
                    falseText="Chưa nạp"
                  />
                  <StatusBadge
                    active={item.has_first_deposit_bonus}
                    trueText="Đã thưởng nạp đầu"
                    falseText="Chưa thưởng nạp đầu"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {referrals && referrals.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setReferralsPage((prev) => Math.max(1, prev - 1))}
            disabled={referralsPage === 1}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            Trước
          </button>

          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/75">
            Trang {referrals.current_page} / {referrals.last_page}
          </div>

          <button
            onClick={() =>
              setReferralsPage((prev) => Math.min(referrals.last_page, prev + 1))
            }
            disabled={referralsPage === referrals.last_page}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );

  const renderCommissionsTab = () => (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6 backdrop-blur-xl">
      <h2 className="text-lg font-semibold text-white">Lịch sử chi thưởng affiliate</h2>
      <p className="mt-1 text-sm text-white/55">
        Toàn bộ khoản thưởng referral đã phát sinh trong hệ thống.
      </p>

      <div className="mt-5 space-y-4">
        {!loading && (!commissions?.data || commissions.data.length === 0) && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-white/55">
            Chưa có dữ liệu affiliate nào.
          </div>
        )}

        {commissions?.data?.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  {getTypeLabel(item.type)}
                </p>
                <p className="text-sm text-white/60">
                  Người giới thiệu:{" "}
                  <span className="font-medium text-cyan-200">
                    {item.referrer?.username || item.referrer?.name || "-"}
                  </span>
                </p>
                <p className="text-sm text-white/60">
                  Người được mời:{" "}
                  <span className="font-medium text-violet-200">
                    {item.referred_user?.username || item.referred_user?.name || "-"}
                  </span>
                </p>
                <p className="text-sm text-white/60">
                  Thời gian: {formatDateTime(item.created_at)}
                </p>
                {item.note && (
                  <p className="text-sm text-white/60">Ghi chú: {item.note}</p>
                )}
              </div>

              <div className="xl:text-right">
                <p className="text-sm text-white/50">Chi thưởng</p>
                <p className="mt-1 text-lg font-bold text-emerald-300">
                  {formatMoney(item.commission_amount)}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  Giao dịch nguồn: {formatMoney(item.source_amount || 0)}
                  {Number(item.commission_rate) > 0
                    ? ` • ${item.commission_rate}%`
                    : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {commissions && commissions.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCommissionsPage((prev) => Math.max(1, prev - 1))}
            disabled={commissionsPage === 1}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            Trước
          </button>

          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/75">
            Trang {commissions.current_page} / {commissions.last_page}
          </div>

          <button
            onClick={() =>
              setCommissionsPage((prev) => Math.min(commissions.last_page, prev + 1))
            }
            disabled={commissionsPage === commissions.last_page}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                Admin Affiliate
              </p>
              <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                Quản lý hệ thống giới thiệu
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/65">
                Theo dõi người giới thiệu, user được mời và toàn bộ chi phí affiliate
                của hệ thống.
              </p>
            </div>

            <button
              onClick={fetchAll}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <RefreshCcw size={18} />
              Tải lại
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setTab("overview")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              tab === "overview"
                ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 text-white"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            Tổng quan
          </button>

          <button
            onClick={() => setTab("referrals")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              tab === "referrals"
                ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 text-white"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            User được giới thiệu
          </button>

          <button
            onClick={() => setTab("commissions")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              tab === "commissions"
                ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 text-white"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            Lịch sử chi thưởng
          </button>
        </div>

        {tab === "overview" && renderOverviewTab()}
        {tab === "referrals" && renderReferralsTab()}
        {tab === "commissions" && renderCommissionsTab()}
      </div>
    </DashboardLayout>
  );
}

export default AdminAffiliatePage;