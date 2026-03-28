import React from 'react';
import { motion } from 'framer-motion';

const COLS = [
  { heading:'Services', links:['Individual Therapy','Couple Sessions','Family Counselling','Teens Support'] },
  { heading:'Tools',    links:['Mood Tracker','Journal','Bloom AI','Mindful Games'] },
  { heading:'Company',  links:['About Us','How it Works','Privacy Policy','Contact'] },
];

const goTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior:'smooth' });

export default function Footer() {
  return (
    <footer style={{ background:'var(--ink)', color:'rgba(255,255,255,0.65)',
      padding:'60px 48px 36px', fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ maxWidth:1200, margin:'0 auto',
        display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr', gap:48 }}
        className="footer-grid">

        {/* Brand */}
        <div>
          <motion.div
            style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer',
              fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600,
              color:'var(--blush-l)', marginBottom:14 }}
            onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
            whileHover={{ scale:1.02 }}>
            <div style={{ width:36, height:36,
              background:'linear-gradient(135deg,var(--sage) 0%,var(--blush) 100%)',
              borderRadius:'50% 50% 50% 12%',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
              🌸
            </div>
            innerbloom
          </motion.div>

          <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7,
            maxWidth:230, marginBottom:22 }}>
            A calm corner of the internet — for your mind, your moods, and your growth.
          </p>

          {/* Social icons */}
          <div style={{ display:'flex', gap:10 }}>
            {['🐦','📸','🎵','💼'].map((icon,i) => (
              <motion.button key={i}
                style={{ width:36, height:36, borderRadius:10,
                  background:'rgba(255,255,255,0.08)',
                  border:'1px solid rgba(255,255,255,0.1)',
                  fontSize:16, cursor:'pointer', display:'flex',
                  alignItems:'center', justifyContent:'center', outline:'none' }}
                whileHover={{ scale:1.15, background:'rgba(255,255,255,0.16)' }}
                whileTap={{ scale:0.95 }}>
                {icon}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {COLS.map(col => (
          <div key={col.heading}>
            <h4 style={{ fontSize:11, fontWeight:600, letterSpacing:'0.12em',
              textTransform:'uppercase', color:'rgba(255,255,255,0.35)',
              marginBottom:16 }}>{col.heading}</h4>
            {col.links.map(link => (
              <motion.button key={link}
                onClick={() => goTo('#counselling')}
                style={{ display:'block', background:'none', border:'none',
                  cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14,
                  color:'rgba(255,255,255,0.6)', textAlign:'left',
                  padding:'5px 0', width:'100%', outline:'none' }}
                whileHover={{ x:3, color:'var(--blush-l)' }}>
                {link}
              </motion.button>
            ))}
          </div>
        ))}

        {/* Bottom bar */}
        <div style={{ gridColumn:'1 / -1',
          borderTop:'1px solid rgba(255,255,255,0.08)',
          paddingTop:28, display:'flex',
          justifyContent:'space-between', flexWrap:'wrap', gap:8,
          fontSize:12, color:'rgba(255,255,255,0.28)' }}>
          <span>© 2025 InnerBloom. All rights reserved.</span>
          <span>Made with 🌸 for better minds everywhere</span>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .footer-grid{grid-template-columns:1fr 1fr!important;gap:32px!important;}
          .footer-grid > div:first-child{grid-column:1/-1;}
        }
        @media(max-width:480px){.footer-grid{grid-template-columns:1fr!important;}}
        footer{padding:48px 20px 28px!important;}
        @media(min-width:769px){footer{padding:60px 48px 36px!important;}}
      `}</style>
    </footer>
  );
}
