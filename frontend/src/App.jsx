import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { NotificationProvider } from './context/NotificationContext';

import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import ReportIssuePage from './pages/ReportIssuePage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import NearbyIssuesPage from './pages/NearbyIssuesPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminHeatmapPage from './pages/AdminHeatmapPage';
import DepartmentPerformancePage from './pages/DepartmentPerformancePage';

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-sky-400 font-mono text-xs">Loading CivicPulse...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (adminOnly && currentUser.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ComplaintProvider>
          <Router>
            <Routes>
              <Route path="/" element={<SplashPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Citizen Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><ReportIssuePage /></ProtectedRoute>} />
              <Route path="/my-complaints" element={<ProtectedRoute><MyComplaintsPage /></ProtectedRoute>} />
              <Route path="/nearby" element={<ProtectedRoute><NearbyIssuesPage /></ProtectedRoute>} />
              <Route path="/ai-assistant" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/points" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/complaints" element={<ProtectedRoute adminOnly={true}><AdminComplaintsPage /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute adminOnly={true}><AdminAnalyticsPage /></ProtectedRoute>} />
              <Route path="/admin/heatmap" element={<ProtectedRoute adminOnly={true}><AdminHeatmapPage /></ProtectedRoute>} />
              <Route path="/admin/departments" element={<ProtectedRoute adminOnly={true}><DepartmentPerformancePage /></ProtectedRoute>} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ComplaintProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
