import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { STATUS_LABELS, AP_DEFAULT_LAT, AP_DEFAULT_LNG } from '../../utils/categories';
import { MapPin, Calendar, CheckCircle2, Filter } from 'lucide-react';

const createCategoryIcon = (color = '#3b82f6') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="28" height="28" stroke="#ffffff" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="#ffffff"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export default function IssueMap({ complaints = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filtered = complaints.filter(c => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
    return true;
  });

  const center = complaints.length > 0
    ? [complaints[0].latitude, complaints[0].longitude]
    : [AP_DEFAULT_LAT, AP_DEFAULT_LNG];

  return (
    <div className="space-y-4">
      
      {/* Map Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Filter className="w-4 h-4 text-sky-400" />
          <span>Filter Map Pins:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Potholes">Potholes</option>
            <option value="Garbage">Garbage</option>
            <option value="Traffic & Street Lights">Traffic & Street Lights</option>
            <option value="Sewerage">Sewerage</option>
            <option value="Electricity Issue / Current Poles">Electricity</option>
            <option value="Others">Others</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="In Progress">In Progress</option>
            <option value="Work Completed">Work Completed</option>
            <option value="Resolved">Resolved</option>
          </select>

          <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2.5 py-1 rounded-xl">
            {filtered.length} Markers Shown
          </span>
        </div>
      </div>

      {/* Map Window */}
      <div className="h-[500px] w-full rounded-2xl border border-slate-800 overflow-hidden relative shadow-xl">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map(c => {
            const statusConfig = STATUS_LABELS[c.status] || { label: c.status, color: 'bg-blue-500/20 text-blue-400' };
            const markerColor = c.status === 'Resolved' ? '#10b981' : c.status === 'In Progress' ? '#8b5cf6' : '#3b82f6';

            return (
              <Marker
                key={c.complaintId}
                position={[c.latitude, c.longitude]}
                icon={createCategoryIcon(markerColor)}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 space-y-2 max-w-xs text-xs text-slate-900">
                    {c.imageUrl && (
                      <img src={c.imageUrl} alt={c.category} className="w-full h-28 object-cover rounded-lg" />
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{c.category}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {c.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{c.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono border-t pt-1">
                      ID: {c.complaintId} • {c.location}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

    </div>
  );
}
