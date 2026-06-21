'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { Search, Clock, DollarSign, Users, MapPin } from 'lucide-react'

const categoryColors = {
  MEDICINE: 'bg-red-100 text-red-600',
  INFORMATION_TECHNOLOGY: 'bg-blue-100 text-blue-600',
  ENGINEERING: 'bg-yellow-100 text-yellow-600',
  BUSINESS: 'bg-green-100 text-green-600',
  LAW: 'bg-purple-100 text-purple-600',
  ARTS: 'bg-pink-100 text-pink-600',
  SCIENCE: 'bg-teal-100 text-teal-600',
  EDUCATION: 'bg-orange-100 text-orange-600',
  ARCHITECTURE: 'bg-indigo-100 text-indigo-600',
  OTHER: 'bg-gray-100 text-gray-600',
}

const categoryIcons = {
  MEDICINE: '🏥', INFORMATION_TECHNOLOGY: '💻', ENGINEERING: '⚙️',
  BUSINESS: '📊', LAW: '⚖️', ARTS: '🎨', SCIENCE: '🔬',
  EDUCATION: '📚', ARCHITECTURE: '🏛️', OTHER: '📖',
}

function ProgramsContent() {
  const searchParams = useSearchParams()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.get('/programs/categories').then(res => setCategories(res.data.categories))
  }, [])

  const fetchPrograms = async () => {
    setLoading(true)
    try {
      const res = await api.get('/programs', {
        params: { search, category, page, limit: 9 }
      })
      setPrograms(res.data.programs)
      setPagination(res.data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [page, category])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchPrograms()
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-blue-600 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Explore Programs</h1>
          <p className="text-blue-100 mb-8">Find the program that matches your goals</p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search programs..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
              />
            </div>
            <button type="submit"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition border-2 border-white">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => { setCategory(''); setPage(1) }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              category === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:border-blue-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1) }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:border-blue-300'
              }`}
            >
              {categoryIcons[cat]} {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded-full w-32 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-4 bg-gray-100 rounded w-16" />
                  <div className="h-4 bg-gray-100 rounded w-20" />
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No programs found.</div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">{pagination.total} programs found</p>
            <div className="grid md:grid-cols-3 gap-6">
              {programs.map((program) => (
                <Link key={program.id} href={`/programs/${program.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 h-full">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[program.category]}`}>
                      {categoryIcons[program.category]} {program.category.replace('_', ' ')}
                    </span>

                    <h3 className="font-bold text-gray-900 text-lg mt-3 mb-1">{program.name}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                      <MapPin size={13} /> {program.university_name}, {program.university_country}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={13} /> {program.duration_years} yrs</span>
                      {program.tuition_fee && (
                        <span className="flex items-center gap-1"><DollarSign size={13} /> ${program.tuition_fee.toLocaleString()}</span>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 text-blue-600 text-sm font-medium">
                      View & Apply →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      p === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:border-blue-300'
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
  )
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
      <ProgramsContent />
    </Suspense>
  )
}