import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../services/api";
import { Bell, CheckCheck, Package, RotateCcw, Tag, Info } from "lucide-react";
import { useToast } from "../components/Toast";

const typeConfig = {
  ORDER: { icon: Package, color: "bg-blue-100 text-blue-600" },
  RETURN: { icon: RotateCcw, color: "bg-orange-100 text-orange-600" },
  PROMO: { icon: Tag, color: "bg-purple-100 text-purple-600" },
  DEFAULT: { icon: Info, color: "bg-gray-100 text-gray-600" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const unreadCount = notifications.filter((n) => !n.seen).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, seen: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const getTypeConfig = (type) => typeConfig[type] || typeConfig.DEFAULT;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition border border-green-200"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No notifications</h2>
            <p className="text-gray-500">You'll see order updates, return status, and more here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const config = getTypeConfig(notif.type);
              const Icon = config.icon;
              return (
                <div
                  key={notif.id}
                  onClick={() => !notif.seen && handleMarkAsRead(notif.id)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-sm transition-all ${
                    !notif.seen
                      ? "border-green-200 shadow-sm"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notif.seen ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                          {notif.message}
                        </p>
                        {!notif.seen && (
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {notif.createdAt
                          ? new Date(notif.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
