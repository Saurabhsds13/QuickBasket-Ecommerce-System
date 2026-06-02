import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/api";
import { Package, ChevronDown, ChevronUp, Clock, Truck, CheckCircle, XCircle, ShoppingBag } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock, dotColor: "bg-yellow-500" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle, dotColor: "bg-blue-500" },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Truck, dotColor: "bg-purple-500" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle, dotColor: "bg-green-500" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, dotColor: "bg-red-500" },
};

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const itemCount = order.items?.length || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Order Header */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left - Order info */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {/* Right - Price and expand */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">₹{order.total?.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total amount</p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
              aria-label={expanded ? "Collapse order" : "Expand order"}
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Order Items - Expandable */}
      {expanded && order.items && order.items.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-5 sm:px-6 py-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Order Items</p>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl p-3 border border-gray-100">
                <img
                  src={item.productImage ? `${API_BASE_URL}${item.productImage}` : "/fallback-product.png"}
                  alt={item.productName}
                  className="w-16 h-16 object-contain rounded-lg bg-gray-50 p-1"
                  onError={(e) => { e.target.src = "/fallback-product.png"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{item.productName}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                  ₹{item.price?.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-500">Order Total</span>
            <span className="font-bold text-gray-900">₹{order.total?.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Progress bar for non-cancelled/delivered orders */}
      {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
        <div className="px-5 sm:px-6 pb-4">
          <div className="flex items-center gap-1 mt-2">
            {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"].map((step, idx) => {
              const steps = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
              const currentIdx = steps.indexOf(order.status);
              const isCompleted = idx <= currentIdx;
              return (
                <div key={step} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-colors ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-gray-400">Placed</span>
            <span className="text-[10px] text-gray-400">Confirmed</span>
            <span className="text-[10px] text-gray-400">Shipped</span>
            <span className="text-[10px] text-gray-400">Delivered</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">
              {orders.length} {orders.length === 1 ? "order" : "orders"} placed
            </p>
          </div>
          <button
            onClick={() => navigate("/AllProducts")}
            className="hidden sm:flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition text-sm font-medium"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop More
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate("/AllProducts")}
              className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition font-semibold"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
