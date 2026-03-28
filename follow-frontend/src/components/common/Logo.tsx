function Logo() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 font-bold text-white shadow-[0_10px_30px_rgba(34,211,238,0.35)]">
        F
        <div className="absolute inset-0 rounded-2xl border border-white/20" />
      </div>

      <div>
        <h2 className="text-lg font-semibold tracking-wide text-white">
          Follow Market
        </h2>
        <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
          Services dashboard
        </p>
      </div>
    </div>
  );
}

export default Logo;