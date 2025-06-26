import React, { useState } from "react";

export default function MediaTable({ data }) {
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...data].sort((a, b) => {
    if (a.title < b.title) return sortAsc ? -1 : 1;
    if (a.title > b.title) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <table className="min-w-full bg-white shadow rounded">
      <thead>
        <tr>
          <th
            className="cursor-pointer text-left p-2 border-b"
            onClick={() => setSortAsc(!sortAsc)}
          >
            Title {sortAsc ? "↑" : "↓"}
          </th>
          <th className="text-left p-2 border-b">Type</th>
          <th className="text-left p-2 border-b">Year</th>
          <th className="text-left p-2 border-b">Rating</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((item) => (
          <tr key={item.id}>
            <td className="p-2 border-b">{item.title}</td>
            <td className="p-2 border-b capitalize">{item.type}</td>
            <td className="p-2 border-b">{item.year || "-"}</td>
            <td className="p-2 border-b">{item.rating || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
