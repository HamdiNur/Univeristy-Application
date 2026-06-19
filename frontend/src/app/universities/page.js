"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Search, MapPin, Globe, Trophy } from "lucide-react";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const res = await api.get("/universities", {
        params: { search, country, page, limit: 9 },
      });
      setUniversities(res.data.universities);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUniversities();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Discover Universities</h1>
          <p className="text-blue-100 mb-8">
            Find the perfect university for your future
          </p>

          {/* Search Bar */}
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search universities..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
              />
            </div>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="🌍 Country"
              className="px-4 py-3 rounded-xl text-gray-900 bg-white focus:outline-none w-full sm:w-40 placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition border-2 border-white"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading universities...
          </div>
        ) : universities.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No universities found.
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">
              {pagination.total} universities found
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {universities.map((uni) => (
                <Link key={uni.id} href={`/universities/${uni.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 h-full">
                    {/* Logo placeholder */}
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {uni.name.charAt(0)}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {uni.name}
                    </h3>

                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
                      <MapPin size={14} />
                      {uni.city}, {uni.country}
                    </div>

                    {uni.ranking && (
                      <div className="flex items-center gap-1 text-yellow-600 text-sm mb-1">
                        <Trophy size={14} />
                        Ranked #{uni.ranking}
                      </div>
                    )}

                    {uni.website && (
                      <div className="flex items-center gap-1 text-blue-500 text-sm mb-3">
                        <Globe size={14} />
                        {uni.website.replace("https://", "")}
                      </div>
                    )}

                    {uni.description && (
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {uni.description}
                      </p>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {uni.total_programs} programs
                      </span>
                      <span className="text-blue-600 text-sm font-medium">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      p === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 border hover:border-blue-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
