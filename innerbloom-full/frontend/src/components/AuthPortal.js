import React, { useState } from 'react';
import { motion } from 'framer-motion';

const STORAGE_USER = 'innerbloom-user';
const STORAGE_USERS = 'innerbloom-users';
const validEmail = (value) => /^\S+@\S+\.\S+$/.test(value.trim());

const getSavedUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS) || '{}');
  } catch {
    return {};
  }
};

const saveUserRecord = (user) => {
  const all = getSavedUsers();
  localStorage.setItem(STORAGE_USERS, JSON.stringify({ ...all, [user.email]: user }));
};

const setSessionUser = (user) => {
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
};

export default function AuthPortal({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validEmail(email)) {
      return setError('Please enter a valid email address.');
    }
    if (!password.trim()) {
      return setError('Password cannot be empty.');
    }

    const users = getSavedUsers();
    const existing = users[email.trim().toLowerCase()];

    if (mode === 'signup') {
      if (!name.trim()) {
        return setError('Enter your name to complete sign up.');
      }
      if (existing) {
        return setError('This email is already registered. Please log in.');
      }

      const user = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };
      saveUserRecord(user);
      setSessionUser(user);
      onAuth({ name: user.name, email: user.email });
      return;
    }

    if (!existing || existing.password !== password.trim()) {
      return setError('Email or password is incorrect.');
    }

    setSessionUser(existing);
    onAuth({ name: existing.name, email: existing.email });
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(20,16,12,0.82)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <motion.div
        initial={{ opacity:0, scale:0.94 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ duration:0.35, ease:[0.22,0.61,0.36,1] }}
        style={{ width:'100%', maxWidth:520, background:'#fff', borderRadius:28, padding:'32px 30px', boxShadow:'0 30px 90px rgba(0,0,0,0.18)' }}>
        <div style={{ marginBottom:28 }}>
          <p style={{ margin:0, fontSize:13, color:'var(--sage-d)', textTransform:'uppercase', letterSpacing:'0.18em', fontWeight:600 }}>InnerBloom Welcome</p>
          <h2 style={{ margin:'14px 0 6px', fontSize:32, lineHeight:1.1, color:'var(--ink)' }}>Sign in to your calm space</h2>
          <p style={{ margin:0, fontSize:14, color:'var(--mid)', lineHeight:1.7 }}>Use a secure email to save your journey and get started with music, mood tracking, and mindful calm.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'grid', gap:16 }}>
          {mode === 'signup' && (
            <label style={{ display:'grid', gap:8, color:'var(--ink)', fontSize:13 }}>
              Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ width:'100%', padding:'14px 16px', border:'1px solid #E2E2E2', borderRadius:14, fontSize:14 }} />
            </label>
          )}

          <label style={{ display:'grid', gap:8, color:'var(--ink)', fontSize:13 }}>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width:'100%', padding:'14px 16px', border:'1px solid #E2E2E2', borderRadius:14, fontSize:14 }} />
          </label>

          <label style={{ display:'grid', gap:8, color:'var(--ink)', fontSize:13 }}>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a strong password" style={{ width:'100%', padding:'14px 16px', border:'1px solid #E2E2E2', borderRadius:14, fontSize:14 }} />
          </label>

          {error && <p style={{ margin:0, color:'#D04747', fontSize:13 }}>{error}</p>}

          <button type="submit" style={{ border:'none', borderRadius:50, padding:'14px 18px', background:'var(--sage-d)', color:'#fff', fontSize:15, fontWeight:600, cursor:'pointer' }}>
            {mode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>

        <div style={{ marginTop:22, display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <p style={{ margin:0, fontSize:13, color:'var(--mid)' }}>
            {mode === 'signup' ? 'Already have an account?' : 'First time here?'}
          </p>
          <button type="button" onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); resetForm(); }} style={{ background:'none', border:'none', color:'var(--sage-d)', fontWeight:700, cursor:'pointer', fontSize:13 }}>
            {mode === 'signup' ? 'Switch to log in' : 'Create a new account'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
