import React, { useState, useRef } from 'react';
import { classifyCivicImage } from '../../services/tfjsClassifierService';
import { Upload, Camera, FileImage, Sparkles, X, CheckCircle2, Cpu } from 'lucide-react';

export default function ImageClassifier({ onImageSelect, onClassificationResult }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'camera'
  const [imagePreview, setImagePreview] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Camera references
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const processImageFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      setImagePreview(dataUrl);
      if (onImageSelect) onImageSelect(dataUrl);

      // Run TensorFlow.js Classification
      setIsClassifying(true);
      const imgElem = new Image();
      imgElem.src = dataUrl;
      imgElem.onload = async () => {
        const result = await classifyCivicImage(imgElem);
        setPrediction(result);
        setIsClassifying(false);
        if (onClassificationResult) onClassificationResult(result);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Camera start
  const startCamera = async () => {
    setActiveTab('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      alert("Camera access non-available or permission denied. Please use file upload.");
    }
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');

    // Stop camera stream
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);

    setImagePreview(dataUrl);
    if (onImageSelect) onImageSelect(dataUrl);

    // Classify photo
    setIsClassifying(true);
    const imgElem = new Image();
    imgElem.src = dataUrl;
    imgElem.onload = async () => {
      const result = await classifyCivicImage(imgElem);
      setPrediction(result);
      setIsClassifying(false);
      if (onClassificationResult) onClassificationResult(result);
    };
  };

  const removeImage = () => {
    setImagePreview(null);
    setPrediction(null);
    if (onImageSelect) onImageSelect(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <FileImage className="w-4 h-4 text-sky-400" /> Evidence Image Upload
        </label>

        {/* Input Option Switcher */}
        <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${activeTab === 'upload' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Upload / Drag & Drop
          </button>
          <button
            type="button"
            onClick={startCamera}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${activeTab === 'camera' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Camera Capture
          </button>
        </div>
      </div>

      {/* Main Upload Box */}
      {!imagePreview && activeTab === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative ${
            dragOver ? 'border-sky-500 bg-sky-950/30' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Drag & Drop complaint image here, or <span className="text-sky-400 underline">browse</span>
            </p>
            <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP (TensorFlow.js AI Auto-Classification)</p>
          </div>
        </div>
      )}

      {/* Camera Live Stream */}
      {!imagePreview && activeTab === 'camera' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
          <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-xl bg-black" />
          <canvas ref={canvasRef} className="hidden" />
          <button
            type="button"
            onClick={captureCameraPhoto}
            className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-teal-500 hover:brightness-110 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Camera className="w-4 h-4" /> Capture Photo Now
          </button>
        </div>
      )}

      {/* Image Preview & AI Prediction Output Box */}
      {imagePreview && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 relative">
          <div className="relative rounded-xl overflow-hidden max-h-64 bg-slate-950 border border-slate-800">
            <img src={imagePreview} alt="Complaint preview" className="w-full h-56 object-contain" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-rose-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI MobileNetV2 Inference Result Card */}
          <div className="p-3 bg-gradient-to-br from-slate-950 to-sky-950/40 border border-sky-800/60 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                <Cpu className="w-4 h-4 animate-pulse text-sky-400" />
                <span>TensorFlow.js AI Detection Result</span>
              </div>
              {isClassifying ? (
                <span className="text-[11px] text-amber-400 animate-pulse font-mono">MobileNetV2 Inferencing...</span>
              ) : (
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-semibold">
                  MobileNetV2 Architecture
                </span>
              )}
            </div>

            {prediction && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-300">Predicted Category:</span>
                  <span className="font-bold text-teal-300 bg-teal-500/20 border border-teal-500/30 px-2 py-0.5 rounded">
                    {prediction.predictedCategory}
                  </span>
                </div>

                {/* Confidence Bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Confidence Score</span>
                    <span className="font-mono font-bold text-sky-400">{prediction.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-teal-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
