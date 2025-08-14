import React from "react";

export default function StoreCard({ store, onRate }) {
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold">{store.name}</h3>
          <p className="text-sm text-gray-600">{store.address}</p>

          <p className="text-sm">
            Your rating: <strong>{store.userRating ?? "Not rated"}</strong>
          </p>
        </div>
        <div>
          <label className="block text-xs mb-1">Rate</label>
          <select
            defaultValue=""
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val) onRate(store.id, val);
            }}
            className="border rounded px-2 py-1"
          >
            <option value="">--</option>
            {[1, 2, 3, 4, 5].map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
