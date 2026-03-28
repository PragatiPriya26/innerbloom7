import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from './SectionHeader';
import { logMood, getWeekMoods } from '../utils/api';

const DAYS    = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const EMOJIS  = [
  { emoji:'😁', label:'GREAT',    val:100, cls:'#E8F5E4' },
  { emoji:'🙂', label:'GOOD',     val:80,  cls:'#FFF5E0' },
  { emoji:'😐', label:'NEUTRAL',  val:60,  cls:'#EAE4F4' },
  { emoji:'😟', label:'LOW',      val:40,  cls:'#F2D5C8' },
  { emoji:'😴', label:'TIRED',    val:30,  cls:'#E0F0F8' },
  { emoji:'😤', label:'STRESSED', val:25,  cls:'#F8EAF4' },
  { emoji:'🥲', label:'SAD',      val:20,  cls:'#FFF0DC' },
  { emoji:'🤩', label:'EXCITED',  val:95,  cls:'#E4F0E8' },
];

function buildPath(data, W=400, H=80) {
  if (data.length < 2) return { pathD:'', fillD:'' };
  const pts = data.map((v,i) => [
    (i/(data.length-1))*W,
    H - (v/100)*(H-10) - 5,
  ]);
  const pathD = pts.reduce((acc,[x,y],i) => {
    if (i===0) return `M ${x},${y}`;
    const [px,py] = pts[i-1];
    const cx = px+(x-px)/2;
    return `${acc} C ${cx},${py} ${cx},${y} ${x},${y}`;
  },'');
  return { pathD, fillD:`${pathD} L ${W},${H} L 0,${H} Z`, pts };
}

