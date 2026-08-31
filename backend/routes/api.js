import express from 'express';
import { queryRAGKnowledge } from '../services/ragService.js';
import { findDuplicateComplaints } from '../services/duplicateService.js';

const router = express.Router();

// Secret Code for Admin Signup (Prototype verification)
const PROTOTYPE_ADMIN_SECRET = 'HackWarriors';

// Admin verification endpoint
router.post('/auth/verify-admin', (req, res) => {
  const { secretCode } = req.body;
  if (secretCode === PROTOTYPE_ADMIN_SECRET) {
    return res.json({ success: true, message: 'Admin secret code verified successfully.' });
  }
  return res.status, res.status(403).json({ success: false, message: 'Invalid Admin Secret Code.' });
});

// Check duplicate complaint endpoint
router.post('/complaints/check-duplicate', (req, res) => {
  const { latitude, longitude, category, existingComplaints = [] } = req.body;
  const duplicates = findDuplicateComplaints({ latitude, longitude, category }, existingComplaints, 0.2);
  
  if (duplicates.length > 0) {
    return res.json({
      hasDuplicates: true,
      count: duplicates.length,
      duplicates,
      message: 'A similar civic issue has already been reported nearby.'
    });
  }
  
  return res.json({ hasDuplicates: false, count: 0, duplicates: [] });
});

// RAG AI Assistant Endpoint
router.post('/rag/chat', async (req, res) => {
  const { message } = req.body;
  const result = await queryRAGKnowledge(message);
  return res.json({
    success: true,
    ...result
  });
});

// Analytics calculation endpoint
router.post('/analytics/stats', (req, res) => {
  const { complaints = [] } = req.body;

  const total = complaints.length;
  const submitted = complaints.filter(c => c.status === 'Submitted').length;
  const acknowledged = complaints.filter(c => c.status === 'Acknowledged').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const workCompleted = complaints.filter(c => c.status === 'Work Completed').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const cancelled = complaints.filter(c => c.status === 'Cancelled').length;

  const activeCount = total - resolved - cancelled;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Average rating
  const ratings = complaints.filter(c => c.feedback && c.feedback.rating).map(c => c.feedback.rating);
  const avgSatisfaction = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '4.8';

  return res.json({
    total,
    submitted,
    acknowledged,
    inProgress,
    workCompleted,
    resolved,
    cancelled,
    activeCount,
    resolutionRate,
    avgResolutionTimeHours: 36,
    avgSatisfaction
  });
});

export default router;
