// src/pages/admin/AdminStores.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [filter, setFilter] = useState({ name: "", address: "" });

  // form for creating store
  const [form, setForm] = useState({ name: "", address: "", ownerId: "" });
  const [formErr, setFormErr] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await api.getStoresAdmin();
      setStores(res.data.stores || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  const submitNewStore = async (e) => {
    e.preventDefault();
    setFormErr(null);
    if (!form.name.trim() || !form.address.trim() || !form.ownerId.trim()) {
      setFormErr("All fields are required");
      return;
    }

    setFormLoading(true);
    try {
      await api.createStore({ ...form, ownerId: Number(form.ownerId) });
      setForm({ name: "", address: "", ownerId: "" });
      fetchStores();
    } catch (e) {
      setFormErr(e?.response?.data?.message || "Failed to create store");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Stores</h2>

      {/* Create Store Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-3">Create New Store</h3>
        {formErr && <div className="text-red-600 mb-2">{formErr}</div>}
        <form
          onSubmit={submitNewStore}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <input
            type="text"
            placeholder="Store Name"
            className="border px-3 py-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className="border px-3 py-2 rounded"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Owner ID"
            className="border px-3 py-2 rounded"
            value={form.ownerId}
            onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
          />
          <div className="col-span-full">
            <button
              type="submit"
              disabled={formLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {formLoading ? "Creating..." : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
