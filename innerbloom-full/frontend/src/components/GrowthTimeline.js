import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from './SectionHeader';

const MILESTONES = [
  {
    date: 'March 2025 · Week 1',
    title: 'First check-in 🌱',
    note: 'Started tracking your mood consistently for the first time. This took courage.',
    badge: '🌟 Milestone unlocked', badgeCol: '#E8F5E4', badgeTxt: '#3A7830',
  },
  {
    date: 'March 2025 · Week 2',
    title: '7-day streak 🔥',
    note: 'You logged your mood every single day for a week. Consistency is the foundation of growth.',
    badge: '🏅 7-day streak badge', badgeCol: '#FDF0D0', badgeTxt: '#8A6010',
  },
  {
    date: 'March 2025 · Week 3',
    title: 'First therapy session ✨',
    note: 'Booked and attended your first counselling session. One of the bravest things you\'ve done.',
    badge: '💜 Courage award', badgeCol: 'var(--lav-l)', badgeTxt: '#7260A0',
  },
  {
    date: 'This week',
    title: 'You\'re still here 🌸',
    note: 'Showing up for yourself every day, even on the hard ones. That\'s everything.',
    badge: '🌸 Present moment', badgeCol: '#E8F5E4', badgeTxt: '#3A7830',
  },
];

const PROGRESS_BARS = [
  { label: 'Emotional awareness', val: 72, color: 'var(--sage-d)' },
  { label: 'Stress management',   val: 55, color: 'var(--blush)' },
  { label: 'Self-compassion',     val: 81, color: 'var(--lavender)' },
  { label: 'Consistency',         val: 68, color: 'var(--gold)' },
];

const STATS = [
  { val: '19', label: 'Check-ins this month' },
  { val: '7',  label: 'Day current streak' },
  { val: '3',  label: 'Sessions completed' },
];

function AnimatedBar({ item, inView, delay }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display:'flex', justifyContent:'space-between',
        fontSize:13, color:'var(--mid)', marginBottom:7, fontWeight:500 }}>
        <span>{item.label}</span>
        <span style={{ color:'var(--ink)', fontWeight:600 }}>{item.val}%</span>
      </div>
      <div style={{ height:7, background:'var(--warm)', borderRadius:4, overflow:'hidden' }}>
        <motion.div
          style={{ height:'100%', borderRadius:4, background:item.color }}
          initial={{ width:0 }}
          animate={inView ? { width:`${item.val}%` } : {}}
          transition={{ duration:1.1, delay, ease:[0.25,0.46,0.45,0.94] }}
        />
      </div>
    </div>
  );
}

