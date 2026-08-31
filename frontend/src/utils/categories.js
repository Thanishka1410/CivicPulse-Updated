export const CIVIC_CATEGORIES = [
  {
    id: 'pothole',
    name: 'Potholes',
    icon: 'AlertCircle',
    color: '#f59e0b',
    department: 'Road Maintenance',
    defaultDesc: 'Deep pothole on the road causing traffic disruption and hazard to vehicles and pedestrians.',
    keywords: ['hole', 'road', 'asphalt', 'crater', 'street', 'pavement', 'tar']
  },
  {
    id: 'garbage',
    name: 'Garbage',
    icon: 'Trash2',
    color: '#ef4444',
    department: 'Garbage & Waste Management',
    defaultDesc: 'Overflowing garbage bin and uncollected waste accumulating in public area.',
    keywords: ['trash', 'waste', 'dump', 'bin', 'garbage', 'litter', 'plastic', 'refuse']
  },
  {
    id: 'traffic_street_light',
    name: 'Traffic & Street Lights',
    icon: 'Lightbulb',
    color: '#3b82f6',
    department: 'Electrical & Traffic Maintenance',
    defaultDesc: 'Non-functional streetlight, flickering bulb, or broken traffic signal light causing safety hazard.',
    keywords: ['lamp', 'light', 'dark', 'bulb', 'post', 'illumination', 'pole', 'signal', 'traffic', 'red light', 'green light', 'intersection', 'junction']
  },
  {
    id: 'sewerage',
    name: 'Sewerage',
    icon: 'Waves',
    color: '#8b5cf6',
    department: 'Water & Sewage Board',
    defaultDesc: 'Blocked drain or overflowing sewage manhole creating foul odor and health hazard.',
    keywords: ['drain', 'sewer', 'manhole', 'overflow', 'odor', 'dirty water', 'sludge']
  },
  {
    id: 'electricity',
    name: 'Electricity Issue / Current Poles',
    icon: 'Zap',
    color: '#eab308',
    department: 'Electrical Maintenance',
    defaultDesc: 'Hanging electrical wire, damaged electric pole, or transformer sparking risk.',
    keywords: ['spark', 'wire', 'pole', 'current', 'transformer', 'shock', 'cable', 'voltage']
  },
  {
    id: 'others',
    name: 'Others',
    icon: 'HelpCircle',
    color: '#64748b',
    department: 'General Administration',
    defaultDesc: 'General civic complaint regarding municipal amenities and maintenance.',
    keywords: ['other', 'civic', 'general', 'facility', 'bench', 'park']
  }
];

export const STATUS_LABELS = {
  Submitted: { label: 'Submitted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  Acknowledged: { label: 'Acknowledged', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  'In Progress': { label: 'In Progress', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  'Work Completed': { label: 'Work Completed', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  Resolved: { label: 'Resolved', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  Reopened: { label: 'Reopened', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  Cancelled: { label: 'Cancelled', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
};

export const WARDS = [
  'Ward 1 - Central Downtown',
  'Ward 2 - Metro East',
  'Ward 3 - West Riverside',
  'Ward 4 - North Zone',
  'Ward 5 - South Industrial'
];
