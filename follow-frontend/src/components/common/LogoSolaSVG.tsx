type Props = {
  size?: number;
  className?: string;
};

function LogoSolaSVG({ size = 40, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="solaGradSafe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* nền */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="18"
        fill="#0f172a"
      />

      {/* chữ S */}
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="32"
        fontWeight="700"
        fill="url(#solaGradSafe)"
        fontFamily="Arial, sans-serif"
      >
        S
      </text>
    </svg>
  );
}

export default LogoSolaSVG;