// src/utils/api.js
// All backend calls go through here

const BASE = '/api';

async function request(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ── Mood ──────────────────────────────────────────────
export const logMood   = (data)  => request('/mood', { method: 'POST', body: JSON.stringify(data) });
export const getMoods  = ()      => request('/mood');
export const getWeekMoods = ()   => request('/mood/week');

// ── Journal ───────────────────────────────────────────
export const saveJournal   = (data) => request('/journal', { method: 'POST', body: JSON.stringify(data) });
export const getJournals   = ()     => request('/journal');
export const deleteJournal = (id)   => request(`/journal/${id}`, { method: 'DELETE' });

// ── Chat ──────────────────────────────────────────────
export const sendChat      = (message) => request('/chat', { method: 'POST', body: JSON.stringify({ message }) });
export const getChatHistory = ()        => request('/chat/history');

// ── Booking ───────────────────────────────────────────
export const createBooking = (data) => request('/booking', { method: 'POST', body: JSON.stringify(data) });

// ── Affirmations ──────────────────────────────────────
export const getAffirmations = () => request('/affirmations');

// ── Game scores ───────────────────────────────────────
export const saveGameScore = (data) => request('/game/score', { method: 'POST', body: JSON.stringify(data) });
