type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

function LogoSolaMark({ size = "md", className = "" }: Props) {
  return (
    <img
      src="/logo-sola.png"
      alt="Sola Vietnam"
      className={`${sizeMap[size]} w-auto object-contain ${className}`}
    />
  );
}

export default LogoSolaMark;