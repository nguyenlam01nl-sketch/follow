import GlassPanel from "../common/GlassPanel";
import Logo from "../common/Logo";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

function AuthCard({ title, subtitle, children }: Props) {
  return (
    <GlassPanel>
      <Logo />

      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/60">{subtitle}</p>
      </div>

      {children}
    </GlassPanel>
  );
}

export default AuthCard;