import LogoSolaMark from "./LogoSolaMark";

type Props = {
  text?: string;
  fullScreen?: boolean;
};

function LoadingLogo({
  text = "Đang tải dữ liệu...",
  fullScreen = false,
}: Props) {
  const wrapperClass = fullScreen
    ? "fixed inset-0 z-[100] flex items-center justify-center bg-[#07111f]"
    : "flex items-center justify-center py-10";

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 scale-125 rounded-full bg-cyan-400/20 blur-2xl animate-pulse" />
          <LogoSolaMark
            size="lg"
            className="relative animate-[pulse_1.8s_ease-in-out_infinite]"
          />
        </div>

        <p className="mt-4 text-sm text-white/65">{text}</p>

        <div className="mt-3 h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 animate-[solaLoad_1.2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes solaLoad {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
      `}</style>
    </div>
  );
}

export default LoadingLogo;