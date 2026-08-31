import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck, XCircle, RotateCcw } from 'lucide-react';

const STAGES = ['Submitted', 'Acknowledged', 'In Progress', 'Work Completed', 'Resolved'];

export default function Timeline({ status, statusHistory = [], cancellationReason = '', reopenReason = '' }) {
  const isCancelled = status === 'Cancelled';
  const isReopened = status === 'Reopened';

  // Determine active step index
  let currentIndex = STAGES.indexOf(status);
  if (currentIndex === -1) {
    if (isReopened) currentIndex = 2; // Treat as In Progress phase
    else currentIndex = 0;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 my-4">
      <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center justify-between">
        <span>Complaint Status Lifecycle</span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
          isCancelled ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
          isReopened ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
          status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
          'bg-sky-500/20 text-sky-400 border-sky-500/30'
        }`}>
          Current Status: {status}
        </span>
      </h4>

      {/* Special status banners */}
      {isCancelled && (
        <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800/50 rounded-lg flex items-start gap-3 text-rose-300 text-sm">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Complaint Cancelled by Admin</span>
            <p className="text-xs text-rose-200/80 mt-0.5">{cancellationReason || 'Marked invalid or duplicate by area inspector.'}</p>
          </div>
        </div>
      )}

      {isReopened && (
        <div className="mb-4 p-3 bg-amber-950/40 border border-amber-800/50 rounded-lg flex items-start gap-3 text-amber-300 text-sm">
          <RotateCcw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Complaint Reopened by Citizen</span>
            <p className="text-xs text-amber-200/80 mt-0.5">{reopenReason || 'Issue reported as unresolved.'}</p>
          </div>
        </div>
      )}

      {/* 5-Step Timeline Graph */}
      {!isCancelled && (
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 my-2">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-5 left-8 right-8 h-0.5 bg-slate-800 z-0" />
          <div
            className="hidden md:block absolute top-5 left-8 h-0.5 bg-sky-500 transition-all duration-500 z-0"
            style={{ width: `${(currentIndex / (STAGES.length - 1)) * 88}%` }}
          />

          {STAGES.map((step, idx) => {
            const isPassed = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center flex-1">
                {/* Step Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                  isCurrent ? 'bg-sky-600 border-sky-400 text-white shadow-lg shadow-sky-500/40 ring-4 ring-sky-500/20' :
                  isPassed ? 'bg-slate-800 border-sky-500 text-sky-400' :
                  'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {isPassed ? <CheckCircle2 className="w-5 h-5 text-sky-400" /> : idx + 1}
                </div>

                {/* Step Title */}
                <div>
                  <p className={`text-xs font-semibold ${isPassed ? 'text-slate-200' : 'text-slate-500'}`}>
                    {step}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Status History Log */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <h5 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Status Audit Log</h5>
        <div className="space-y-2.5">
          {statusHistory.map((hist, i) => (
            <div key={i} className="text-xs flex items-start gap-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
              <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>{hist.status}</span>
                  <span className="text-[11px] text-slate-500">{new Date(hist.timestamp).toLocaleString()}</span>
                </div>
                {hist.note && <p className="text-slate-400 mt-0.5">{hist.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
