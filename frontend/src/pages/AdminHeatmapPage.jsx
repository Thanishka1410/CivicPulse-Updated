import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import HeatmapLayer from '../components/map/HeatmapLayer';

export default function AdminHeatmapPage() {
  const { complaints } = useComplaints();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
          <HeatmapLayer complaints={complaints} />
        </main>
      </div>
    </div>
  );
}
