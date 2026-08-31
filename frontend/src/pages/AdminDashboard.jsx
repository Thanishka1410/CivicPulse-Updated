import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ResolutionProofModal from '../components/admin/ResolutionProofModal';
import Timeline from '../components/common/Timeline';
import { WARDS, STATUS_LABELS } from '../utils/categories';
import {
  ShieldCheck,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Building2,
  FileText,
  AlertCircle,
  Check,
  X,
  Eye,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { complaints, updateStatus } = useComplaints();

  const [wardFilter, setWardFilter] = useState(currentUser?.assignedLocation || 'Ward 1 - Central Downtown');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Resolution Proof Modal state
  const [showProofModal, setShowProofModal] = useState(false);
  
  // Cancelled reason modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReasonText, setCancellationReasonText] = useState('');

  // Internal Note state
  const [internalNote, setInternalNote] = useState('');

  // Filter complaints by Ward Jurisdiction & Status
  const filtered = complaints.filter(item => {
    if (wardFilter !== 'All' && item.ward !== wardFilter) return false;
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.complaintId.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (newStatus) => {
    if (!selectedComplaint) return;

    if (newStatus === 'Resolved') {
      setShowProofModal(true);
      return;
    }

    if (newStatus === 'Cancelled') {
      setShowCancelModal(true);
      return;
    }

    updateStatus(selectedComplaint.complaintId, newStatus, internalNote);
    setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
    setInternalNote('');
    alert(`Status updated to ${newStatus}`);
  };

  const handleResolutionProofSubmit = (proofData) => {
    if (!selectedComplaint) return;
    updateStatus(selectedComplaint.complaintId, 'Resolved', internalNote, proofData);
    setShowProofModal(false);
    setSelectedComplaint(prev => ({ ...prev, status: 'Resolved', resolutionProof: proofData }));
    setInternalNote('');
    alert("Complaint marked as Resolved with uploaded proof!");
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    if (!selectedComplaint || !cancellationReasonText.trim()) return;
    updateStatus(selectedComplaint.complaintId, 'Cancelled', '', null, cancellationReasonText);
    setShowCancelModal(false);
    setSelectedComplaint(prev => ({ ...prev, status: 'Cancelled', cancellationReason: cancellationReasonText }));
    setCancellationReasonText('');
    alert("Complaint marked as Cancelled with official reason recorded.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Admin Jurisdiction Header */}
          <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-sky-950 border border-teal-800/40 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-teal-400" />
                <h1 className="text-2xl font-extrabold text-white">Admin Grievance Control Center</h1>
              </div>
              <p className="text-xs text-slate-300">
                Logged in as Officer <strong className="text-teal-300">{currentUser?.name}</strong> • Jurisdiction: <strong className="text-sky-300">{wardFilter}</strong>
              </p>
            </div>

            {/* Ward Selector Filter */}
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-2xl text-xs">
              <Building2 className="w-4 h-4 text-teal-400" />
              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Municipal Wards</option>
                {WARDS.map(w => <option key={w} value={w} className="bg-slate-900">{w}</option>)}
              </select>
            </div>
          </div>

          {/* Search & Status Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Complaint ID, category, or location..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="In Progress">In Progress</option>
                <option value="Work Completed">Work Completed</option>
                <option value="Resolved">Resolved</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Complaint ID</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Ward / Location</th>
                    <th className="p-4">Urgency</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">No complaints found for current filter.</td>
                    </tr>
                  ) : (
                    filtered.map(item => (
                      <tr key={item.complaintId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono text-sky-400 font-bold">{item.complaintId}</td>
                        <td className="p-4 font-semibold text-white">{item.category}</td>
                        <td className="p-4 text-slate-300 max-w-xs truncate">{item.location}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.urgency === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                            item.urgency === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.urgency || 'Normal'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_LABELS[item.status]?.color || 'bg-slate-800 text-slate-300'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedComplaint(item)}
                            className="px-3 py-1.5 bg-teal-600/20 hover:bg-teal-600/40 text-teal-300 border border-teal-500/40 font-bold rounded-lg transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manage Complaint Modal */}
          {selectedComplaint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
                
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-teal-400">Admin Inspection • {selectedComplaint.complaintId}</span>
                    <h2 className="text-xl font-bold text-white mt-0.5">{selectedComplaint.category}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedComplaint.location}</p>
                  </div>
                  <button onClick={() => setSelectedComplaint(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Complaint Image & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedComplaint.imageUrl && (
                    <div className="h-48 rounded-xl overflow-hidden bg-black border border-slate-800">
                      <img src={selectedComplaint.imageUrl} alt="Evidence" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-2 text-xs">
                    <span className="font-semibold text-slate-400 block">Citizen Description</span>
                    <p className="text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      {selectedComplaint.description}
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono space-y-1">
                      <p>Reported By: {selectedComplaint.userName} ({selectedComplaint.userEmail})</p>
                      <p>AI Category Confidence: {Math.round((selectedComplaint.aiConfidence || 0.9) * 100)}%</p>
                    </div>
                  </div>
                </div>

                {/* Audit Timeline */}
                <Timeline status={selectedComplaint.status} statusHistory={selectedComplaint.statusHistory} />

                {/* Admin Status Update Actions */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Update Grievance Status</h4>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {['Acknowledged', 'In Progress', 'Work Completed', 'Resolved', 'Cancelled'].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(st)}
                        className={`px-3 py-2 rounded-xl font-bold border transition-all ${
                          selectedComplaint.status === st
                            ? 'bg-teal-600 border-teal-400 text-white shadow-md'
                            : st === 'Resolved'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900'
                            : st === 'Cancelled'
                            ? 'bg-rose-950/60 text-rose-400 border-rose-800/80 hover:bg-rose-900'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-teal-500'
                        }`}
                      >
                        Set: {st}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Add Internal Field Note</label>
                    <input
                      type="text"
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="e.g. Dispatched asphalt truck #4..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Resolution Proof Upload Modal */}
          <ResolutionProofModal
            isOpen={showProofModal}
            onClose={() => setShowProofModal(false)}
            onSubmit={handleResolutionProofSubmit}
            complaintId={selectedComplaint?.complaintId}
          />

          {/* Cancel Reason Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
              <form onSubmit={handleCancelSubmit} className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 text-xs">
                <h3 className="text-sm font-bold text-rose-400">Cancel Complaint (Reason Required)</h3>
                <textarea
                  required
                  rows={3}
                  value={cancellationReasonText}
                  onChange={(e) => setCancellationReasonText(e.target.value)}
                  placeholder="Provide reason for cancellation (e.g. Duplicate report / invalid image / private property)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowCancelModal(false)} className="flex-1 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl">
                    Back
                  </button>
                  <button type="submit" className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl">
                    Confirm Cancellation
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
