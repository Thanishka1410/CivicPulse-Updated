import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Star, Award, ShieldCheck } from 'lucide-react';

// Custom Tooltip component for Recharts pie & bar charts to guarantee high contrast visibility
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white text-slate-900 font-sans p-3 rounded-xl border border-slate-200 shadow-2xl space-y-1 text-xs">
        <p className="font-extrabold text-slate-900">{data.name || data.payload?.category || 'Category'}</p>
        <div className="flex items-center justify-between gap-3 text-slate-700 font-mono">
          <span>Count / Value:</span>
          <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            {data.value}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

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
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 flex flex-col transition-colors">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white light:text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-sky-400" /> Municipal Governance Analytics
              </h1>
              <p className="text-xs text-slate-400 light:text-slate-600 mt-1">Data-driven performance metrics, resolution rates, and satisfaction scores.</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full">
              Real-Time Firestore Sync
            </span>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-5 space-y-1 shadow-md">
              <span className="text-xs text-slate-400 light:text-slate-600 font-medium">Total Complaints</span>
              <p className="text-3xl font-extrabold text-white light:text-slate-900">{total}</p>
            </div>
            <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-5 space-y-1 shadow-md">
              <span className="text-xs text-slate-400 light:text-slate-600 font-medium">Resolution Rate</span>
              <p className="text-3xl font-extrabold text-emerald-400 light:text-emerald-600">{resolutionRate}%</p>
            </div>
            <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-5 space-y-1 shadow-md">
              <span className="text-xs text-slate-400 light:text-slate-600 font-medium">Avg Resolution Time</span>
              <p className="text-3xl font-extrabold text-sky-400 light:text-sky-600">36 Hrs</p>
            </div>
            <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-5 space-y-1 shadow-md">
              <span className="text-xs text-slate-400 light:text-slate-600 font-medium">Citizen Rating</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-3xl font-extrabold text-amber-400 light:text-amber-500">4.8</span>
                <Star className="w-5 h-5 text-amber-400 light:text-amber-500 fill-current" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pie Chart */}
            <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white light:text-slate-900">Grievance Status Breakdown</h3>
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
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white light:text-slate-900">Complaints by Civic Category</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="category" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
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
