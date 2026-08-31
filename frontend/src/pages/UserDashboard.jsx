import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import RAGAssistantModal from '../components/chat/RAGAssistantModal';
import {
  PlusCircle,
  FileText,
  MapPin,
  Bot,
  Award,
  User,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const { complaints } = useComplaints();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  // User specific complaints
  const myComplaints = complaints.filter(c => c.userId === currentUser?.uid || c.userEmail === currentUser?.email);
  const activeCount = myComplaints.filter(c => !['Resolved', 'Cancelled'].includes(c.status)).length;
  const resolvedCount = myComplaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-teal-950 border border-sky-800/40 rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Empowering Citizens & Authorities
              </div>
              <h1 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight">
                Hello, {currentUser?.name || 'Citizen'}!
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Found a pothole, garbage overflow, or broken streetlight? Report it instantly using AI visual detection & Web Speech voice input.
              </p>

              {/* Prominent Action Button */}
              <div className="pt-2">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-teal-400 hover:brightness-110 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-sky-500/20 transition-all hover:scale-[1.02]"
                >
                  <PlusCircle className="w-5 h-5" />
                  Report a Civic Issue (+100 Pts)
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-slate-400 font-medium">My Total Reports</span>
              <p className="text-2xl font-extrabold text-white">{myComplaints.length}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-slate-400 font-medium">In Progress</span>
              <p className="text-2xl font-extrabold text-purple-400">{activeCount}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Resolved</span>
              <p className="text-2xl font-extrabold text-emerald-400">{resolvedCount}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Civic Rewards Score</span>
              <p className="text-2xl font-extrabold text-amber-400">{currentUser?.points || 0} Pts</p>
            </div>
          </div>

          {/* Core Feature Navigation Cards Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Core Platform Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <Link to="/report" className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-5 space-y-3 group transition-all">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">Report Issue</h4>
                  <p className="text-xs text-slate-400 mt-1">Upload evidence photo, run TensorFlow.js AI classification & locate on map.</p>
                </div>
              </Link>

              <Link to="/my-complaints" className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 space-y-3 group transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">My Complaints</h4>
                  <p className="text-xs text-slate-400 mt-1">Track 5-step status timeline, view resolution proof photos, or reopen issues.</p>
                </div>
              </Link>

              <Link to="/nearby" className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 space-y-3 group transition-all">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">Nearby Issues Map</h4>
                  <p className="text-xs text-slate-400 mt-1">Explore live civic issue pins across your neighborhood on Leaflet map.</p>
                </div>
              </Link>

              <button onClick={() => setIsChatOpen(true)} className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-3 text-left group transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">RAG AI Assistant</h4>
                  <p className="text-xs text-slate-400 mt-1">Ask questions about civic procedures, department mappings & app usage.</p>
                </div>
              </button>

              <Link to="/points" className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 space-y-3 group transition-all">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">Points & Leaderboard</h4>
                  <p className="text-xs text-slate-400 mt-1">Earn badges like Civic Contributor, Active Reporter, and Civic Champion.</p>
                </div>
              </Link>

              <Link to="/profile" className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-3 group transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Citizen Profile</h4>
                  <p className="text-xs text-slate-400 mt-1">View account details, contribution rank, and notification preferences.</p>
                </div>
              </Link>

            </div>
          </div>

        </main>
      </div>

      <RAGAssistantModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
