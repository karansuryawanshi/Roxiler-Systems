import React, { useEffect, useState } from "react";
import api from "../../services/api";

/**
 * Admin can view & filter users by name, email, address, role
 * Sorting can be done client-side for simplicity
 */

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState({ name: "", email: "", address: "", role: "" });
  const [sort, setSort] = useState({ field: "name", dir: "asc" });

  useEffect(() => {
    fetchUsers();
  });

  const fetchUsers = async () => {
    const res = await api.getUsers();

    setUsers(res.data.data);
  };

  const filtered = users.filter((u) => {
    return (
      u.name?.toLowerCase().includes(q.name.toLowerCase()) &&
      u.email?.toLowerCase().includes(q.email.toLowerCase()) &&
      (q.address
        ? (u.address || "").toLowerCase().includes(q.address.toLowerCase())
        : true) &&
      (q.role ? u.role === q.role : true)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const f = sort.field;
    if (!a[f]) return 1;
    if (!b[f]) return -1;
    if (a[f] < b[f]) return sort.dir === "asc" ? -1 : 1;
    if (a[f] > b[f]) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Users</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="grid grid-cols-4 gap-3">
          <input
            value={q.name}
            onChange={(e) => setQ({ ...q, name: e.target.value })}
            placeholder="Name"
            className="border px-2 py-1"
          />
          <input
            value={q.email}
            onChange={(e) => setQ({ ...q, email: e.target.value })}
            placeholder="Email"
            className="border px-2 py-1"
          />
          <input
            value={q.address}
            onChange={(e) => setQ({ ...q, address: e.target.value })}
            placeholder="Address"
            className="border px-2 py-1"
          />
          <select
            value={q.role}
            onChange={(e) => setQ({ ...q, role: e.target.value })}
            className="border px-2 py-1"
          >
            <option value="">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="NORMAL_USER">Normal</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="text-left p-3 cursor-pointer"
                onClick={() =>
                  setSort((s) => ({
                    field: "name",
                    dir: s.dir === "asc" ? "desc" : "asc",
                  }))
                }
              >
                Name
              </th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Address</th>
              <th className="text-left p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.address}</td>
                <td className="p-3">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
