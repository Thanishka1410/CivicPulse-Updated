import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Sparkles, Activity } from 'lucide-react';

export default function Splash({ onFinish }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      } else {
        navigate('/login');
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate, onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none">
      {/* Background Glowing Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md animate-fade-in">
        {/* Animated Logo Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-600 to-teal-400 p-0.5 shadow-2xl shadow-sky-500/30 flex items-center justify-center animate-bounce">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <Activity className="w-12 h-12 text-sky-400" />
            </div>
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500"></span>
          </span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent mb-2">
          CivicPulse
        </h1>

        <p className="text-lg font-medium text-teal-400 tracking-wide mb-8 flex items-center gap-1.5 justify-center">
          <Sparkles className="w-4 h-4 text-teal-300" />
          "Report. Track. Resolve."
        </p>

        {/* Loading Indicator */}
        <div className="w-48 bg-slate-800 rounded-full h-1.5 overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-sky-500 to-teal-400 h-full rounded-full animate-[progress_4s_ease-in-out_forwards]" style={{ width: '100%' }} />
        </div>

        <p className="text-xs text-slate-500 font-mono">
          AI Crowdsourced Civic Governance Platform
        </p>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-6 text-center text-xs text-slate-600">
        Empowering Citizens & Local Authorities
      </div>
    </div>
  );
}
