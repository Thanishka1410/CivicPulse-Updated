import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function VoiceInput({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      if (currentTranscript && onTranscript) {
        onTranscript(currentTranscript);
      }
    };

    rec.onerror = (event) => {
      console.warn("Web Speech API error:", event.error);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    setRecognition(rec);
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!supported) {
    return (
      <span className="text-[11px] text-slate-500 italic">Voice input non-supported in browser</span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
        isListening
          ? 'bg-rose-600/20 text-rose-400 border-rose-500/50 animate-pulse ring-2 ring-rose-500/30'
          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-sky-500 hover:text-sky-400'
      }`}
    >
      {isListening ? (
        <>
          <MicOff className="w-3.5 h-3.5 text-rose-400" />
          <span>Stop Voice Dictation</span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-sky-400" />
          <span>Voice-to-Text</span>
        </>
      )}
    </button>
  );
}
