'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import {
  GraduationCap, Bell, FileText, Clock,
  CheckCircle, XCircle, AlertCircle, Send, BookOpen
} from 'lucide-react'

const statusConfig = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-600', icon: FileText },
  SUBMITTED: { label: 'Submitted', color: 'bg-blue-100 text-blue-600', icon: Send },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-600', icon: Clock },
  ACCEPTED: { label: 'Accepted', color: 'bg-green-100 text-green-600', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-600', icon: XCircle },
  WAITLISTED: { label: 'Waitlisted', color: 'bg-purple-100 text-purple-600', icon: AlertCircle },
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('applications')
  const [submitting, setSubmitting] = useState(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading])

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [appsRes, notifRes] = await Promise.all([
        api.get('/applications/me'),
        api.get('/notifications')
      ])
      setApplications(appsRes.data.applications)
      setNotifications(notifRes.data.notifications)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (appId) => {
    setSubmitting(appId)
    try {
      await api.patch(`/applications/${appId}/submit`)
      toast.success('Application submitted successfully!')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit.')
    } finally {
      setSubmitting(null)
    }
  }

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all')
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Loading...
    </div>
  )

  const unreadCount = notifications.filter(n => !n.is_read).length
  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.status !== 'DRAFT').length,
    accepted: applications.filter(a => a.status === 'ACCEPTED').length,
    pending: applications.filter(a => ['SUBMITTED', 'UNDER_REVIEW'].includes(a.status)).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-blue-600 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {user?.fullName || user?.full_name} 👋
              </h1>
              <p className="text-blue-100 mt-1">Track your university applications</p>
            </div>
            <Link href="/universities"
              className="bg-white text-blue-600 px-5 py-2 rounded-xl font-semibold hover:bg-blue-50 transition text-sm">
              Browse Programs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total', value: stats.total, color: 'bg-white/20' },
              { label: 'Submitted', value: stats.submitted, color: 'bg-white/20' },
              { label: 'Pending', value: stats.pending, color: 'bg-white/20' },
              { label: 'Accepted', value: stats.accepted, color: 'bg-green-500/30' },
            ].map((s) => (
              <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-blue-100 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-5 py-2 rounded-xl font-medium transition ${
              activeTab === 'applications'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:border-blue-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <GraduationCap size={16} /> Applications ({stats.total})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-5 py-2 rounded-xl font-medium transition ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:border-blue-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Bell size={16} />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            {applications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-gray-500 font-medium mb-2">No applications yet</h3>
                <p className="text-gray-400 text-sm mb-6">Start by browsing universities and programs</p>
                <Link href="/universities"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  Browse Universities
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => {
                  const status = statusConfig[app.status]
                  const StatusIcon = status.icon
                  return (
                    <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${status.color}`}>
                              <StatusIcon size={12} />
                              {status.label}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg">{app.program_name}</h3>
                          <p className="text-gray-500 text-sm">{app.university_name} · {app.university_country}</p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-400">
                            <span>{app.category?.replace('_', ' ')}</span>
                            <span>{app.degree_level}</span>
                            {app.tuition_fee && <span>${app.tuition_fee.toLocaleString()}/yr</span>}
                          </div>
                          {app.notes && (
                            <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                              📝 {app.notes}
                            </p>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400 mb-3">
                            {new Date(app.created_at).toLocaleDateString()}
                          </p>
                          {app.status === 'DRAFT' && (
                            <button
                              onClick={() => handleSubmit(app.id)}
                              disabled={submitting === app.id}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                            >
                              {submitting === app.id ? 'Submitting...' : 'Submit'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            {unreadCount > 0 && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={markAllRead}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Mark all as read
                </button>
              </div>
            )}
            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Bell className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id}
                    className={`bg-white rounded-2xl border p-5 shadow-sm ${
                      !notif.is_read ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{notif.title}</p>
                        <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                      </div>
                      {!notif.is_read && (
                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}