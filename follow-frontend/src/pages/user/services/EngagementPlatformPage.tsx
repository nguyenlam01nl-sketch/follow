import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import { ChevronLeft, Check, ChevronDown, Sparkles, Wallet } from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";

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

function dropdownButtonClass(hasValue = false, disabled = false) {
  return [
    "flex h-[52px] w-full items-center justify-between rounded-2xl border px-4",
    "text-sm md:text-[15px] transition duration-200",
    "border-white/10 bg-[#071327]/90 backdrop-blur-md",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
    "outline-none hover:border-white/20",
    "focus-within:border-[#2F80ED] focus-within:ring-2 focus-within:ring-[#2F80ED]/20",
    hasValue ? "text-white" : "text-white/40",
    disabled ? "cursor-not-allowed opacity-60" : "",
  ].join(" ");
}

function dropdownPanelClass() {
  return [
    "absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl",
    "border border-white/10 bg-[#0b1730]/95 backdrop-blur-xl",
    "shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
  ].join(" ");
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
      {
        key: "follow_page",
        name: "Tăng Follow Page",
        hint: "Nhập link page Facebook",
        matchers: ["follow page", "sub chạy cho page", "like page", "page"],
      },
      {
        key: "follow_profile",
        name: "Tăng Follow Profile",
        hint: "Nhập link profile Facebook",
        matchers: ["follow", "sub", "profile"],
      },
      {
        key: "like_post",
        name: "Tăng Like Bài Viết / Cảm Xúc",
        hint: "Nhập link bài viết Facebook",
        matchers: ["like bài viết", "like cảm xúc", "cảm xúc", "post"],
      },
      {
        key: "view",
        name: "Tăng View",
        hint: "Nhập link video, reel hoặc story Facebook",
        matchers: ["view", "reel", "story"],
      },
      {
        key: "comment",
        name: "Tăng Comment",
        hint: "Nhập link bài viết Facebook",
        matchers: ["comment"],
      },
      {
        key: "share",
        name: "Tăng Share",
        hint: "Nhập link bài viết Facebook",
        matchers: ["share"],
      },
      {
        key: "member",
        name: "Tăng Member",
        hint: "Nhập link group Facebook",
        matchers: ["member"],
      },
      {
        key: "live",
        name: "Tăng Mắt Live",
        hint: "Nhập link livestream Facebook",
        matchers: ["live", "livestream", "mắt live"],
      },
    ],
  },

  instagram: {
    label: "Instagram",
    icon: <InstagramIcon className="h-5 w-5 text-pink-400" />,
    serviceTypes: [
      {
        key: "follow",
        name: "Tăng Follow / Sub",
        hint: "Nhập link profile Instagram",
        matchers: ["follow", "sub", "theo dõi"],
      },
      {
        key: "like",
        name: "Tăng Like / Tim",
        hint: "Nhập link bài post Instagram",
        matchers: ["like", "tim"],
      },
      {
        key: "view",
        name: "Tăng View",
        hint: "Nhập link reel, story hoặc bài post Instagram",
        matchers: ["view", "story"],
      },
      {
        key: "comment",
        name: "Tăng Comment",
        hint: "Nhập link bài post Instagram",
        matchers: ["comment"],
      },
      {
        key: "share",
        name: "Tăng Share",
        hint: "Nhập link bài post Instagram",
        matchers: ["share"],
      },
    ],
  },

  tiktok: {
    label: "TikTok",
    icon: <TikTokIcon className="h-5 w-5 text-white" />,
    serviceTypes: [
      {
        key: "follow",
        name: "Tăng Follow",
        hint: "Nhập link profile TikTok",
        matchers: ["follow"],
      },
      {
        key: "like",
        name: "Tăng Like / Tym",
        hint: "Nhập link video TikTok",
        matchers: ["like", "tym"],
      },
      {
        key: "view",
        name: "Tăng View",
        hint: "Nhập link video TikTok",
        matchers: ["view"],
      },
      {
        key: "comment",
        name: "Tăng Comment",
        hint: "Nhập link video TikTok",
        matchers: ["comment"],
      },
      {
        key: "share",
        name: "Tăng Share",
        hint: "Nhập link video TikTok",
        matchers: ["share"],
      },
      {
        key: "live",
        name: "Tăng Mắt Live",
        hint: "Nhập link live TikTok",
        matchers: ["live", "livestream", "mắt live"],
      },
    ],
  },

  threads: {
  label: "Threads",
  icon: <InstagramIcon className="h-5 w-5 text-pink-400" />,
  serviceTypes: [
    {
      key: "follow",
      name: "Tăng Follow",
      hint: "Nhập link profile Threads",
      matchers: ["follow", "sub"],
    },
    {
      key: "like",
      name: "Tăng Like",
      hint: "Nhập link bài viết Threads",
      matchers: ["like", "tym", "tim"],
    },
    {
      key: "view",
      name: "Tăng View",
      hint: "Nhập link bài viết Threads",
      matchers: ["view"],
    },
    {
      key: "comment",
      name: "Tăng Comment",
      hint: "Nhập link bài viết Threads",
      matchers: ["comment"],
    },
    {
      key: "share",
      name: "Tăng Share",
      hint: "Nhập link bài viết Threads",
      matchers: ["share"],
    },
  ],
},

  youtube: {
    label: "YouTube",
    icon: <YoutubeIcon className="h-5 w-5 text-red-500" />,
    serviceTypes: [
      {
        key: "follow",
        name: "Tăng Subscribe / Sub",
        hint: "Nhập link channel YouTube",
        matchers: ["subscribe", "sub"],
      },
      {
        key: "like",
        name: "Tăng Like",
        hint: "Nhập link video YouTube",
        matchers: ["like"],
      },
      {
        key: "view",
        name: "Tăng View",
        hint: "Nhập link video hoặc shorts YouTube",
        matchers: ["view"],
      },
      {
        key: "comment",
        name: "Tăng Comment",
        hint: "Nhập link video YouTube",
        matchers: ["comment"],
      },
    ],
  },
};

