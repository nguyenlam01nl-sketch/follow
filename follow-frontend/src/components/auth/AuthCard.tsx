type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

function AuthCard({ title, subtitle, children }: Props) {
  return (
    <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-6">
      <div className="mb-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
            <svg
              width="40"
              height="40"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="authCardSGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>

              <rect x="4" y="4" width="56" height="56" rx="18" fill="#0f172a" />

              <text
                x="50%"
                y="54%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="32"
                fontWeight="700"
                fill="url(#authCardSGradient)"
                fontFamily="Arial, sans-serif"
              >
                S
              </text>
            </svg>
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl">
              Sola Vietnam
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/45">
              Digital Services
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

export default AuthCard;