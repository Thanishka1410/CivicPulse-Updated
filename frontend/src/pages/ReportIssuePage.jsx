import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ImageClassifier from '../components/complaint/ImageClassifier';
import LocationPicker from '../components/complaint/LocationPicker';
import VoiceInput from '../components/complaint/VoiceInput';
import DuplicateChecker from '../components/complaint/DuplicateChecker';
import { CIVIC_CATEGORIES } from '../utils/categories';
import { PlusCircle, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ReportIssuePage() {
  const { currentUser, addPoints } = useAuth();
  const { addComplaint, checkDuplicates } = useComplaints();
  const navigate = useNavigate();

  const [category, setCategory] = useState(CIVIC_CATEGORIES[0].name);
  const [description, setDescription] = useState(CIVIC_CATEGORIES[0].defaultDesc);
  const [imageUrl, setImageUrl] = useState('');
  const [lat, setLat] = useState(40.7128);
  const [lng, setLng] = useState(-74.0060);
  const [locationText, setLocationText] = useState('Ward 1 - Central Downtown, Main St');
  const [aiPrediction, setAiPrediction] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category select change
  const handleCategoryChange = (newCatName) => {
    setCategory(newCatName);
    const catObj = CIVIC_CATEGORIES.find(c => c.name === newCatName);
    if (catObj && !description) {
      setDescription(catObj.defaultDesc);
    }
  };

  // AI Classification handler
  const handleClassificationResult = (result) => {
    setAiPrediction(result);
    if (result.predictedCategory) {
      setCategory(result.predictedCategory);
      if (result.descriptionSuggestion) {
        setDescription(result.descriptionSuggestion);
      }
    }
  };

  // Location change handler
  const handleLocationChange = (newLat, newLng, address) => {
    setLat(newLat);
    setLng(newLng);
    if (address) setLocationText(address);

    // Check duplicate complaints near new coordinates
    const nearby = checkDuplicates(newLat, newLng, category);
    setDuplicates(nearby);
    if (nearby.length > 0) {
      setShowDuplicateWarning(true);
    }
  };

  const handleVoiceTranscript = (text) => {
    setDescription(prev => (prev ? prev + ' ' + text : text));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Re-check duplicates before submitting
    const nearby = checkDuplicates(lat, lng, category);
    if (nearby.length > 0 && !showDuplicateWarning) {
      setDuplicates(nearby);
      setShowDuplicateWarning(true);
      return;
    }

    setIsSubmitting(true);

    const newComplaintData = {
      userId: currentUser?.uid || 'user_citizen_1',
      userName: currentUser?.name || 'John Doe',
      userEmail: currentUser?.email || 'citizen@civicpulse.org',
      category,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      location: locationText,
      latitude: lat,
      longitude: lng,
      ward: 'Ward 1 - Central Downtown',
      aiPrediction: aiPrediction?.predictedCategory || category,
      aiConfidence: aiPrediction?.confidence ? aiPrediction.confidence / 100 : 0.92,
      urgency: 'Medium'
    };

    const created = addComplaint(newComplaintData);
    addPoints(100);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Complaint submitted successfully!\nComplaint ID: ${created.complaintId}\n+100 Civic Points added to your profile!`);
      navigate('/my-complaints');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-sky-400" /> Report a Civic Issue
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Upload complaint photo, run TensorFlow.js AI classification & verify location.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full">
              Earn +100 Points
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload + AI Classification */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <ImageClassifier
                onImageSelect={setImageUrl}
                onClassificationResult={handleClassificationResult}
              />
            </div>

            {/* Category Selection */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Select Complaint Category (AI Auto-Filled if image uploaded)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CIVIC_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      category === cat.name
                        ? 'bg-sky-600 border-sky-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Textarea + Voice Input */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Detailed Complaint Description
                </label>
                <VoiceInput onTranscript={handleVoiceTranscript} />
              </div>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 leading-relaxed"
              />
            </div>

            {/* Location Picker */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <LocationPicker
                defaultLat={lat}
                defaultLng={lng}
                onChange={handleLocationChange}
              />
            </div>

            {/* Duplicate Detection Warning Banner */}
            {showDuplicateWarning && (
              <DuplicateChecker
                duplicates={duplicates}
                onProceedAnyway={() => setShowDuplicateWarning(false)}
                onViewExisting={() => navigate('/my-complaints')}
              />
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 hover:brightness-110 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {isSubmitting ? 'Registering Complaint & Awarding Points...' : 'Submit Complaint (+100 Civic Points)'}
            </button>

          </form>

        </main>
      </div>
    </div>
  );
}
