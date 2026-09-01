# CivicPulse RAG (Retrieval-Augmented Generation) AI Assistant Architecture 🧠

This document explains how the RAG-based AI Assistant is structured in CivicPulse, how context retrieval functions, how to configure the Google Gemini API, and how to add new knowledge documents.

---

## 📂 Key RAG Files in the Codebase

1. **Backend RAG Knowledge Base & Gemini Service**:
   - Location: [`backend/services/ragService.js`](file:///C:/Users/91901/.gemini/antigravity/scratch/civicpulse/backend/services/ragService.js)
   - Contains the primary knowledge base array (`KNOWLEDGE_BASE`), TF-IDF/keyword retrieval engine, and the **Google Gemini 1.5 Flash API** integration.

2. **Frontend RAG Service & Fallback Engine**:
   - Location: [`frontend/src/services/ragChatbotService.js`](file:///C:/Users/91901/.gemini/antigravity/scratch/civicpulse/frontend/src/services/ragChatbotService.js)
   - Handles client-side API requests to `/api/rag/chat` and provides offline browser retrieval fallback.

3. **Interactive Chatbot UI Modal**:
   - Location: [`frontend/src/components/chat/RAGAssistantModal.jsx`](file:///C:/Users/91901/.gemini/antigravity/scratch/civicpulse/frontend/src/components/chat/RAGAssistantModal.jsx)
   - Renders the floating chat window, quick prompt pills, knowledge source citations, and chat message history.

---

## 🔄 RAG Architecture & Flow Diagram

```
      User Question (Chat UI)
                 │
                 ▼
     [RAG Service Endpoint]
      /api/rag/chat (Express)
                 │
                 ▼
  Step 1: CONTEXT RETRIEVAL
  Search KNOWLEDGE_BASE using keyword matching
  Extract top 2 relevant articles
                 │
                 ▼
  Step 2: CONTEXT AUGMENTATION
  Construct Prompt = Context + User Question
                 │
                 ▼
  Step 3: LLM GENERATION
  If GEMINI_API_KEY present in backend/.env:
    -> Call Google Gemini 1.5 Flash API
  Else:
    -> Synthesize response from Knowledge Base
                 │
                 ▼
      Response + Source Citations
            (Returned to UI)
```

---

## 📝 How to Add New Knowledge Base Documents

To add new FAQs, municipal rules, department contact info, or procedures to the RAG system:

Open [`backend/services/ragService.js`](file:///C:/Users/91901/.gemini/antigravity/scratch/civicpulse/backend/services/ragService.js) and add a new entry to the `KNOWLEDGE_BASE` array:

```javascript
{
  topic: 'Emergency Contacts & Helplines',
  keywords: ['emergency', 'helpline', 'contact', 'phone', 'fire', 'ambulance', 'police'],
  content: 'For immediate civic emergencies: Municipal Control Room: 1800-123-4567, Water Leakage Hotline: 1916, Electricity Board: 1912. For non-emergencies, submit a report via CivicPulse for tracked resolution.'
}
```

---

## 🔑 How Gemini LLM Integration Works

When `GEMINI_API_KEY` is set in `backend/.env`, the system constructs this augmented prompt:

```text
You are the CivicPulse AI Assistant. Use ONLY the following retrieved knowledge context to answer the citizen's question concisely, professionally, and accurately.

=== RETRIEVED CONTEXT ===
[Topic: Reporting Complaints]
To submit a civic complaint: Navigate to "Report Issue"...

=== USER QUESTION ===
How do I report a pothole on my street?

Answer:
```
