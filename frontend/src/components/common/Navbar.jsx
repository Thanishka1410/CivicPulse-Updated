import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Activity,
  Bell,
  Award,
  User,
  LogOut,
  Check,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  FileText,
  MapPin,
  Bot,
  Shield,
  BarChart3,
  Flame,
  Building2,
  ListFilter
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = currentUser?.role === 'admin';

  const citizenLinks = [
    { to: '/dashboard', label: 'User Dashboard', icon: LayoutDashboard },
    { to: '/report', label: 'Report Issue', icon: PlusCircle, highlight: true },
    { to: '/my-complaints', label: 'My Complaints', icon: FileText },
    { to: '/nearby', label: 'Nearby Issues', icon: MapPin },
    { to: '/ai-assistant', label: 'AI Assistant', icon: Bot },
    { to: '/points', label: 'Civic Rewards', icon: Award },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'Manage Complaints', icon: ListFilter },
    { to: '/nearby', label: 'Live Issue Map', icon: MapPin },
    { to: '/admin/heatmap', label: 'Issue Hotspot Heatmap', icon: Flame },
    { to: '/admin/analytics', label: 'Governance Analytics', icon: BarChart3 },
    { to: '/admin/departments', label: 'Department Performance', icon: Building2 },
    { to: '/profile', label: 'Admin Profile', icon: Shield }
  ];

  const links = isAdmin ? adminLinks : citizenLinks;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 dark:bg-slate-950/90 light:bg-white/90 backdrop-blur-md border-b border-slate-800/80 light:border-slate-200 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-slate-300 light:text-slate-700"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to={currentUser?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 dark:bg-slate-950 light:bg-white rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white light:text-slate-900">CivicPulse</span>
                {currentUser?.role === 'admin' && (
                  <span className="text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/40 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[10px] text-teal-400 font-medium tracking-wide">Report. Track. Resolve.</p>
            </div>
          </Link>
        </div>

        {/* Right Section Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle Button (Dark / Light) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-slate-300 light:text-slate-700 hover:text-sky-400 transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-sky-600" />}
          </button>

          {currentUser ? (
            <>
              {/* Gamification Points Badge (Citizen) */}
              {currentUser.role !== 'admin' && (
                <Link to="/points" className="hidden sm:flex items-center gap-2 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 hover:border-amber-500/50 px-3 py-1.5 rounded-full transition-all">
                  <Award className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-amber-400">{currentUser.points || 0} Pts</span>
                </Link>
              )}

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-slate-300 light:text-slate-700 hover:bg-slate-800 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 light:border-slate-300 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 bg-slate-950 dark:bg-slate-950 light:bg-slate-100 border-b border-slate-800 light:border-slate-200 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 light:text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-sky-400" /> Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-[11px] text-sky-400 hover:underline flex items-center gap-1">
                          <Check className="w-3 h-3" /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 light:divide-slate-200">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500">No notifications yet.</div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-3 text-xs transition-colors cursor-pointer ${n.read ? 'bg-slate-900/50 light:bg-slate-50 text-slate-400' : 'bg-slate-800/50 light:bg-sky-50 text-slate-100 light:text-slate-900 font-medium'}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-200 light:text-slate-800">{n.title}</span>
                              <span className="text-[10px] text-slate-500">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-slate-300 light:text-slate-600 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Link */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800 light:border-slate-300">
                <Link to="/profile" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-slate-800 light:bg-slate-200 border border-slate-700 light:border-slate-300 flex items-center justify-center text-sky-400 light:text-sky-600 font-bold text-xs">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-slate-200 light:text-slate-800 leading-none">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 light:text-slate-500 capitalize mt-0.5">{currentUser.role}</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-semibold text-slate-300 light:text-slate-700 hover:text-white px-3 py-1.5">
                Log In
              </Link>
              <Link to="/signup" className="text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-sky-600/20">
                Sign Up
              </Link>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Navigation Drawer Dropdown */}
      {showMobileMenu && currentUser && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800 light:border-slate-200 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                    : 'text-slate-300 light:text-slate-700 hover:bg-slate-900 light:hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
