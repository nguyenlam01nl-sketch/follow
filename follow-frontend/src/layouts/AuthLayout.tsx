import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

function AuthLayout({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_30%),linear-gradient(135deg,#07111f_0%,#0a1630_45%,#081120_100%)]" />

      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-120px] top-[-120px] -z-10 h-[320px] w-[320px] rounded-full bg-cyan-400/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -25, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-140px] right-[-100px] -z-10 h-[360px] w-[360px] rounded-full bg-fuchsia-500/20 blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.45, 0.7, 0.45],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 -z-10 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="hidden px-10 py-12 lg:flex lg:items-center"
        >
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
              <span className="text-sm text-white/80">Liquid Glass UI</span>
            </div>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight xl:text-6xl">
              Follow services
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent">
                dashboard platform
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-white/65 xl:text-lg">
              Website bán follow, dame, mở account và nhiều dịch vụ số khác với
              giao diện hiện đại, cảm giác premium và dễ scale về sau.
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-xl">
                <p className="text-2xl font-semibold text-white">24/7</p>
                <p className="mt-1 text-sm text-white/55">Hoạt động</p>
              </div>

              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-xl">
                <p className="text-2xl font-semibold text-white">Fast</p>
                <p className="mt-1 text-sm text-white/55">Xử lý đơn</p>
              </div>

              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-xl">
                <p className="text-2xl font-semibold text-white">Secure</p>
                <p className="mt-1 text-sm text-white/55">Auth system</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;