export default function GrowthTimeline({ userName = 'friend' }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.1 });

  return (
    <section id="timeline" style={{ background:'var(--cream)' }} className="section-padding">
      <div ref={ref} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionHeader
          tag="Your Journey"
          title="Emotional <em style='color:var(--sage-d);font-style:italic'>growth timeline</em>"
          sub="Growth isn't linear — and that's okay. Here's a record of your brave moments, big and small."
        />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'start' }}
          className="timeline-grid">

          {/* ── Timeline ── */}
          <div style={{ position:'relative', paddingLeft:36 }}>
            {/* vertical line */}
            <motion.div
              style={{ position:'absolute', left:14, top:10,
                width:2, background:'linear-gradient(to bottom,var(--sage),var(--blush),var(--lavender))',
                borderRadius:2, originY:0 }}
              initial={{ height:0 }}
              animate={inView ? { height:'calc(100% - 20px)' } : {}}
              transition={{ duration:1.2, ease:'easeInOut' }}
            />

            {MILESTONES.map((m, i) => (
              <motion.div key={i}
                style={{ position:'relative', marginBottom: i < MILESTONES.length-1 ? 28 : 0 }}
                initial={{ opacity:0, x:-24 }}
                animate={inView ? { opacity:1, x:0 } : {}}
                transition={{ duration:0.55, delay:i*0.13 }}>

                {/* dot */}
                <motion.div
                  style={{ position:'absolute', left:-30, top:22,
                    width:14, height:14, borderRadius:'50%',
                    background:'var(--sage-d)',
                    border:'3px solid var(--cream)',
                    boxShadow:'0 0 0 2px var(--sage-d)' }}
                  initial={{ scale:0 }}
                  animate={inView ? { scale:1 } : {}}
                  transition={{ delay:i*0.13+0.2, type:'spring', stiffness:400 }}
                />

                {/* card */}
                <motion.div
                  style={{ background:'#fff', borderRadius:24, padding:'22px 24px',
                    boxShadow:'var(--shadow-sm)', cursor:'pointer' }}
                  onClick={() => setExpandedIdx(expandedIdx===i ? null : i)}
                  whileHover={{ boxShadow:'var(--shadow-md)' }}>
                  <p style={{ fontSize:11, color:'var(--light)', letterSpacing:'0.08em',
                    textTransform:'uppercase', marginBottom:6 }}>{m.date}</p>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:18,
                    color:'var(--ink)', marginBottom:6 }}>{m.title}</p>

                  <AnimatePresence>
                    {expandedIdx === i && (
                      <motion.div
                        initial={{ height:0, opacity:0 }}
                        animate={{ height:'auto', opacity:1 }}
                        exit={{ height:0, opacity:0 }}
                        transition={{ duration:0.28 }}
                        style={{ overflow:'hidden' }}>
                        <p style={{ fontSize:13, color:'var(--mid)', lineHeight:1.6, marginBottom:12 }}>
                          {m.note}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <span style={{ display:'inline-flex', alignItems:'center', gap:4,
                    padding:'5px 13px', borderRadius:50, fontSize:12, fontWeight:500,
                    background:m.badgeCol, color:m.badgeTxt, marginTop: expandedIdx===i ? 0 : 8 }}>
                    {m.badge}
                  </span>
                  <p style={{ fontSize:11, color:'var(--light)', marginTop:8 }}>
                    {expandedIdx===i ? '▲ Less' : '▼ See details'}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* ── Right panel ── */}
          <motion.div
            style={{ display:'flex', flexDirection:'column', gap:18 }}
            initial={{ opacity:0, x:24 }}
            animate={inView ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.6, delay:0.2 }}>

            {/* Progress card */}
            <div style={{ background:'#fff', borderRadius:28, padding:28, boxShadow:'var(--shadow-md)' }}>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20,
                color:'var(--ink)', marginBottom:22 }}>Growth at a glance</p>
              {PROGRESS_BARS.map((bar, i) => (
                <AnimatedBar key={bar.label} item={bar} inView={inView} delay={0.4 + i*0.15} />
              ))}
            </div>

            {/* Bloom note */}
            <motion.div
              style={{ background:'linear-gradient(135deg,var(--lav-l),var(--blush-l))',
                borderRadius:24, padding:24, cursor:'default' }}
              whileHover={{ scale:1.01 }}>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:17,
                color:'var(--ink)', marginBottom:10 }}>💌 A note from Bloom</p>
              <p style={{ fontSize:14, color:'var(--mid)', lineHeight:1.7, fontStyle:'italic' }}>
                {`${userName}, you've shown up 19 times this month. That's 19 moments you chose yourself. I'm so proud of you. Keep going. 🌸`}
              </p>
            </motion.div>

            {/* Stats row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {STATS.map((s,i) => (
                <motion.div key={i}
                  style={{ background:'#fff', borderRadius:16, padding:'18px 12px',
                    textAlign:'center', boxShadow:'var(--shadow-sm)' }}
                  initial={{ opacity:0, y:14 }}
                  animate={inView ? { opacity:1, y:0 } : {}}
                  transition={{ delay:0.6+i*0.1 }}
                  whileHover={{ y:-3 }}>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'var(--ink)' }}>
                    {s.val}
                  </p>
                  <p style={{ fontSize:11, color:'var(--light)', marginTop:4, lineHeight:1.4 }}>
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.timeline-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
