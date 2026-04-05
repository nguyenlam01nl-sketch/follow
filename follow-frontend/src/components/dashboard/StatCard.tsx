type Props = {
  title: string;
  value: string;
  subtext: string;
  icon: string;
};

function StatCard({ title, value, subtext, icon }: Props) {
  return (
    <div className="h-full w-full rounded-xl border border-white/12 bg-white/8 p-3 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.18)] sm:rounded-2xl sm:p-4">
      <div className="flex items-start justify-between gap-2.5 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] text-white/50 sm:text-xs">{title}</p>

          <h3 className="mt-2 break-words text-lg font-semibold leading-tight text-white sm:mt-3 sm:text-2xl">
            {value}
          </h3>

          <p className="mt-1.5 text-[11px] leading-4 text-white/45 sm:mt-2 sm:text-xs sm:leading-5">
            {subtext}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/10 text-base sm:h-11 sm:w-11 sm:rounded-2xl sm:text-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;