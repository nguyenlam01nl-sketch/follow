import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import { ChevronLeft, Save, Sparkles } from "lucide-react";

function FacebookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.19 2.23.19v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.89h-2.33v6.99C18.34 21.13 22 17 22 12z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM12 9a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
  );
}

function YoutubeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.7-.9-1.5-.9-1.9-1C18.3 2.7 12 2.7 12 2.7h0s-6.3 0-8.8.2c-.4 0-1.2.1-1.9 1C.7 4.6.5 6.2.5 6.2S.3 8 .3 9.8v1.4c0 1.8.2 3.6.2 3.6s.2 1.6.8 2.3c.7.9 1.7.9 2.1 1 1.5.1 6.6.2 8.6.2 0 0 6.3 0 8.8-.2.4 0 1.2-.1 1.9-1 .6-.7.8-2.3.8-2.3s.2-1.8.2-3.6V9.8c0-1.8-.2-3.6-.2-3.6zM9.8 14.6V7.9l6.4 3.4-6.4 3.3z" />
    </svg>
  );
}

function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="currentColor">
      <path d="M33.5 6C35.1 10.2 38.2 13.3 42 14.7V21C38.9 20.9 35.8 19.9 33.2 18.2V29.2C33.2 37.4 26.6 44 18.4 44C10.2 44 3.6 37.4 3.6 29.2C3.6 21 10.2 14.4 18.4 14.4C19.1 14.4 19.8 14.5 20.5 14.6V22.1C19.8 21.9 19.1 21.8 18.4 21.8C14.3 21.8 11 25.1 11 29.2C11 33.3 14.3 36.6 18.4 36.6C22.5 36.6 25.8 33.3 25.8 29.2V4H33.5V6Z" />
    </svg>
  );
}

type ApiServiceItem = {
  service: number | string;
  name: string;
  desc?: string;
  type?: string;
  category?: string;
  platform?: string;
  rate?: number | string;
  original_rate?: number | string;
  sell_rate?: number | string;
  rate_per?: number | string;
  min?: number | string;
  max?: number | string;
  refill?: boolean;
  cancel?: boolean;
  status?: string;
};

type ServiceTypeOption = {
  key: string;
  name: string;
  hint: string;
  matchers: string[];
};

const engagementData: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    serviceTypes: ServiceTypeOption[];
  }
> = {
  facebook: {
    label: "Facebook",
    icon: <FacebookIcon className="h-5 w-5 text-[#4EA1FF]" />,
    serviceTypes: [
      { key: "follow_page", name: "Tăng Follow Page", hint: "", matchers: ["follow page", "sub chạy cho page", "like page", "page"] },
      { key: "follow_profile", name: "Tăng Follow Profile", hint: "", matchers: ["follow", "sub", "profile"] },
      { key: "like_post", name: "Tăng Like Bài Viết / Cảm Xúc", hint: "", matchers: ["like bài viết", "like cảm xúc", "cảm xúc", "post"] },
      { key: "view", name: "Tăng View", hint: "", matchers: ["view", "reel", "story"] },
      { key: "comment", name: "Tăng Comment", hint: "", matchers: ["comment"] },
      { key: "share", name: "Tăng Share", hint: "", matchers: ["share"] },
      { key: "member", name: "Tăng Member", hint: "", matchers: ["member"] },
      { key: "live", name: "Tăng Mắt Live", hint: "", matchers: ["live", "livestream", "mắt live"] },
    ],
  },
  instagram: {
    label: "Instagram",
    icon: <InstagramIcon className="h-5 w-5 text-pink-400" />,
    serviceTypes: [
      { key: "follow", name: "Tăng Follow / Sub", hint: "", matchers: ["follow", "sub", "theo dõi"] },
      { key: "like", name: "Tăng Like / Tim", hint: "", matchers: ["like", "tim"] },
      { key: "view", name: "Tăng View", hint: "", matchers: ["view", "story"] },
      { key: "comment", name: "Tăng Comment", hint: "", matchers: ["comment"] },
      { key: "share", name: "Tăng Share", hint: "", matchers: ["share"] },
    ],
  },
  tiktok: {
    label: "TikTok",
    icon: <TikTokIcon className="h-5 w-5 text-white" />,
    serviceTypes: [
      { key: "follow", name: "Tăng Follow", hint: "", matchers: ["follow"] },
      { key: "like", name: "Tăng Like / Tym", hint: "", matchers: ["like", "tym"] },
      { key: "view", name: "Tăng View", hint: "", matchers: ["view"] },
      { key: "comment", name: "Tăng Comment", hint: "", matchers: ["comment"] },
      { key: "share", name: "Tăng Share", hint: "", matchers: ["share"] },
      { key: "live", name: "Tăng Mắt Live", hint: "", matchers: ["live", "livestream", "mắt live"] },
    ],
  },
  youtube: {
    label: "YouTube",
    icon: <YoutubeIcon className="h-5 w-5 text-red-500" />,
    serviceTypes: [
      { key: "follow", name: "Tăng Subscribe / Sub", hint: "", matchers: ["subscribe", "sub"] },
      { key: "like", name: "Tăng Like", hint: "", matchers: ["like"] },
      { key: "view", name: "Tăng View", hint: "", matchers: ["view"] },
      { key: "comment", name: "Tăng Comment", hint: "", matchers: ["comment"] },
    ],
  },
};

