import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Timeline from '../components/common/Timeline';
import { STATUS_LABELS } from '../utils/categories';
import { FileText, Filter, Calendar, MapPin, Star, RotateCcw, CheckCircle2, ShieldAlert, ArrowRight, Eye, X, PlusCircle } from 'lucide-react';

export default function MyComplaintsPage() {
  const { currentUser } = useAuth();
  const { complaints, reopenComplaint, submitFeedback } = useComplaints();

  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Reopen Modal state
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReasonText, setReopenReasonText] = useState('');

  // Rating state
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  const myComplaints = complaints.filter(c => c.userId === currentUser?.uid || c.userEmail === currentUser?.email);

  const filtered = myComplaints.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    return true;
  });

  const handleReopenSubmit = (e) => {
    e.preventDefault();
    if (!selectedComplaint || !reopenReasonText.trim()) return;

    reopenComplaint(selectedComplaint.complaintId, reopenReasonText);
    alert(`Complaint ${selectedComplaint.complaintId} has been reopened.`);
    setShowReopenModal(false);
    setReopenReasonText('');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    submitFeedback(selectedComplaint.complaintId, rating, feedbackComment);
    alert("Thank you for your rating and civic feedback!");
  };

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 flex flex-col transition-colors">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 light:border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white light:text-slate-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-400" /> My Complaints & Tracking
              </h1>
              <p className="text-xs text-slate-400 light:text-slate-600 mt-1">Real-time status updates, resolution proofs, and reopening requests.</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-300 rounded-xl px-3 py-2 text-slate-200 light:text-slate-900 focus:outline-none shadow-sm"
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="In Progress">In Progress</option>
                <option value="Work Completed">Work Completed</option>
                <option value="Resolved">Resolved</option>
                <option value="Reopened">Reopened</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-300 rounded-xl px-3 py-2 text-slate-200 light:text-slate-900 focus:outline-none shadow-sm"
              >
                <option value="All">All Categories</option>
                <option value="Potholes">Potholes</option>
                <option value="Garbage">Garbage</option>
                <option value="Traffic & Street Lights">Traffic & Street Lights</option>
                <option value="Sewerage">Sewerage</option>
                <option value="Electricity Issue / Current Poles">Electricity</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          {/* Empty State Card */}
          {filtered.length === 0 ? (
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white light:text-slate-900">No Complaints Reported Yet</h3>
              <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                You haven't submitted any civic complaints. Click below to report a pothole, garbage overflow, or streetlight issue and earn +100 points!
              </p>
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-sky-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Report Your First Issue (+100 Pts)
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(item => {
                const statusCfg = STATUS_LABELS[item.status] || { label: item.status, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };

                return (
                  <div
                    key={item.complaintId}
                    className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors shadow-lg"
                  >
                    <div className="space-y-3">
                      {item.imageUrl && (
                        <div className="h-40 rounded-xl overflow-hidden bg-slate-950 relative border border-slate-800">
                          <img src={item.imageUrl} alt={item.category} className="w-full h-full object-cover" />
                          <span className={`absolute top-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-md backdrop-blur-md ${statusCfg.color}`}>
                            {item.status}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                        <span>{item.complaintId}</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>

                      <h3 className="text-sm font-bold text-white light:text-slate-900">{item.category}</h3>
                      <p className="text-xs text-slate-300 light:text-slate-600 line-clamp-2">{item.description}</p>

                      <div className="text-[11px] text-slate-400 light:text-slate-500 flex items-center gap-1 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedComplaint(item)}
                      className="w-full py-2 bg-slate-800 light:bg-slate-100 hover:bg-slate-700 text-slate-200 light:text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-700 light:border-slate-300"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" /> View Status & Details
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Complaint Details Modal */}
          {selectedComplaint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
              <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
                
                <div className="flex items-start justify-between border-b border-slate-800 light:border-slate-200 pb-4">
                  <div>
                    <span className="text-xs font-mono text-sky-400">{selectedComplaint.complaintId}</span>
                    <h2 className="text-xl font-bold text-white light:text-slate-900 mt-0.5">{selectedComplaint.category}</h2>
                    <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5">{selectedComplaint.location}</p>
                  </div>
                  <button onClick={() => setSelectedComplaint(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <Timeline
                  status={selectedComplaint.status}
                  statusHistory={selectedComplaint.statusHistory}
                  cancellationReason={selectedComplaint.cancellationReason}
                  reopenReason={selectedComplaint.reopenReason}
                />

                {selectedComplaint.resolutionProof && (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Admin Resolution Proof Photo
                    </div>
                    <div className="h-56 rounded-xl overflow-hidden border border-emerald-800/60 bg-black">
                      <img src={selectedComplaint.resolutionProof.imageUrl} alt="Proof" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs text-emerald-200">{selectedComplaint.resolutionProof.description}</p>
                    <p className="text-[10px] text-emerald-400/80 font-mono">
                      Resolved by: {selectedComplaint.resolutionProof.resolvedBy} on {new Date(selectedComplaint.resolutionProof.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {selectedComplaint.status === 'Resolved' && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => setShowReopenModal(true)}
                      className="py-2.5 px-4 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 text-rose-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-rose-400" /> Unsatisfied? Reopen Complaint
                    </button>
                  </div>
                )}

                {selectedComplaint.status === 'Resolved' && (
                  <form onSubmit={handleFeedbackSubmit} className="p-4 bg-slate-950 dark:bg-slate-950 light:bg-slate-100 border border-slate-800 light:border-slate-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 light:text-slate-800">Rate Resolution Quality</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-2 rounded-lg border ${rating >= star ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'}`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Optional feedback comment..."
                      className="w-full bg-slate-900 light:bg-white border border-slate-800 light:border-slate-300 rounded-xl p-2.5 text-xs text-white light:text-slate-900"
                    />
                    <button type="submit" className="py-2 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl">
                      Submit Rating
                    </button>
                  </form>
                )}

              </div>
            </div>
          )}

          {showReopenModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
              <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white light:text-slate-900">Reopen Complaint Reason</h3>
                <textarea
                  required
                  rows={3}
                  value={reopenReasonText}
                  onChange={(e) => setReopenReasonText(e.target.value)}
                  placeholder="State why the resolution is incomplete..."
                  className="w-full bg-slate-950 light:bg-slate-100 border border-slate-800 light:border-slate-300 rounded-xl p-3 text-xs text-white light:text-slate-900"
                />
                <div className="flex gap-2 text-xs">
                  <button onClick={() => setShowReopenModal(false)} className="flex-1 py-2 bg-slate-800 light:bg-slate-200 text-slate-300 light:text-slate-700 font-semibold rounded-xl">
                    Cancel
                  </button>
                  <button onClick={handleReopenSubmit} className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl">
                    Confirm Reopen
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
