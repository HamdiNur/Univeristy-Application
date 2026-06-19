'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, GraduationCap, BookOpen,
  FileText, LogOut, GraduationCap as Logo
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Applications', icon: FileText, exact: true },
  { href: '/admin/universities', label: 'Universities', icon: GraduationCap },
  { href: '/admin/programs', label: 'Programs', icon: BookOpen },
]

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading])

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    )
  }

  const isActive = (item) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-screen">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo className="text-blue-400" size={26} />
            <div>
              <p className="font-bold text-lg leading-tight">UniApply</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Info + Logout */}
        <div className="px-3 py-4 border-t border-gray-800">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-medium text-white">{user.fullName || user.full_name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white text-sm font-medium transition"
          >
            <LayoutDashboard size={16} />
            View Site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-300 hover:bg-red-600/20 hover:text-red-400 text-sm font-medium transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>

    </div>
  )
}