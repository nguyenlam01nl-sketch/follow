import UserStatusBadge from "./UserStatusBadge";

type User = {
  id: number;
  name: string;
  email: string;
  balance: number;
  status: "active" | "banned";
  role: "admin" | "user";
};

type Props = {
  user: User;
  onToggle: (id: number) => void;
};

function UserRow({ user, onToggle }: Props) {
  return (
    <div className="grid grid-cols-6 items-center gap-4 rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm">

      <div className="text-white font-medium">
        {user.name}
      </div>

      <div className="text-white/60">
        {user.email}
      </div>

      <div className="text-white">
        {user.balance.toLocaleString()}đ
      </div>

      <div>
        <UserStatusBadge status={user.status} />
      </div>

      <div className="text-white/60">
        {user.role}
      </div>

      <div>
        <button
          onClick={() => onToggle(user.id)}
          className="text-xs text-cyan-300 hover:underline"
        >
          {user.status === "active" ? "Khoá" : "Mở khoá"}
        </button>
      </div>

    </div>
  );
}

export default UserRow;