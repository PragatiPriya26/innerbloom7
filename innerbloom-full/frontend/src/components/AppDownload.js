import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PHONE_ITEMS = [
  { dot: 'var(--sage-d)',   text: 'Yoga stretching · 8 min' },
  { dot: 'var(--blush)',    text: 'Self care & relaxation' },
  { dot: 'var(--lavender)', text: 'Drink 10 glasses of water' },
  { dot: 'var(--gold)',     text: 'Evening journal prompt' },
];

const STATS = [
  { val: '3000+', label: 'Active users' },
  { val: '50K',   label: 'Downloads' },
  { val: '4.9★',  label: 'App Store' },
];

export default function AppDownload() {
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.15 });

  return (
    <section id="app" style={{ padding:'0 48px 80px' }}>
      <div ref={ref}
        style={{ background:'linear-gradient(135deg,#2E2A26 0%,#3D3530 100%)',
          borderRadius:36, padding:'64px', display:'grid',
          gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center',
          position:'relative', overflow:'hidden', maxWidth:1200, margin:'0 auto' }}
        className="app-card">

        {/* Ambient blob */}
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300,
          background:'radial-gradient(circle,rgba(168,190,160,0.12),transparent 70%)',
          borderRadius:'50%', pointerEvents:'none' }} />

        {/* Left */}
        <motion.div
          initial={{ opacity:0, x:-30 }}
          animate={inView ? { opacity:1, x:0 } : {}}
          transition={{ duration:0.7 }}>
          <p style={{ fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase',
            color:'var(--sage)', marginBottom:14, fontWeight:500 }}>InnerBloom App</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif",
            fontSize:'clamp(28px,3.5vw,44px)', color:'#fff',
            lineHeight:1.2, marginBottom:18 }}>
            Take control of your<br />
            <em style={{ color:'var(--blush)', fontStyle:'italic' }}>mental health</em>
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.7,
            marginBottom:30, maxWidth:420 }}>
            Mental wellness means the ability to cope with life's challenges,
            manage stress, and bounce back from setbacks — wherever you are.
          </p>

          {/* Stats */}
          <div style={{ display:'flex', gap:36, marginBottom:32 }}>
            {STATS.map(s => (
              <div key={s.label}>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:'#fff' }}>{s.val}</p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginTop:2 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Store buttons */}
          <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            {[
              { icon:'🍎', small:'Download on the', big:'App Store' },
              { icon:'▶',  small:'Get it on',       big:'Google Play' },
            ].map(btn => (
              <motion.a key={btn.big} href="#"
                style={{ display:'flex', alignItems:'center', gap:12,
                  background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
                  borderRadius:14, padding:'13px 22px', color:'#fff',
                  textDecoration:'none', cursor:'pointer' }}
                whileHover={{ scale:1.04, background:'rgba(255,255,255,0.18)' }}
                whileTap={{ scale:0.97 }}>
                <span style={{ fontSize:26 }}>{btn.icon}</span>
                <div>
                  <div style={{ fontSize:10, opacity:0.6, marginBottom:2 }}>{btn.small}</div>
                  <div style={{ fontSize:15, fontWeight:600 }}>{btn.big}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Right — phone mockup */}
        <motion.div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}
          initial={{ opacity:0, y:30 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, delay:0.15 }}>
          <motion.div
            style={{ width:210, minHeight:390,
              background:'linear-gradient(145deg,#FAF6F0,#F0E8DC)',
              borderRadius:38,
              border:'7px solid rgba(255,255,255,0.15)',
              boxShadow:'0 24px 64px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.2)',
              display:'flex', flexDirection:'column',
              alignItems:'center', padding:'28px 16px 20px',
              gap:10, position:'relative', overflow:'hidden' }}
            animate={{ y:[0,-10,0] }}
            transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}>

            {/* pill notch */}
            <div style={{ width:72, height:5,
              background:'rgba(255,255,255,0.3)', borderRadius:'0 0 6px 6px',
              position:'absolute', top:0, left:'50%', transform:'translateX(-50%)' }} />

            {PHONE_ITEMS.map((item, i) => (
              <motion.div key={i}
                style={{ width:'100%', background:'#fff', borderRadius:12,
                  padding:'11px 14px', display:'flex', alignItems:'center', gap:10,
                  fontSize:12, color:'var(--ink)', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}
                initial={{ opacity:0, x:20 }}
                animate={inView ? { opacity:1, x:0 } : {}}
                transition={{ delay:0.6+i*0.12 }}>
                <div style={{ width:9, height:9, borderRadius:'50%',
                  background:item.dot, flexShrink:0 }} />
                <span>{item.text}</span>
              </motion.div>
            ))}

            <motion.div
              style={{ width:'100%', background:'var(--sage-d)', borderRadius:12,
                padding:'11px 14px', color:'#fff', fontSize:12,
                fontWeight:500, textAlign:'center', marginTop:4 }}
              initial={{ opacity:0 }}
              animate={inView ? { opacity:1 } : {}}
              transition={{ delay:1.1 }}>
              Today's check-in complete 🌸
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media(max-width:900px){
          .app-card{grid-template-columns:1fr!important;padding:40px 28px!important;}
          .app-card > div:last-child{display:none!important;}
        }
        @media(max-width:560px){ section#app{padding:0 16px 48px!important;} }
      `}</style>
    </section>
  );
}
