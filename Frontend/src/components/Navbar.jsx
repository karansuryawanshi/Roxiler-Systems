import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 py-3 max-w-6xl flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">
          StoreRatings
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link to="/admin" className="text-sm">
                  Admin
                </Link>
              )}
              {user.role === "NORMAL_USER" && (
                <Link to="/stores" className="text-sm">
                  Stores
                </Link>
              )}
              {user.role === "ADMIN" && (
                <>
                  <Link to="/admin" className="text-sm">
                    Dashboard
                  </Link>
                  <Link to="/admin/users" className="text-sm">
                    Users
                  </Link>
                  <Link to="/admin/stores" className="text-sm">
                    Stores
                  </Link>
                </>
              )}

              {user.role === "STORE_OWNER" && (
                <Link to="/owner" className="text-sm">
                  Owner
                </Link>
              )}
              <Link to="/profile" className="text-sm">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-sm text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">
                Login
              </Link>
              <Link to="/signup" className="text-sm">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
