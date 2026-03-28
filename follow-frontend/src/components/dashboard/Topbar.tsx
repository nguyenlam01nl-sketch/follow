function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-white/5 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-white/45">Overview</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/60 md:block">
            Xin chào, Nguyễn Lam
          </div>

          <button className="rounded-2xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/75 transition hover:bg-white/12 hover:text-white">
            Thông báo
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;