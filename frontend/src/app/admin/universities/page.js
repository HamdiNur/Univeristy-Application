'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, MapPin, Trophy, ArrowLeft, X } from 'lucide-react'

const emptyForm = {
  name: '', country: '', city: '', website: '', email: '',
  description: '', ranking: '', foundedYear: ''
}

export default function AdminUniversitiesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) router.push('/')
  }, [user, authLoading])

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchUniversities()
  }, [user])

  const fetchUniversities = async () => {
    try {
      const res = await api.get('/universities', { params: { limit: 100 } })
      setUniversities(res.data.universities)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (uni) => {
    setEditingId(uni.id)
    setForm({
      name: uni.name || '',
      country: uni.country || '',
      city: uni.city || '',
      website: uni.website || '',
      email: uni.email || '',
      description: uni.description || '',
      ranking: uni.ranking || '',
      foundedYear: uni.founded_year || ''
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        ranking: form.ranking ? parseInt(form.ranking) : null,
        foundedYear: form.foundedYear ? parseInt(form.foundedYear) : null
      }
      if (editingId) {
        await api.put(`/universities/${editingId}`, payload)
        toast.success('University updated!')
      } else {
        await api.post('/universities', payload)
        toast.success('University created!')
      }
      setShowModal(false)
      fetchUniversities()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this university?')) return
    try {
      await api.delete(`/universities/${id}`)
      toast.success('University deactivated.')
      fetchUniversities()
    } catch (err) {
      toast.error('Failed to delete.')
    }
  }

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gray-900 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition text-sm">
            <ArrowLeft size={16} /> Back to Admin Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Manage Universities</h1>
              <p className="text-gray-400">{universities.length} universities total</p>
            </div>
            <button
              onClick={openCreate}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={18} /> Add University
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {universities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
            No universities yet. Click "Add University" to create one.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {universities.map((uni) => (
              <div key={uni.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{uni.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin size={13} /> {uni.city}, {uni.country}
                    </div>
                    {uni.ranking && (
                      <div className="flex items-center gap-1 text-yellow-600 text-sm mt-1">
                        <Trophy size={13} /> Ranked #{uni.ranking}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{uni.total_programs} programs</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(uni)}
                      className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(uni.id)}
                      className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit University' : 'Add New University'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ranking</label>
                  <input type="number" value={form.ranking} onChange={(e) => setForm({ ...form, ranking: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                  <input type="number" value={form.foundedYear} onChange={(e) => setForm({ ...form, foundedYear: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}