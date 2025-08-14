import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
} from "../../utils/validators";

export default function Signup() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateAll = () => {
    const e = {};
    const n = validateName(form.name);
    if (n) e.name = n;
    const a = validateAddress(form.address);
    if (a) e.address = a;
    const em = validateEmail(form.email);
    if (em) e.email = em;
    const p = validatePassword(form.password);
    if (p) e.password = p;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerErr(null);
    if (!validateAll()) return;
    setLoading(true);
    try {
      await register(form);
      nav("/login");
    } catch (e) {
      setServerErr(e?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-4">Sign up</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow">
        {serverErr && <div className="mb-3 text-red-600">{serverErr}</div>}
        <label className="block mb-2">
          Name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          {errors.name && (
            <div className="text-sm text-red-600 mt-1">{errors.name}</div>
          )}
        </label>

        <label className="block mb-2">
          Email
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          {errors.email && (
            <div className="text-sm text-red-600 mt-1">{errors.email}</div>
          )}
        </label>

        <label className="block mb-2">
          Address
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
            rows="3"
          />
          {errors.address && (
            <div className="text-sm text-red-600 mt-1">{errors.address}</div>
          )}
        </label>

        <label className="block mb-4">
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          {errors.password && (
            <div className="text-sm text-red-600 mt-1">{errors.password}</div>
          )}
        </label>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
