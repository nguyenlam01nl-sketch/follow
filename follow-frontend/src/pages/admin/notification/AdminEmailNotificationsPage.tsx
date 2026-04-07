import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import {
  BellRing,
  Send,
  FileText,
  Type,
  Link as LinkIcon,
  Megaphone,
} from "lucide-react";

type CreateNotificationResponse = {
  message?: string;
  data?: {
    id: number;
    title: string;
    content: string;
    link?: string | null;
    created_at?: string;
  };
};

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    link: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateNotificationResponse["data"] | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    setForm({
      title: "",
      content: "",
      link: "",
    });
    setResult(null);
    setSuccessMessage("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      setResult(null);

      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        link: form.link.trim() || null,
      };

      const res = await api.post<CreateNotificationResponse>(
        "/admin/notifications",
        payload
      );

      setSuccessMessage(res.data?.message || "Tạo thông báo thành công.");
      setResult(res.data?.data || null);

      setForm({
        title: "",
        content: "",
        link: "",
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không thể tạo thông báo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        <div className="border-b border-white/6 pb-3 sm:pb-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 sm:text-xs sm:tracking-[0.24em]">
            Admin &nbsp; &gt; &nbsp; Notifications
          </div>
        </div>

        <section className="rounded-[22px] border border-white/10 bg-[#08152d] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] sm:h-14 sm:w-14">
                <BellRing size={24} className="text-cyan-300 sm:h-7 sm:w-7" />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[30px]">
                  TẠO THÔNG BÁO
                </h1>
                <p className="mt-1 text-xs text-white/35 sm:mt-2 sm:text-sm">
                  Tạo thông báo hiển thị trực tiếp cho người dùng trong dashboard.
                </p>
              </div>
            </div>

            <div className="self-start rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-cyan-200 sm:px-4 sm:text-xs">
              In-App Notification
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-[22px] border border-white/10 bg-[#08152d] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="mb-2 block text-xs text-white/55 sm:text-sm">
                    Tiêu đề thông báo
                  </label>
                  <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-[#071226] px-3 sm:h-12 sm:px-4 lg:h-14">
                    <Type
                      size={16}
                      className="shrink-0 text-white/35 sm:h-[18px] sm:w-[18px]"
                    />
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Ví dụ: Ưu đãi nạp ví hôm nay"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25 sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/55 sm:text-sm">
                    Nội dung thông báo
                  </label>
                  <div className="rounded-2xl border border-white/10 bg-[#071226] p-3 sm:p-4">
                    <div className="mb-3 flex items-center gap-2 text-white/35">
                      <FileText size={16} />
                      <span className="text-xs sm:text-sm">
                        Nội dung ngắn gọn, rõ ràng
                      </span>
                    </div>

                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      rows={8}
                      placeholder="Nhập nội dung muốn hiển thị cho người dùng..."
                      className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/25 sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/55 sm:text-sm">
                    Link điều hướng (không bắt buộc)
                  </label>
                  <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-[#071226] px-3 sm:h-12 sm:px-4 lg:h-14">
                    <LinkIcon
                      size={16}
                      className="shrink-0 text-white/35 sm:h-[18px] sm:w-[18px]"
                    />
                    <input
                      type="text"
                      name="link"
                      value={form.link}
                      onChange={handleChange}
                      placeholder="Ví dụ: /wallet hoặc https://zalo.me/..."
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25 sm:text-base"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-[20px] border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-[20px] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                    {successMessage}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.08] disabled:opacity-50 sm:h-12 sm:px-6 sm:text-base"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-50 sm:h-12 sm:px-6 sm:text-base"
                  >
                    <Send size={16} />
                    {loading ? "Đang tạo..." : "Tạo thông báo"}
                  </button>
                </div>
              </form>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[22px] border border-white/10 bg-[#08152d] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05]">
                  <Megaphone size={20} className="text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white sm:text-xl">
                    Hướng dẫn
                  </h2>
                  <p className="mt-1 text-xs text-white/35 sm:text-sm">
                    Có thể tạo thông báo thường hoặc thông báo có link điều hướng.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4 text-sm leading-7 text-white/75">
                  Nếu nhập link ngoài như <span className="text-cyan-300">https://...</span> thì người dùng bấm sẽ mở tab mới.
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4 text-sm leading-7 text-white/75">
                  Nếu nhập link trong web như <span className="text-cyan-300">/wallet</span> hoặc <span className="text-cyan-300">/orders</span> thì sẽ điều hướng trong app.
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4 text-sm leading-7 text-white/75">
                  Nếu để trống link thì thông báo chỉ hiển thị nội dung, không có hành động bấm.
                </div>
              </div>
            </section>

            <section className="rounded-[22px] border border-white/10 bg-[#08152d] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
              <h2 className="text-lg font-bold text-white sm:text-xl">
                Xem trước
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl border border-white/10 bg-[#071226] p-4"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                  Preview
                </p>

                <h3 className="mt-2 text-base font-bold text-white sm:text-lg">
                  {form.title.trim() || "Tiêu đề thông báo"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  {form.content.trim() || "Nội dung thông báo sẽ hiển thị ở đây."}
                </p>

                {form.link.trim() && (
                  <div className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-medium text-cyan-200">
                    {form.link.trim()}
                  </div>
                )}

                {result && (
                  <p className="mt-4 text-[11px] text-emerald-300">
                    Đã tạo thông báo thành công.
                  </p>
                )}
              </motion.div>
            </section>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}