import * as Dialog from "@radix-ui/react-dialog";
import { X, Eye, EyeOff, User, Mail, Lock, Phone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

function PasswordStrength({ password }) {
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"];
  const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? colors[strength] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs mt-1 ${strength <= 2 ? "text-red-500" : "text-green-600"}`}>
        {labels[strength]}
      </p>
    </div>
  );
}

function InputField({ icon: Icon, label, error, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div
        className={`relative flex items-center border rounded-xl transition-all duration-200 ${
          error
            ? "border-red-400 ring-2 ring-red-100"
            : focused
            ? "border-green-500 ring-2 ring-green-100"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <Icon className="absolute left-3.5 w-4.5 h-4.5 text-gray-400" />
        <input
          {...props}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none text-sm"
        />
        {props.children}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function AuthModal({ open, setOpen }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const { login, register, loading, error, setError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccessMsg("");
    // Clear field error on type
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = useCallback(() => {
    const errors = {};

    if (!form.username.trim()) {
      errors.username = "Username is required";
    } else if (form.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      errors.username = "Only letters, numbers, and underscores";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (isRegister) {
      if (!form.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = "Enter a valid email address";
      }

      if (form.phone && !/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ""))) {
        errors.phone = "Enter a valid 10-digit phone number";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form, isRegister]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    if (!validateForm()) return;

    if (isRegister) {
      const result = await register(form.username.trim(), form.email.trim(), form.password, form.phone.trim());
      if (result.success) {
        setSuccessMsg("Account created successfully! Please sign in.");
        setIsRegister(false);
        setForm({ username: "", email: "", password: "", phone: "" });
        setFieldErrors({});
      }
    } else {
      const result = await login(form.username.trim(), form.password);
      if (result.success) {
        setOpen(false);
        setForm({ username: "", email: "", password: "", phone: "" });
        setFieldErrors({});
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
    setSuccessMsg("");
    setFieldErrors({});
    setForm({ username: "", email: "", password: "", phone: "" });
  };

  const switchMode = (toRegister) => {
    setIsRegister(toRegister);
    setError("");
    setSuccessMsg("");
    setFieldErrors({});
    setForm({ username: "", email: "", password: "", phone: "" });
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 w-[92%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-pop-in">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

          <div className="p-7">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <Dialog.Title className="text-2xl font-bold text-gray-900">
                  {isRegister ? "Create Account" : "Welcome Back"}
                </Dialog.Title>
                <p className="text-sm text-gray-500 mt-1">
                  {isRegister
                    ? "Join QuickBasket for the best deals"
                    : "Sign in to access your account"}
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  className="p-2 -mr-2 -mt-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Success message */}
            {successMsg && (
              <div className="mb-5 p-3.5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">{successMsg}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Username */}
              <InputField
                icon={User}
                label="Username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
                error={fieldErrors.username}
              />

              {/* Email (register only) */}
              {isRegister && (
                <InputField
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={fieldErrors.email}
                />
              )}

              {/* Phone (register only) */}
              {isRegister && (
                <InputField
                  icon={Phone}
                  label="Phone Number (optional)"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  error={fieldErrors.phone}
                />
              )}

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div
                  className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                    fieldErrors.password
                      ? "border-red-400 ring-2 ring-red-100"
                      : "border-gray-200 hover:border-gray-300 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100"
                  }`}
                >
                  <Lock className="absolute left-3.5 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={isRegister ? "Min 6 characters" : "Enter your password"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    className="w-full pl-11 pr-11 py-3 bg-transparent text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.password}
                  </p>
                )}
                {isRegister && <PasswordStrength password={form.password} />}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-green-200/50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : isRegister ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400 uppercase tracking-wider">or</span>
              </div>
            </div>

            {/* Switch mode */}
            <div className="text-center">
              {isRegister ? (
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                    onClick={() => switchMode(false)}
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  New to QuickBasket?{" "}
                  <button
                    type="button"
                    className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                    onClick={() => switchMode(true)}
                  >
                    Create Account
                  </button>
                </p>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Secure
              </span>
              <span>•</span>
              <span>256-bit encryption</span>
              <span>•</span>
              <span>Privacy first</span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
