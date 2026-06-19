'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { GraduationCap, LogOut, User, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="text-blue-600" size={28} />
            <span className="text-xl font-bold text-gray-900">UniApply</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/universities" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Universities
            </Link>
            <Link href="/programs" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Programs
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
           {user ? (
  <>
    <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'} 
      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium">
      <LayoutDashboard size={18} />
      Dashboard
    </Link>
    <button onClick={logout} className="flex items-center gap-1 text-gray-600 hover:text-red-500 font-medium">
      <LogOut size={18} />
      Logout
    </button>
  </>
) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition">
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}