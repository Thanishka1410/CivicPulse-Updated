import React, { useState } from 'react';
import { askRAGAssistant } from '../../services/ragChatbotService';
import { Bot, Send, User, Sparkles, BookOpen, X, MessageSquare } from 'lucide-react';

export default function RAGAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg_0',
      sender: 'bot',
      text: 'Hello! I am your CivicPulse AI Governance Assistant. Ask me anything about reporting issues, tracking status, complaint categories, points rewards, or department responsibilities!',
      sources: ['CivicPulse Knowledge System']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'How do I submit a complaint?',
    'What does In Progress status mean?',
    'Which department fixes streetlights?',
    'How do I earn civic points?'
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { id: 'msg_' + Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const reply = await askRAGAssistant(text);

    const botMsg = {
      id: 'msg_' + (Date.now() + 1),
      sender: 'bot',
      text: reply.answer,
      sources: reply.sources || []
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                CivicPulse AI Assistant
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-mono">
                  RAG Knowledge Retrieval
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Context-Aware Civic Governance Assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full border border-slate-700 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                m.sender === 'user' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-teal-400 border border-slate-700'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-line">{m.text}</div>

                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-teal-400/90 font-mono">
                    <BookOpen className="w-3 h-3 text-teal-400" />
                    <span>Knowledge Source: {m.sources.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Bot className="w-4 h-4 animate-spin text-sky-400" />
              <span>Retrieving knowledge context...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about CivicPulse..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
