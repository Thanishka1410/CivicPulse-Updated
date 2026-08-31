import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import PointsWidget from '../components/gamification/PointsWidget';
import { User, Mail, ShieldCheck, Award, MapPin, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
          
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-sky-400" /> Account Profile
            </h1>
            <p className="text-xs text-slate-400 mt-1">Manage user identity, assigned ward, and civic gamification stats.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* User Info Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg text-xs">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500 to-teal-400 p-1 shadow-xl">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-sky-400 font-extrabold text-2xl">
                    {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                </div>
                <h3 className="text-base font-bold text-white">{currentUser?.name}</h3>
                <span className="px-3 py-0.5 rounded-full font-bold uppercase text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  {currentUser?.role || 'Citizen'}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">{currentUser?.email}</span>
                </div>
                {currentUser?.assignedLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{currentUser.assignedLocation}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Member since August 2026</span>
                </div>
              </div>

              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full py-2.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 text-rose-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors mt-4"
              >
                <LogOut className="w-4 h-4 text-rose-400" /> Sign Out
              </button>
            </div>

            {/* Gamification Points Widget for Citizens */}
            <div className="md:col-span-2">
              <PointsWidget points={currentUser?.points || 250} complaintCount={2} />
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