function formatMoney(value?: string | number) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0 VND";
  return `${num.toLocaleString("vi-VN")} VND`;
}

function getRawOriginalPrice(item?: ApiServiceItem) {
  if (!item) return 0;
  return Number(item.original_rate ?? item.rate ?? 0);
}

function getRawSellPrice(item?: ApiServiceItem) {
  if (!item) return 0;
  return Number(item.sell_rate ?? item.rate ?? 0);
}

function getRatePer(item?: ApiServiceItem) {
  if (!item) return 1000;
  const per = Number(item.rate_per ?? 1000);
  return per > 0 ? per : 1000;
}

function getOriginalUnitPrice(item?: ApiServiceItem) {
  if (!item) return 0;
  return getRawOriginalPrice(item) / getRatePer(item);
}

function getUnitPrice(item?: ApiServiceItem) {
  if (!item) return 0;
  return getRawSellPrice(item) / getRatePer(item);
}

function matchesServiceType(
  item: ApiServiceItem,
  typeKey: string,
  matchers: string[],
  platform?: string
) {
  const text = `${item.name || ""} ${item.category || ""} ${item.type || ""}`.toLowerCase();

  if (platform === "facebook") {
    if (typeKey === "follow_page") {
      return (
        text.includes("like page") ||
        text.includes("follow page") ||
        text.includes("sub chạy cho page")
      );
    }

    if (typeKey === "follow_profile") {
      return (
        (text.includes("follow") || text.includes("sub")) &&
        !text.includes("like page") &&
        !text.includes("follow page") &&
        !text.includes("sub chạy cho page")
      );
    }

    if (typeKey === "like_post") {
      return (
        (text.includes("like") || text.includes("cảm xúc")) &&
        !text.includes("like page")
      );
    }
  }

  return matchers.some((keyword) => text.includes(keyword.toLowerCase()));
}

