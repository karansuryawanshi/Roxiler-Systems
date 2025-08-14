import React, { useEffect, useState } from "react";
import api from "../../services/api";
import StoreCard from "../../components/StoreCard";
import useAuth from "../../hooks/useAuth";

/**
 * Shows list of all stores with ability to search by name/address
 * Users can submit or modify rating via select
 */

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState({ name: "", address: "" });
  const { user } = useAuth();

  useEffect(() => {
    fetch();
  });

  const fetch = async () => {
    const res = await api.getStores();

    // console.log("Res is ", res);

    setStores(res.data.data || []);
  };

  const handleRate = async (storeId, rating) => {
    try {
      // console.log("rating", rating);
      await api.submitRating(storeId, { value: rating });
      // refresh
      fetch();
    } catch (e) {
      // try update (modify) if server expects that
      await api.updateRating(storeId, { value: rating });
      fetch();
    }
  };

  //   console.log("stores", stores);

  const filtered = stores.filter((s) => {
    return (
      s.name.toLowerCase().includes(q.name.toLowerCase()) &&
      (q.address
        ? s.address.toLowerCase().includes(q.address.toLowerCase())
        : true)
    );
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Stores</h2>

      <div className="mb-4 flex gap-3">
        <input
          placeholder="Search name"
          value={q.name}
          onChange={(e) => setQ({ ...q, name: e.target.value })}
          className="border px-3 py-2 rounded flex-1"
        />
        <input
          placeholder="Search address"
          value={q.address}
          onChange={(e) => setQ({ ...q, address: e.target.value })}
          className="border px-3 py-2 rounded flex-1"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((s) => (
          <StoreCard
            key={s.id}
            store={{
              id: s.id,
              name: s.name,
              address: s.address,
              overallRating: s.averageRating,
              userRating: s.userRating,
            }}
            onRate={handleRate}
          />
        ))}
      </div>
    </div>
  );
}
