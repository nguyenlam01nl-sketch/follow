type Props = {
  title: string;
  value: string;
  subtext: string;
  icon: string;
};

function StatCard({ title, value, subtext, icon }: Props) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-white/8 p-5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/50">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
          <p className="mt-2 text-sm text-white/45">{subtext}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;