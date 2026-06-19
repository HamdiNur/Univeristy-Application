"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Users,
  BookOpen,
  Calendar,
  Star,
  Briefcase,
  FileText,
  CheckCircle,
} from "lucide-react";

const categoryColors = {
  MEDICINE: "bg-red-100 text-red-600",
  INFORMATION_TECHNOLOGY: "bg-blue-100 text-blue-600",
  ENGINEERING: "bg-yellow-100 text-yellow-600",
  BUSINESS: "bg-green-100 text-green-600",
  LAW: "bg-purple-100 text-purple-600",
  ARTS: "bg-pink-100 text-pink-600",
  SCIENCE: "bg-teal-100 text-teal-600",
  EDUCATION: "bg-orange-100 text-orange-600",
  ARCHITECTURE: "bg-indigo-100 text-indigo-600",
  OTHER: "bg-gray-100 text-gray-600",
};

export default function ProgramDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/programs/${id}`);
        setProgram(res.data.program);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to apply.");
      router.push("/login");
      return;
    }
    setApplying(true);
    try {
      await api.post("/applications", { programId: id, coverLetter });
      toast.success("Application created! Go to dashboard to submit it.");
      setShowModal(false);
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply.");
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  if (!program)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Program not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-blue-600 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex gap-2 mb-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[program.category]}`}
                >
                  {program.category.replace("_", " ")}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
                  {program.degree_level}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{program.name}</h1>
              <p className="text-blue-100 text-lg">
                {program.university_name} — {program.university_city},{" "}
                {program.university_country}
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition flex-shrink-0"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            {program.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 text-lg mb-3">
                  About This Program
                </h2>
                <p className="text-gray-600">{program.description}</p>
              </div>
            )}

            {/* Course Outline */}
            {program.course_outline && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-600" /> Course
                  Outline
                </h2>
                <p className="text-gray-600">{program.course_outline}</p>
              </div>
            )}

            {/* Career Prospects */}
            {program.career_prospects && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                  <Briefcase size={18} className="text-green-600" /> Career
                  Prospects
                </h2>
                <p className="text-gray-600">{program.career_prospects}</p>
              </div>
            )}

            {/* Required Documents */}
            {program.required_documents?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-purple-600" /> Required
                  Documents
                </h2>
                <div className="space-y-2">
                  {program.required_documents.map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <CheckCircle size={16} className="text-green-500" />
                      {doc.replace("_", " ")}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 text-lg mb-4">
                Program Info
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock size={18} className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="font-medium">
                      {program.duration_years} Years
                    </p>
                  </div>
                </div>
                {program.tuition_fee && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <DollarSign size={18} className="text-green-500" />
                    <div>
                      <p className="text-xs text-gray-400">Tuition Fee</p>
                      <p className="font-medium">
                        ${program.tuition_fee.toLocaleString()} / year
                      </p>
                    </div>
                  </div>
                )}
                {program.available_seats && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users size={18} className="text-purple-500" />
                    <div>
                      <p className="text-xs text-gray-400">Available Seats</p>
                      <p className="font-medium">
                        {program.available_seats} seats
                      </p>
                    </div>
                  </div>
                )}
                {program.min_gpa && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Star size={18} className="text-yellow-500" />
                    <div>
                      <p className="text-xs text-gray-400">Minimum GPA</p>
                      <p className="font-medium">{program.min_gpa}</p>
                    </div>
                  </div>
                )}
                {program.application_deadline && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={18} className="text-red-500" />
                    <div>
                      <p className="text-xs text-gray-400">
                        Application Deadline
                      </p>
                      <p className="font-medium">
                        {new Date(
                          program.application_deadline,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600">
                  <BookOpen size={18} className="text-teal-500" />
                  <div>
                    <p className="text-xs text-gray-400">Language</p>
                    <p className="font-medium">{program.language}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Apply to {program.name}
            </h2>
            <p className="text-gray-500 mb-6">{program.university_name}</p>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter (optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
              placeholder="Tell us why you want to join this program..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {applying ? "Applying..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
