import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Star, Award, ShieldCheck } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { complaints } = useComplaints();

  const total = complaints.length;
  const submitted = complaints.filter(c => c.status === 'Submitted').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const cancelled = complaints.filter(c => c.status === 'Cancelled').length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Status chart data
  const statusData = [
    { name: 'Submitted', value: submitted, color: '#3b82f6' },
    { name: 'In Progress', value: inProgress, color: '#a855f7' },
    { name: 'Resolved', value: resolved, color: '#10b981' },
    { name: 'Cancelled', value: cancelled, color: '#64748b' }
  ];

  // Category breakdown chart data
  const categoryCounts = {};
  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const categoryData = Object.keys(categoryCounts).map(cat => ({
    category: cat,
    count: categoryCounts[cat]
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-sky-400" /> Municipal Governance Analytics
              </h1>
              <p className="text-xs text-slate-400 mt-1">Data-driven performance metrics, resolution rates, and satisfaction scores.</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full">
              Real-Time Firestore Sync
            </span>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Total Complaints</span>
              <p className="text-3xl font-extrabold text-white">{total}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Resolution Rate</span>
              <p className="text-3xl font-extrabold text-emerald-400">{resolutionRate}%</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Avg Resolution Time</span>
              <p className="text-3xl font-extrabold text-sky-400">36 Hrs</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Citizen Rating</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-3xl font-extrabold text-amber-400">4.8</span>
                <Star className="w-5 h-5 text-amber-400 fill-current" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pie Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Grievance Status Breakdown</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {statusData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Complaints by Civic Category</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="category" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