function formatMoney(value?: string | number) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0 VND";
  return `${num.toLocaleString("vi-VN")} VND`;
}

function getDisplayPrice(item?: ApiServiceItem) {
  if (!item) return 0;

  const rawPrice = Number(item.sell_rate ?? item.rate ?? 0);
  const ratePer = Number(item.rate_per ?? 1000);

  if (!Number.isFinite(rawPrice) || rawPrice <= 0) return 0;
  if (!Number.isFinite(ratePer) || ratePer <= 0) return rawPrice;

  return rawPrice / ratePer;
}

function stripHtml(html?: string) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
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

function alertHtml(content: string) {
  return `
    <div style="text-align:left; line-height:1.7; font-size:14px; color:#dbe7ff;">
      ${content}
    </div>
  `;
}

const swalBaseOptions = {
  background: "#08152d",
  color: "#e5eefc",
  backdrop: "rgba(2, 8, 23, 0.78)",
  buttonsStyling: false,
  customClass: {
    popup: "rounded-[24px] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]",
    title: "!text-white !text-[32px] !font-extrabold",
    htmlContainer: "!text-left !text-[14px] !leading-7 !text-white/80",
    confirmButton:
      "!inline-flex !h-11 !items-center !justify-center !rounded-xl !bg-[#2F80ED] !px-6 !text-sm !font-semibold !text-white hover:!brightness-110",
    cancelButton:
      "!inline-flex !h-11 !items-center !justify-center !rounded-xl !border !border-white/10 !bg-white/5 !px-6 !text-sm !font-semibold !text-white/80 hover:!bg-white/10",
    icon: "!border-[3px]",
  },
};

function showAlert({
  title,
  icon = "info",
  content,
  confirmText = "OK",
}: {
  title: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
  content: string;
  confirmText?: string;
}) {
  return Swal.fire({
    ...swalBaseOptions,
    title,
    icon,
    html: alertHtml(content),
    confirmButtonText: confirmText,
  });
}

