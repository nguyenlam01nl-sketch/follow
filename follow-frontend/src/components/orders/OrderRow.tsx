import OrderStatusBadge from "./OrderStatusBadge";

type Props = {
  order: any;
};

function OrderRow({ order }: Props) {
  return (
    <div className="grid grid-cols-6 items-center gap-4 rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm">

      <div className="font-medium text-white">
        {order.id}
      </div>

      <div className="text-white/70">
        {order.service}
      </div>

      <div className="text-white/50 truncate">
        {order.link}
      </div>

      <div className="text-white">
        {order.quantity}
      </div>

      <div className="text-white">
        {order.price} VND
      </div>

      <div>
        <OrderStatusBadge status={order.status} />
      </div>
    </div>
  );
}

export default OrderRow;