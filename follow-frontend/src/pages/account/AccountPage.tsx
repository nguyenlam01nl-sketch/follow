import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function AccountPage() {
  const [profile, setProfile] = useState({
    fullName: "Nguyễn Lam",
    email: "lam@gmail.com",
    username: "nguyenlam",
    phone: "0901234567",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile:", profile);
    alert("Đã lưu thông tin");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    console.log("Password:", passwordForm);
    alert("Đổi mật khẩu thành công");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Tài khoản</h1>
          <p className="text-sm text-white/50">
            Quản lý thông tin cá nhân và bảo mật tài khoản
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-xl font-bold text-white">
                  L
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Nguyễn Lam
                  </h2>
                  <p className="text-sm text-white/50">lam@gmail.com</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                  <span className="text-white/55">Vai trò</span>
                  <span className="text-white">User</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                  <span className="text-white/55">Ngày tham gia</span>
                  <span className="text-white">21/03/2026</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                  <span className="text-white/55">Số dư</span>
                  <span className="font-semibold text-emerald-300">
                    12,500,000đ
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl">
              <p className="text-sm text-white/45">Giao dịch gần đây</p>
              <h2 className="mt-1 text-lg font-semibold text-white">
                Hoạt động gần nhất
              </h2>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                  <p className="text-sm font-medium text-white">
                    Nạp tiền Techcombank
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    +500,000đ • 21/03/2026
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                  <p className="text-sm font-medium text-white">
                    Mua dịch vụ Instagram Follow
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    -120,000đ • 20/03/2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <form
              onSubmit={handleSaveProfile}
              className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl"
            >
              <p className="text-sm text-white/45">Profile settings</p>
              <h2 className="mt-1 text-lg font-semibold text-white">
                Cập nhật thông tin
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm text-white/60">Họ và tên</label>
                  <input
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60">Email</label>
                  <input
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60">Username</label>
                  <input
                    name="username"
                    value={profile.username}
                    onChange={handleProfileChange}
                    className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60">Số điện thoại</label>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-5 h-12 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 text-sm font-semibold text-white"
              >
                Lưu thông tin
              </button>
            </form>

            <form
              onSubmit={handleChangePassword}
              className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl"
            >
              <p className="text-sm text-white/45">Security</p>
              <h2 className="mt-1 text-lg font-semibold text-white">
                Đổi mật khẩu
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm text-white/60">Mật khẩu cũ</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60">Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-5 h-12 w-full rounded-2xl border border-white/12 bg-white/10 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                Cập nhật mật khẩu
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AccountPage;