import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .adminDashboard()
      .then((res) => {
        setStats(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  });

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{stats?.users ?? 0}</div>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Stores</div>
          <div className="text-2xl font-bold">{stats?.stores ?? 0}</div>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Ratings</div>
          <div className="text-2xl font-bold">{stats?.ratings ?? 0}</div>
        </div>
      </div>
    </div>
  );
}
