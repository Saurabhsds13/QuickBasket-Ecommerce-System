import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to home with a flag to open auth modal
    return <Navigate to="/" state={{ openAuth: true, from: location.pathname }} replace />;
  }

  return children;
}
