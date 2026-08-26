import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../api";

const AuthContext = createContext({ user: null, loading: true, login: async () => {}, logout: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("xa_token");
    if (!token) { setLoading(false); return; }
    AuthAPI.me().then((u) => setUser(u)).catch(() => localStorage.removeItem("xa_token")).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await AuthAPI.login(email, password);
    localStorage.setItem("xa_token", res.token);
    setUser({ email: res.email });
    return res;
  };

  const logout = () => {
    localStorage.removeItem("xa_token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
