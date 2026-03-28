const express = require('express');
const cors    = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ─── In-memory store (replace with DB in production) ───────────────────────
let moods      = [];
let journals   = [];
let bookings   = [];
let chatHistory = [];

// ─── Bloom AI responses by detected mood ────────────────────────────────────
const bloomResponses = {
  positive: [
    "That's so wonderful to hear! 🌟 Your positivity is truly contagious. What's been making your day so bright?",
    "I love seeing you this happy! 🌸 What's one thing you want to savour about today?",
    "You're glowing! ✨ It sounds like things are going really well. Tell me more!",
  ],
  anxious: [
    "I hear you. Anxiety can feel so overwhelming sometimes 💜. Let's try something — take a slow breath in for 4 counts. Ready?",
    "You're safe here. 🌿 Can you name 3 things you can see around you right now? That can help ground us.",
    "Anxiety makes everything feel urgent, but you don't have to solve it all at once. What's the smallest thing you can let go of right now?",
  ],
  sad: [
    "I'm really glad you told me. 💜 Sadness is just love with nowhere to go right now. You don't have to carry this alone.",
    "It's okay to not be okay. 🌧️ Would you like to just talk, or would a gentle breathing exercise help?",
    "Thank you for trusting me with this. You're doing something brave by putting your feelings into words. 🌸",
  ],
  stressed: [
    "Stress is your body asking for care 🌿. What's the one thing weighing heaviest on you right now?",
    "Let's break this down together. What's one tiny thing you could cross off your list to feel lighter?",
    "You're handling so much. Remember — rest is productive too. When did you last truly rest? 💜",
  ],
  default: [
    "I'm here for you. 🌸 What's on your mind today?",
    "Tell me more — I'm listening with my whole heart. 💜",
    "Thank you for sharing that. What would feel most supportive right now?",
    "You don't have to have it all figured out. Just being here is enough. 🌿",
    "I'm so glad you're talking about this. Small steps still count as forward. 🌱",
    "That takes a lot of courage to say. How long have you been feeling this way?",
  ]
};

function detectMood(text) {
  const t = text.toLowerCase();
  if (/happy|great|amazing|wonderful|joy|excited|good|love|lovely/.test(t)) return 'positive';
  if (/anxious|anxiety|panic|worried|nervous|scared|fear/.test(t))           return 'anxious';
  if (/sad|cry|depressed|down|low|hopeless|empty|grief|loss/.test(t))        return 'sad';
  if (/stress|overwhelm|too much|busy|pressure|deadline|tired|exhaust/.test(t)) return 'stressed';
  return 'default';
}

function getBloomReply(text) {
  const mood = detectMood(text);
  const arr  = bloomResponses[mood];
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Routes ─────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', message: '🌸 InnerBloom API running' }));

// ── MOOD ──────────────────────────────────────────────────────────────────
app.post('/api/mood', (req, res) => {
  const { mood, emoji, note } = req.body;
  if (!mood) return res.status(400).json({ error: 'mood is required' });
  const entry = { id: uuidv4(), mood, emoji, note: note || '', timestamp: new Date().toISOString() };
  moods.push(entry);
  res.json({ success: true, entry });
});

app.get('/api/mood', (_, res) => {
  // Return last 30 entries
  res.json(moods.slice(-30));
});

app.get('/api/mood/week', (_, res) => {
  const now  = new Date();
  const week = moods.filter(m => {
    const d = new Date(m.timestamp);
    return (now - d) <= 7 * 24 * 60 * 60 * 1000;
  });
  res.json(week);
});

// ── JOURNAL ───────────────────────────────────────────────────────────────
app.post('/api/journal', (req, res) => {
  const { title, content, prompt } = req.body;
  if (!content) return res.status(400).json({ error: 'content is required' });
  const entry = { id: uuidv4(), title: title || 'Journal Entry', content, prompt: prompt || '', timestamp: new Date().toISOString() };
  journals.push(entry);
  res.json({ success: true, entry });
});

app.get('/api/journal', (_, res) => {
  res.json([...journals].reverse());
});

app.delete('/api/journal/:id', (req, res) => {
  const before = journals.length;
  journals = journals.filter(j => j.id !== req.params.id);
  if (journals.length === before) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

// ── CHAT / BLOOM AI ────────────────────────────────────────────────────────
app.post('/api/chat', (req, res) => {
  const { message, sessionId } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  // Store user message
  const userMsg = { id: uuidv4(), from: 'user', text: message, timestamp: new Date().toISOString() };

  // Generate Bloom's reply
  const replyText = getBloomReply(message);
  const bloomMsg  = { id: uuidv4(), from: 'bloom', text: replyText, timestamp: new Date().toISOString() };

  chatHistory.push(userMsg, bloomMsg);

  // Simulate typing delay on client side — we just return immediately
  res.json({ reply: bloomMsg, mood: detectMood(message) });
});

app.get('/api/chat/history', (_, res) => {
  res.json(chatHistory.slice(-50));
});

// ── BOOKING / COUNSELLING ──────────────────────────────────────────────────
app.post('/api/booking', (req, res) => {
  const { service, date, time, name, note } = req.body;
  if (!service || !date || !time || !name) {
    return res.status(400).json({ error: 'service, date, time, name required' });
  }
  const booking = { id: uuidv4(), service, date, time, name, note: note || '', status: 'confirmed', timestamp: new Date().toISOString() };
  bookings.push(booking);
  res.json({ success: true, booking });
});

app.get('/api/booking', (_, res) => res.json(bookings));

// ── AFFIRMATIONS ───────────────────────────────────────────────────────────
const affirmations = [
  'I am strong and capable of every thing that comes my way.',
  'Everything is in my control. I am grateful for this moment.',
  'I am worthy of love, kindness, and all good things.',
  'Even though I fail, I am happy that I tried and will try again.',
  'I choose positivity above everything else today.',
  'My feelings are valid. I allow myself to feel and heal.',
  'I am enough, exactly as I am right now.',
  'Every day I grow a little more into who I am meant to be.',
  'Peace begins with me. I breathe in calm and breathe out tension.',
  'I deserve joy, rest, and all the good that life has to offer.',
  'My mind is powerful and I choose kind thoughts.',
  'I release what I cannot control and embrace what I can.',
  'Today I choose me, gently and without apology.',
  'Healing is not linear and I trust my process.',
  'I am allowed to take up space and ask for what I need.',
];

app.get('/api/affirmations', (_, res) => {
  const shuffled = [...affirmations].sort(() => Math.random() - 0.5);
  res.json(shuffled.slice(0, 5));
});

app.get('/api/affirmations/all', (_, res) => res.json(affirmations));

// ── GAME SCORES ────────────────────────────────────────────────────────────
let gameScores = [];

app.post('/api/game/score', (req, res) => {
  const { game, score, duration } = req.body;
  const entry = { id: uuidv4(), game, score, duration, timestamp: new Date().toISOString() };
  gameScores.push(entry);
  res.json({ success: true, entry });
});

app.get('/api/game/score', (_, res) => res.json(gameScores));

// ─── Start server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌸 InnerBloom API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
