import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  MapPin,
  Bot,
  Award,
  User,
  Shield,
  BarChart3,
  Flame,
  Building2,
  ListFilter
} from 'lucide-react';

export default function Sidebar() {
  const { currentUser } = useAuth();
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
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 shrink-0 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-3">
            {isAdmin ? 'Admin Governance' : 'Citizen Workspace'}
          </p>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/dashboard' || link.to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30 shadow-sm'
                        : link.highlight
                        ? 'bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-md hover:brightness-110'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Admin Location Badge */}
      {isAdmin && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Assigned Ward</span>
          <p className="font-semibold text-sky-400 mt-0.5">{currentUser.assignedLocation || 'Ward 1 - Central Downtown'}</p>
        </div>
      )}
    </aside>
  );
}
