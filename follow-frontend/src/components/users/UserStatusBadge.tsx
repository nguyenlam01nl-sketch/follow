type Props = {
  status: "active" | "banned";
};

function UserStatusBadge({ status }: Props) {
  return (
    <span
      className={`px-3 py-1 text-xs rounded-full border ${
        status === "active"
          ? "bg-emerald-300/10 text-emerald-200 border-emerald-300/20"
          : "bg-red-300/10 text-red-200 border-red-300/20"
      }`}
    >
      {status === "active" ? "Hoạt động" : "Bị khoá"}
    </span>
  );
}

export default UserStatusBadge;