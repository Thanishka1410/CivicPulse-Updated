import React from 'react';
import { AlertTriangle, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function DuplicateChecker({ duplicates = [], onProceedAnyway, onViewExisting }) {
  if (!duplicates || duplicates.length === 0) return null;

  const firstDup = duplicates[0];

  return (
    <div className="bg-amber-950/40 border border-amber-800/80 rounded-2xl p-5 my-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-300">
            A similar civic issue has already been reported nearby.
          </h4>
          <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
            CivicPulse duplicate detection engine found active complaint <strong className="text-white">{firstDup.complaintId}</strong> within {firstDup.distanceMeters || 120} meters of your location.
          </p>
        </div>
      </div>

      {/* Duplicate Summary Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-200">{firstDup.category}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Status: {firstDup.status}
          </span>
        </div>
        <p className="text-slate-400 line-clamp-2">{firstDup.description}</p>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-800">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {firstDup.location}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {new Date(firstDup.createdAt).toLocaleDateText || 'Recent'}</span>
        </div>
      </div>

      {/* Decision Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => onViewExisting && onViewExisting(firstDup)}
          className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors text-center"
        >
          View Existing Complaint
        </button>
        <button
          type="button"
          onClick={onProceedAnyway}
          className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-colors text-center shadow-md"
        >
          Continue Reporting Different Issue
        </button>
      </div>
    </div>
  );
}
