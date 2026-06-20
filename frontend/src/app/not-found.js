'use client'
import Link from 'next/link'
import { GraduationCap, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
            <GraduationCap className="text-blue-600" size={36} />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Page not found</h2>
        <p className="text-gray-500 mb-8">
          Looks like this page took a gap year. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            <Home size={18} /> Go Home
          </Link>
          <Link
            href="/universities"
            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            <Search size={18} /> Browse Universities
          </Link>
        </div>

      </div>
    </div>
  )
}