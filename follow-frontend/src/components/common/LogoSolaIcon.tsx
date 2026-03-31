type Props = {
  size?: number;
  className?: string;
};

function LogoSolaIcon({ size = 40, className = "" }: Props) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-violet-500 text-white font-bold shadow-[0_0_25px_rgba(56,189,248,0.4)] ${className}`}
    >
      <span style={{ fontSize: size * 0.5 }}>S</span>
    </div>
  );
}

export default LogoSolaIcon;