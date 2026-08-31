import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COMPLAINTS } from '../utils/sampleData';
import { useNotifications } from './NotificationContext';

const ComplaintContext = createContext();

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('civicpulse_complaints');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_COMPLAINTS; }
    }
    return INITIAL_COMPLAINTS;
  });

  const { addNotification } = useNotifications();

  useEffect(() => {
    localStorage.setItem('civicpulse_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Submit new complaint
  const addComplaint = (newComplaintData) => {
    const uniqueNum = Math.floor(10000 + Math.random() * 90000);
    const complaintId = `CP-2026-${uniqueNum}`;
    const timestamp = new Date().toISOString();

    const fullComplaint = {
      complaintId,
      status: 'Submitted',
      createdAt: timestamp,
      updatedAt: timestamp,
      statusHistory: [
        {
          status: 'Submitted',
          timestamp,
          note: 'Complaint reported by citizen.'
        }
      ],
      ...newComplaintData
    };

    setComplaints(prev => [fullComplaint, ...prev]);

    // Send notification
    addNotification({
      userId: newComplaintData.userId,
      title: 'Complaint Submitted Successfully! 🎉',
      message: `Your complaint ID ${complaintId} (${newComplaintData.category}) has been submitted. You earned +100 points!`,
      type: 'success',
      complaintId
    });

    return fullComplaint;
  };

  // Update complaint status (Admin action)
  const updateStatus = (complaintId, newStatus, note = '', resolutionProof = null, cancellationReason = '') => {
    const timestamp = new Date().toISOString();

    setComplaints(prev => prev.map(item => {
      if (item.complaintId !== complaintId) return item;

      const historyEntry = {
        status: newStatus,
        timestamp,
        note: note || `Status updated to ${newStatus} by admin.`
      };

      if (cancellationReason) {
        historyEntry.note = `Cancelled: ${cancellationReason}`;
      }

      const updatedComplaint = {
        ...item,
        status: newStatus,
        updatedAt: timestamp,
        statusHistory: [...item.statusHistory, historyEntry]
      };

      if (resolutionProof) {
        updatedComplaint.resolutionProof = {
          ...resolutionProof,
          resolvedAt: timestamp
        };
      }

      if (cancellationReason) {
        updatedComplaint.cancellationReason = cancellationReason;
      }

      // Notify citizen user
      addNotification({
        userId: item.userId,
        title: `Status Update: ${newStatus}`,
        message: `Complaint ${item.complaintId} is now ${newStatus}.${cancellationReason ? ' Reason: ' + cancellationReason : ''}`,
        type: newStatus === 'Resolved' ? 'success' : newStatus === 'Cancelled' ? 'warning' : 'info',
        complaintId: item.complaintId
      });

      return updatedComplaint;
    }));
  };

  // Reopen complaint
  const reopenComplaint = (complaintId, reason, newEvidenceUrl = '') => {
    const timestamp = new Date().toISOString();

    setComplaints(prev => prev.map(item => {
      if (item.complaintId !== complaintId) return item;

      const updatedHistory = [
        ...item.statusHistory,
        {
          status: 'Reopened',
          timestamp,
          note: `Citizen reopened complaint: ${reason}`
        }
      ];

      return {
        ...item,
        status: 'Reopened',
        reopenReason: reason,
        reopenEvidenceUrl: newEvidenceUrl || item.reopenEvidenceUrl,
        updatedAt: timestamp,
        statusHistory: updatedHistory
      };
    }));
  };

  // Citizen Rating and Feedback
  const submitFeedback = (complaintId, rating, comment) => {
    const timestamp = new Date().toISOString();

    setComplaints(prev => prev.map(item => {
      if (item.complaintId !== complaintId) return item;
      return {
        ...item,
        feedback: { rating, comment, createdAt: timestamp }
      };
    }));
  };

  // Check duplicate complaints within 200m
  const checkDuplicates = (lat, lng, category) => {
    if (!lat || !lng) return [];
    return complaints.filter(c => {
      if (['Resolved', 'Cancelled'].includes(c.status)) return false;
      const isSameCategory = c.category.toLowerCase() === (category || '').toLowerCase();
      // Calculate distance roughly using simple math
      const R = 6371;
      const dLat = (c.latitude - lat) * (Math.PI / 180);
      const dLon = (c.longitude - lng) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat * (Math.PI / 180)) * Math.cos(c.latitude * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const distKm = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
      return distKm <= 0.2 && isSameCategory;
    });
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      addComplaint,
      updateStatus,
      reopenComplaint,
      submitFeedback,
      checkDuplicates
    }}>
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  return useContext(ComplaintContext);
}