export default function MoodTracker() {
  const [activeDay,   setActiveDay]   = useState(new Date().getDay() || 6);
  const [selMood,     setSelMood]     = useState(null);
  const [logged,      setLogged]      = useState(false);
  const [weekData,    setWeekData]    = useState([65,50,72,40,80,60,55]);
  const [loading,     setLoading]     = useState(false);
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.15 });

  // Load saved moods from backend
  useEffect(() => {
    getWeekMoods().then(data => {
      if (data.length > 0) {
        const filled = [...weekData];
        data.slice(-7).forEach((m,i) => { filled[i] = EMOJIS.find(e=>e.label===m.emoji)?.val || 55; });
        setWeekData(filled);
      }
    }).catch(()=>{});
  // eslint-disable-next-line
  }, []);

  const handleLog = async () => {
    if (!selMood) return;
    setLoading(true);
    try {
      await logMood({ mood: selMood.label.toLowerCase(), emoji: selMood.label, note:'' });
      const newData = [...weekData];
      newData[activeDay] = selMood.val;
      setWeekData(newData);
      setLogged(true);
      setTimeout(() => setLogged(false), 3000);
    } catch(e) {
      // still update locally
      const newData = [...weekData];
      newData[activeDay] = selMood.val;
      setWeekData(newData);
      setLogged(true);
      setTimeout(() => setLogged(false), 3000);
    }
    setLoading(false);
  };

  const W=400, H=80;
  const { pathD, fillD, pts } = buildPath(weekData, W, H);
  const best    = EMOJIS.find(e=>e.val===Math.max(...weekData.map(v=>v)));
  const worst   = EMOJIS.find(e=>e.val===Math.min(...weekData.map(v=>v)));

  return (
    <section id="mood" style={{ background:'var(--cream)' }} className="section-padding">
      <div ref={ref} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionHeader tag="Track & Reflect"
          title="Your <em style='color:var(--sage-d);font-style:italic'>mood, mapped</em>"
          sub="Patterns reveal wisdom. Check in daily and watch your emotional landscape unfold." />

        <div style={{ display:'grid', gridTemplateColumns:'1.45fr 1fr', gap:28, alignItems:'start' }}
          className="mood-grid">

          {/* Chart card */}
          <motion.div style={{ background:'#fff', borderRadius:28, padding:30, boxShadow:'var(--shadow-md)' }}
            initial={{ opacity:0, x:-28 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:0.6 }}>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'var(--ink)' }}>
                This Week's Mood
              </p>
              <div style={{ display:'flex', gap:6 }}>
                {DAYS.map((d,i) => (
                  <motion.button key={d} onClick={() => setActiveDay(i)}
                    style={{ width:34, height:34, borderRadius:'50%',
                      border:`1.5px solid ${activeDay===i ? 'var(--blush)' : 'var(--blush-l)'}`,
                      background: activeDay===i ? 'var(--blush)' : 'none',
                      color: activeDay===i ? '#fff' : 'var(--mid)',
                      fontSize:11, fontWeight:600, cursor:'pointer',
                      fontFamily:"'DM Sans',sans-serif", outline:'none' }}
                    whileHover={{ scale:1.12 }} whileTap={{ scale:0.95 }}>
                    {d[0]}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* SVG Chart */}
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', marginBottom:24 }}>
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A8BEA0" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#A8BEA0" stopOpacity="0" />
                </linearGradient>
              </defs>
              {fillD && <path d={fillD} fill="url(#wg)" />}
              {pathD && (
                <motion.path d={pathD} fill="none" stroke="#6F9463" strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength:0 }} animate={inView?{pathLength:1}:{}}
                  transition={{ duration:1.4, ease:'easeInOut' }} />
              )}
              {pts && pts.map(([x,y],i) => (
                <motion.circle key={i} cx={x} cy={y}
                  r={i===activeDay ? 6 : 4}
                  fill={i===activeDay ? '#E8B4A0' : '#6F9463'}
                  stroke={i===activeDay ? '#fff' : 'none'} strokeWidth={2}
                  initial={{ scale:0 }} animate={inView?{scale:1}:{}}
                  transition={{ delay:0.8+i*0.1 }}
                  style={{ cursor:'pointer' }} onClick={() => setActiveDay(i)} />
              ))}
            </svg>

            {/* Summary */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[
                { val: best?.emoji || '😊',  label:'Best',    sub: best?.label || 'Happy' },
                { val:'😌', label:'Average', sub:'Calm' },
                { val: worst?.emoji || '😔', label:'Lowest',  sub: worst?.label || 'Low' },
              ].map(s => (
                <div key={s.label} style={{ background:'var(--warm)', borderRadius:14, padding:'14px', textAlign:'center' }}>
                  <div style={{ fontSize:26 }}>{s.val}</div>
                  <div style={{ fontSize:11, color:'var(--light)', marginTop:4 }}>{s.label}</div>
                  <div style={{ fontSize:13, color:'var(--mid)', marginTop:2, fontWeight:500 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Daily reflection */}
          <motion.div style={{ background:'#fff', borderRadius:28, padding:28, boxShadow:'var(--shadow-md)' }}
            initial={{ opacity:0, x:28 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:0.6, delay:0.12 }}>
            <p style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase',
              color:'var(--sage-d)', fontWeight:500, marginBottom:6 }}>Daily Reflection</p>
            <p style={{ fontSize:14, color:'var(--mid)', marginBottom:20 }}>How are you feeling right now?</p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
              {EMOJIS.map((e,i) => (
                <motion.button key={i} onClick={() => setSelMood(e)}
                  style={{ aspectRatio:1, borderRadius:16,
                    border:`2px solid ${selMood?.label===e.label ? 'var(--sage-d)' : 'transparent'}`,
                    background:e.cls, display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center', gap:4,
                    cursor:'pointer', outline:'none' }}
                  whileHover={{ scale:1.08, y:-2 }} whileTap={{ scale:0.95 }}>
                  <span style={{ fontSize:26 }}>{e.emoji}</span>
                  <span style={{ fontSize:8, color:'var(--mid)', fontWeight:600, letterSpacing:'0.05em' }}>{e.label}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {logged ? (
                <motion.div key="ok"
                  style={{ width:'100%', padding:13, background:'#E8F5E4',
                    color:'#3A7830', borderRadius:14, fontSize:14, fontWeight:500, textAlign:'center' }}
                  initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}>
                  🌸 Mood logged! Keep showing up.
                </motion.div>
              ) : (
                <motion.button key="btn"
                  style={{ width:'100%', padding:13, background:'var(--sage-d)', color:'#fff',
                    border:'none', borderRadius:14, fontFamily:"'DM Sans',sans-serif",
                    fontSize:14, fontWeight:500, cursor:'pointer',
                    opacity: selMood ? 1 : 0.55 }}
                  onClick={handleLog} disabled={!selMood || loading}
                  whileHover={{ scale:1.02, background:'var(--sage-dd)' }} whileTap={{ scale:0.97 }}>
                  {loading ? 'Saving…' : 'Log Today\'s Feeling'}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.mood-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
