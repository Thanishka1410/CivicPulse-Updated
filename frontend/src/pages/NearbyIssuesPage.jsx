import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import IssueMap from '../components/map/IssueMap';
import { MapPin, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function NearbyIssuesPage() {
  const { complaints } = useComplaints();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-teal-400" /> Nearby Civic Issues Map
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Explore crowdsourced issue pins across municipal wards (Leaflet.js + OpenStreetMap).
              </p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono">
              Privacy Protected (No User Data Exposed)
            </span>
          </div>

          <IssueMap complaints={complaints} />

        </main>
      </div>
    </div>
  );
}
