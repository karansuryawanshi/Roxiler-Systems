import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getStores({ mine: true });
        // console.log(res.data.data);
        setStores(res.data.data); // Now stores is an array
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []); //  run only once

  if (loading) return <div className="p-6">Loading...</div>;
  if (!stores.length)
    return <div className="p-6">No store associated with your account.</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Owner Dashboard</h2>

      {stores.map((store) => {
        // console.log("Store", store);
        return (
          <div key={store.id} className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold">Store: {store.name}</h3>
            <p className="text-sm text-gray-600">{store.address}</p>

            <div className="mt-4 bg-gray-50 p-3 rounded">
              <h4 className="font-semibold mb-2">Store Rating</h4>
              {store.overallRating ? (
                <ul>
                  <li key={store.id} className=" py-2">
                    Rating: {store.overallRating}🌟
                  </li>
                </ul>
              ) : (
                <div>No raters yet</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// overallRating
