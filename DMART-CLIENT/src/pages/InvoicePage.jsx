import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/api";

export default function InvoicePage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-gray-500">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg mb-4">Order not found.</p>
        <button
          onClick={() => navigate("/orders")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const subtotal = order.items?.reduce((sum, item) => sum + item.price, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Print button - hidden during print */}
      <div className="container mx-auto max-w-3xl mb-6 print:hidden flex items-center justify-between">
        <button
          onClick={() => navigate("/orders")}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition text-sm font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Invoice
        </button>
      </div>

      {/* Invoice */}
      <div className="container mx-auto max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none print:rounded-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 print:bg-green-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <h1 className="text-2xl font-bold">QuickBasket</h1>
              </div>
              <p className="text-green-100 text-sm">Your trusted grocery partner</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold uppercase tracking-wide">Invoice</h2>
              <p className="text-green-100 text-sm mt-1">#{order.id}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
              <p className="font-semibold text-gray-900">{order.customerName}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Order Details</h3>
              <p className="text-sm text-gray-600">Order Date: <span className="font-medium text-gray-900">{orderDate}</span></p>
              <p className="text-sm text-gray-600 mt-1">
                Status: <span className={`font-medium ${order.status === "DELIVERED" ? "text-green-600" : "text-gray-900"}`}>
                  {order.status}
                </span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items?.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                    </td>
                    <td className="px-5 py-4 text-center text-sm text-gray-700">{item.quantity}</td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-gray-900">₹{item.price?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-72">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-gray-900">{subtotal > 500 ? "Free" : "₹40.00"}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-green-700">₹{order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">Thank you for shopping with QuickBasket!</p>
            <p className="text-xs text-gray-400 mt-1">This is a computer-generated invoice. No signature required.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
