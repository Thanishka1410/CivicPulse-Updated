import React from 'react';
import { Award, Trophy, ShieldAlert, Star, Zap, CheckCircle2 } from 'lucide-react';

export default function PointsWidget({ points = 250, complaintCount = 2 }) {
  const BADGES = [
    {
      title: 'Civic Contributor',
      minPoints: 100,
      icon: Award,
      color: 'from-amber-500 to-yellow-400',
      description: 'Submitted first verified civic issue report.'
    },
    {
      title: 'Active Reporter',
      minPoints: 500,
      icon: Trophy,
      color: 'from-sky-500 to-teal-400',
      description: 'Active citizen contributing 500+ governance points.'
    },
    {
      title: 'Civic Champion',
      minPoints: 1000,
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      description: 'Top governance champion with 1000+ points.'
    }
  ];

  // Current level determination
  const nextBadge = BADGES.find(b => points < b.minPoints) || BADGES[BADGES.length - 1];
  const progressPercent = Math.min(100, Math.round((points / nextBadge.minPoints) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      
      {/* Total Score Banner */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-950/60 to-teal-950/60 border border-sky-800/40 rounded-xl">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Civic Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-amber-400">{points}</span>
            <span className="text-xs font-bold text-slate-400">Points</span>
          </div>
        </div>

        <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
          <Award className="w-7 h-7" />
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Next Rank: <strong className="text-sky-300">{nextBadge.title}</strong></span>
          <span className="font-mono font-bold text-sky-400">{points} / {nextBadge.minPoints} Pts</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 via-sky-400 to-teal-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Badges List */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Earned Civic Badges</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BADGES.map((badge) => {
            const isUnlocked = points >= badge.minPoints;
            const Icon = badge.icon;

            return (
              <div
                key={badge.title}
                className={`p-3.5 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-500/40 shadow-md shadow-amber-500/5'
                    : 'bg-slate-950/40 border-slate-800 opacity-50 grayscale'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${badge.color} flex items-center justify-center text-slate-950 font-bold shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{badge.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{badge.description}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  {isUnlocked ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span>Requires {badge.minPoints} Pts</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
