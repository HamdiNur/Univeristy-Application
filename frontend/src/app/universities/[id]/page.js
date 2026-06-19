'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { MapPin, Globe, Trophy, Calendar, BookOpen, Clock, DollarSign, Users, ArrowLeft } from 'lucide-react'

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
  MEDICINE: '🏥',
  INFORMATION_TECHNOLOGY: '💻',
  ENGINEERING: '⚙️',
  BUSINESS: '📊',
  LAW: '⚖️',
  ARTS: '🎨',
  SCIENCE: '🔬',
  EDUCATION: '📚',
  ARCHITECTURE: '🏛️',
  OTHER: '📖',
}

export default function UniversityDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/universities/${id}`)
        setUniversity(res.data.university)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Loading...
    </div>
  )

  if (!university) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      University not found.
    </div>
  )

  const programs = university.programs || []
  const categories = ['ALL', ...new Set(programs.map(p => p.category))]
  const filtered = selectedCategory === 'ALL'
    ? programs
    : programs.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-blue-600 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition"
          >
            <ArrowLeft size={18} /> Back to Universities
          </button>

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-blue-600">
                {university.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{university.name}</h1>
              <div className="flex flex-wrap gap-4 text-blue-100 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {university.city}, {university.country}
                </span>
                {university.ranking && (
                  <span className="flex items-center gap-1">
                    <Trophy size={14} /> Ranked #{university.ranking}
                  </span>
                )}
                {university.founded_year && (
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> Founded {university.founded_year}
                  </span>
                )}
                {university.website && (
                  <a href={university.website} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 hover:text-white">
                    <Globe size={14} /> {university.website.replace('https://', '')}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Description */}
        {university.description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg mb-2">About</h2>
            <p className="text-gray-600">{university.description}</p>
          </div>
        )}

        {/* Facilities */}
        {university.facilities && university.facilities.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Facilities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {university.facilities.map((f) => (
                <div key={f.id} className="bg-gray-50 rounded-xl p-3">
                  <p className="font-medium text-gray-800 text-sm">{f.name}</p>
                  {f.description && <p className="text-gray-500 text-xs mt-1">{f.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Programs */}
        <div>
          <h2 className="font-bold text-gray-900 text-2xl mb-6">
            Programs Offered ({programs.length})
          </h2>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border hover:border-blue-300'
                  }`}
                >
                  {cat === 'ALL' ? 'All Programs' : `${categoryIcons[cat]} ${cat.replace('_', ' ')}`}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No programs found.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((program) => (
                <Link key={program.id} href={`/programs/${program.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-6">

                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[program.category]}`}>
                        {categoryIcons[program.category]} {program.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {program.degree_level}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-3">{program.name}</h3>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {program.duration_years} years
                      </span>
                      {program.tuition_fee && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={13} /> ${program.tuition_fee.toLocaleString()}/yr
                        </span>
                      )}
                      {program.available_seats && (
                        <span className="flex items-center gap-1">
                          <Users size={13} /> {program.available_seats} seats
                        </span>
                      )}
                      {program.language && (
                        <span className="flex items-center gap-1">
                          <BookOpen size={13} /> {program.language}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      {program.min_gpa && (
                        <span className="text-xs text-gray-500">Min GPA: {program.min_gpa}</span>
                      )}
                      <span className="text-blue-600 text-sm font-medium ml-auto">
                        View & Apply →
                      </span>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}