# CivicPulse 🏛️⚡
**"Report. Track. Resolve."**

CivicPulse is an AI-powered crowdsourced civic issue reporting and grievance redressal web platform that connects citizens and local government authorities. Built as a prototype for research, academic presentations, and hackathons, CivicPulse prioritizes open-source and free technologies while retaining production-ready modular architecture.

---

## 🚀 Key Features

### 1. Citizen Experience & Reporting
- **Modern 4-Second Splash Screen**: Displays brand identity, logo, and tagline `"Report. Track. Resolve."`.
- **Firebase Authentication & Dual Engine Storage**: Email/Password authentication with automatic local storage fallback for offline zero-setup testing.
- **AI-Powered Visual Classification**: Integrated **MobileNetV2** transfer learning model via **TensorFlow.js** running client-side in the browser to auto-detect issue categories (Potholes, Garbage, Traffic & Street Lights, Sewerage, Electricity Issue) and suggest complaint descriptions with confidence scores (e.g. *Pothole 92%*).
- **Voice-to-Text Dictation**: Continuous voice input powered by the **Web Speech API**.
- **Geolocation & Reverse Geocoding**: **Leaflet.js + OpenStreetMap** interactive pin verification, browser **Geolocation API** auto-detection, and OpenStreetMap Nominatim reverse geocoding to resolve approachable street & village names.
- **Geofenced Duplicate Detection**: Haversine formula distance calculation (within 200m radius) to alert users if a matching issue has already been reported nearby.
- **Gamification Rewards & Points**: Earn +100 Civic Points per valid report, track rank levels, and unlock badges (*Civic Contributor*, *Active Reporter*, *Civic Champion*).
- **Interactive 5-Step Status Timeline**: Real-time tracking (`Submitted` ➔ `Acknowledged` ➔ `In Progress` ➔ `Work Completed` ➔ `Resolved`).
- **Reopen Complaint**: Citizens can reopen resolved complaints with custom reasons and evidence.
- **Resolution Rating**: 1-to-5 star rating and written feedback submission upon issue resolution.
- **Dark / Light Theme Toggle**: Universal mode switcher for optimal visibility in any lighting.

### 2. Admin & Governance Dashboard
- **Role-Based Registration & Secret Code**: Admin registration guarded by secret code: `HackWarriors`.
- **Ward Jurisdiction Filtering**: Restricted view based on assigned location/ward in Andhra Pradesh (e.g., *Vijayawada Central Ward*).
- **Mandatory Resolution Proof**: Admins must upload a photo proof of completed field work before marking a complaint as `Resolved`.
- **Mandatory Cancellation Reason**: Admins must record a clear justification before marking fake/invalid reports as `Cancelled`.
- **Governance Analytics (Recharts)**: Interactive charts for status breakdown, category distribution, resolution rate %, average resolution time, and citizen satisfaction scores with high-contrast tooltips.
- **Live Issue Map & Hotspot Heatmap**: Leaflet density overlay visualization centered on Andhra Pradesh defaults for identifying high-frequency civic problem areas.
- **Department Performance & Ward Rankings**: Benchmarks for Garbage, Road Maintenance, Electricity, Water & Sewerage, and Traffic Control.

### 3. RAG-Based AI Assistant
- **Context-Aware Retrieval**: RAG knowledge retriever answering user FAQs, complaint procedures, department rules, and status meanings with citation sources, augmented by Google Gemini API integration.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React, Leaflet.js, React-Leaflet, Recharts, TensorFlow.js, MobileNetV2.
- **Backend**: Node.js, Express.js.
- **Database & Auth**: Firebase Authentication, Firestore, Cloud Storage (with built-in local reactive fallback).
- **Maps & Geocoding**: Leaflet.js + OpenStreetMap + Nominatim Reverse Geocoding.
- **Voice**: Web Speech API.

---

## 📦 How to Run Locally

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

## 🌐 Deployment Instructions (Free Hosting Options)

### A. Deploying Frontend (Vercel or Netlify)

#### Option 1: Deploy on Vercel (Recommended)
1. Push your code to GitHub repository: `https://github.com/Thanishka1410/CivicPulse-Updated.git`
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your `CivicPulse-Updated` repository.
4. Set **Root Directory** to `frontend`.
5. Framework Preset will auto-detect as **Vite**.
6. (Optional) Add Environment Variables in Vercel settings:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
7. Click **Deploy**. Vercel will build and provide your live HTTPS URL.

#### Option 2: Deploy on Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Click **Add new site** ➔ **Import an existing project**.
3. Select GitHub and choose `CivicPulse-Updated`.
4. Set **Base directory**: `frontend`
5. Set **Build command**: `npm run build`
6. Set **Publish directory**: `frontend/dist`
7. Click **Deploy Site**.

---

### B. Deploying Backend Express API (Render.com)

1. Log in to [Render.com](https://render.com/).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository `CivicPulse-Updated`.
4. Configure Web Service settings:
   - **Name**: `civicpulse-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `PORT`: `5000`
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key from Google AI Studio)*
6. Click **Create Web Service**.
7. Once deployed, copy your Render URL (e.g. `https://civicpulse-api.onrender.com`) and update your frontend fetch calls if targeting production backend.

---

## 🔑 Portal Access Credentials

- **Citizen Portal**: `citizen@civicpulse.org` / `citizen123`
- **Admin Portal**: `admin@civicpulse.org` / `admin123`
- **Admin Secret Registration Code**: `HackWarriors`
