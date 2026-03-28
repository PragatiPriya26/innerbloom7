import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOODS = [
  { id:'great', emoji:'😊', label:'Great',  col:'#E8F5E4', text:'#4A8A3C', border:'#A8D49A', msg:"That's wonderful! Your positivity is contagious today 🌟" },
  { id:'okay',  emoji:'😌', label:'Okay',   col:'#EAE4F4', text:'#7260A0', border:'#C5B8D8', msg:"Okay is perfectly fine. Let's make it a little brighter 🌿" },
  { id:'meh',   emoji:'😶', label:'Meh',    col:'#FFF5E0', text:'#A08020', border:'#E0C870', msg:"Meh days happen. We're here to add some warmth 🍂" },
  { id:'low',   emoji:'😔', label:'Low',    col:'#F2D5C8', text:'#A05040', border:'#E8B4A0', msg:"Thank you for being honest. You're not alone 💜" },
];

const CARDS = [
  { label:"Today's pick for you", title:'Calm the Racing Mind',   meta:'6-min guided meditation', chip:'▶ Play now',    col:'#E8F5E4', tc:'#4A8A3C' },
  { label:'Saved & Favorites',    title:'Daily Motivation',        meta:'Victoria Lucas',           chip:'📌 Saved',      col:'#EAE4F4', tc:'#7260A0' },
  { label:'Upcoming Session',     title:'Book Reading Secrets',    meta:'3/27 · 45 min',            chip:'🗓 Reminder',   col:'#F2D5C8', tc:'#A05040' },
];

export default function Hero({ userName = 'Friend' }) {
  const [sel,     setSel]     = useState(null);
  const [showMsg, setShowMsg] = useState(false);

  const pick = (m) => {
    setSel(m.id); setShowMsg(true);
    setTimeout(() => setShowMsg(false), 3500);
  };

  return (
    <section style={{ position:'relative', overflow:'hidden', padding:'80px 48px 70px' }}>
      {/* ambient blobs */}
      <div style={{ position:'absolute', top:-100, right:-100, width:500, height:500,
        background:'radial-gradient(circle,var(--blush-l) 0%,transparent 68%)',
        borderRadius:'50%', zIndex:0, pointerEvents:'none',
        animation:'floatB 8s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:380, height:380,
        background:'radial-gradient(circle,var(--lav-l) 0%,transparent 68%)',
        borderRadius:'50%', zIndex:0, pointerEvents:'none',
        animation:'floatB 10s ease-in-out infinite reverse' }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:1200, margin:'0 auto',
        display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:56, alignItems:'center' }}
        className="hero-grid">

        {/* LEFT */}
        <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, ease:[0.25,0.46,0.45,0.94] }}>
          <p style={{ fontSize:13, fontWeight:500, letterSpacing:'0.12em',
            textTransform:'uppercase', color:'var(--blush-d)', marginBottom:14 }}>
            🌿 Welcome back
          </p>
          <h1 style={{ fontFamily:"'Playfair Display',serif",
            fontSize:'clamp(34px,4.5vw,52px)', lineHeight:1.15, color:'var(--ink)', marginBottom:18 }}>
            Good morning,<br />
            <span style={{ display:'block', fontFamily:"'Caveat',cursive",
              fontSize:'clamp(38px,5vw,56px)', color:'var(--blush-d)', lineHeight:1.1 }}>
              {userName} ✨
            </span>
            <em style={{ fontStyle:'italic', color:'var(--sage-d)',
              fontSize:'clamp(22px,3vw,34px)' }}>How are you feeling today?</em>
          </h1>
          <p style={{ fontSize:16, color:'var(--mid)', lineHeight:1.7,
            maxWidth:440, marginBottom:36 }}>
            This is your calm corner of the internet. No judgment, no rush — just a gentle space to check in with yourself.
          </p>

          {/* Mood check-in */}
          <div style={{ background:'#fff', border:'1.5px solid var(--blush-l)',
            borderRadius:28, padding:'26px 30px', display:'inline-block',
            boxShadow:'var(--shadow-md)', maxWidth:440, width:'100%' }}>
            <p style={{ fontSize:15, color:'var(--mid)', marginBottom:16, fontWeight:500 }}>
              I'm feeling…
            </p>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {MOODS.map(m => (
                <motion.button key={m.id}
                  onClick={() => pick(m)}
                  style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px',
                    borderRadius:50, border:`1.5px solid ${m.border}`,
                    background: m.col, color: m.text, fontSize:13, fontWeight:500,
                    cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                    boxShadow: sel===m.id ? `0 0 0 3px ${m.border}66` : 'none',
                    outline:'none' }}
                  whileHover={{ y:-3, scale:1.04 }} whileTap={{ scale:0.96 }}
                  transition={{ type:'spring', stiffness:400 }}>
                  <span>{m.emoji}</span>{m.label}
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {showMsg && sel && (
                <motion.p initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-8 }} transition={{ duration:0.3 }}
                  style={{ marginTop:14, fontSize:13, color:'var(--sage-d)',
                    fontStyle:'italic', padding:'10px 14px',
                    background:'#EAF1E8', borderRadius:10 }}>
                  {MOODS.find(m=>m.id===sel)?.msg}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* RIGHT — cards */}
        <motion.div style={{ display:'flex', flexDirection:'column', gap:16 }}
          initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, delay:0.15 }}>
          {CARDS.map((c,i) => (
            <motion.div key={i}
              style={{ background:'#fff', borderRadius:24, padding:'22px 26px',
                boxShadow:'var(--shadow-sm)', border:'1px solid rgba(168,190,160,0.2)',
                cursor:'pointer' }}
              whileHover={{ y:-4, boxShadow:'0 12px 40px rgba(46,42,38,0.13)' }}
              transition={{ type:'spring', stiffness:300 }}>
              <p style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase',
                color:'var(--light)', marginBottom:6 }}>{c.label}</p>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:17,
                color:'var(--ink)', marginBottom:4 }}>{c.title}</p>
              <p style={{ fontSize:13, color:'var(--mid)' }}>{c.meta}</p>
              <span style={{ display:'inline-block', padding:'5px 12px', borderRadius:50,
                fontSize:12, fontWeight:500, marginTop:10,
                background:c.col, color:c.tc }}>{c.chip}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes floatB {
          0%,100%{transform:translate(0,0) scale(1);}
          33%{transform:translate(20px,-20px) scale(1.04);}
          66%{transform:translate(-15px,15px) scale(0.97);}
        }
        @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important;}}
      `}</style>
    </section>
  );
}
