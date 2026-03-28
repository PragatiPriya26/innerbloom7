import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from './SectionHeader';
import { saveGameScore } from '../utils/api';

/* ═══════════════════════════════════════
   GAME 1 — Bubble Breather
═══════════════════════════════════════ */
function BubbleBreather({ onClose }) {
  const [phase,   setPhase]   = useState('ready'); // ready | in | hold | out | done
  const [count,   setCount]   = useState(4);
  const [cycles,  setCycles]  = useState(0);
  const [total,   setTotal]   = useState(0);
  const MAX_CYCLES = 5;

  useEffect(() => {
    if (phase === 'ready') return;
    if (phase === 'done')  return;
    const dur = phase==='hold' ? 7 : 4;
    let c = dur;
    setCount(c);
    const iv = setInterval(() => {
      c--;
      setCount(c);
      if (c <= 0) {
        clearInterval(iv);
        if (phase === 'in') {
          setPhase('hold');
        } else if (phase === 'hold') {
          setPhase('out');
        } else if (phase === 'out') {
          const nc = cycles + 1;
          setCycles(nc);
          setTotal(t => t+1);
          if (nc >= MAX_CYCLES) { setPhase('done'); saveGameScore({ game:'bubble', score:MAX_CYCLES, duration:MAX_CYCLES*15 }).catch(()=>{}); }
          else setPhase('in');
        }
      }
    }, 1000);
    return () => clearInterval(iv);
  // eslint-disable-next-line
  }, [phase]);

  const phaseLabel  = { ready:'Press Start', in:'Breathe In', hold:'Hold', out:'Breathe Out', done:'Well done!' };
  const phaseColor  = { ready:'var(--sage)', in:'var(--sage-d)', hold:'var(--lavender)', out:'var(--blush)', done:'var(--gold)' };
  const targetScale = { ready:1, in:1.7, hold:1.7, out:0.75, done:1.1 };

  return (
    <div style={overlay}>
      <motion.div style={modal} initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.85, opacity:0 }}>
        <button style={closeBtn} onClick={onClose}>✕</button>
        <p style={modalTitle}>🫧 Bubble Breather</p>
        <p style={{ fontSize:13, color:'var(--mid)', marginBottom:20, textAlign:'center' }}>
          4-7-8 breathing · {cycles}/{MAX_CYCLES} cycles
        </p>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, marginBottom:20 }}>
          <motion.div
            style={{ width:100, height:100, borderRadius:'50%',
              background:`radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), ${phaseColor[phase]} 60%, var(--sage-dd))`,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 8px 32px ${phaseColor[phase]}55, inset 0 2px 8px rgba(255,255,255,0.6)` }}
            animate={{ scale: targetScale[phase] }}
            transition={{ duration: phase==='in'?4 : phase==='hold'?0.1 : phase==='out'?4 : 0.3, ease:'easeInOut' }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:36,
              color:'#fff', textShadow:'0 2px 4px rgba(0,0,0,0.15)' }}>
              {phase === 'ready' ? '🫧' : phase === 'done' ? '🌸' : count}
            </span>
          </motion.div>
        </div>

        <p style={{ fontSize:20, fontWeight:600, color:phaseColor[phase],
          textAlign:'center', marginBottom:8, letterSpacing:'0.05em' }}>
          {phaseLabel[phase]}
        </p>
        <p style={{ fontSize:13, color:'var(--mid)', textAlign:'center', marginBottom:24, fontStyle:'italic' }}>
          {phase==='ready' ? 'Close your eyes if it helps. Just follow the bubble.' :
           phase==='in'    ? 'Expand your belly as you breathe in…' :
           phase==='hold'  ? 'Hold gently. Let the stillness settle.' :
           phase==='out'   ? 'Release slowly through your mouth…' :
           'You completed 5 breath cycles. Your nervous system thanks you 🌿'}
        </p>

        {phase === 'ready' || phase === 'done' ? (
          <motion.button
            style={{ width:'100%', padding:14, background:'var(--sage-d)', color:'#fff',
              border:'none', borderRadius:14, fontFamily:"'DM Sans',sans-serif",
              fontSize:15, fontWeight:500, cursor:'pointer' }}
            onClick={() => { setCycles(0); setPhase('in'); }}
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
            {phase==='done' ? '🔄 Do it again' : '▶ Start Breathing'}
          </motion.button>
        ) : null}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════
   GAME 2 — Memory Match (calm cards)
═══════════════════════════════════════ */
const CARD_PAIRS = ['🌸','🌿','🌙','☁️','🌻','🦋','🌊','🍃'];

function MemoryGame({ onClose }) {
  const makeBoard = useCallback(() => {
    const cards = [...CARD_PAIRS, ...CARD_PAIRS]
      .map((emoji, i) => ({ id:i, emoji, flipped:false, matched:false }))
      .sort(() => Math.random()-0.5);
    return cards;
  }, []);

  const [cards,    setCards]    = useState(makeBoard);
  const [selected, setSelected] = useState([]);
  const [moves,    setMoves]    = useState(0);
  const [won,      setWon]      = useState(false);
  const [checking, setChecking] = useState(false);

  const flip = (id) => {
    if (checking) return;
    const card = cards.find(c=>c.id===id);
    if (!card || card.flipped || card.matched) return;
    if (selected.length === 1 && selected[0].id === id) return;

    const newCards = cards.map(c => c.id===id ? {...c, flipped:true} : c);
    setCards(newCards);
    const newSel = [...selected, { id, emoji: card.emoji }];
    setSelected(newSel);

    if (newSel.length === 2) {
      setMoves(m=>m+1);
      setChecking(true);
      if (newSel[0].emoji === newSel[1].emoji) {
        setTimeout(() => {
          setCards(c => c.map(card =>
            newSel.some(s=>s.id===card.id) ? {...card, matched:true} : card
          ));
          setSelected([]);
          setChecking(false);
          const allDone = newCards.filter(c=>!newSel.some(s=>s.id===c.id)).every(c=>c.matched);
          if (allDone || newCards.filter(c=>c.matched||newSel.some(s=>s.id===c.id)).length === newCards.length) {
            setWon(true);
            saveGameScore({ game:'memory', score:moves+1, duration:moves*3 }).catch(()=>{});
          }
        }, 600);
      } else {
        setTimeout(() => {
          setCards(c => c.map(card =>
            newSel.some(s=>s.id===card.id) ? {...card, flipped:false} : card
          ));
          setSelected([]);
          setChecking(false);
        }, 900);
      }
    }
  };

  useEffect(() => {
    const matched = cards.filter(c=>c.matched).length;
    if (matched === cards.length && cards.length > 0) {
      setWon(true);
      saveGameScore({ game:'memory', score:moves, duration:moves*3 }).catch(()=>{});
    }
  }, [cards, moves]);

  return (
    <div style={overlay}>
      <motion.div style={{ ...modal, maxWidth:520 }} initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.85, opacity:0 }}>
        <button style={closeBtn} onClick={onClose}>✕</button>
        <p style={modalTitle}>🧩 Memory Match</p>
        <p style={{ textAlign:'center', fontSize:13, color:'var(--mid)', marginBottom:16 }}>
          Moves: {moves} · Matched: {cards.filter(c=>c.matched).length/2}/{CARD_PAIRS.length}
        </p>

        {won ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <p style={{ fontSize:48, marginBottom:12 }}>🎉</p>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'var(--ink)', marginBottom:8 }}>You did it!</p>
            <p style={{ fontSize:14, color:'var(--mid)', marginBottom:20 }}>Completed in {moves} moves. Your focus is 🔥</p>
            <motion.button style={gameBtn} onClick={() => { setCards(makeBoard()); setMoves(0); setWon(false); setSelected([]); }}
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>🔄 Play Again</motion.button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {cards.map(card => (
              <motion.div key={card.id} onClick={() => flip(card.id)}
                style={{ aspectRatio:1, borderRadius:14, cursor:'pointer',
                  background: card.matched ? '#E8F5E4' : card.flipped ? 'var(--lav-l)' : 'var(--warm)',
                  border:`2px solid ${card.matched ? 'var(--sage)' : card.flipped ? 'var(--lavender)' : 'var(--blush-l)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:28, userSelect:'none' }}
                whileHover={!card.flipped && !card.matched ? { scale:1.05 } : {}}
                whileTap={!card.flipped && !card.matched ? { scale:0.95 } : {}}>
                <AnimatePresence mode="wait">
                  {(card.flipped || card.matched) ? (
                    <motion.span key="front" initial={{ rotateY:90 }} animate={{ rotateY:0 }} transition={{ duration:0.2 }}>
                      {card.emoji}
                    </motion.span>
                  ) : (
                    <motion.span key="back" initial={{ rotateY:90 }} animate={{ rotateY:0 }} transition={{ duration:0.2 }}>
                      🌸
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════
   GAME 3 — Garden of Thoughts
═══════════════════════════════════════ */
function GardenGame({ onClose }) {
  const [thought,  setThought]  = useState('');
  const [seeds,    setSeeds]    = useState([
    { id:1, text:'I am enough',  x:18, y:62, stage:3 },
    { id:2, text:'I am loved',   x:62, y:68, stage:3 },
    { id:3, text:'I am calm',    x:40, y:58, stage:2 },
  ]);
  const [score, setScore] = useState(0);
  const stageEmoji = ['🌱','🌿','🌻','🌸'];

  const plant = () => {
    if (!thought.trim()) return;
    const id = Date.now();
    setSeeds(prev => [...prev, { id, text:thought.trim(), x:10+Math.random()*78, y:55+Math.random()*20, stage:0 }]);
    setThought('');
    setScore(s=>s+10);
    // Grow planted seed
    setTimeout(() => setSeeds(prev=>prev.map(s=>s.id===id?{...s,stage:1}:s)), 500);
    setTimeout(() => setSeeds(prev=>prev.map(s=>s.id===id?{...s,stage:2}:s)), 1500);
    setTimeout(() => { setSeeds(prev=>prev.map(s=>s.id===id?{...s,stage:3}:s)); saveGameScore({game:'garden',score:score+10,duration:1}).catch(()=>{}); }, 3000);
  };

  const water = (id) => {
    setSeeds(prev=>prev.map(s=>s.id===id ? {...s,stage:Math.min(3,s.stage+1)} : s));
    setScore(s=>s+5);
  };

  return (
    <div style={overlay}>
      <motion.div style={{ ...modal, maxWidth:500 }} initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.85, opacity:0 }}>
        <button style={closeBtn} onClick={onClose}>✕</button>
        <p style={modalTitle}>🌸 Garden of Thoughts</p>
        <p style={{ textAlign:'center', fontSize:13, color:'var(--mid)', marginBottom:12 }}>Score: {score} pts · {seeds.length} thoughts planted</p>

        {/* Garden visual */}
        <div style={{ height:200, borderRadius:16, overflow:'hidden', position:'relative', marginBottom:16 }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,#C8E6F5 0%,#D4E8C0 60%,#8B6914 100%)' }} />
          {seeds.map(s => (
            <motion.div key={s.id}
              style={{ position:'absolute', left:`${s.x}%`, bottom:`${100-s.y}%`,
                transform:'translateX(-50%) translateY(50%)',
                display:'flex', flexDirection:'column', alignItems:'center',
                cursor:'pointer', zIndex:2 }}
              initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
              transition={{ type:'spring', stiffness:300 }}
              onClick={() => water(s.id)} title="Click to water 💧">
              <span style={{ fontSize:s.stage===0?14:s.stage===1?18:s.stage===2?24:28 }}>
                {stageEmoji[s.stage]}
              </span>
              <span style={{ fontSize:9, background:'rgba(255,255,255,0.85)',
                padding:'2px 6px', borderRadius:6, marginTop:2, whiteSpace:'nowrap',
                color:'var(--ink)', maxWidth:70, overflow:'hidden', textOverflow:'ellipsis' }}>
                {s.text}
              </span>
            </motion.div>
          ))}
        </div>

        <p style={{ fontSize:12, color:'var(--light)', marginBottom:8, textAlign:'center' }}>
          💡 Click plants to water them and help them grow!
        </p>

        <div style={{ display:'flex', gap:10 }}>
          <input value={thought} onChange={e=>setThought(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&plant()}
            placeholder="Type a positive thought…"
            style={{ flex:1, padding:'11px 16px', border:'1.5px solid rgba(168,190,160,0.4)',
              borderRadius:12, background:'var(--warm)', fontFamily:"'DM Sans',sans-serif",
              fontSize:14, color:'var(--ink)', outline:'none' }} />
          <motion.button onClick={plant}
            style={gameBtn} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
            Plant 🌱
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════
   GAME 4 — Cloud Sorting (Worry Release)
═══════════════════════════════════════ */
function CloudGame({ onClose }) {
  const [worry,   setWorry]   = useState('');
  const [clouds,  setClouds]  = useState([]);
  const [released,setReleased] = useState([]);
  const [score,   setScore]   = useState(0);

  const addCloud = () => {
    if (!worry.trim()) return;
    const id = Date.now();
    setClouds(prev=>[...prev, { id, text:worry.trim(), x:Math.random()*60+10, opacity:1 }]);
    setWorry('');
  };

  const release = (id) => {
    const cloud = clouds.find(c=>c.id===id);
    if (!cloud) return;
    setReleased(prev=>[...prev, cloud]);
    setClouds(prev=>prev.filter(c=>c.id!==id));
    setScore(s=>s+15);
    saveGameScore({ game:'clouds', score:score+15, duration:1 }).catch(()=>{});
  };

  return (
    <div style={overlay}>
      <motion.div style={{ ...modal, maxWidth:480 }} initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.85, opacity:0 }}>
        <button style={closeBtn} onClick={onClose}>✕</button>
        <p style={modalTitle}>☁️ Cloud Release</p>
        <p style={{ textAlign:'center', fontSize:13, color:'var(--mid)', marginBottom:12 }}>
          Type a worry, then let it float away · {released.length} released
        </p>

        {/* Sky */}
        <div style={{ height:200, borderRadius:16, background:'linear-gradient(to bottom,#87CEEB,#B8E0FF)',
          position:'relative', overflow:'hidden', marginBottom:16 }}>
          {/* Released clouds floating up */}
          <AnimatePresence>
            {released.slice(-5).map((c,i) => (
              <motion.div key={c.id}
                style={{ position:'absolute', left:`${c.x}%`,
                  fontSize:13, background:'rgba(255,255,255,0.7)',
                  padding:'4px 10px', borderRadius:20, whiteSpace:'nowrap',
                  color:'rgba(100,100,100,0.8)' }}
                initial={{ y:160, opacity:1 }} animate={{ y:-40, opacity:0 }}
                exit={{}} transition={{ duration:3, delay:i*0.3, ease:'easeOut' }}>
                ☁️ {c.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Current worry clouds */}
          {clouds.map(c => (
            <motion.div key={c.id}
              style={{ position:'absolute', left:`${c.x}%`, top:'50%',
                transform:'translateX(-50%) translateY(-50%)',
                background:'rgba(255,255,255,0.85)', padding:'8px 16px',
                borderRadius:24, cursor:'pointer', boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
                fontSize:13, color:'var(--ink)', textAlign:'center',
                maxWidth:140, userSelect:'none' }}
              initial={{ scale:0 }} animate={{ scale:1, y:[0,-6,0] }}
              transition={{ duration:0.4, y:{ duration:3, repeat:Infinity, ease:'easeInOut' } }}
              onClick={() => release(c.id)}
              title="Click to release this worry ☁️">
              ☁️ {c.text}
              <div style={{ fontSize:10, color:'var(--light)', marginTop:2 }}>tap to release</div>
            </motion.div>
          ))}

          {clouds.length === 0 && released.length > 0 && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
              justifyContent:'center', color:'rgba(255,255,255,0.8)', fontSize:13, textAlign:'center' }}>
              Sky is clear ✨<br/>Your worries have drifted away
            </div>
          )}
          {clouds.length === 0 && released.length === 0 && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
              justifyContent:'center', color:'rgba(100,120,150,0.6)', fontSize:13, textAlign:'center' }}>
              Type a worry below and add it to the sky…
            </div>
          )}
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <input value={worry} onChange={e=>setWorry(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&addCloud()}
            placeholder="Write a worry to release…"
            style={{ flex:1, padding:'11px 16px', border:'1.5px solid rgba(168,190,160,0.4)',
              borderRadius:12, background:'var(--warm)', fontFamily:"'DM Sans',sans-serif",
              fontSize:14, color:'var(--ink)', outline:'none' }} />
          <motion.button onClick={addCloud}
            style={gameBtn} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
            Add ☁️
          </motion.button>
        </div>
        {score > 0 && <p style={{ textAlign:'center', fontSize:12, color:'var(--sage-d)', marginTop:10 }}>+{score} relief points collected 🌿</p>}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Shared modal styles
═══════════════════════════════════════ */
const overlay = {
  position:'fixed', inset:0, background:'rgba(46,42,38,0.55)',
  backdropFilter:'blur(6px)', zIndex:300,
  display:'flex', alignItems:'center', justifyContent:'center', padding:20,
};
const modal = {
  background:'#fff', borderRadius:28, padding:'36px 32px',
  width:'100%', maxWidth:480, position:'relative',
  boxShadow:'var(--shadow-xl)', maxHeight:'90vh', overflowY:'auto',
};
const closeBtn = {
  position:'absolute', top:16, right:16,
  background:'var(--warm)', border:'none', width:32, height:32,
  borderRadius:'50%', fontSize:14, color:'var(--mid)', cursor:'pointer',
};
const modalTitle = {
  fontFamily:"'Playfair Display',serif", fontSize:22, color:'var(--ink)',
  marginBottom:6, textAlign:'center',
};
const gameBtn = {
  padding:'11px 20px', background:'var(--sage-d)', color:'#fff',
  border:'none', borderRadius:12, fontFamily:"'DM Sans',sans-serif",
  fontSize:14, fontWeight:500, cursor:'pointer',
};

/* ═══════════════════════════════════════
   Main Games Section
═══════════════════════════════════════ */
const GAMES = [
  { id:'bubble', emoji:'🫧', bg:'#D4EDD8', name:'Bubble Breather',   desc:'Guided 4-7-8 breathing exercise to calm your nervous system.',    tag:'2–5 min · Anxiety relief' },
  { id:'memory', emoji:'🧩', bg:'var(--lav-l)', name:'Memory Match', desc:'Flip calming cards and find pairs. No timer, just gentle focus.', tag:'5–10 min · Presence & focus' },
  { id:'garden', emoji:'🌸', bg:'var(--blush-l)', name:'Garden of Thoughts', desc:'Plant positive thoughts and watch your garden bloom over time.', tag:'Ongoing · Mood building' },
  { id:'clouds', emoji:'☁️', bg:'#FDF0D0', name:'Cloud Release',     desc:'Write your worries down and watch them float away into the sky.', tag:'3 min · Stress release' },
];

export default function MindfulGames() {
  const [active, setActive] = useState(null);
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.1 });

  return (
    <section id="games" style={{ background:'var(--cream)' }} className="section-padding">
      <div ref={ref} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionHeader tag="Play & Breathe"
          title="Mindful <em style='color:var(--sage-d);font-style:italic'>games</em> for a busy mind"
          sub="Sometimes the best therapy is play. These gentle games anchor you back to the present moment." />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:22 }} className="games-grid">
          {GAMES.map((g,i) => (
            <motion.div key={g.id}
              style={{ background:'#fff', borderRadius:28, padding:'28px 22px',
                textAlign:'center', boxShadow:'var(--shadow-sm)',
                border:'1.5px solid transparent', cursor:'pointer',
                display:'flex', flexDirection:'column', alignItems:'center' }}
              initial={{ opacity:0, y:30 }} animate={inView?{opacity:1,y:0}:{}}
              transition={{ duration:0.5, delay:i*0.1 }}
              whileHover={{ y:-6, borderColor:'var(--sage)', boxShadow:'var(--shadow-lg)' }}>
              <div style={{ width:64, height:64, borderRadius:20, background:g.bg,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:30, marginBottom:16 }}>{g.emoji}</div>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:17,
                color:'var(--ink)', marginBottom:8 }}>{g.name}</p>
              <p style={{ fontSize:13, color:'var(--mid)', lineHeight:1.6, marginBottom:10 }}>{g.desc}</p>
              <p style={{ fontSize:11, color:'var(--sage-d)', fontWeight:500, marginBottom:18 }}>{g.tag}</p>
              <motion.button onClick={() => setActive(g.id)}
                style={{ padding:'10px 22px', borderRadius:50, border:'1.5px solid var(--sage)',
                  background:'none', color:'var(--sage-d)', fontFamily:"'DM Sans',sans-serif",
                  fontSize:13, fontWeight:500, cursor:'pointer', marginTop:'auto' }}
                whileHover={{ background:'var(--sage-d)', color:'#fff', borderColor:'var(--sage-d)', scale:1.05 }}
                whileTap={{ scale:0.96 }}>
                Play Now →
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active === 'bubble' && <BubbleBreather onClose={() => setActive(null)} />}
        {active === 'memory' && <MemoryGame    onClose={() => setActive(null)} />}
        {active === 'garden' && <GardenGame    onClose={() => setActive(null)} />}
        {active === 'clouds' && <CloudGame     onClose={() => setActive(null)} />}
      </AnimatePresence>

      <style>{`
        @media(max-width:900px){.games-grid{grid-template-columns:repeat(2,1fr)!important;}}
        @media(max-width:560px){.games-grid{grid-template-columns:1fr!important;}}
      `}</style>
    </section>
  );
}
