import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { login as loginAPI, register as registerAPI, getMyProfile } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticated = !!token && !!user;

  // Listen for auth-expired events from axios interceptor
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener("auth-expired", handleExpired);
    return () => window.removeEventListener("auth-expired", handleExpired);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await loginAPI(username, password);
      const { token: jwt, username: uname, role, expiry } = res.data;

      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify({ username: uname, role }));

      setToken(jwt);
      setUser({ username: uname, role });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username, email, password, phone) => {
    setLoading(true);
    setError("");
    try {
      await registerAPI(username, email, password, phone);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getMyProfile();
      const profile = res.data;
      setUser((prev) => ({ ...prev, ...profile }));
    } catch (err) {
      // If profile fetch fails, token might be invalid
      if (err.response?.status === 401) {
        logout();
      }
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        fetchProfile,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
