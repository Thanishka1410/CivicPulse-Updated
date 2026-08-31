import React from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { Building2, Award, CheckCircle2, Star, TrendingUp, ShieldCheck } from 'lucide-react';

export default function DepartmentPerformancePage() {
  const DEPARTMENTS = [
    { name: 'Road Maintenance', total: 42, resolved: 36, rate: 85, avgTime: '28h', score: 4.7 },
    { name: 'Garbage & Waste Management', total: 58, resolved: 52, rate: 89, avgTime: '18h', score: 4.9 },
    { name: 'Electrical & Traffic Maintenance', total: 50, resolved: 46, rate: 92, avgTime: '16h', score: 4.9 },
    { name: 'Water & Sewage Board', total: 29, resolved: 24, rate: 82, avgTime: '34h', score: 4.6 },
    { name: 'General Administration', total: 14, resolved: 13, rate: 93, avgTime: '14h', score: 4.8 }
  ];

  const WARD_RANKINGS = [
    { rank: 1, ward: 'Ward 1 - Central Downtown', rate: '94%', speed: '16 Hrs', score: 4.9, status: 'Top Rated' },
    { rank: 2, ward: 'Ward 2 - Metro East', rate: '91%', speed: '20 Hrs', score: 4.8, status: 'Excellent' },
    { rank: 3, ward: 'Ward 3 - West Riverside', rate: '86%', speed: '28 Hrs', score: 4.6, status: 'Good' },
    { rank: 4, ward: 'Ward 4 - North Zone', rate: '82%', speed: '32 Hrs', score: 4.5, status: 'Satisfactory' },
    { rank: 5, ward: 'Ward 5 - South Industrial', rate: '78%', speed: '40 Hrs', score: 4.3, status: 'Needs Improvement' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
          
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-sky-400" /> Department Performance & Ward Rankings
            </h1>
            <p className="text-xs text-slate-400 mt-1">Benchmarking resolution efficiency across municipal divisions.</p>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEPARTMENTS.map(dept => (
              <div key={dept.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{dept.name}</h3>
                  <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                    {dept.rate}% Resolution
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Total</span>
                    <span className="font-bold text-white text-base">{dept.total}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Avg Time</span>
                    <span className="font-bold text-sky-400 text-base">{dept.avgTime}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Rating</span>
                    <span className="font-bold text-amber-400 text-base">{dept.score}★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ward Rankings Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Ward Governance Performance Rankings
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Rank</th>
                    <th className="p-4">Ward Name</th>
                    <th className="p-4">Resolution Rate</th>
                    <th className="p-4">Avg Speed</th>
                    <th className="p-4">Citizen Feedback</th>
                    <th className="p-4 text-right">Performance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {WARD_RANKINGS.map(w => (
                    <tr key={w.ward} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold font-mono text-amber-400">#{w.rank}</td>
                      <td className="p-4 font-bold text-white">{w.ward}</td>
                      <td className="p-4 font-semibold text-emerald-400">{w.rate}</td>
                      <td className="p-4 text-sky-400 font-mono">{w.speed}</td>
                      <td className="p-4 text-amber-400 font-bold">{w.score} ★</td>
                      <td className="p-4 text-right">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
