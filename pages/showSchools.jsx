// pages/showSchools.jsx
import React, { useEffect, useState } from "react";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [board, setBoard] = useState("");

  const [selectedSchool, setSelectedSchool] = useState(null); // For overlay

  const cityOptions = [
    "Lucknow",
    "Noida",
    "New Delhi",
    "Delhi",
    "Gurgaon",
    "Faridabad",
    "Hyderabad",
    "Pune",
    "Dehradun",
    "Kolkata",
    "Mumbai",
  ];

  const boardOptions = ["CBSE", "ICSE", "IB", "Cambridge", "State Board"];

  // Fetch schools submitted via /addSchool
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/getSchools"); // backend should return all added schools
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (mounted) {
          setSchools(Array.isArray(data) ? data : []);
          setFiltered(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (mounted) setError(e.message || "Failed to fetch schools");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...schools];
    if (search.trim()) {
      result = result.filter((s) =>
        s.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (city) {
      result = result.filter(
        (s) => s.city?.toLowerCase() === city.toLowerCase()
      );
    }
    if (board) {
      result = result.filter((s) =>
        s.board?.toLowerCase().includes(board.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, city, board, schools]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-black flex flex-col items-center justify-start px-4 py-8">
      {/* Header */}
      <header className="bg-white shadow w-full rounded-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            🏫 School Search
          </h1>
          <a
            href="/addSchool"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base transition"
          >
            + Add School
          </a>
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 w-full max-w-7xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Find the right school for your child
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="School Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Cities</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="border rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Boards</option>
            {boardOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading / Error / Empty */}
      {loading && <div className="text-center text-white">Loading schools…</div>}
      {error && !loading && (
        <div className="text-center text-red-400 font-medium">❌ {error}</div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center text-gray-300">No schools found.</div>
      )}

      {/* School Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
        {filtered.map((s) => (
          <article
            key={s.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer transform hover:scale-105"
            onClick={() => setSelectedSchool(s)}
          >
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              {s.image ? (
                <img
                  src={s.image}
                  alt={s.name || "School image"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {s.name || "Untitled School"}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {s.address || "Address not provided"}
              </p>
              <p className="text-gray-500 text-sm mt-1">{s.city || ""}</p>
              {s.board && (
                <p className="text-xs mt-2 font-medium text-blue-600">{s.board}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Overlay Card */}
     {selectedSchool && (
  <>
    {/* Floating Card */}
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      onClick={() => setSelectedSchool(null)}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 transform transition-transform duration-300 scale-95 opacity-0 animate-fadeIn overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-black">{selectedSchool.name}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            onClick={() => setSelectedSchool(null)}
          >
            &times;
          </button>
        </div>

        {selectedSchool.image && (
          <img
            src={selectedSchool.image}
            alt={selectedSchool.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        <p className="text-gray-700 mb-2">
          <strong>Address:</strong> {selectedSchool.address || "N/A"}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>City:</strong> {selectedSchool.city || "N/A"}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>State:</strong> {selectedSchool.state || "N/A"}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Contact:</strong> {selectedSchool.contact || "N/A"}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Email:</strong> {selectedSchool.email || "N/A"}
        </p>
        <p className="text-gray-700 mb-2">
  <strong>Website:</strong>{" "}
  {selectedSchool.website ? (
    <a
      href={selectedSchool.website}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      {selectedSchool.website}
    </a>
  ) : (
    "N/A"
  )}
</p>

        {selectedSchool.board && (
          <p className="text-gray-700 mb-2">
            <strong>Board:</strong> {selectedSchool.board}
          </p>
        )}

        {selectedSchool.description && (
          <p className="text-gray-700 mt-4">
            <strong>Description:</strong> {selectedSchool.description}
          </p>
        )}
      </div>
    </div>

    {/* Inline CSS for animation */}
    <style jsx>{`
      @keyframes fadeIn {
        0% {
          opacity: 0;
          transform: scale(0.95);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s forwards;
      }
    `}</style>
  </>
)}
    </div>
  );
}
