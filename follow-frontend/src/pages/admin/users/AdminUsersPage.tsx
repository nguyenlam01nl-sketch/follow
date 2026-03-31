import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";
import { Search, UserRound, Trash2, Lock, Unlock, Eye } from "lucide-react";

type UserItem = {
  id: number;
  name: string;
  username: string | null;
  email: string;
  phone?: string | null;
  role: "admin" | "user" | string;
  status?: "active" | "blocked" | string;
  balance?: number | string;
  created_at?: string;
  updated_at?: string;
};

type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

function formatMoney(value?: string | number) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0 VND";
  return `${num.toLocaleString("vi-VN")} VND`;
}

function formatDate(value?: string) {
  if (!value) return "--";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("vi-VN");
}

function getRoleLabel(role?: string) {
  return role === "admin" ? "Admin" : "User";
}

function getStatusLabel(status?: string) {
  return status === "blocked" ? "Đã khóa" : "Hoạt động";
}

function getRoleClass(role?: string) {
  return role === "admin"
    ? "border-violet-400/20 bg-violet-400/10 text-violet-200"
    : "border-sky-400/20 bg-sky-400/10 text-sky-200";
}

function getStatusClass(status?: string) {
  return status === "blocked"
    ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
    : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [items, setItems] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get<PaginatedResponse<UserItem>>("/admin/users", {
        params: {
          search,
          role,
          status,
          page,
        },
      });

      setItems(res.data.data || []);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        per_page: res.data.per_page,
        total: res.data.total,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được danh sách người dùng");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role, status, page]);

  const totalPages = useMemo(() => {
    return Math.max(1, pagination.last_page || 1);
  }, [pagination.last_page]);

  const handleSearch = () => {
    setPage(1);
    setSearch(keyword.trim());
  };

  const handleReset = () => {
    setKeyword("");
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
  };

  const updateUser = async (
    id: number,
    payload: Partial<Pick<UserItem, "role" | "status">>
  ) => {
    try {
      setActionLoadingId(id);
      await api.patch(`/admin/users/${id}`, payload);
      await fetchUsers();

      if (selectedUser?.id === id) {
        setSelectedUser((prev) => (prev ? { ...prev, ...payload } : prev));
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Cập nhật user thất bại");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (user: UserItem) => {
    const ok = window.confirm(`Bạn có chắc muốn xóa user "${user.name}" không?`);
    if (!ok) return;

    try {
      setActionLoadingId(user.id);
      await api.delete(`/admin/users/${user.id}`);

      if (selectedUser?.id === user.id) {
        setSelectedUser(null);
      }

      if (items.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchUsers();
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Xóa user thất bại");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        <div className="border-b border-white/6 pb-3 sm:pb-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 sm:text-xs sm:tracking-[0.24em]">
            Admin &nbsp; &gt; &nbsp; Users
          </div>
        </div>

        <section className="rounded-[22px] border border-white/10 bg-[#08152d] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] sm:h-14 sm:w-14">
                <UserRound size={24} className="text-cyan-300 sm:h-7 sm:w-7" />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[30px]">
                  QUẢN LÝ NGƯỜI DÙNG
                </h1>
                <p className="mt-1 text-xs text-white/35 sm:mt-2 sm:text-sm">
                  Quản lý tài khoản và trạng thái hoạt động của người dùng.
                </p>
              </div>
            </div>

            <div className="self-start rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-cyan-200 sm:px-4 sm:text-xs">
              {pagination.total} người dùng
            </div>
          </div>
        </section>

        <section className="rounded-[22px] border border-white/10 bg-[#08152d] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.7fr)_200px_200px_auto_auto] lg:gap-4">
            <div>
              <label className="mb-2 block text-xs text-white/55 sm:text-sm">Tìm kiếm</label>
              <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-[#071226] px-3 sm:h-12 sm:px-4 lg:h-14">
                <Search size={16} className="shrink-0 text-white/35 sm:h-[18px] sm:w-[18px]" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="Tên, username hoặc email..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25 sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs text-white/55 sm:text-sm">Quyền</label>
              <select
                value={role}
                onChange={(e) => {
                  setPage(1);
                  setRole(e.target.value);
                }}
                className="h-11 w-full rounded-2xl border border-white/10 bg-[#071226] px-3 text-sm text-white outline-none sm:h-12 sm:px-4 sm:text-base lg:h-14"
              >
                <option value="">Tất cả quyền</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs text-white/55 sm:text-sm">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
                className="h-11 w-full rounded-2xl border border-white/10 bg-[#071226] px-3 text-sm text-white outline-none sm:h-12 sm:px-4 sm:text-base lg:h-14"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="blocked">Đã khóa</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="h-11 rounded-2xl bg-violet-500 px-5 text-sm font-semibold text-white transition hover:bg-violet-400 sm:h-12 sm:px-6 sm:text-base lg:mt-[28px] lg:h-14"
            >
              Tìm
            </button>

            <button
              onClick={handleReset}
              className="h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.08] sm:h-12 sm:px-6 sm:text-base lg:mt-[28px] lg:h-14"
            >
              Reset
            </button>
          </div>
        </section>

        <section className="rounded-[22px] border border-white/10 bg-[#08152d] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
          {loading && (
            <div className="rounded-[20px] border border-white/10 bg-[#071226] p-5 text-sm text-white/60 sm:rounded-[24px] sm:p-6">
              Đang tải danh sách người dùng...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-[20px] border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-200 sm:rounded-[24px] sm:p-6">
              {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="rounded-[20px] border border-white/10 bg-[#071226] p-5 text-sm text-white/60 sm:rounded-[24px] sm:p-6">
              Không có dữ liệu người dùng.
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <>
              <div className="mb-4 hidden grid-cols-[64px_2.3fr_3.1fr_140px_100px_120px_220px] gap-4 px-3 text-xs uppercase tracking-[0.18em] text-white/28 xl:grid">
                <div>ID</div>
                <div>Người dùng</div>
                <div>Liên hệ</div>
                <div>Số dư</div>
                <div>Quyền</div>
                <div>Trạng thái</div>
                <div className="text-right">Thao tác</div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {items.map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-[20px] border border-white/8 bg-[#071226] p-3 sm:rounded-[22px] sm:p-4"
                  >
                    <div className="xl:hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-sm text-white/45">#{user.id}</span>
                            <span className="text-base font-bold text-white">{user.name}</span>
                          </div>

                          <div className="mt-2 break-all text-sm text-white/75">
                            {user.email}
                          </div>

                          <div className="mt-2 text-sm text-white/75">
                            {formatMoney(user.balance)}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${getRoleClass(
                                user.role
                              )}`}
                            >
                              {getRoleLabel(user.role)}
                            </span>

                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${getStatusClass(
                                user.status
                              )}`}
                            >
                              {getStatusLabel(user.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/[0.08]"
                        >
                          <Eye size={14} />
                          Chi tiết
                        </button>

                        <button
                          disabled={actionLoadingId === user.id}
                          onClick={() =>
                            updateUser(user.id, {
                              status: user.status === "blocked" ? "active" : "blocked",
                            })
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/20 disabled:opacity-50"
                        >
                          {user.status === "blocked" ? <Unlock size={14} /> : <Lock size={14} />}
                          {user.status === "blocked" ? "Mở khóa" : "Khóa"}
                        </button>

                        <button
                          disabled={actionLoadingId === user.id}
                          onClick={() => handleDelete(user)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-400/20 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          Xóa
                        </button>
                      </div>
                    </div>

                    <div className="hidden xl:grid xl:grid-cols-[64px_2.3fr_3.1fr_140px_100px_120px_220px] xl:items-center xl:gap-4">
                      <div className="text-sm text-white/45">#{user.id}</div>

                      <div className="min-w-0">
                        <div className="text-[17px] font-bold leading-7 text-white">
                          {user.name}
                        </div>
                        <div className="mt-1 text-sm text-white/35">
                          {user.username || "--"}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="min-w-0 text-sm text-white/75 break-all">
                          {user.email}
                        </div>
                      </div>

                      <div className="whitespace-nowrap text-sm text-white/75">
                        {formatMoney(user.balance)}
                      </div>

                      <div>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${getRoleClass(
                            user.role
                          )}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </div>

                      <div>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${getStatusClass(
                            user.status
                          )}`}
                        >
                          {getStatusLabel(user.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/[0.08]"
                        >
                          <Eye size={14} />
                          Chi tiết
                        </button>

                        <button
                          disabled={actionLoadingId === user.id}
                          onClick={() =>
                            updateUser(user.id, {
                              status: user.status === "blocked" ? "active" : "blocked",
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/20 disabled:opacity-50"
                        >
                          {user.status === "blocked" ? <Unlock size={14} /> : <Lock size={14} />}
                          {user.status === "blocked" ? "Mở khóa" : "Khóa"}
                        </button>

                        <button
                          disabled={actionLoadingId === user.id}
                          onClick={() => handleDelete(user)}
                          className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-400/20 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-white/8 pt-4 sm:mt-6 sm:gap-4 sm:pt-5 md:flex-row md:items-center md:justify-between">
                <div className="text-xs text-white/40 sm:text-sm">
                  Trang {pagination.current_page} / {totalPages} · Tổng {pagination.total} người dùng
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.current_page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition hover:bg-white/[0.08] disabled:opacity-40"
                  >
                    Trước
                  </button>

                  <div className="rounded-full border border-white/10 bg-[#071226] px-4 py-2 text-sm text-white">
                    {pagination.current_page}
                  </div>

                  <button
                    disabled={pagination.current_page >= totalPages}
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition hover:bg-white/[0.08] disabled:opacity-40"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-2xl rounded-[24px] border border-white/10 bg-[#08152d] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:rounded-[28px] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/35 sm:text-xs">
                    User Detail
                  </div>
                  <h2 className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                    {selectedUser.name}
                  </h2>
                  <p className="mt-1 text-sm text-white/35">ID: #{selectedUser.id}</p>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 hover:bg-white/[0.08]"
                >
                  Đóng
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
                    Username
                  </div>
                  <div className="mt-2 break-all text-sm text-white">
                    {selectedUser.username || "--"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
                    Email
                  </div>
                  <div className="mt-2 break-all text-sm text-white">
                    {selectedUser.email}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
                    Số điện thoại
                  </div>
                  <div className="mt-2 text-sm text-white">
                    {selectedUser.phone || "--"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
                    Số dư
                  </div>
                  <div className="mt-2 text-sm text-white">
                    {formatMoney(selectedUser.balance)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
                    Quyền
                  </div>
                  <div className="mt-2 text-sm text-white">
                    {getRoleLabel(selectedUser.role)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
                    Trạng thái
                  </div>
                  <div className="mt-2 text-sm text-white">
                    {getStatusLabel(selectedUser.status)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#071226] p-4 sm:col-span-2">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
                    Ngày tạo
                  </div>
                  <div className="mt-2 text-sm text-white">
                    {formatDate(selectedUser.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}