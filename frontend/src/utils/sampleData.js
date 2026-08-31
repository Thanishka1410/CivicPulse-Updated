export const INITIAL_COMPLAINTS = [
  {
    complaintId: 'CP-2026-98101',
    userId: 'user_citizen_1',
    userName: 'John Doe',
    userEmail: 'citizen@civicpulse.org',
    category: 'Potholes',
    description: 'Dangerous 1.5ft deep pothole in the middle of Main Street junction near Central Park gate. 2 motorbikes skidded yesterday.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    location: 'Main St & 4th Ave, Ward 1 - Central Downtown',
    latitude: 40.7128,
    longitude: -74.0060,
    ward: 'Ward 1 - Central Downtown',
    status: 'In Progress',
    aiPrediction: 'Potholes',
    aiConfidence: 0.94,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    assignedAdmin: 'admin@civicpulse.org',
    assignedDepartment: 'Road Maintenance',
    urgency: 'High',
    statusHistory: [
      { status: 'Submitted', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Complaint reported via CivicPulse Mobile AI.' },
      { status: 'Acknowledged', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), note: 'Assigned to Road Maintenance Crew #4.' },
      { status: 'In Progress', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), note: 'Asphalt patching team dispatched with hot-mix truck.' }
    ],
    internalNotes: ['Priority patch job scheduled before evening heavy rain forecast.']
  },
  {
    complaintId: 'CP-2026-98102',
    userId: 'user_citizen_2',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@example.com',
    category: 'Garbage',
    description: 'Public dumpster overflowing for 4 days. Stench and stray animals spreading garbage onto sidewalk.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    location: 'Market Sq, Ward 2 - Metro East',
    latitude: 40.7180,
    longitude: -73.9950,
    ward: 'Ward 2 - Metro East',
    status: 'Submitted',
    aiPrediction: 'Garbage',
    aiConfidence: 0.96,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    assignedDepartment: 'Garbage & Waste Management',
    urgency: 'Medium',
    statusHistory: [
      { status: 'Submitted', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Complaint submitted by citizen.' }
    ]
  },
  {
    complaintId: 'CP-2026-98103',
    userId: 'user_citizen_1',
    userName: 'John Doe',
    userEmail: 'citizen@civicpulse.org',
    category: 'Traffic & Street Lights',
    description: '3 consecutive streetlights broken near Girls High School bus stop. Area completely dark after 7 PM.',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    location: 'School Lane, Ward 1 - Central Downtown',
    latitude: 40.7100,
    longitude: -74.0120,
    ward: 'Ward 1 - Central Downtown',
    status: 'Resolved',
    aiPrediction: 'Traffic & Street Lights',
    aiConfidence: 0.89,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    assignedAdmin: 'admin@civicpulse.org',
    assignedDepartment: 'Electrical & Traffic Maintenance',
    urgency: 'High',
    resolutionProof: {
      imageUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80',
      description: 'Replaced LED lamp heads and restored power cable junction box. Tested and functional.',
      resolvedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      resolvedBy: 'Tech Lead Robert'
    },
    feedback: {
      rating: 5,
      comment: 'Replaced within 48 hours! Fantastic prompt service by the electrical department.',
      createdAt: new Date(Date.now() - 86400000 * 0.8).toISOString()
    },
    statusHistory: [
      { status: 'Submitted', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), note: 'Reported.' },
      { status: 'Acknowledged', timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), note: 'Electrical inspection scheduled.' },
      { status: 'In Progress', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'Bucket truck arrived at site.' },
      { status: 'Work Completed', timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString(), note: 'Replacement verified.' },
      { status: 'Resolved', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Case closed with resolution proof photo.' }
    ]
  },
  {
    complaintId: 'CP-2026-98104',
    userId: 'user_citizen_3',
    userName: 'Alex Smith',
    userEmail: 'alex@example.com',
    category: 'Electricity Issue / Current Poles',
    description: 'Loose high-voltage electrical cable dangling from wooden utility pole near residential park.',
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
    location: '7th Cross Rd, Ward 3 - West Riverside',
    latitude: 40.7250,
    longitude: -74.0150,
    ward: 'Ward 3 - West Riverside',
    status: 'In Progress',
    aiPrediction: 'Electricity Issue / Current Poles',
    aiConfidence: 0.97,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    assignedDepartment: 'Electrical Maintenance',
    urgency: 'Critical',
    statusHistory: [
      { status: 'Submitted', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), note: 'Emergency electrical hazard reported.' },
      { status: 'Acknowledged', timestamp: new Date(Date.now() - 3600000 * 10).toISOString(), note: 'Line inspector dispatched.' },
      { status: 'In Progress', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Technicians securing cable insulators.' }
    ]
  },
  {
    complaintId: 'CP-2026-98105',
    userId: 'user_citizen_4',
    userName: 'Maria Garcia',
    userEmail: 'maria@example.com',
    category: 'Traffic & Street Lights',
    description: 'Traffic lights stuck on solid red in all four directions. Heavy traffic jam building up.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    location: 'Broad St & Commerce Ave, Ward 1 - Central Downtown',
    latitude: 40.7155,
    longitude: -74.0020,
    ward: 'Ward 1 - Central Downtown',
    status: 'Acknowledged',
    aiPrediction: 'Traffic & Street Lights',
    aiConfidence: 0.91,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    assignedAdmin: 'admin@civicpulse.org',
    assignedDepartment: 'Electrical & Traffic Maintenance',
    urgency: 'High',
    statusHistory: [
      { status: 'Submitted', timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), note: 'Signal glitch reported.' },
      { status: 'Acknowledged', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), note: 'Traffic warden deployed to manually manage traffic while technician resets controller unit.' }
    ]
  },
  {
    complaintId: 'CP-2026-98106',
    userId: 'user_citizen_5',
    userName: 'David Miller',
    userEmail: 'david@example.com',
    category: 'Sewerage',
    description: 'Open sewer manhole cover missing on pedestrian walkway. Dangerous pit hazard.',
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80',
    location: 'Industrial Park Rd, Ward 5 - South Industrial',
    latitude: 40.7020,
    longitude: -74.0090,
    ward: 'Ward 5 - South Industrial',
    status: 'Work Completed',
    aiPrediction: 'Sewerage',
    aiConfidence: 0.88,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    assignedDepartment: 'Water & Sewage Board',
    urgency: 'Critical',
    resolutionProof: {
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      description: 'Heavy duty cast-iron manhole lid installed and sealed.',
      resolvedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      resolvedBy: 'Sanitation Crew 9'
    },
    statusHistory: [
      { status: 'Submitted', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'Missing cover reported.' },
      { status: 'Acknowledged', timestamp: new Date(Date.now() - 86400000 * 2.5).toISOString(), note: 'Barricade placed temporarily.' },
      { status: 'In Progress', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'New cover installation.' },
      { status: 'Work Completed', timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), note: 'Inspected and fitted properly.' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    userId: 'user_citizen_1',
    title: 'Status Updated: In Progress',
    message: 'Your complaint CP-2026-98101 (Potholes) has been updated to In Progress.',
    type: 'status_update',
    read: false,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    complaintId: 'CP-2026-98101'
  },
  {
    id: 'notif_2',
    userId: 'user_citizen_1',
    title: '+100 Civic Points Earned! 🏆',
    message: 'Thank you for reporting CP-2026-98101. You earned 100 civic contribution points!',
    type: 'points',
    read: true,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    complaintId: 'CP-2026-98101'
  }
];
