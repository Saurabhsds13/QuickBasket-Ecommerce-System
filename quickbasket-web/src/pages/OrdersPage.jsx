import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders, cancelOrder, createReturnRequest, getReturnByOrderId } from "../services/api";
import { Package, ChevronDown, ChevronUp, Clock, Truck, CheckCircle, XCircle, ShoppingBag, Plus, X, AlertTriangle, RotateCcw } from "lucide-react";
import { useToast } from "../components/Toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Truck },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

const cancellationReasons = [
  "I want to add more items",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "Delivery is taking too long",
  "Changed my mind",
  "Other",
];

// Cancel Order Modal
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
                <p className="text-sm text-gray-500">Order #{orderId}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 font-medium">Why are you cancelling this order?</p>

          <div className="space-y-2">
            {cancellationReasons.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedReason === reason
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">{reason}</span>
              </label>
            ))}
          </div>

          {selectedReason === "Other" && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Please specify your reason..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none text-sm"
              rows={3}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
          >
            Keep Order
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason.trim() || (selectedReason === "Other" && !customReason.trim()) || submitting}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

const returnReasons = [
  "Product is damaged or defective",
  "Wrong item received",
  "Product doesn't match description",
  "Quality not as expected",
  "Size/fit issue",
  "Changed my mind",
  "Other",
];

// Return Request Modal
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Request Return</h3>
                <p className="text-sm text-gray-500">Order #{orderId}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 font-medium">Why do you want to return this order?</p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {returnReasons.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedReason === reason
                    ? "border-orange-300 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="returnReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">{reason}</span>
              </label>
            ))}
          </div>

          {selectedReason === "Other" && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Please describe the issue..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none text-sm"
              rows={3}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason.trim() || (selectedReason === "Other" && !customReason.trim()) || submitting}
            className="flex-1 py-3 px-4 rounded-xl bg-orange-600 text-white font-medium text-sm hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Return"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onCancelClick, onReturnClick, navigate }) {
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
  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";
  const canAddItems = order.status === "PENDING";
  const canReturn = order.status === "DELIVERED" && !order.returnRequested;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Order Header */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">₹{order.total?.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total amount</p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Quick action buttons (visible without expanding) */}
        {canAddItems && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => navigate("/AllProducts")}
              className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add More Items
            </button>
          </div>
        )}
      </div>

      {/* Order Items - Expandable */}
      {expanded && order.items && order.items.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-5 sm:px-6 py-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Order Items</p>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl p-3 border border-gray-100">
                <img
                  src={item.productImage ? `${API_BASE_URL}${item.productImage}` : "https://placehold.co/100x100/f3f4f6/9ca3af?text=No+Image"}
                  alt={item.productName}
                  className="w-16 h-16 object-contain rounded-lg bg-gray-50 p-1"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/f3f4f6/9ca3af?text=No+Image"; }}
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

          {/* Cancellation reason if cancelled */}
          {order.status === "CANCELLED" && order.cancellationReason && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-xs font-medium text-red-600">Cancellation Reason</p>
              <p className="text-sm text-red-700 mt-0.5">{order.cancellationReason}</p>
            </div>
          )}

          {/* Cancel button */}
          {canCancel && (
            <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-3">
              {canAddItems && (
                <button
                  onClick={() => navigate("/AllProducts")}
                  className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-lg hover:bg-green-100 transition font-medium text-sm border border-green-200"
                >
                  <Plus className="w-4 h-4" />
                  Add More Items
                </button>
              )}
              <button
                onClick={() => onCancelClick(order.id)}
                className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-100 transition font-medium text-sm border border-red-200"
              >
                <XCircle className="w-4 h-4" />
                Cancel Order
              </button>
            </div>
          )}

          {/* Return button for delivered orders */}
          {canReturn && (
            <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-3">
              <button
                onClick={() => onReturnClick(order.id)}
                className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2.5 rounded-lg hover:bg-orange-100 transition font-medium text-sm border border-orange-200"
              >
                <RotateCcw className="w-4 h-4" />
                Request Return
              </button>
              <button
                onClick={() => navigate(`/invoice/${order.id}`)}
                className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg hover:bg-blue-100 transition font-medium text-sm border border-blue-200"
              >
                <Package className="w-4 h-4" />
                Download Invoice
              </button>
            </div>
          )}

          {/* Invoice button for delivered orders with return already requested */}
          {order.status === "DELIVERED" && order.returnRequested && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <button
                onClick={() => navigate(`/invoice/${order.id}`)}
                className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg hover:bg-blue-100 transition font-medium text-sm border border-blue-200"
              >
                <Package className="w-4 h-4" />
                Download Invoice
              </button>
            </div>
          )}

          {/* Return status display */}
          {order.returnStatus && (
            <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-xs font-medium text-orange-600">Return Request</p>
              <p className="text-sm text-orange-700 mt-0.5">
                Status: <span className="font-semibold">{order.returnStatus}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
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
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: null });
  const [returnModal, setReturnModal] = useState({ open: false, orderId: null });
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        // For each delivered order, check if a return has been requested
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
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, returnRequested: true, returnStatus: "PENDING" } : o
        )
      );
      toast.success("Return request submitted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit return request");
    }
  };

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

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={cancelModal.open}
        orderId={cancelModal.orderId}
        onClose={() => setCancelModal({ open: false, orderId: null })}
        onConfirm={handleCancelConfirm}
      />

      {/* Return Request Modal */}
      <ReturnRequestModal
        isOpen={returnModal.open}
        orderId={returnModal.orderId}
        onClose={() => setReturnModal({ open: false, orderId: null })}
        onConfirm={handleReturnConfirm}
      />
    </div>
  );
}
