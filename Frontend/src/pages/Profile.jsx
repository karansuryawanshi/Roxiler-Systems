import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import { validatePassword } from "../utils/validators";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  const updatePassword = async () => {
    setErr(null);
    setSuccess(null);
    const v = validatePassword(password);
    if (v) return setErr(v);
    try {
      await api.updatePassword(user.id, { password });
      setSuccess("Password updated");
      setPassword("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-xl mb-4">Profile</h2>
      <div className="bg-white p-4 rounded shadow">
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Address:</strong> {user?.address}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Update Password</h3>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />
        <button
          onClick={updatePassword}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
}
