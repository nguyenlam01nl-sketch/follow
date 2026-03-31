type Props = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "topbar" | "sidebar";
  className?: string;
};

const sizeMap = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

function LogoSola({
  size = "md",
  showText = true,
  variant = "default",
  className = "",
}: Props) {
  const imageSize = sizeMap[size];

  const textClass =
    variant === "topbar"
      ? "text-base sm:text-lg"
      : variant === "sidebar"
      ? "text-lg"
      : "text-lg";

  const subtitleClass =
    variant === "topbar"
      ? "text-[10px] tracking-[0.22em]"
      : "text-[10px] tracking-[0.24em]";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logo-sola.png"
        alt="Sola Vietnam"
        className={`${imageSize} w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.22)]`}
      />

      {showText && (
        <div className="min-w-0 leading-tight">
          <h2
            className={`truncate font-semibold tracking-[-0.02em] text-white ${textClass}`}
          >
            Sola Vietnam
          </h2>
          <p className={`mt-1 uppercase text-white/45 ${subtitleClass}`}>
            Digital Services
          </p>
        </div>
      )}
    </div>
  );
}

export default LogoSola;