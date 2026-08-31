import dotenv from 'dotenv';
dotenv.config();

// CivicPulse Knowledge Base for RAG Assistant
const KNOWLEDGE_BASE = [
  {
    topic: 'Reporting Complaints',
    keywords: ['submit', 'report', 'create', 'file', 'complaint', 'how to', 'issue'],
    content: 'To submit a civic complaint: Navigate to "Report Issue" in your User Dashboard. You can upload an image (File, Drag&Drop, or Camera), use AI image detection to auto-fill category, edit the description (or use Voice-to-Text), verify your location on the map, and click "Submit Complaint". You earn +100 civic points upon submission.'
  },
  {
    topic: 'Tracking & Status Timeline',
    keywords: ['track', 'status', 'meaning', 'timeline', 'progress', 'acknowledged', 'in progress', 'resolved', 'cancelled'],
    content: 'Complaints follow a 5-step transparent timeline:\n1. Submitted: Report received into system.\n2. Acknowledged: Assigned to local ward admin & department.\n3. In Progress: Field team dispatched to repair site.\n4. Work Completed: Field repairs finished.\n5. Resolved: Admin uploaded resolution photo proof & closed case.\n* Cancelled: Marked invalid/fake with official reason provided.'
  },
  {
    topic: 'Categories & Departments',
    keywords: ['category', 'department', 'pothole', 'garbage', 'light', 'sewer', 'electricity', 'traffic'],
    content: 'CivicPulse supports 6 major categories:\n- Potholes (Road Maintenance Dept)\n- Garbage Overflow (Garbage & Waste Management Dept)\n- Traffic & Street Lights (Electrical & Traffic Maintenance Dept)\n- Sewerage (Water & Sewage Board)\n- Electricity Issue / Current Poles (Electrical Maintenance Dept)\n- Others (General Admin)'
  },
  {
    topic: 'Reopening & Feedback',
    keywords: ['reopen', 'unsatisfied', 'rating', 'feedback', 'review', 'not fixed'],
    content: 'If a complaint is marked as Resolved but the issue persists, click "Reopen Complaint" on your complaint details page, provide a reason, and optionally upload evidence. You can also rate resolved issues from 1 to 5 stars.'
  },
  {
    topic: 'Rewards and Points',
    keywords: ['points', 'rewards', 'badges', 'level', 'leaderboard', 'contribution'],
    content: 'You earn +100 civic points for every valid complaint reported. Unlock badges as your score grows:\n- Civic Contributor: 100+ points\n- Active Reporter: 500+ points\n- Civic Champion: 1000+ points'
  },
  {
    topic: 'Admin Privileges & Secret Code',
    keywords: ['admin', 'secret code', 'role', 'ward', 'proof', 'resolution photo', 'hackwarriors'],
    content: 'Admins handle complaints assigned to their authorized Ward. To register an Admin account during prototype phase, use Secret Code: HackWarriors. Admins must upload a Resolution Proof Image before marking a complaint as Resolved.'
  }
];

export function retrieveContext(queryText) {
  if (!queryText) return [];
  const text = queryText.toLowerCase();
  const words = text.split(/\W+/).filter(w => w.length > 2);

  const scored = KNOWLEDGE_BASE.map(item => {
    let score = 0;
    item.keywords.forEach(kw => {
      if (text.includes(kw.toLowerCase())) score += 3;
    });
    words.forEach(w => {
      if (item.content.toLowerCase().includes(w)) score += 1;
    });
    return { ...item, score };
  }).sort((a, b) => b.score - a.score);

  return scored.filter(item => item.score > 0).slice(0, 2);
}

export async function queryRAGKnowledge(queryText) {
  if (!queryText) return { answer: "Please ask a question about CivicPulse.", sources: [] };

  const matches = retrieveContext(queryText);
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const contextSnippet = matches.length > 0
    ? matches.map(m => `[Topic: ${m.topic}]\n${m.content}`).join('\n\n')
    : "CivicPulse platform general knowledge base.";

  if (geminiApiKey && geminiApiKey !== "YOUR_GEMINI_API_KEY") {
    try {
      const prompt = `You are the CivicPulse AI Assistant. Use ONLY the following retrieved knowledge context to answer the citizen's question concisely, professionally, and accurately.\n\n=== RETRIEVED CONTEXT ===\n${contextSnippet}\n\n=== USER QUESTION ===\n${queryText}\n\nAnswer:`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return {
            answer: generatedText,
            sources: matches.map(m => m.topic),
            modelUsed: "Google Gemini 1.5 Flash (RAG Augmented)"
          };
        }
      }
    } catch (err) {
      console.warn("Gemini API call error, falling back to local retrieval synthesizer:", err.message);
    }
  }

  if (matches.length === 0) {
    return {
      answer: "CivicPulse AI Assistant: I couldn't find specific details for your query. You can ask me how to submit a complaint, track status, category details, points system, or admin ward procedures!",
      sources: ["CivicPulse General Guide"]
    };
  }

  const primary = matches[0];
  let answer = `**${primary.topic}**\n${primary.content}`;
  if (matches.length > 1) {
    answer += `\n\n*Related Information (${matches[1].topic}):*\n${matches[1].content}`;
  }

  return {
    answer,
    sources: matches.map(m => m.topic),
    modelUsed: "CivicPulse Knowledge Engine (Retrieval Prototype)"
  };
}
