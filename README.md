# CivicPulse 🏛️⚡
**"Report. Track. Resolve."**

CivicPulse is an AI-powered crowdsourced civic issue reporting and grievance redressal web platform that connects citizens and local government authorities. Built as a prototype for research, academic presentations, and hackathons, CivicPulse prioritizes open-source and free technologies while retaining production-ready modular architecture.

---

## 🚀 Key Features

### 1. Citizen Experience & Reporting
- **Modern 4-Second Splash Screen**: Displays brand identity, logo, and tagline `"Report. Track. Resolve."`.
- **Firebase Authentication & Dual Engine Storage**: Email/Password authentication with automatic local storage fallback for offline zero-setup testing.
- **AI-Powered Visual Classification**: Integrated **MobileNetV2** transfer learning model via **TensorFlow.js** running client-side in the browser to auto-detect issue categories (Potholes, Garbage, Streetlights, Traffic Signals, Water Leaks, Sewage) and suggest complaint descriptions with confidence scores (e.g. *Pothole 92%*).
- **Voice-to-Text Dictation**: Continuous voice input powered by the **Web Speech API**.
- **Geolocation & Mapping**: **Leaflet.js + OpenStreetMap** interactive pin verification and browser **Geolocation API** auto-detection.
- **Geofenced Duplicate Detection**: Haversine formula distance calculation (within 200m radius) to alert users if a matching issue has already been reported nearby.
- **Gamification Rewards & Points**: Earn +100 Civic Points per valid report, track rank levels, and unlock badges (*Civic Contributor*, *Active Reporter*, *Civic Champion*).
- **Interactive 5-Step Status Timeline**: Real-time tracking (`Submitted` ➔ `Acknowledged` ➔ `In Progress` ➔ `Work Completed` ➔ `Resolved`).
- **Reopen Complaint**: Citizens can reopen resolved complaints with custom reasons and evidence.
- **Resolution Rating**: 1-to-5 star rating and written feedback submission upon issue resolution.

### 2. Admin & Governance Dashboard
- **Role-Based Registration & Secret Code**: Admin registration guarded by secret code: `HackWarriors`.
- **Ward Jurisdiction Filtering**: Restricted view based on assigned location/ward (e.g., *Ward 1 - Central Downtown*).
- **Mandatory Resolution Proof**: Admins must upload a photo proof of completed field work before marking a complaint as `Resolved`.
- **Mandatory Cancellation Reason**: Admins must record a clear justification before marking fake/invalid reports as `Cancelled`.
- **Governance Analytics (Recharts)**: Interactive charts for total grievances, status pie charts, resolution rate %, average resolution time, and citizen satisfaction scores.
- **Live Issue Map & Hotspot Heatmap**: Leaflet density overlay visualization for identifying high-frequency civic problem areas.
- **Department Performance & Ward Rankings**: Benchmarks for Garbage, Road Maintenance, Electricity, Water Supply, and Traffic Management.

### 3. RAG-Based AI Assistant
- **Context-Aware Retrieval**: RAG knowledge retriever answering user FAQs, complaint procedures, department rules, and status meanings with citation sources.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React, Leaflet.js, React-Leaflet, Recharts, TensorFlow.js, MobileNetV2.
- **Backend**: Node.js, Express.js.
- **Database & Auth**: Firebase Authentication, Firestore, Cloud Storage (with built-in local reactive fallback).
- **Maps**: Leaflet.js + OpenStreetMap.
- **Voice**: Web Speech API.

---

## 📦 How to Run the Application

### 1. Backend Server
```bash
cd backend
npm install
npm start
# Express API will run on http://localhost:5000
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
# React Vite App will run on http://localhost:3000
```

---

## 🔑 Demo Account Credentials

- **Citizen Demo**: `citizen@civicpulse.org` / `password`
- **Admin Demo**: `admin@civicpulse.org` / `password`
- **Admin Secret Registration Code**: `HackWarriors`
