import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyProfile, updateProfile, deleteAccount } from "../services/api";
import { useToast } from "../components/Toast";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Pencil,
  Save,
  X,
  ShieldAlert,
  CheckCircle,
  Lock,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ email: "", phone: "", currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.data);
        setForm({ email: res.data.email || "", phone: res.data.phone || "", currentPassword: "", newPassword: "" });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const payload = {};
      if (form.email !== profile.email) payload.email = form.email;
      if (form.phone !== profile.phone) payload.phone = form.phone;
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }

      if (Object.keys(payload).length === 0) {
        setMessage({ type: "info", text: "No changes to save." });
        return;
      }

      const res = await updateProfile(payload);
      setProfile(res.data);
      setEditing(false);
      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile.";
      setMessage({ type: "error", text: msg });
    }
  };

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <h1 className="text-4xl font-bold text-gray-900">
            My Account
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your profile and account settings
          </p>
        </motion.div>

        {/* Hero Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden"
        >
          <div className="h-28 bg-gradient-to-r from-green-600 via-emerald-500 to-green-400" />

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between -mt-12">
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {profile?.username?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="pt-10 md:pt-12">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.username}
                  </h2>

                  <p className="text-gray-500">{profile?.email}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Calendar size={16} />
                    <span>
                      Member since{" "}
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {!editing && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditing(true)}
                  className="mt-6 md:mt-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <Pencil size={18} />
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
        {/* Dashboard Summary */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4 }}
            onClick={() => navigate("/addresses")}
            className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm cursor-pointer hover:border-green-200 transition"
          >
            <p className="text-xs uppercase text-gray-500">Addresses</p>
            <p className="text-lg font-bold text-green-600 mt-1">
              Manage
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4 }}
            onClick={() => navigate("/orders")}
            className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm cursor-pointer hover:border-green-200 transition"
          >
            <p className="text-xs uppercase text-gray-500">Orders</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              View All
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4 }}
            onClick={() => navigate("/wishlist")}
            className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm cursor-pointer hover:border-green-200 transition"
          >
            <p className="text-xs uppercase text-gray-500">Wishlist</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              View All
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm"
          >
            <p className="text-xs uppercase text-gray-500">Security</p>
            <p className="text-lg font-bold text-green-600 mt-1">
              Protected
            </p>
          </motion.div>
        </motion.div>
        {/* Alert */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-2xl p-4 text-sm font-medium ${message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-100"
                : message.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-100"
                  : "bg-blue-50 text-blue-700 border border-blue-100"
                }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View/Edit Section */}
        <AnimatePresence mode="wait">
          {!editing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              <>
                {/* LEFT COLUMN */}
                <div className="space-y-6">

                  {/* Profile Completion */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">
                      Profile Completion
                    </h3>

                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        Completion
                      </span>

                      <span className="font-semibold text-green-600">
                        100%
                      </span>
                    </div>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-green-500 to-emerald-500" />
                    </div>
                  </div>

                  {/* Security */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-5">
                      Security Status
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Password</span>
                        <span className="text-green-600">
                          Protected
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Email</span>
                        <span className="text-green-600">
                          Verified
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Status</span>
                        <span className="text-green-600">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-lg p-6">

                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Account Details
                  </h3>

                  <div className="grid grid-cols-2 gap-5">

                    <div className="bg-gray-50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Mail size={18} />
                        <span className="text-sm">
                          Email Address
                        </span>
                      </div>

                      <p className="font-semibold text-gray-900">
                        {profile?.email}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Phone size={18} />
                        <span className="text-sm">
                          Phone Number
                        </span>
                      </div>

                      <p className="font-semibold text-gray-900">
                        {profile?.phone || "Not Set"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <User size={18} />
                        <span className="text-sm">
                          Role
                        </span>
                      </div>

                      <p className="font-semibold text-gray-900">
                        {profile?.role}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Calendar size={18} />
                        <span className="text-sm">
                          Joined
                        </span>
                      </div>

                      <p className="font-semibold text-gray-900">
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                          : "—"}
                      </p>
                    </div>

                  </div>

                </div>
              </>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Edit Profile
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none"
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Change Password
                  </h4>

                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={form.currentPassword}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-green-100 outline-none"
                    />

                    <input
                      type="password"
                      placeholder="New Password"
                      value={form.newPassword}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-green-100 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium shadow-lg"
                  >
                    <Save size={18} />
                    Save Changes
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setMessage({ type: "", text: "" });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium"
                  >
                    <X size={18} />
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Danger Zone */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="border-t border-gray-200 pt-8"
        >
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <ShieldAlert className="text-red-600" size={24} />
              <h3 className="text-xl font-semibold text-red-700">
                Danger Zone
              </h3>
            </div>

            <p className="text-gray-700 mb-5">
              Permanently delete your account and all associated data.
            </p>

            {!showDeleteConfirm && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-5 py-3 rounded-xl font-medium"
              >
                Delete Account
              </motion.button>
            )}

            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="space-y-4 bg-white rounded-2xl p-5 border border-red-200">
                    <p className="text-red-700 font-medium">
                      Type <strong>DELETE</strong> to confirm:
                    </p>

                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) =>
                        setDeleteConfirmText(e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl border border-red-300"
                    />

                    <div className="flex gap-3">
                      <button
                        disabled={
                          deleting ||
                          deleteConfirmText !== "DELETE"
                        }
                        onClick={async () => {
                          if (deleteConfirmText !== "DELETE") return;

                          setDeleting(true);

                          try {
                            await deleteAccount();
                            toast.success(
                              "Account deleted successfully"
                            );
                            logout();
                            navigate("/");
                          } catch (err) {
                            toast.error(
                              err.response?.data?.message ||
                              "Failed to delete account"
                            );
                          } finally {
                            setDeleting(false);
                          }
                        }}
                        className="bg-red-600 text-white px-5 py-3 rounded-xl disabled:opacity-50"
                      >
                        {deleting
                          ? "Deleting..."
                          : "Permanently Delete"}
                      </button>

                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

    </div>

  );
}
