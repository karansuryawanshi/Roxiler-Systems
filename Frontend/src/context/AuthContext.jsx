import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const t = localStorage.getItem("token");
      if (!t) return null;
      //   const decoded = jwt_decode(t);
      const decoded = jwtDecode.default(t);

      return { ...decoded };
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthState({
        token,
        user: JSON.parse(user),
      });
    }
  }, []);

  useEffect(() => {
    // keep user in sync if token changed
    const t = localStorage.getItem("token");
    if (!t) setUser(null);
  });

  const login = async (email, password) => {
    const { data } = await api.login({ email, password });
    const { token, user: userObj } = data;
    localStorage.setItem("token", token);
    setUser(userObj || jwtDecode(token));
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (payload) => {
    return api.register(payload);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
