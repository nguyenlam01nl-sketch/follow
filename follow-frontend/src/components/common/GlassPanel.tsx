import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
};

function GlassPanel({ children, className = "" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={[
        "relative w-full max-w-md overflow-hidden rounded-[28px]",
        "border border-white/15 bg-white/10 ring-1 ring-white/10",
        "backdrop-blur-2xl",
        "shadow-[0_20px_80px_rgba(0,0,0,0.45),0_0_40px_rgba(34,211,238,0.08)]",
        "before:pointer-events-none before:absolute before:inset-0",
        "before:bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.03)_35%,transparent_60%)]",
        className,
      ].join(" ")}
    >
      <div className="relative z-10 p-6 sm:p-7">{children}</div>
    </motion.div>
  );
}

export default GlassPanel;