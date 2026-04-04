type Props = {
  name: string;
  icon: string;
  onClick: () => void;
};

export default function CategoryCard({ name, icon, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded-3xl border border-white/12 bg-white/8 p-6 backdrop-blur-xl hover:bg-white/12 transition text-left"
    >
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{name}</h3>
    </button>
  );
}