import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyOrders, cancelOrder, createReturnRequest, getReturnByOrderId } from "../services/api";
import { Package, ChevronRight, X, AlertTriangle, RotateCcw, FileText } from "lucide-react";
import { useToast } from "../components/Toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const statusConfig = {
  PENDING: { label: "In Progress", dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  CONFIRMED: { label: "Confirmed", dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  SHIPPED: { label: "Shipped", dot: "bg-purple-500", text: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  DELIVERED: { label: "Delivered", dot: "bg-green-600", text: "text-green-700", bg: "bg-green-50 border-green-200" },
  CANCELLED: { label: "Cancelled", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const filterTabs = [
  { key: "ALL", label: "All" },
  { key: "ACTIVE", label: "In Progress" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

const cancellationReasons = [
  "I want to add more items",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "Delivery is taking too long",
  "Changed my mind",
  "Other",
];

const returnReasons = [
  "Product is damaged or defective",
  "Wrong item received",
  "Product doesn't match description",
  "Quality not as expected",
  "Changed my mind",
  "Other",
];

// Modal Shell
function ModalShell({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

// Cancel Modal
function CancelOrderModal({ isOpen, onClose, onConfirm, orderId }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    const reason = selectedReason === "Other" ? customReason : selectedReason;
    if (!reason.trim()) return;
    setSubmitting(true);
    await onConfirm(orderId, reason);
    setSubmitting(false);
    onClose();
    setSelectedReason("");
    setCustomReason("");
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose}>
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="text-[15px] font-semibold text-gray-900">Cancel Order #{orderId}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition"><X className="w-4 h-4 text-gray-400" /></button>
      </div>
      <div className="p-6 space-y-3">
        {cancellationReasons.map((reason) => (
          <label key={reason} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all text-sm ${selectedReason === reason ? "border-red-300 bg-red-50/50" : "border-gray-150 hover:bg-gray-50"}`}>
            <input type="radio" name="cancelReason" value={reason} checked={selectedReason === reason} onChange={(e) => setSelectedReason(e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-500" />
            <span className="text-gray-700">{reason}</span>
          </label>
        ))}
        {selectedReason === "Other" && (
          <textarea value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Please specify..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-red-300" rows={3} />
        )}
      </div>
      <div className="p-6 pt-3 border-t border-gray-100 flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition">Keep Order</button>
        <button onClick={handleConfirm} disabled={!selectedReason.trim() || (selectedReason === "Other" && !customReason.trim()) || submitting} className="flex-1 py-3 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition disabled:opacity-50">
          {submitting ? "Cancelling..." : "Cancel Order"}
        </button>
      </div>
    </ModalShell>
  );
}

// Return Modal
function ReturnRequestModal({ isOpen, onClose, onConfirm, orderId }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    const reason = selectedReason === "Other" ? customReason : selectedReason;
    if (!reason.trim()) return;
    setSubmitting(true);
    await onConfirm(orderId, reason);
    setSubmitting(false);
    onClose();
    setSelectedReason("");
    setCustomReason("");
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose}>
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
            <RotateCcw className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="text-[15px] font-semibold text-gray-900">Return Order #{orderId}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition"><X className="w-4 h-4 text-gray-400" /></button>
      </div>
      <div className="p-6 space-y-3">
        {returnReasons.map((reason) => (
          <label key={reason} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all text-sm ${selectedReason === reason ? "border-orange-300 bg-orange-50/50" : "border-gray-150 hover:bg-gray-50"}`}>
            <input type="radio" name="returnReason" value={reason} checked={selectedReason === reason} onChange={(e) => setSelectedReason(e.target.value)} className="w-4 h-4 text-orange-600 focus:ring-orange-500" />
            <span className="text-gray-700">{reason}</span>
          </label>
        ))}
        {selectedReason === "Other" && (
          <textarea value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Describe the issue..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-orange-300" rows={3} />
        )}
      </div>
      <div className="p-6 pt-3 border-t border-gray-100 flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition">Cancel</button>
        <button onClick={handleConfirm} disabled={!selectedReason.trim() || (selectedReason === "Other" && !customReason.trim()) || submitting} className="flex-1 py-3 text-sm font-medium text-white bg-orange-600 rounded-full hover:bg-orange-700 transition disabled:opacity-50">
          {submitting ? "Submitting..." : "Submit Return"}
        </button>
      </div>
    </ModalShell>
  );
}

// Order Card — Rich layout
function OrderCard({ order, onCancelClick, onReturnClick, navigate }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[order.status] || statusConfig.PENDING;

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

  const items = order.items || [];
  const firstItem = items[0];
  const moreCount = items.length - 1;
  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";
  const canReturn = order.status === "DELIVERED" && !order.returnRequested;

  // Build item summary text
  const itemSummary = items.map((i) => i.productName).join(" | ");
  const truncatedSummary = itemSummary.length > 80 ? itemSummary.slice(0, 80) + "..." : itemSummary;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all">
      {/* Status bar + date */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
        <span className="text-xs text-gray-400">|</span>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>

      {/* Main content — clickable to expand */}
      <div
        className="px-5 pb-4 flex items-center gap-4 cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Product thumbnail */}
        {firstItem && (
          <div className="relative flex-shrink-0">
            <img
              src={firstItem.productImage ? `${API_BASE_URL}${firstItem.productImage}` : "https://placehold.co/72x72/f3f4f6/9ca3af?text=·"}
              alt={firstItem.productName}
              className="w-[72px] h-[72px] rounded-xl object-cover bg-gray-100 border border-gray-100"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/72x72/f3f4f6/9ca3af?text=·"; }}
            />
            {moreCount > 0 && (
              <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                +{moreCount}
              </span>
            )}
          </div>
        )}

        {/* Order info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-green-700 mb-0.5">Order ID: #{order.id}</p>
          <p className="text-sm text-gray-600 truncate leading-relaxed">{truncatedSummary}</p>
          <p className="text-[15px] font-bold text-gray-900 mt-1">₹{order.total?.toFixed(2)}</p>
        </div>

        {/* Arrow */}
        <ChevronRight className={`w-5 h-5 text-gray-300 group-hover:text-green-600 transition flex-shrink-0 ${expanded ? "rotate-90" : ""}`} />
      </div>

      {/* Expanded — All items detail */}
      {expanded && items.length > 0 && (
        <div className="px-5 pb-4 border-t border-gray-100 pt-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Order Items</p>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.productImage ? `${API_BASE_URL}${item.productImage}` : "https://placehold.co/48x48/f3f4f6/9ca3af?text=·"}
                  alt={item.productName}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/f3f4f6/9ca3af?text=·"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">₹{item.price?.toFixed(0)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">Order Total</span>
            <span className="text-base font-bold text-gray-900">₹{order.total?.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Progress bar for active orders */}
      {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
        <div className="px-5 pb-3">
          <div className="flex items-center gap-0.5">
            {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"].map((step, idx) => {
              const currentIdx = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"].indexOf(order.status);
              return (
                <div key={step} className="flex-1">
                  <div className={`h-1 rounded-full ${idx <= currentIdx ? "bg-green-500" : "bg-gray-200"}`} />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-gray-400">Placed</span>
            <span className="text-[9px] text-gray-400">Confirmed</span>
            <span className="text-[9px] text-gray-400">Shipped</span>
            <span className="text-[9px] text-gray-400">Delivered</span>
          </div>
        </div>
      )}

      {/* Actions strip */}
      {(canCancel || canReturn || order.status === "DELIVERED") && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-2">
          {canCancel && (
            <button onClick={() => onCancelClick(order.id)} className="text-xs font-medium text-red-600 hover:text-red-700 transition">
              Cancel
            </button>
          )}
          {canCancel && (canReturn || order.status === "DELIVERED") && <span className="text-gray-300">·</span>}
          {canReturn && (
            <button onClick={() => onReturnClick(order.id)} className="text-xs font-medium text-orange-600 hover:text-orange-700 transition">
              Return
            </button>
          )}
          {(canReturn || order.returnRequested) && order.status === "DELIVERED" && <span className="text-gray-300">·</span>}
          {order.status === "DELIVERED" && (
            <button onClick={() => navigate(`/invoice/${order.id}`)} className="text-xs font-medium text-gray-600 hover:text-gray-900 transition flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Invoice
            </button>
          )}
          {order.returnStatus && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-orange-600 font-medium">Return: {order.returnStatus}</span>
            </>
          )}
        </div>
      )}

      {/* Cancellation reason */}
      {order.status === "CANCELLED" && order.cancellationReason && (
        <div className="px-5 py-3 bg-red-50/50 border-t border-red-100">
          <p className="text-xs text-red-600"><span className="font-medium">Reason:</span> {order.cancellationReason}</p>
        </div>
      )}
    </div>
  );
}

// Main Page
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: null });
  const [returnModal, setReturnModal] = useState({ open: false, orderId: null });
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        const ordersData = res.data;
        const enriched = await Promise.all(
          ordersData.map(async (order) => {
            if (order.status === "DELIVERED") {
              try {
                const returnRes = await getReturnByOrderId(order.id);
                return { ...order, returnStatus: returnRes.data.status, returnRequested: true };
              } catch {
                return { ...order, returnRequested: false };
              }
            }
            return order;
          })
        );
        setOrders(enriched);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "ACTIVE") return ["PENDING", "CONFIRMED", "SHIPPED"].includes(order.status);
    if (activeFilter === "DELIVERED") return order.status === "DELIVERED";
    if (activeFilter === "CANCELLED") return order.status === "CANCELLED";
    return true;
  });

  const handleCancelConfirm = async (orderId, reason) => {
    try {
      const res = await cancelOrder(orderId, reason);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleReturnConfirm = async (orderId, reason) => {
    try {
      await createReturnRequest(orderId, reason);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, returnRequested: true, returnStatus: "PENDING" } : o));
      toast.success("Return request submitted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit return request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between py-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Orders</h1>
              <p className="text-sm text-gray-500 mt-0.5">{orders.length} {orders.length === 1 ? "order" : "orders"} placed</p>
            </div>
            <button
              onClick={() => navigate("/AllProducts")}
              className="hidden sm:inline-flex px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-green-700 transition"
            >
              Shop More
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 pb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-all ${
                  activeFilter === tab.key
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-6">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <Package className="w-7 h-7 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1.5">
              {activeFilter === "ALL" ? "No orders yet" : `No ${activeFilter.toLowerCase()} orders`}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {activeFilter === "ALL" ? "When you place an order, it will appear here." : "Try a different filter."}
            </p>
            {activeFilter === "ALL" && (
              <button onClick={() => navigate("/AllProducts")} className="px-7 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-green-700 transition">
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancelClick={(id) => setCancelModal({ open: true, orderId: id })}
                onReturnClick={(id) => setReturnModal({ open: true, orderId: id })}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>

      <CancelOrderModal isOpen={cancelModal.open} orderId={cancelModal.orderId} onClose={() => setCancelModal({ open: false, orderId: null })} onConfirm={handleCancelConfirm} />
      <ReturnRequestModal isOpen={returnModal.open} orderId={returnModal.orderId} onClose={() => setReturnModal({ open: false, orderId: null })} onConfirm={handleReturnConfirm} />
    </div>
  );
}
