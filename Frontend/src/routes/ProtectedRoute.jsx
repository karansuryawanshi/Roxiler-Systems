import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    if (user.role === "STORE_OWNER") return <Navigate to="/owner" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
}
