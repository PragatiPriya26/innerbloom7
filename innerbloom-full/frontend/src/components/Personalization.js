import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from './SectionHeader';

const GOALS   = ['Reduce anxiety','Sleep better','Build confidence','Process grief','Relationship health','Manage stress','Find purpose'];
const TIMES   = ['Morning','Afternoon','Evening','Late night'];
const NOTIFS  = ['Soft reminders','Daily prompts','Minimal','Off'];
const THEMES  = ['Sage & Cream','Blush & Gold','Lavender Dusk','Forest Dark'];

const PREVIEW = [
  { icon:'🌅', title:'Morning Check-in · 7:30 AM',  desc:'Gentle mood log + one breathing exercise' },
  { icon:'🎵', title:'Focus Playlist Queued',         desc:'Curated for your current anxiety goal' },
  { icon:'✍️', title:'Evening Journal Prompt',        desc:'Soft reminder at 9 PM to reflect on the day' },
  { icon:'🤖', title:'Weekly Bloom Check-in',         desc:'Bloom will review your week and share patterns' },
];

function TagGroup({ label, opts, sel, toggle }) {
  return (
    <div style={{ marginBottom:24 }}>
      <p style={{ fontSize:11, fontWeight:600, color:'var(--mid)', textTransform:'uppercase',
        letterSpacing:'0.1em', marginBottom:10 }}>{label}</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        {opts.map(o => (
          <motion.button key={o} onClick={() => toggle(o)}
            style={{ padding:'8px 18px', borderRadius:50,
              border:`1.5px solid ${sel.includes(o)?'var(--sage-d)':'var(--blush-l)'}`,
              background: sel.includes(o)?'var(--sage-d)':'#fff',
              color: sel.includes(o)?'#fff':'var(--mid)',
              fontFamily:"'DM Sans',sans-serif", fontSize:13,
              cursor:'pointer', outline:'none', transition:'all 0.2s' }}
            whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}>
            {o}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function Personalization() {
  const [goals,     setGoals]     = useState(['Reduce anxiety','Build confidence']);
  const [times,     setTimes]     = useState(['Morning']);
  const [notifs,    setNotifs]    = useState(['Soft reminders']);
  const [theme,     setTheme]     = useState(['Sage & Cream']);
  const [intensity, setIntensity] = useState(40);
  const [saved,     setSaved]     = useState(false);
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.1 });

  const toggle = setter => val =>
    setter(prev => prev.includes(val) ? prev.filter(v=>v!==val) : [...prev,val]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section id="personalize" style={{ background:'var(--warm)' }} className="section-padding">
      <div ref={ref} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionHeader tag="Just for You"
          title="InnerBloom, <em style='color:var(--sage-d);font-style:italic'>personalised</em>"
          sub="Tell us what matters to you. We'll shape your entire experience around it." />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:36, alignItems:'start' }}
          className="pers-grid">

          {/* Form */}
          <motion.div style={{ background:'#fff', borderRadius:28, padding:34, boxShadow:'var(--shadow-md)' }}
            initial={{ opacity:0, x:-28 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:0.6 }}>

            <TagGroup label="My Goals"         opts={GOALS}  sel={goals}  toggle={toggle(setGoals)} />
            <TagGroup label="Preferred Time"   opts={TIMES}  sel={times}  toggle={toggle(setTimes)} />
            <TagGroup label="Notifications"    opts={NOTIFS} sel={notifs} toggle={toggle(setNotifs)} />
            <TagGroup label="App Theme"        opts={THEMES} sel={theme}  toggle={toggle(setTheme)} />

            <div style={{ marginBottom:28 }}>
              <p style={{ fontSize:11, fontWeight:600, color:'var(--mid)', textTransform:'uppercase',
                letterSpacing:'0.1em', marginBottom:12 }}>Session Intensity</p>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:12, color:'var(--light)', whiteSpace:'nowrap' }}>Gentle</span>
                <input type="range" min={0} max={100} value={intensity}
                  onChange={e => setIntensity(+e.target.value)}
                  style={{ flex:1, accentColor:'var(--sage-d)', cursor:'pointer', height:5 }} />
                <span style={{ fontSize:12, color:'var(--light)', whiteSpace:'nowrap' }}>Deep dive</span>
              </div>
              <p style={{ fontSize:12, color:'var(--sage-d)', fontWeight:500, marginTop:8 }}>
                {intensity}% intensity
              </p>
            </div>

            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div key="saved"
                  style={{ padding:14, background:'#E8F5E4', color:'#3A7830',
                    borderRadius:14, fontSize:14, fontWeight:500, textAlign:'center' }}
                  initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}>
                  ✅ Preferences Saved!
                </motion.div>
              ) : (
                <motion.button key="save" onClick={handleSave}
                  style={{ width:'100%', padding:14, background:'var(--ink)', color:'#fff',
                    border:'none', borderRadius:14, fontFamily:"'DM Sans',sans-serif",
                    fontSize:15, fontWeight:500, cursor:'pointer' }}
                  whileHover={{ scale:1.02, background:'var(--sage-dd)' }}
                  whileTap={{ scale:0.97 }}>
                  Save My Preferences
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Preview */}
          <motion.div initial={{ opacity:0, x:28 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:0.6, delay:0.15 }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'var(--ink)', marginBottom:4 }}>
              Your personalised feed
            </p>
            <p style={{ fontSize:13, color:'var(--light)', marginBottom:20 }}>Based on your preferences</p>

            {PREVIEW.map((item,i) => (
              <motion.div key={i}
                style={{ background:'#fff', borderRadius:18, padding:'18px 20px',
                  boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'center',
                  gap:14, marginBottom:14 }}
                initial={{ opacity:0, y:16 }} animate={inView?{opacity:1,y:0}:{}}
                transition={{ delay:0.3+i*0.1 }}
                whileHover={{ x:4, boxShadow:'var(--shadow-md)' }}>
                <span style={{ fontSize:26, flexShrink:0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight:500, fontSize:14, color:'var(--ink)', marginBottom:3 }}>{item.title}</p>
                  <p style={{ fontSize:12, color:'var(--mid)' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}

            <div style={{ background:'var(--lav-l)', borderRadius:14, padding:'14px 18px',
              display:'flex', gap:10, alignItems:'flex-start', marginTop:4,
              fontSize:13, color:'var(--mid)', lineHeight:1.5 }}>
              <span>🎨</span>
              <p>Your selected theme will apply across the whole app after saving your preferences.</p>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.pers-grid{grid-template-columns:1fr!important;}}
        input[type=range]{-webkit-appearance:none;height:5px;border-radius:3px;background:var(--warm);}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--sage-d);cursor:pointer;box-shadow:0 2px 8px rgba(111,148,99,0.4);}
      `}</style>
    </section>
  );
}
