'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, GraduationCap, BookOpen,
  FileText, LogOut, GraduationCap as Logo, Menu, X
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
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo className="text-blue-400" size={26} />
          <div>
            <p className="font-bold text-lg leading-tight">UniApply</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
        <button onClick={() => setMobileOpen(false)} className="md:hidden text-gray-400 hover:text-white">
          <X size={22} />
        </button>
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
                active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white text-sm font-medium transition">
          <LayoutDashboard size={16} /> View Site
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-300 hover:bg-red-600/20 hover:text-red-400 text-sm font-medium transition">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-gray-900 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo className="text-blue-400" size={22} />
          <span className="font-bold">Admin Panel</span>
        </Link>
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar — fixed on desktop, slide-in drawer on mobile */}
      <aside className={`
        w-64 bg-gray-900 text-white flex flex-col fixed h-screen z-50 transition-transform duration-300
        md:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* Main Content — offset only on desktop */}
      <main className="md:ml-64">
        {children}
      </main>

    </div>
  )
}