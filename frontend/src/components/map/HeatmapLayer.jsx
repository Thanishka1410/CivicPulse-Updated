import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Flame, AlertTriangle } from 'lucide-react';

export default function HeatmapLayer({ complaints = [] }) {
  const center = complaints.length > 0
    ? [complaints[0].latitude, complaints[0].longitude]
    : [40.7128, -74.0060];

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Civic Hotspot Heatmap Density</h3>
            <p className="text-xs text-slate-400">High-density complaint zone visualizer for municipal ward inspection.</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1 text-rose-400"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span> High Density Hotspot</span>
          <span className="flex items-center gap-1 text-amber-400"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Medium Density</span>
          <span className="flex items-center gap-1 text-sky-400"><span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span> Low Density</span>
        </div>
      </div>

      <div className="h-[520px] w-full rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl">
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

          {complaints.map(c => {
            const isHighRisk = c.urgency === 'Critical' || c.urgency === 'High';
            const radius = isHighRisk ? 35 : 22;
            const color = isHighRisk ? '#ef4444' : '#f59e0b';

            return (
              <CircleMarker
                key={c.complaintId}
                center={[c.latitude, c.longitude]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.45,
                  color: color,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="p-1 text-xs text-slate-900">
                    <span className="font-bold block">{c.category} ({c.urgency || 'Normal'})</span>
                    <span>{c.location}</span>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