export default function EngagementPlatformPage() {
  const { platform = "" } = useParams();
  const navigate = useNavigate();

  const current = useMemo(() => engagementData[platform.toLowerCase()], [platform]);

  const [serviceType, setServiceType] = useState("");
  const [services, setServices] = useState<ApiServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);

  const selectedTypeMeta = current?.serviceTypes.find((x) => x.key === serviceType);
  const isComment = serviceType === "comment";

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

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoadingWallet(true);
        const res = await api.get("/wallet");
        setWalletBalance(Number(res.data?.balance ?? res.data?.data?.balance ?? 0));
      } catch (error) {
        console.error("Lỗi lấy số dư ví:", error);
        setWalletBalance(0);
      } finally {
        setLoadingWallet(false);
      }
    };

    fetchWallet();
  }, []);

  const platformServices = useMemo(() => {
    if (!current) return [];
    return services.filter((item) => {
      const itemPlatform = (item.platform || "").toLowerCase();
      return itemPlatform.includes(current.label.toLowerCase());
    });
  }, [services, current]);

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

  const selectedPrice = useMemo(() => getDisplayPrice(selectedPackage), [selectedPackage]);

  const totalPrice = useMemo(() => {
    const qty = Number(quantity || 0);
    if (!selectedPackage) return 0;
    if (!Number.isFinite(qty) || qty <= 0) return 0;
    return selectedPrice * qty;
  }, [selectedPackage, selectedPrice, quantity]);

  const handleChangeType = (value: string) => {
    setServiceType(value);
    setSelectedServiceId("");
    setQuantity("");
    setLink("");
    setNote("");
    setCommentContent("");
  };

  const refreshWallet = async () => {
    try {
      const res = await api.get("/wallet");
      setWalletBalance(Number(res.data?.balance ?? res.data?.data?.balance ?? 0));
    } catch (error) {
      console.error("Lỗi refresh ví:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedServiceId || !link || !quantity) {
      await showAlert({
        title: "Thiếu thông tin!",
        icon: "warning",
        content: `
          <p>Vui lòng nhập đủ:</p>
          <p>• Gói dịch vụ</p>
          <p>• Link</p>
          <p>• Số lượng</p>
        `,
      });
      return;
    }

    const qty = Number(quantity);
    const min = Number(selectedPackage?.min || 0);
    const max = Number(selectedPackage?.max || 0);

    if (!Number.isInteger(qty) || qty <= 0) {
      await showAlert({
        title: "Số lượng không hợp lệ!",
        icon: "warning",
        content: `<p>Vui lòng nhập số lượng là <b>số nguyên dương</b>.</p>`,
      });
      return;
    }

    if (min > 0 && qty < min) {
      await showAlert({
        title: "Số lượng quá nhỏ!",
        icon: "warning",
        content: `<p>Số lượng tối thiểu là <b>${min}</b></p>`,
      });
      return;
    }

    if (max > 0 && qty > max) {
      await showAlert({
        title: "Số lượng quá lớn!",
        icon: "warning",
        content: `<p>Số lượng tối đa là <b>${max}</b></p>`,
      });
      return;
    }

    if (isComment && !commentContent.trim()) {
      await showAlert({
        title: "Thiếu nội dung comment!",
        icon: "warning",
        content: `<p>Dịch vụ comment bắt buộc phải nhập <b>nội dung comment</b>.</p>`,
      });
      return;
    }

    if (totalPrice > walletBalance) {
      await showAlert({
        title: "Số dư không đủ!",
        icon: "warning",
        confirmText: "Nạp thêm",
        content: `
          <p>Số dư hiện tại: <b>${formatMoney(walletBalance)}</b></p>
          <p>Giá gói: <b>${formatMoney(selectedPrice)}</b></p>
          <p>Tổng tiền: <b>${formatMoney(totalPrice)}</b></p>
        `,
      });
      return;
    }

    const confirm = await Swal.fire({
      ...swalBaseOptions,
      title: "Xác nhận đặt đơn?",
      icon: "question",
      html: alertHtml(`
        <p>Số dư ví: <b style="color:#34d399;">${formatMoney(walletBalance)}</b></p>
        <p>Giá gói: <b style="color:#60a5fa;">${formatMoney(selectedPrice)}</b></p>
        <p>Số lượng: <b style="color:#f8fafc;">${quantity || 0}</b></p>
        <p>Tổng tiền: <b style="color:#f59e0b;">${formatMoney(totalPrice)}</b></p>
        <p style="margin-top:10px;">Bạn có chắc muốn tạo đơn hàng này không?</p>
      `),
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Huỷ",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);

      const payload: Record<string, any> = {
        service: selectedServiceId,
        link,
        quantity: qty,
      };

      if (isComment && commentContent.trim()) {
        payload.comments = commentContent;
      }

      if (note.trim()) {
        payload.note = note;
      }

      await api.post("/external/orders", payload);
      await refreshWallet();

      // Google Ads conversion
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-18064301149/338SCIymiZYcEN243aVD",
          value: Number(totalPrice || 0),
          currency: "VND",
          transaction_id: `external-${Date.now()}`,
        });
      }

      await showAlert({
        title: "Tạo đơn thành công!",
        icon: "success",
        content: `
    <div style="display:flex; flex-direction:column; gap:8px;">
      <div style="display:flex; justify-content:space-between; gap:16px;">
        <span style="color:rgba(255,255,255,0.68)">Giá gói</span>
        <b style="color:#60a5fa">${formatMoney(selectedPrice)}</b>
      </div>
      <div style="display:flex; justify-content:space-between; gap:16px;">
        <span style="color:rgba(255,255,255,0.68)">Tổng tiền</span>
        <b style="color:#f59e0b">${formatMoney(totalPrice)}</b>
      </div>
    </div>
  `,
      });


      setSelectedServiceId("");
      setQuantity("");
      setLink("");
      setNote("");
      setCommentContent("");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Tạo đơn thất bại";

      await showAlert({
        title: "Lỗi!",
        icon: "error",
        content: `<p>${errorMsg}</p>`,
      });
    } finally {
      setSubmitting(false);
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
          onClick={() => navigate("/services")}
          className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ChevronLeft size={16} />
          Quay lại
        </button>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-2xl border border-white/10 bg-[#08152d] p-4 sm:p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102345]">
                <Sparkles size={16} className="text-orange-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Tăng tương tác {current.label}
                </h2>
                <p className="mt-1 text-sm text-white/40">
                  Chọn loại dịch vụ rồi chọn gói thực tế.
                </p>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10">
                  <Wallet size={18} className="text-emerald-300" />
                </div>
                <div>
                  <div className="text-xs text-white/45">Số dư ví</div>
                  <div className="text-sm font-semibold text-emerald-300">
                    {loadingWallet ? "Đang tải..." : formatMoney(walletBalance)}
                  </div>
                </div>
              </div>

              <button
                onClick={refreshWallet}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
              >
                Làm mới
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#071122] px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                {current.icon}
              </div>
              <div className="text-sm font-medium text-white">{current.label}</div>
              <div className="ml-auto rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-300">
                Đã chọn
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Loại dịch vụ</label>

                <Listbox value={serviceType} onChange={handleChangeType}>
                  <div className="relative">
                    <Listbox.Button className={dropdownButtonClass(!!serviceType)}>
                      <span className="truncate pr-3">
                        {selectedTypeMeta?.name || "Chọn loại dịch vụ"}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-white/45" />
                    </Listbox.Button>

                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-1"
                    >
                      <Listbox.Options className={dropdownPanelClass()}>
                        <div className="max-h-80 overflow-y-auto p-2 md:p-3">
                          {current.serviceTypes.map((item) => (
                            <Listbox.Option
                              key={item.key}
                              value={item.key}
                              className={({ active }) =>
                                [
                                  "relative cursor-pointer rounded-xl border px-4 py-3.5 pr-10",
                                  "transition duration-150",
                                  active
                                    ? "border-[#2F80ED]/30 bg-[#2F80ED]/18 text-white"
                                    : "border-transparent text-white/80",
                                  serviceType === item.key ? "bg-[#2F80ED]/12 text-white" : "",
                                ].join(" ")
                              }
                            >
                              {({ active, selected }: { active: boolean; selected: boolean }) => (
                                <>
                                  <div className="font-medium text-sm md:text-[15px]">
                                    {item.name}
                                  </div>
                                  <div
                                    className={[
                                      "mt-1 text-xs md:text-[13px]",
                                      active || selected ? "text-white/70" : "text-white/45",
                                    ].join(" ")}
                                  >
                                    {item.hint}
                                  </div>

                                  {selected && (
                                    <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#60A5FA]" />
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </div>
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Gói dịch vụ</label>

                <Listbox
                  value={selectedServiceId}
                  onChange={setSelectedServiceId}
                  disabled={!serviceType}
                >
                  <div className="relative">
                    <Listbox.Button
                      className={dropdownButtonClass(!!selectedServiceId, !serviceType)}
                    >
                      <span className="truncate pr-3">
                        {!serviceType
                          ? "Chọn loại dịch vụ trước"
                          : loadingServices
                            ? "Đang tải dịch vụ..."
                            : selectedPackage
                              ? `#${selectedPackage.service} - ${selectedPackage.name}`
                              : "Chọn gói"}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-white/45" />
                    </Listbox.Button>

                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-1"
                    >
                      <Listbox.Options className={dropdownPanelClass()}>
                        <div className="max-h-80 overflow-y-auto p-2 md:p-3">
                          {!serviceType ? (
                            <div className="px-4 py-4 text-sm text-white/45">
                              Chọn loại dịch vụ trước
                            </div>
                          ) : filteredServices.length === 0 ? (
                            <div className="px-4 py-4 text-sm text-white/45">
                              {loadingServices ? "Đang tải dịch vụ..." : "Không có gói phù hợp"}
                            </div>
                          ) : (
                            filteredServices.map((item) => (
                              <Listbox.Option
                                key={item.service}
                                value={String(item.service)}
                                className={({ active }) =>
                                  [
                                    "relative cursor-pointer rounded-xl border px-4 py-3.5 pr-10",
                                    "transition duration-150",
                                    active
                                      ? "border-[#2F80ED]/30 bg-[#2F80ED]/18 text-white"
                                      : "border-transparent text-white/80",
                                    selectedServiceId === String(item.service)
                                      ? "bg-[#2F80ED]/12 text-white"
                                      : "",
                                  ].join(" ")
                                }
                              >
                                {({ active, selected }: { active: boolean; selected: boolean }) => (
                                  <>
                                    <div className="truncate text-sm font-medium md:text-[15px]">
                                      #{item.service} - {item.name}
                                    </div>

                                    <div className="mt-1.5 flex items-center justify-between gap-3 text-xs md:text-[13px]">
                                      <span
                                        className={
                                          active || selected
                                            ? "text-white/65"
                                            : "text-white/45"
                                        }
                                      >
                                        Min {item.min || "..."} • Max {item.max || "..."}
                                      </span>

                                      <span className="shrink-0 font-semibold text-emerald-300">
                                        {formatMoney(getDisplayPrice(item))}
                                      </span>
                                    </div>

                                    {selected && (
                                      <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#60A5FA]" />
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))
                          )}
                        </div>
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2 md:gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-white/70">Link</label>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={selectedTypeMeta?.hint || "Nhập link"}
                  className="h-[52px] w-full rounded-2xl border border-white/10 bg-[#071327]/90 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Số lượng</label>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={
                    selectedPackage?.min && selectedPackage?.max
                      ? `${selectedPackage.min} - ${selectedPackage.max}`
                      : "Nhập số lượng"
                  }
                  className="h-[52px] w-full rounded-2xl border border-white/10 bg-[#071327]/90 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#071327]/90 px-4 py-4">
                <div className="text-[11px] uppercase tracking-[0.15em] text-white/35">
                  Thông tin gói
                </div>
                <div className="mt-1 text-sm font-medium text-white">
                  {selectedPackage?.name || "Chưa chọn gói"}
                </div>
                <div className="mt-1 text-xs text-white/65">
                  Giá gói: {selectedPackage ? formatMoney(selectedPrice) : "Chưa có giá"}
                </div>
                <div className="mt-1 text-sm font-semibold text-emerald-300">
                  Tổng tiền:{" "}
                  {selectedPackage && Number(quantity) > 0
                    ? formatMoney(totalPrice)
                    : "..."}
                </div>
              </div>
            </div>

            {isComment && (
              <div className="mt-5 space-y-2">
                <label className="text-sm font-medium text-white/70">Nội dung comment</label>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Mỗi comment một dòng"
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-[#071327]/90 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
                />
              </div>
            )}

            <div className="mt-5 space-y-2">
              <label className="text-sm font-medium text-white/70">Ghi chú</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú thêm nếu có"
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-[#071327]/90 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-5 h-[52px] w-full rounded-2xl bg-[#2F80ED] text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? "Đang xử lý..." : "Tạo đơn"}
            </button>
          </div>

          <div className="rounded-2xl border border-orange-400/15 bg-[linear-gradient(180deg,rgba(255,149,0,0.06),rgba(255,149,0,0.02))] p-5">
            <div className="text-base font-semibold text-white">Thông tin đơn</div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="text-white/70">Số dư ví: {formatMoney(walletBalance)}</div>
              <div className="text-white/70">Nền tảng: {current.label}</div>
              <div className="text-white/70">Loại: {selectedTypeMeta?.name || "..."}</div>
              <div className="text-white/70">Gói: {selectedPackage?.name || "..."}</div>
              <div className="text-emerald-300">
                Giá: {selectedPackage ? formatMoney(selectedPrice) : "..."}
              </div>
              <div className="text-white/70">
                Min/Max:{" "}
                {selectedPackage
                  ? `${selectedPackage.min || "..."} / ${selectedPackage.max || "..."}`
                  : "..."}
              </div>
              <div className="break-all text-white/70">Link: {link || "..."}</div>
              <div className="text-white/70">Số lượng: {quantity || "..."}</div>
              <div className="text-emerald-300">
                Tổng tiền:{" "}
                {selectedPackage && Number(quantity) > 0 ? formatMoney(totalPrice) : "..."}
              </div>
              <div className="text-white/70">
                Trạng thái ví:{" "}
                {selectedPackage && Number(quantity) > 0 ? (
                  totalPrice <= walletBalance ? (
                    <span className="text-emerald-300">Đủ số dư</span>
                  ) : (
                    <span className="text-red-300">Không đủ số dư</span>
                  )
                ) : (
                  "..."
                )}
              </div>

              {selectedPackage?.desc && (
                <div className="whitespace-pre-line rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white/65">
                  {stripHtml(selectedPackage.desc)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}