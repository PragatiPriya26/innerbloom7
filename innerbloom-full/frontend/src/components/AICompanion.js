import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from './SectionHeader';
import { sendChat } from '../utils/api';

const INIT_MSGS = [
  { from:'bloom', text:"Hey there 🌸 I'm Bloom, your InnerBloom companion. I'm here whenever you need to talk — no judgment, just support. How are you feeling today?" },
];

const FEATURES = [
  { icon:'🧠', bg:'#D4EDD8', title:'Mood-aware conversations', desc:"Bloom adapts its tone based on how you've been feeling. Anxious days get gentler responses." },
  { icon:'📓', bg:'var(--lav-l)', title:'Memory & context',    desc:"Bloom remembers what you've shared and builds on it session after session." },
  { icon:'🔒', bg:'var(--blush-l)', title:'Private by design', desc:"All conversations are encrypted. Your thoughts stay yours — always." },
  { icon:'🌿', bg:'#FDF0D0', title:'Crisis-aware & safe',      desc:"If Bloom detects distress, it connects you to a real human counsellor immediately." },
];

const QUICK = ["I'm feeling anxious today", "I need some motivation", "I can't sleep well", "Work is overwhelming me"];

export default function AICompanion() {
  const [messages,  setMessages]  = useState(INIT_MSGS);
  const [input,     setInput]     = useState('');
  const [typing,    setTyping]    = useState(false);
  const [connected, setConnected] = useState(true);
  const endRef = useRef(null);
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.1 });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, typing]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { from:'user', text:msg }]);
    setTyping(true);

    try {
      const data = await sendChat(msg);
      setTimeout(() => {
        setTyping(false);
        setMessages(prev => [...prev, { from:'bloom', text:data.reply.text }]);
      }, 800 + Math.random()*600);
    } catch {
      // fallback offline replies
      const fallbacks = [
        "I'm here for you 🌸 Tell me more about what you're going through.",
        "That sounds really tough. You don't have to go through this alone. 💜",
        "Thank you for sharing that with me. How long have you been feeling this way?",
        "I hear you. Let's work through this together, one breath at a time. 🌿",
      ];
      setTimeout(() => {
        setTyping(false);
        setMessages(prev => [...prev, { from:'bloom', text:fallbacks[Math.floor(Math.random()*fallbacks.length)] }]);
      }, 1200);
    }
  };

  return (
    <section id="ai" style={{ background:'#EAF1E8' }} className="section-padding">
      <div ref={ref} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionHeader tag="AI & Support"
          title="Meet <em style='color:var(--sage-d);font-style:italic'>Bloom</em>, your AI companion"
          sub="Available 24/7, Bloom listens without judgment and guides you toward clarity. Not a replacement for therapy — a kind presence when you need one." />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:40, alignItems:'start' }}
          className="ai-grid">

          {/* Chat */}
          <motion.div style={{ background:'#fff', borderRadius:28, padding:28,
            boxShadow:'var(--shadow-lg)', border:'1px solid rgba(197,184,216,0.3)' }}
            initial={{ opacity:0, x:-32 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:0.65 }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20,
              paddingBottom:20, borderBottom:'1px solid rgba(168,190,160,0.2)' }}>
              <motion.div style={{ width:44, height:44, borderRadius:'50%',
                background:'linear-gradient(135deg,var(--sage),var(--lavender))',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}
                animate={{ rotate:[0,5,-5,0] }} transition={{ duration:4, repeat:Infinity }}>
                🌸
              </motion.div>
              <div>
                <p style={{ fontWeight:600, fontSize:15, color:'var(--ink)' }}>Bloom</p>
                <p style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--sage-d)', marginTop:2 }}>
                  <motion.span style={{ width:7, height:7, borderRadius:'50%', background:'var(--sage-d)', display:'inline-block' }}
                    animate={{ opacity:[1,0.4,1], scale:[1,0.85,1] }} transition={{ duration:2, repeat:Infinity }} />
                  Online — always here for you
                </p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ display:'flex', flexDirection:'column', gap:12,
              minHeight:260, maxHeight:320, overflowY:'auto',
              marginBottom:16, paddingRight:4, scrollBehavior:'smooth' }}>
              <AnimatePresence initial={false}>
                {messages.map((m,i) => (
                  <motion.div key={i}
                    style={{ maxWidth:'82%', padding:'12px 16px', borderRadius:18, fontSize:14,
                      lineHeight:1.55,
                      ...(m.from==='bloom'
                        ? { background:'var(--lav-l)', color:'var(--ink)', borderBottomLeftRadius:4, alignSelf:'flex-start' }
                        : { background:'var(--sage-d)', color:'#fff', borderBottomRightRadius:4, alignSelf:'flex-end' }) }}
                    initial={{ opacity:0, y:12, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }}
                    transition={{ duration:0.3 }}>
                    {m.text}
                  </motion.div>
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {typing && (
                  <motion.div style={{ maxWidth:'82%', padding:'12px 16px', borderRadius:18,
                    background:'var(--lav-l)', borderBottomLeftRadius:4, alignSelf:'flex-start',
                    display:'flex', gap:5, alignItems:'center' }}
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                    {[0,0.2,0.4].map(d => (
                      <motion.span key={d} style={{ fontSize:16, color:'var(--lav-d)' }}
                        animate={{ opacity:[0.3,1,0.3] }}
                        transition={{ duration:1, repeat:Infinity, delay:d }}>●</motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Quick replies */}
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
              {QUICK.map(q => (
                <motion.button key={q} onClick={() => send(q)}
                  style={{ padding:'5px 12px', borderRadius:50, fontSize:11,
                    background:'var(--warm)', border:'1px solid var(--blush-l)',
                    color:'var(--mid)', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
                  whileHover={{ background:'var(--blush-l)', color:'var(--ink)' }}
                  whileTap={{ scale:0.96 }}>
                  {q}
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <input value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()}
                placeholder="Type something…"
                style={{ flex:1, padding:'12px 18px',
                  border:'1.5px solid rgba(168,190,160,0.4)', borderRadius:50,
                  background:'var(--warm)', fontFamily:"'DM Sans',sans-serif",
                  fontSize:14, color:'var(--ink)', outline:'none',
                  transition:'border-color 0.2s' }}
                onFocus={e=>e.target.style.borderColor='var(--sage-d)'}
                onBlur={e=>e.target.style.borderColor='rgba(168,190,160,0.4)'} />
              <motion.button onClick={() => send()}
                disabled={!input.trim() || typing}
                style={{ width:42, height:42, borderRadius:'50%',
                  background:'var(--sage-d)', color:'#fff', border:'none',
                  fontSize:16, cursor:'pointer', display:'flex',
                  alignItems:'center', justifyContent:'center',
                  opacity: input.trim() ? 1 : 0.45 }}
                whileHover={{ scale:1.08, background:'var(--ink)' }}
                whileTap={{ scale:0.93 }}>
                ➤
              </motion.button>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div style={{ display:'flex', flexDirection:'column', gap:18 }}
            initial={{ opacity:0, x:32 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:0.65, delay:0.12 }}>
            {FEATURES.map((f,i) => (
              <motion.div key={i}
                style={{ display:'flex', gap:16, alignItems:'flex-start',
                  background:'#fff', borderRadius:20, padding:22, boxShadow:'var(--shadow-sm)' }}
                whileHover={{ x:4, boxShadow:'var(--shadow-md)' }}
                transition={{ type:'spring', stiffness:300 }}>
                <div style={{ width:46, height:46, borderRadius:14, background:f.bg,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:22, flexShrink:0 }}>{f.icon}</div>
                <div>
                  <p style={{ fontWeight:600, fontSize:15, color:'var(--ink)', marginBottom:5 }}>{f.title}</p>
                  <p style={{ fontSize:13, color:'var(--mid)', lineHeight:1.55 }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.ai-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
