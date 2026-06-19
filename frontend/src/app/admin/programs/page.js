'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, Clock, DollarSign, Users } from 'lucide-react'

const categories = [
  'MEDICINE', 'INFORMATION_TECHNOLOGY', 'ENGINEERING', 'BUSINESS',
  'LAW', 'ARTS', 'SCIENCE', 'EDUCATION', 'ARCHITECTURE', 'OTHER'
]
const degreeLevels = ['BACHELOR', 'MASTER', 'PHD', 'DIPLOMA', 'CERTIFICATE']
const documentTypes = ['TRANSCRIPT', 'CV', 'MOTIVATION_LETTER', 'RECOMMENDATION_LETTER', 'PASSPORT', 'LANGUAGE_CERTIFICATE', 'OTHER']

const emptyForm = {
  universityId: '', name: '', category: 'MEDICINE', degreeLevel: 'BACHELOR',
  description: '', durationYears: '', tuitionFee: '', language: 'English',
  availableSeats: '', applicationDeadline: '', minGPA: '',
  courseOutline: '', careerProspects: '', requiredDocuments: []
}

export default function AdminProgramsPage() {
  const { user } = useAuth()
  const [programs, setPrograms] = useState([])
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [progRes, uniRes] = await Promise.all([
        api.get('/programs', { params: { limit: 100 } }),
        api.get('/universities', { params: { limit: 100 } })
      ])
      setPrograms(progRes.data.programs)
      setUniversities(uniRes.data.universities)
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

  const openEdit = (p) => {
    setEditingId(p.id)
    setForm({
      universityId: p.university_id,
      name: p.name,
      category: p.category,
      degreeLevel: p.degree_level,
      description: p.description || '',
      durationYears: p.duration_years || '',
      tuitionFee: p.tuition_fee || '',
      language: p.language || 'English',
      availableSeats: p.available_seats || '',
      applicationDeadline: p.application_deadline ? p.application_deadline.split('T')[0] : '',
      minGPA: p.min_gpa || '',
      courseOutline: p.course_outline || '',
      careerProspects: p.career_prospects || '',
      requiredDocuments: p.required_documents || []
    })
    setShowModal(true)
  }

  const toggleDoc = (doc) => {
    setForm((f) => ({
      ...f,
      requiredDocuments: f.requiredDocuments.includes(doc)
        ? f.requiredDocuments.filter(d => d !== doc)
        : [...f.requiredDocuments, doc]
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        durationYears: parseFloat(form.durationYears),
        tuitionFee: form.tuitionFee ? parseFloat(form.tuitionFee) : null,
        availableSeats: form.availableSeats ? parseInt(form.availableSeats) : null,
        minGPA: form.minGPA ? parseFloat(form.minGPA) : null,
        applicationDeadline: form.applicationDeadline || null,
      }
      if (editingId) {
        await api.put(`/programs/${editingId}`, payload)
        toast.success('Program updated!')
      } else {
        await api.post('/programs', payload)
        toast.success('Program created!')
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this program?')) return
    try {
      await api.delete(`/programs/${id}`)
      toast.success('Program deactivated.')
      fetchData()
    } catch (err) {
      toast.error('Failed to delete.')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Programs</h1>
          <p className="text-gray-500 mt-1">{programs.length} programs total</p>
        </div>
        <button
          onClick={openCreate}
          disabled={universities.length === 0}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          <Plus size={18} /> Add Program
        </button>
      </div>

      <div className="px-8 py-6">
        {universities.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-4 mb-6 text-sm">
            ⚠️ You need to add a university first before creating programs.
          </div>
        )}

        {programs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
            No programs yet. Click "Add Program" to create one.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {programs.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-600">
                        {p.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        {p.degree_level}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                    <p className="text-gray-500 text-sm">{p.university_name}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={12} /> {p.duration_years}y</span>
                      {p.tuition_fee && <span className="flex items-center gap-1"><DollarSign size={12} /> ${p.tuition_fee}</span>}
                      {p.available_seats && <span className="flex items-center gap-1"><Users size={12} /> {p.available_seats}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition">
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
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Program' : 'Add New Program'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                <select required value={form.universityId} onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select university</option>
                  {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Bachelor of Computer Science"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {categories.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree Level *</label>
                  <select required value={form.degreeLevel} onChange={(e) => setForm({ ...form, degreeLevel: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {degreeLevels.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (yrs) *</label>
                  <input required type="number" step="0.5" value={form.durationYears}
                    onChange={(e) => setForm({ ...form, durationYears: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee ($)</label>
                  <input type="number" value={form.tuitionFee} onChange={(e) => setForm({ ...form, tuitionFee: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                  <input type="number" value={form.availableSeats} onChange={(e) => setForm({ ...form, availableSeats: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min GPA</label>
                  <input type="number" step="0.1" value={form.minGPA} onChange={(e) => setForm({ ...form, minGPA: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input type="date" value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Outline</label>
                <textarea rows={2} value={form.courseOutline} onChange={(e) => setForm({ ...form, courseOutline: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Career Prospects</label>
                <textarea rows={2} value={form.careerProspects} onChange={(e) => setForm({ ...form, careerProspects: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
                <div className="flex flex-wrap gap-2">
                  {documentTypes.map((doc) => (
                    <button
                      key={doc}
                      type="button"
                      onClick={() => toggleDoc(doc)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        form.requiredDocuments.includes(doc)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {doc.replace('_', ' ')}
                    </button>
                  ))}
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