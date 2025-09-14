import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";

export default function AuthModal({ open, setOpen }) {
  const [isRegister, setIsRegister] = useState(true);
    const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.placeholder.toLowerCase().split(' ')[0]]: e.target.value }));

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Content */}
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8 animate-in fade-in-50 zoom-in-95">
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

          {/* Form */}
          <form className="space-y-5">
            {isRegister && (
              <div className="relative">
                <input
                  type="text"
                  required
                  className="peer w-full bg-white/10 text-white placeholder-transparent rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Full Name"
                />
                <label className="absolute left-4 top-3 text-white text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-xs">
                  Full Name
                </label>
              </div>
            )}

            <div className="relative">
              <input
                type="email"
                required
                className="peer w-full bg-white/10 text-white placeholder-transparent rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Email"
              />
              <label className="absolute left-4 top-3 text-white text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-xs">
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                required
                className="peer w-full bg-white/10 text-white placeholder-transparent rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Password"
              />
              <label className="absolute left-4 top-3 text-white text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-xs">
                Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          {/* Switch */}
          <div className="mt-6 text-center text-white text-sm">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  className="text-green-300 font-semibold hover:text-green-100"
                  onClick={() => setIsRegister(false)}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  className="text-green-300 font-semibold hover:text-green-100"
                  onClick={() => setIsRegister(true)}
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Social Login */}
          <div className="mt-6 text-center">
            <p className="text-white/80 mb-3 text-sm">Or continue with</p>
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition">
                Google
              </button>
              <button className="px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition">
                Facebook
              </button>
              <button className="px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition">
                Apple
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  
}
