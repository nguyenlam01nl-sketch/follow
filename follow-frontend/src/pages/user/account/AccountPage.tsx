import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/api/axios";

type ProfileState = {
  fullName: string;
  email: string;
  username: string;
  phone: string;
};

type PasswordState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function AccountPage() {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profile, setProfile] = useState<ProfileState>({
    fullName: "",
    email: "",
    username: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchMe = async () => {
    try {
      setLoadingProfile(true);

      const res = await api.get("/account");
      const user = res.data;

      setProfile({
        fullName: user?.name || "",
        email: user?.email || "",
        username: user?.username || "",
        phone: user?.phone || "",
      });
    } catch (error: any) {
      console.log("Lỗi load account:", error?.response?.data || error);

      Swal.fire({
        icon: "error",
        title: "Không tải được tài khoản",
        text: error?.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu",
        confirmButtonText: "Đóng",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.fullName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập họ và tên",
        confirmButtonText: "Đóng",
      });
      return;
    }

    if (!profile.email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập email",
        confirmButtonText: "Đóng",
      });
      return;
    }

    try {
      setSavingProfile(true);

      const res = await api.put("/account/profile", {
        full_name: profile.fullName,
        email: profile.email,
        username: profile.username || null,
        phone: profile.phone || null,
      });

      const user = res.data?.user;

      if (user) {
        setProfile({
          fullName: user?.name || "",
          email: user?.email || "",
          username: user?.username || "",
          phone: user?.phone || "",
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: res.data?.message || "Cập nhật thông tin thành công",
        confirmButtonText: "OK",
      });
    } catch (error: any) {
      console.log("Lỗi update profile:", error?.response?.data || error);

      const errors = error?.response?.data?.errors;
      let message = error?.response?.data?.message || "Cập nhật thất bại";

      if (errors) {
        const firstKey = Object.keys(errors)[0];
        if (firstKey && Array.isArray(errors[firstKey])) {
          message = errors[firstKey][0];
        }
      }

      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại",
        text: message,
        confirmButtonText: "Đóng",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đầy đủ các trường mật khẩu",
        confirmButtonText: "Đóng",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Mật khẩu quá ngắn",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự",
        confirmButtonText: "Đóng",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Không khớp",
        text: "Mật khẩu xác nhận không khớp",
        confirmButtonText: "Đóng",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Đổi mật khẩu?",
      text: "Bé có chắc muốn cập nhật mật khẩu mới không?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      setSavingPassword(true);

      const res = await api.put("/account/password", {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
        new_password_confirmation: passwordForm.confirmPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: res.data?.message || "Đổi mật khẩu thành công",
        confirmButtonText: "OK",
      });
    } catch (error: any) {
      console.log("Lỗi đổi mật khẩu:", error?.response?.data || error);

      const errors = error?.response?.data?.errors;
      let message = error?.response?.data?.message || "Đổi mật khẩu thất bại";

      if (errors) {
        const firstKey = Object.keys(errors)[0];
        if (firstKey && Array.isArray(errors[firstKey])) {
          message = errors[firstKey][0];
        }
      }

      Swal.fire({
        icon: "error",
        title: "Đổi mật khẩu thất bại",
        text: message,
        confirmButtonText: "Đóng",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 px-2.5 sm:px-4">
        <div>
          <h1 className="text-base font-semibold text-white sm:text-lg">
            Tài khoản
          </h1>
          <p className="text-[11px] text-white/50 sm:text-xs">
            Quản lý thông tin cá nhân và bảo mật tài khoản
          </p>
        </div>

        <div className="grid gap-3 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            <div className="rounded-[18px] border border-white/10 bg-white/5 p-3 sm:rounded-[20px] sm:p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-sm font-bold text-white sm:h-14 sm:w-14 sm:text-base">
                  {profile.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-white sm:text-base">
                    {loadingProfile
                      ? "Đang tải..."
                      : profile.fullName || "Người dùng"}
                  </h2>
                  <p className="truncate text-[11px] text-white/50 sm:text-xs">
                    {loadingProfile
                      ? "Đang tải dữ liệu..."
                      : profile.email || "Chưa có email"}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <span className="text-white/55">Vai trò</span>
                  <span className="text-white">User</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <span className="text-white/55">Username</span>
                  <span className="max-w-[60%] truncate text-right text-white">
                    {loadingProfile
                      ? "Đang tải..."
                      : profile.username || "Chưa cập nhật"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <span className="text-white/55">Số điện thoại</span>
                  <span className="max-w-[60%] truncate text-right text-white">
                    {loadingProfile
                      ? "Đang tải..."
                      : profile.phone || "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <form
              onSubmit={handleSaveProfile}
              className="rounded-[18px] border border-white/10 bg-white/5 p-3 sm:rounded-[20px] sm:p-4 backdrop-blur-xl"
            >
              <p className="text-[11px] text-white/45 sm:text-xs">
                Profile settings
              </p>
              <h2 className="mt-1 text-sm font-semibold text-white sm:text-base">
                Cập nhật thông tin
              </h2>

              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-[11px] text-white/60 sm:text-xs">
                    Họ và tên
                  </label>
                  <input
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    disabled={loadingProfile || savingProfile}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-white/60 sm:text-xs">
                    Email
                  </label>
                  <input
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled={loadingProfile || savingProfile}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-white/60 sm:text-xs">
                    Username
                  </label>
                  <input
                    name="username"
                    value={profile.username}
                    onChange={handleProfileChange}
                    disabled={loadingProfile || savingProfile}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-white/60 sm:text-xs">
                    Số điện thoại
                  </label>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    disabled={loadingProfile || savingProfile}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingProfile || savingProfile}
                className="mt-4 h-10 w-full rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingProfile
                  ? "Đang tải..."
                  : savingProfile
                  ? "Đang lưu..."
                  : "Lưu thông tin"}
              </button>
            </form>

            <form
              onSubmit={handleChangePassword}
              className="rounded-[18px] border border-white/10 bg-white/5 p-3 sm:rounded-[20px] sm:p-4 backdrop-blur-xl"
            >
              <p className="text-[11px] text-white/45 sm:text-xs">Security</p>
              <h2 className="mt-1 text-sm font-semibold text-white sm:text-base">
                Đổi mật khẩu
              </h2>

              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-[11px] text-white/60 sm:text-xs">
                    Mật khẩu cũ
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    disabled={savingPassword || loadingProfile}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-white/60 sm:text-xs">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    disabled={savingPassword || loadingProfile}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-white/60 sm:text-xs">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    disabled={savingPassword || loadingProfile}
                    className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPassword || loadingProfile}
                className="mt-4 h-10 w-full rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingProfile
                  ? "Đang tải..."
                  : savingPassword
                  ? "Đang cập nhật..."
                  : "Cập nhật mật khẩu"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AccountPage;