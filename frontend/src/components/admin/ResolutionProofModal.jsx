import React, { useState } from 'react';
import { Camera, CheckCircle2, X, Upload } from 'lucide-react';

export default function ResolutionProofModal({ isOpen, onClose, onSubmit, complaintId }) {
  const [proofUrl, setProofUrl] = useState('');
  const [description, setDescription] = useState('');
  const [resolvedBy, setResolvedBy] = useState('Area Inspector Robert');

  if (!isOpen) return null;

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setProofUrl(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please provide a brief description of the resolution work done.");
      return;
    }

    const proofData = {
      imageUrl: proofUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      description,
      resolvedBy
    };

    onSubmit(proofData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Upload Resolution Proof ({complaintId})</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Resolution Photo Proof (Required)</label>
            {proofUrl ? (
              <div className="relative rounded-xl overflow-hidden max-h-48 border border-slate-800 bg-black">
                <img src={proofUrl} alt="Resolution Proof" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => setProofUrl('')}
                  className="absolute top-2 right-2 p-1 bg-slate-900/80 text-rose-400 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-800 rounded-xl p-4 text-center bg-slate-950 relative cursor-pointer">
                <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                <Upload className="w-6 h-6 text-sky-400 mx-auto mb-1" />
                <p className="text-slate-300 font-semibold">Upload Photo Proof</p>
                <p className="text-[10px] text-slate-500">Show completed field repair work</p>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Resolution Details / Notes</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Replaced LED lamp head, sealed junction box, tested functional."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Field Officer Name</label>
            <input
              type="text"
              value={resolvedBy}
              onChange={(e) => setResolvedBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20"
            >
              Confirm & Mark Resolved
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
