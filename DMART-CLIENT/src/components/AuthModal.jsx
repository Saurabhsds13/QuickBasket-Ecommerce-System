import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ open, setOpen }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  const { login, register, loading, error, setError } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    if (isRegister) {
      // Register
      if (!form.username || !form.email || !form.password) {
        setError("Please fill in all required fields.");
        return;
      }
      const result = await register(form.username, form.email, form.password, form.phone);
      if (result.success) {
        setSuccessMsg("Registration successful! Please sign in.");
        setIsRegister(false);
        setForm({ username: "", email: "", password: "", phone: "" });
      }
    } else {
      // Login
      if (!form.username || !form.password) {
        setError("Please enter username and password.");
        return;
      }
      const result = await login(form.username, form.password);
      if (result.success) {
        setOpen(false);
        setForm({ username: "", email: "", password: "", phone: "" });
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
    setSuccessMsg("");
    setForm({ username: "", email: "", password: "", phone: "" });
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8 z-50 animate-in fade-in-50 zoom-in-95">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold text-white">
              {isRegister ? "Create Account" : "Welcome Back"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 rounded-full hover:bg-white/20">
                <X className="w-5 h-5 text-white" />
              </button>
            </Dialog.Close>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-400/30 rounded-xl text-green-200 text-sm text-center">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="peer w-full bg-white/10 text-white placeholder-transparent rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Username"
              />
              <label className="absolute left-4 top-3 text-white/70 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-300">
                Username
              </label>
            </div>

            {/* Email (register only) */}
            {isRegister && (
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="peer w-full bg-white/10 text-white placeholder-transparent rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Email"
                />
                <label className="absolute left-4 top-3 text-white/70 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-300">
                  Email
                </label>
              </div>
            )}

            {/* Phone (register only) */}
            {isRegister && (
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="peer w-full bg-white/10 text-white placeholder-transparent rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Phone"
                />
                <label className="absolute left-4 top-3 text-white/70 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-300">
                  Phone (optional)
                </label>
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="peer w-full bg-white/10 text-white placeholder-transparent rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Password"
              />
              <label className="absolute left-4 top-3 text-white/70 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-300">
                Password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : isRegister
                ? "Register"
                : "Sign In"}
            </button>
          </form>

          {/* Switch */}
          <div className="mt-6 text-center text-white text-sm">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  className="text-green-300 font-semibold hover:text-green-100"
                  onClick={() => {
                    setIsRegister(false);
                    setError("");
                    setSuccessMsg("");
                  }}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  className="text-green-300 font-semibold hover:text-green-100"
                  onClick={() => {
                    setIsRegister(true);
                    setError("");
                    setSuccessMsg("");
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
