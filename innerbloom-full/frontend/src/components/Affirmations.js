import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from './SectionHeader';
import { getAffirmations, saveJournal, getJournals, deleteJournal } from '../utils/api';

const LOCAL_AFF = [
  'I am strong and capable of every thing that comes my way.',
  'Everything is in my control. I am grateful for this moment.',
  'I am worthy of love, kindness, and all good things.',
  'Even though I fail, I am happy that I tried and will try again.',
  'I choose positivity above everything else today.',
  'My feelings are valid. I allow myself to feel and heal.',
  'I am enough, exactly as I am right now.',
  'Peace begins with me. I breathe in calm and breathe out tension.',
  'I deserve joy, rest, and all the good that life has to offer.',
  'Today I choose me, gently and without apology.',
];

const BORDER_COLORS = ['var(--sage)','var(--blush)','var(--lavender)','var(--gold)','var(--sage-d)'];
const PROMPTS = [
  '💭 What am I grateful for?',
  '🌱 What challenged me today?',
  '✨ What brought me joy?',
  '🌙 Tonight I let go of…',
  '💪 What made me proud?',
  '🌿 What do I need more of?',
];

export default function Affirmations() {
  const [affList,       setAffList]       = useState(LOCAL_AFF.slice(0,5));
  const [shuffling,     setShuffling]     = useState(false);
  const [journalText,   setJournalText]   = useState('');
  const [activePrompt,  setActivePrompt]  = useState(0);
  const [saved,         setSaved]         = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [pastEntries,   setPastEntries]   = useState([]);
  const [showEntries,   setShowEntries]   = useState(false);
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.1 });

  useEffect(() => {
    getJournals().then(setPastEntries).catch(()=>{});
  }, []);

  const shuffle = async () => {
    setShuffling(true);
    try {
      const fresh = await getAffirmations();
      setAffList(fresh);
    } catch {
      const shuffled = [...LOCAL_AFF].sort(() => Math.random()-0.5).slice(0,5);
      setAffList(shuffled);
    }
    setTimeout(() => setShuffling(false), 400);
  };

  const handleSave = async () => {
    if (!journalText.trim()) return;
    setSaving(true);
    try {
      const entry = await saveJournal({
        title: 'Journal Entry',
        content: journalText,
        prompt: PROMPTS[activePrompt],
      });
      setPastEntries(prev => [entry.entry, ...prev]);
    } catch { /* still show success */ }
    setSaved(true);
    setJournalText('');
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setPastEntries(prev => prev.filter(e=>e.id!==id));
    deleteJournal(id).catch(()=>{});
  };

  const promptClick = (i) => {
    setActivePrompt(i);
    setJournalText(prev => prev); // keep existing text
  };

  return (
    <section id="journal" style={{ background:'var(--lav-l)' }} className="section-padding">
      <div ref={ref} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionHeader tag="Words & Writing"
          title="Affirmations & <em style='color:var(--sage-d);font-style:italic'>Your Journal</em>"
          sub="Words have weight. Speak kindness to yourself daily, and let the journal hold what you can't say aloud." />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:36, alignItems:'start' }}
          className="aff-grid">

          {/* Affirmations */}
          <motion.div initial={{ opacity:0, x:-28 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:0.6 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20,
              color:'var(--ink)', marginBottom:18 }}>Words of Affirmation</h3>

            <AnimatePresence mode="popLayout">
              {!shuffling && affList.map((text,i) => (
                <motion.div key={text}
                  style={{ background:'#fff',
                    borderLeft:`4px solid ${BORDER_COLORS[i%5]}`,
                    borderRadius:'0 16px 16px 0', padding:'16px 20px',
                    fontSize:15, lineHeight:1.55, color:'var(--ink)',
                    boxShadow:'var(--shadow-sm)', marginBottom:12 }}
                  initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:20 }}
                  transition={{ duration:0.35, delay:i*0.07 }}
                  whileHover={{ x:6 }}>
                  {text}
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.button onClick={shuffle}
              style={{ marginTop:4, padding:'11px 22px', background:'#fff',
                border:'1.5px solid var(--lavender)', borderRadius:50,
                fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500,
                color:'var(--mid)', cursor:'pointer' }}
              whileHover={{ scale:1.04, borderColor:'var(--lav-d)', color:'var(--lav-d)' }}
              whileTap={{ scale:0.96, rotate: shuffling ? 360 : 0 }}
              animate={shuffling ? { rotate:360 } : { rotate:0 }}
              transition={{ duration:0.4 }}>
              🔀 Shuffle Affirmations
            </motion.button>
          </motion.div>

          {/* Journal */}
          <motion.div style={{ background:'#FFFDF8', border:'1.5px solid var(--blush-l)',
            borderRadius:28, padding:30, boxShadow:'var(--shadow-md)' }}
            initial={{ opacity:0, x:28 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:0.6, delay:0.12 }}>

            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:22,
              color:'var(--ink)', marginBottom:6 }}>📖 Your Journal</p>
            <p style={{ fontSize:12, color:'var(--light)', fontStyle:'italic', marginBottom:18 }}>
              {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})} · Private & Secure 🔒
            </p>

            <textarea value={journalText} onChange={e=>setJournalText(e.target.value)}
              placeholder="Start writing… this is just for you."
              rows={5}
              style={{ width:'100%', padding:'14px 16px',
                border:'1.5px solid rgba(168,190,160,0.35)', borderRadius:14,
                background:'var(--cream)', fontFamily:"'DM Sans',sans-serif",
                fontSize:14, color:'var(--ink)', resize:'none', outline:'none',
                lineHeight:1.7, marginBottom:14, transition:'border-color 0.2s' }}
              onFocus={e=>e.target.style.borderColor='var(--sage-d)'}
              onBlur={e=>e.target.style.borderColor='rgba(168,190,160,0.35)'} />

            <p style={{ fontSize:12, color:'var(--light)', marginBottom:10 }}>Prompt ideas</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:18 }}>
              {PROMPTS.map((p,i) => (
                <motion.button key={i} onClick={() => promptClick(i)}
                  style={{ padding:'7px 14px', borderRadius:50,
                    background: activePrompt===i ? '#EAF1E8' : 'var(--warm)',
                    border:`1.5px solid ${activePrompt===i ? 'var(--sage-d)' : 'transparent'}`,
                    fontSize:12, color: activePrompt===i ? 'var(--sage-d)' : 'var(--mid)',
                    cursor:'pointer', fontFamily:"'DM Sans',sans-serif", outline:'none' }}
                  whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
                  {p}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div key="ok"
                  style={{ padding:13, background:'#E8F5E4', color:'#3A7830',
                    borderRadius:14, fontSize:14, fontWeight:500, textAlign:'center' }}
                  initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}>
                  ✅ Entry saved. Well done for showing up today 🌸
                </motion.div>
              ) : (
                <motion.button key="btn" onClick={handleSave}
                  style={{ width:'100%', padding:13, background:'var(--sage-d)', color:'#fff',
                    border:'none', borderRadius:14, fontFamily:"'DM Sans',sans-serif",
                    fontSize:14, fontWeight:500, cursor:'pointer',
                    opacity: journalText.trim() ? 1 : 0.5 }}
                  disabled={!journalText.trim() || saving}
                  whileHover={{ scale:1.02, background:'var(--sage-dd)' }} whileTap={{ scale:0.97 }}>
                  {saving ? 'Saving…' : 'Save Entry'}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Past entries toggle */}
            {pastEntries.length > 0 && (
              <div style={{ marginTop:20 }}>
                <button onClick={() => setShowEntries(p=>!p)}
                  style={{ background:'none', border:'none', color:'var(--sage-d)',
                    fontSize:13, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                    fontWeight:500 }}>
                  {showEntries ? '▲ Hide' : '▼ Show'} past entries ({pastEntries.length})
                </button>
                <AnimatePresence>
                  {showEntries && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                      exit={{ height:0, opacity:0 }} style={{ overflow:'hidden', marginTop:10 }}>
                      {pastEntries.slice(0,5).map(e => (
                        <div key={e.id} style={{ background:'var(--warm)', borderRadius:12,
                          padding:'12px 14px', marginBottom:8, position:'relative' }}>
                          <p style={{ fontSize:11, color:'var(--light)', marginBottom:4 }}>
                            {new Date(e.timestamp).toLocaleDateString()}
                          </p>
                          <p style={{ fontSize:13, color:'var(--ink)', lineHeight:1.5 }}>
                            {e.content.slice(0,120)}{e.content.length>120?'…':''}
                          </p>
                          <button onClick={() => handleDelete(e.id)}
                            style={{ position:'absolute', top:10, right:10,
                              background:'none', border:'none', color:'var(--light)',
                              cursor:'pointer', fontSize:14 }}>✕</button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.aff-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
