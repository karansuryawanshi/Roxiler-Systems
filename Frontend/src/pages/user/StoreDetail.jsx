import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);

  useEffect(() => {
    api
      .getStore(id)
      .then((res) => setStore(res.data))
      .catch(() => {});
  }, [id]);

  if (!store) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{store.name}</h2>
      <p className="text-sm text-gray-600 mb-4">{store.address}</p>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Average rating</h3>
        <p className="text-3xl">{store.averageRating ?? "N/A"}</p>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Ratings by users</h3>
        {store.ratings?.length ? (
          <ul>
            {store.ratings.map((r) => (
              <li key={r.id} className="border-b py-2">
                <div className="text-sm font-medium">{r.userName}</div>
                <div className="text-sm text-gray-600">Rating: {r.rating}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No ratings yet</div>
        )}
      </div>
    </div>
  );
}
