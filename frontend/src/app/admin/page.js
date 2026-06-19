'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

const statusConfig = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  SUBMITTED: { label: 'Submitted', color: 'bg-blue-100 text-blue-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-600' },
  ACCEPTED: { label: 'Accepted', color: 'bg-green-100 text-green-600' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-600' },
  WAITLISTED: { label: 'Waitlisted', color: 'bg-purple-100 text-purple-600' },
}

export default function AdminPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [updating, setUpdating] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchApplications()
  }, [user])

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications')
      setApplications(res.data.applications)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (appId, status) => {
    setUpdating(appId)
    try {
      await api.patch(`/applications/${appId}/status`, { status, notes })
      toast.success(`Application ${status}!`)
      setSelectedApp(null)
      setNotes('')
      fetchApplications()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update.')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  )

  const filtered = filter === 'ALL' ? applications : applications.filter(a => a.status === filter)

  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.status === 'SUBMITTED').length,
    review: applications.filter(a => a.status === 'UNDER_REVIEW').length,
    accepted: applications.filter(a => a.status === 'ACCEPTED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500 mt-1">Manage all university applications</p>

        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700' },
            { label: 'Submitted', value: stats.submitted, color: 'bg-blue-50 text-blue-700' },
            { label: 'In Review', value: stats.review, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Accepted', value: stats.accepted, color: 'bg-green-50 text-green-700' },
            { label: 'Rejected', value: stats.rejected, color: 'bg-red-50 text-red-700' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 py-6">

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WAITLISTED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === s ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border hover:border-gray-300'
              }`}
            >
              {s === 'ALL' ? `All (${stats.total})` : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
            No applications found.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => {
              const status = statusConfig[app.status]
              return (
                <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-lg">{app.program_name}</h3>
                      <p className="text-gray-500 text-sm">{app.university_name}</p>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">
                            {app.student_name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{app.student_name}</p>
                          <p className="text-xs text-gray-400">{app.student_email} · {app.nationality}</p>
                        </div>
                      </div>

                      {app.notes && (
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                          📝 {app.notes}
                        </p>
                      )}
                    </div>

                    {(app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW') && (
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {app.status === 'SUBMITTED' && (
                          <button
                            onClick={() => updateStatus(app.id, 'UNDER_REVIEW')}
                            disabled={updating === app.id}
                            className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition"
                          >
                            <Clock size={14} /> Review
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedApp(app); setNotes('') }}
                          className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, 'REJECTED')}
                          disabled={updating === app.id}
                          className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Accept Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Accept Application</h2>
            <p className="text-gray-500 mb-6">{selectedApp.student_name} — {selectedApp.program_name}</p>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes for student (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="e.g. Strong academic background. Welcome!"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedApp(null)}
                className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => updateStatus(selectedApp.id, 'ACCEPTED')}
                disabled={updating === selectedApp.id}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
              >
                {updating ? 'Accepting...' : 'Confirm Accept'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}