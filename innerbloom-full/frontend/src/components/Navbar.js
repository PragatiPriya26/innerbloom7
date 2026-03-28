import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Music',        href: '#music' },
  { label: 'Mood Tracker', href: '#mood' },
  { label: 'AI Bloom',     href: '#ai' },
  { label: 'Journal',      href: '#journal' },
  { label: 'Counselling',  href: '#counselling' },
];

const s = {
  nav: {
    position:'sticky', top:0, zIndex:200,
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'14px 48px',
    transition:'all 0.3s ease',
    fontFamily:"'DM Sans', sans-serif",
  },
  scrolled: {
    background:'rgba(250,246,240,0.96)',
    backdropFilter:'blur(16px)',
    boxShadow:'0 2px 20px rgba(46,42,38,0.08)',
    borderBottom:'1px solid rgba(168,190,160,0.2)',
  },
  normal: {
    background:'rgba(250,246,240,0.75)',
    backdropFilter:'blur(12px)',
    borderBottom:'1px solid rgba(168,190,160,0.1)',
  },
  logo: {
    display:'flex', alignItems:'center', gap:10,
    background:'none', border:'none', cursor:'pointer',
    fontFamily:"'Playfair Display', serif",
    fontSize:22, fontWeight:600, color:'var(--sage-d)',
  },
  logoIcon: {
    width:38, height:38,
    background:'linear-gradient(135deg,var(--sage) 0%,var(--blush) 100%)',
    borderRadius:'50% 50% 50% 12%',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:20,
  },
  links: { display:'flex', gap:4, listStyle:'none' },
  linkBtn: {
    position:'relative', background:'none', border:'none', cursor:'pointer',
    fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:400,
    color:'var(--mid)', padding:'8px 14px', borderRadius:8,
    transition:'color 0.2s, background 0.2s',
  },
  cta: {
    background:'var(--sage-d)', color:'#fff',
    border:'none', padding:'11px 24px', borderRadius:50,
    fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:500,
    cursor:'pointer',
  },
  ham: {
    display:'none', flexDirection:'column', gap:5,
    background:'none', border:'none', cursor:'pointer', padding:4,
  },
  hamBar: {
    display:'block', width:24, height:2,
    background:'var(--ink)', borderRadius:2, transformOrigin:'center',
    transition:'all 0.3s',
  },
  mobileMenu: {
    position:'fixed', top:68, left:0, right:0, zIndex:190,
    background:'rgba(250,246,240,0.98)', backdropFilter:'blur(16px)',
    padding:'16px 20px 24px', display:'flex', flexDirection:'column', gap:4,
    borderBottom:'1px solid rgba(168,190,160,0.2)',
    boxShadow:'0 8px 32px rgba(46,42,38,0.1)',
  },
  mobileLink: {
    background:'none', border:'none', cursor:'pointer',
    fontFamily:"'DM Sans', sans-serif", fontSize:16,
    color:'var(--mid)', textAlign:'left', padding:'12px 8px',
    borderRadius:10, transition:'color 0.2s, background 0.2s',
  },
  mobileCta: {
    marginTop:12, background:'var(--sage-d)', color:'#fff',
    border:'none', padding:14, borderRadius:14,
    fontFamily:"'DM Sans', sans-serif", fontSize:15, fontWeight:500, cursor:'pointer',
  },
};

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (href) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  const isMobile = window.innerWidth <= 900;

  return (
    <>
      <motion.nav
        style={{ ...s.nav, ...(scrolled ? s.scrolled : s.normal) }}
        initial={{ y:-80 }} animate={{ y:0 }}
        transition={{ duration:0.5, ease:[0.25,0.46,0.45,0.94] }}
      >
        {/* Logo */}
        <motion.button style={s.logo}
          onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
          whileHover={{ scale:1.02 }}>
          <motion.div style={s.logoIcon}
            whileHover={{ rotate:15, scale:1.1 }}
            transition={{ type:'spring', stiffness:300 }}>🌸</motion.div>
          <span>innerbloom</span>
        </motion.button>

        {/* Desktop links */}
        <ul style={s.links} className="nav-desktop">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <motion.button style={s.linkBtn} onClick={() => go(link.href)}
                whileHover={{ color:'var(--sage-d)', background:'rgba(168,190,160,0.1)' }}>
                {link.label}
              </motion.button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <motion.button style={s.cta} className="nav-desktop"
          onClick={() => go('#counselling')}
          whileHover={{ scale:1.04, background:'var(--ink)' }}
          whileTap={{ scale:0.97 }}>
          Begin Journey ✨
        </motion.button>

        {/* Hamburger */}
        <button style={{ ...s.ham, display:'flex' }} className="nav-mobile"
          onClick={() => setMenuOpen(p => !p)} aria-label="menu">
          <span style={{ ...s.hamBar, transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <span style={{ ...s.hamBar, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...s.hamBar, transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div style={s.mobileMenu}
            initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-16 }} transition={{ duration:0.22 }}>
            {NAV_LINKS.map((link, i) => (
              <motion.button key={link.href} style={s.mobileLink}
                onClick={() => go(link.href)}
                initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ color:'var(--sage-d)', background:'rgba(168,190,160,0.1)' }}>
                {link.label}
              </motion.button>
            ))}
            <motion.button style={s.mobileCta}
              onClick={() => go('#counselling')}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.28 }}>
              Begin Journey ✨
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media(max-width:900px){.nav-desktop{display:none!important;}.nav-mobile{display:flex!important;}}
        @media(min-width:901px){.nav-mobile{display:none!important;}}
      `}</style>
    </>
  );
}
