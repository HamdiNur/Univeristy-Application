'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { GraduationCap, LogOut, User, LayoutDashboard, ChevronDown, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="text-blue-600" size={28} />
            <span className="text-xl font-bold text-gray-900">UniApply</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/universities" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Universities
            </Link>
            <Link href="/programs" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Programs
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(user.fullName || user.full_name || '?').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {(user.fullName || user.full_name || '').split(' ')[0]}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {open && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.fullName || user.full_name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link href="/profile" onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                        <User size={16} /> My Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
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

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-600 p-2"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          <Link href="/universities" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
            Universities
          </Link>
          <Link href="/programs" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
            Programs
          </Link>

          <div className="border-t border-gray-100 my-2"></div>

          {user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {(user.fullName || user.full_name || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.fullName || user.full_name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link href="/profile" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                <User size={18} /> My Profile
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-500 font-medium hover:bg-red-50"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="text-center px-3 py-2.5 rounded-lg text-gray-700 font-medium border border-gray-200">
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}
                className="text-center bg-blue-600 text-white px-3 py-2.5 rounded-lg font-medium">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}