import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyProfile, updateProfile, deleteAccount } from "../services/api";
import { useToast } from "../components/Toast";

export default function ProfilePage() {
  const { user, logout } = useAuth();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">👤 My Profile</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-bold text-2xl">
                {profile?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{profile?.username}</h2>
              <p className="text-sm text-gray-500">{profile?.role}</p>
            </div>
          </div>

          {/* Messages */}
          {message.text && (
            <div className={`mb-6 p-3 rounded-lg text-sm ${
              message.type === "success" ? "bg-green-50 text-green-700" :
              message.type === "error" ? "bg-red-50 text-red-700" :
              "bg-blue-50 text-blue-700"
            }`}>
              {message.text}
            </div>
          )}

          {!editing ? (
            // View Mode
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Email</span>
                <span className="text-gray-800 font-medium">{profile?.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Phone</span>
                <span className="text-gray-800 font-medium">{profile?.phone || "Not set"}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Member since</span>
                <span className="text-gray-800 font-medium">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  }) : "—"}
                </span>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <hr className="my-4" />
              <p className="text-sm text-gray-500">Change password (leave blank to keep current)</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setMessage({ type: "", text: "" }); }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Danger Zone - Delete Account */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-red-100 p-8">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-50 text-red-600 px-5 py-2.5 rounded-lg hover:bg-red-100 transition font-medium text-sm border border-red-200"
            >
              Delete My Account
            </button>
          ) : (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-4">
              <p className="text-sm text-red-700 font-medium">
                Type <span className="font-bold">DELETE</span> to confirm account deletion:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
              />
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    if (deleteConfirmText !== "DELETE") {
                      toast.error("Please type DELETE to confirm");
                      return;
                    }
                    setDeleting(true);
                    try {
                      await deleteAccount();
                      toast.success("Account deleted successfully");
                      logout();
                      navigate("/");
                    } catch (err) {
                      toast.error(err.response?.data?.message || "Failed to delete account");
                    } finally {
                      setDeleting(false);
                    }
                  }}
                  disabled={deleting || deleteConfirmText !== "DELETE"}
                  className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Permanently Delete"}
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                  className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
