import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      // redirect based on role
      const user =
        res.user ||
        JSON.parse(atob(localStorage.getItem("token").split(".")[1]));
      if (user.role === "ADMIN") nav("/admin");
      else if (user.role === "STORE_OWNER") nav("/owner");
      else nav("/stores");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow">
        {err && <div className="mb-3 text-red-600">{err}</div>}
        <label className="block mb-2">
          Email
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>
        <label className="block mb-4">
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