export default function AdminEngagementPlatformPage() {
  const { platform = "" } = useParams();
  const navigate = useNavigate();

  const current = useMemo(() => engagementData[platform.toLowerCase()], [platform]);

  const [serviceType, setServiceType] = useState("");
  const [services, setServices] = useState<ApiServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    desc: "",
    original_rate: "",
    sell_rate: "",
    rate_per: "1",
    min: "",
    max: "",
    platform: "",
    category: "",
    status: "active",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const res = await api.get("/external/services");
        const data = res.data?.data || res.data || [];
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi lấy danh sách dịch vụ:", error);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const platformServices = useMemo(() => {
    if (!current) return [];
    return services.filter((item) => {
      const itemPlatform = (item.platform || "").toLowerCase();
      return itemPlatform.includes(current.label.toLowerCase());
    });
  }, [services, current]);

  const selectedTypeMeta = current?.serviceTypes.find((x) => x.key === serviceType);

  const filteredServices = useMemo(() => {
    if (!selectedTypeMeta) return [];
    return platformServices.filter((item) =>
      matchesServiceType(
        item,
        selectedTypeMeta.key,
        selectedTypeMeta.matchers,
        platform.toLowerCase()
      )
    );
  }, [platformServices, selectedTypeMeta, platform]);

  const selectedPackage = useMemo(() => {
    return filteredServices.find((item) => String(item.service) === selectedServiceId);
  }, [filteredServices, selectedServiceId]);

  useEffect(() => {
    if (!selectedPackage) {
      setEditForm({
        name: "",
        desc: "",
        original_rate: "",
        sell_rate: "",
        rate_per: "1",
        min: "",
        max: "",
        platform: "",
        category: "",
        status: "active",
      });
      return;
    }

    setEditForm({
      name: selectedPackage.name || "",
      desc: selectedPackage.desc || "",
      original_rate: String(getOriginalUnitPrice(selectedPackage)),
      sell_rate: String(getUnitPrice(selectedPackage)),
      rate_per: "1",
      min: String(selectedPackage.min ?? ""),
      max: String(selectedPackage.max ?? ""),
      platform: selectedPackage.platform || "",
      category: selectedPackage.category || "",
      status: selectedPackage.status || "active",
    });
  }, [selectedPackage]);

  const handleSave = async () => {
    if (!selectedPackage) return;

    const confirm = await Swal.fire({
      title: "Lưu thay đổi?",
      text: "Bạn có chắc muốn cập nhật giá bán gói này không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2F80ED",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Huỷ",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSaving(true);

      const originalPer = getRatePer(selectedPackage);

      await api.put(`/admin/external-services/${selectedPackage.service}`, {
        name: editForm.name.trim(),
        desc: editForm.desc.trim(),
        original_rate: Number(editForm.original_rate || 0) * originalPer,
        sell_rate: Number(editForm.sell_rate || 0) * originalPer,
        rate_per: originalPer,
        min: Number(editForm.min || 0),
        max: Number(editForm.max || 0),
        platform: editForm.platform.trim(),
        category: editForm.category.trim(),
        status: editForm.status,
      });

      await Swal.fire({
        title: "Thành công!",
        text: "Đã cập nhật giá bán",
        icon: "success",
        confirmButtonColor: "#2F80ED",
        confirmButtonText: "OK",
      });

      const res = await api.get("/external/services");
      const data = res.data?.data || res.data || [];
      setServices(Array.isArray(data) ? data : []);
    } catch (error: any) {
      await Swal.fire({
        title: "Lỗi!",
        text: error?.response?.data?.message || "Cập nhật thất bại",
        icon: "error",
        confirmButtonColor: "#2F80ED",
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!current) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          Không tìm thấy nền tảng: {platform}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate("/admin/services")}
          className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ChevronLeft size={16} />
          Quay lại
        </button>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-2xl border border-white/10 bg-[#08152d] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102345]">
                <Sparkles size={16} className="text-orange-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Quản lý tương tác {current.label}
                </h2>
                <p className="mt-1 text-sm text-white/40">
                  Chọn gói và chỉnh giá bán riêng cho từng service.
                </p>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-[#071122] px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                {current.icon}
              </div>
              <div className="text-sm font-medium text-white">{current.label}</div>
              <div className="ml-auto rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-300">
                Admin
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-white/70">Loại dịch vụ</label>
                <select
                  value={serviceType}
                  onChange={(e) => {
                    setServiceType(e.target.value);
                    setSelectedServiceId("");
                  }}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#071327] px-3 text-sm text-white outline-none"
                >
                  <option value="">Chọn loại dịch vụ</option>
                  {current.serviceTypes.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70">Gói dịch vụ</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#071327] px-3 text-sm text-white outline-none"
                >
                  <option value="">
                    {!serviceType
                      ? "Chọn loại dịch vụ trước"
                      : loadingServices
                        ? "Đang tải dịch vụ..."
                        : "Chọn gói"}
                  </option>

                  {filteredServices.map((item) => (
                    <option key={item.service} value={String(item.service)}>
                      #{item.service} - {item.name} - {formatMoney(getUnitPrice(item))}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-sm text-white/70">Tên gói</label>
              <input
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                className="h-11 w-full rounded-xl border border-white/10 bg-[#071327] px-3 text-sm text-white outline-none"
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm text-white/70">Giá gốc API</label>
                <input
                  value={editForm.original_rate}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, original_rate: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#071327] px-3 text-sm text-white outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70">Giá bán của mình</label>
                <input
                  value={editForm.sell_rate}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, sell_rate: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#071327] px-3 text-sm text-white outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70">Tính theo</label>
                <input
                  value={editForm.rate_per}
                  readOnly
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#071327] px-3 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-white/70">Min</label>
                <input
                  value={editForm.min}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, min: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#071327] px-3 text-sm text-white outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70">Max</label>
                <input
                  value={editForm.max}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, max: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#071327] px-3 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-sm text-white/70">Mô tả</label>
              <textarea
                value={editForm.desc}
                onChange={(e) => setEditForm((prev) => ({ ...prev, desc: e.target.value }))}
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-[#071327] px-3 py-3 text-sm text-white outline-none"
              />
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-sm text-white/70">Trạng thái</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                className="h-11 w-full rounded-xl border border-white/10 bg-[#071327] px-3 text-sm text-white outline-none"
              >
                <option value="active">active</option>
                <option value="paused">paused</option>
                <option value="hidden">hidden</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={!selectedPackage || saving}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2F80ED] text-sm font-semibold text-white disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>

          <div className="rounded-2xl border border-orange-400/15 bg-[linear-gradient(180deg,rgba(255,149,0,0.06),rgba(255,149,0,0.02))] p-5">
            <div className="text-base font-semibold text-white">Thông tin gói</div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="text-white/70">Nền tảng: {current.label}</div>
              <div className="text-white/70">Loại: {selectedTypeMeta?.name || "..."}</div>
              <div className="text-white/70">Gói: {editForm.name || "..."}</div>
              <div className="text-white/70">
                Giá gốc: {selectedPackage ? formatMoney(getOriginalUnitPrice(selectedPackage)) : "..."}
              </div>
              <div className="text-emerald-300">
                Giá bán: {selectedPackage ? formatMoney(getUnitPrice(selectedPackage)) : "..."}
              </div>
              <div className="text-white/70">Theo: 1</div>
              <div className="text-white/70">
                Min/Max: {editForm.min || "..."} / {editForm.max || "..."}
              </div>
              <div className="text-white/70">ID gói: {selectedPackage?.service || "..."}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}