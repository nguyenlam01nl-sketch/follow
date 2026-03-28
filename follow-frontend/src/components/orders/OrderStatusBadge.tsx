type Props = {
  status: "pending" | "processing" | "completed" | "failed";
};

function OrderStatusBadge({ status }: Props) {
  const map = {
    pending: "bg-amber-300/10 text-amber-200 border-amber-300/20",
    processing: "bg-sky-300/10 text-sky-200 border-sky-300/20",
    completed: "bg-emerald-300/10 text-emerald-200 border-emerald-300/20",
    failed: "bg-red-300/10 text-red-200 border-red-300/20",
  };

  const label = {
    pending: "Chờ xử lý",
    processing: "Đang chạy",
    completed: "Hoàn thành",
    failed: "Thất bại",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs ${map[status]}`}
    >
      {label[status]}
    </span>
  );
}

export default OrderStatusBadge;