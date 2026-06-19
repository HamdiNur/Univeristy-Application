'use client'
import Link from 'next/link'
import { GraduationCap, Search, FileText, Bell, ArrowRight, BookOpen, Users, Globe } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Find Your Dream University <br /> & Apply Online
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Discover thousands of programs across top universities worldwide.
            Apply, track your application, and get notified — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/universities"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition flex items-center gap-2 justify-center">
              <Search size={20} />
              Browse Universities
            </Link>
            <Link href="/register"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center">
              Get Started Free
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-600">500+</p>
            <p className="text-gray-600 mt-1">Universities</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">2,000+</p>
            <p className="text-gray-600 mt-1">Programs</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">10,000+</p>
            <p className="text-gray-600 mt-1">Students</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Apply to your dream university in 3 simple steps
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Discover</h3>
              <p className="text-gray-500">Search and filter universities by country, program, degree level and tuition fee.</p>
            </div>
            <div className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Apply</h3>
              <p className="text-gray-500">Submit your application with your documents, cover letter and personal details.</p>
            </div>
            <div className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Notified</h3>
              <p className="text-gray-500">Track your application status and get instant notifications on every update.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Popular Programs
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Explore top programs students are applying to
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Medicine', icon: '🏥', color: 'bg-red-50 text-red-600 border-red-100' },
              { name: 'Information Technology', icon: '💻', color: 'bg-blue-50 text-blue-600 border-blue-100' },
              { name: 'Engineering', icon: '⚙️', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
              { name: 'Business', icon: '📊', color: 'bg-green-50 text-green-600 border-green-100' },
              { name: 'Law', icon: '⚖️', color: 'bg-purple-50 text-purple-600 border-purple-100' },
              { name: 'Architecture', icon: '🏛️', color: 'bg-orange-50 text-orange-600 border-orange-100' },
              { name: 'Science', icon: '🔬', color: 'bg-teal-50 text-teal-600 border-teal-100' },
              { name: 'Arts', icon: '🎨', color: 'bg-pink-50 text-pink-600 border-pink-100' },
            ].map((program) => (
              <Link
                key={program.name}
                href={`/programs?category=${program.name.toUpperCase().replace(' ', '_')}`}
                className={`border rounded-xl p-4 text-center hover:shadow-md transition ${program.color}`}
              >
                <div className="text-3xl mb-2">{program.icon}</div>
                <p className="font-medium text-sm">{program.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <GraduationCap size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of students who found their perfect university through UniApply.
          </p>
          <Link href="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition inline-flex items-center gap-2">
            Create Free Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>© 2026 UniApply. Built for students, by students. 🎓</p>
      </footer>

    </div>
  )
}