import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from './SectionHeader';

// Free ambient audio from Pixabay CDN (public domain)
const TRACKS = [
  { id:1, mood:'Smooth · Calm',   title:'Ocean Calm',           meta:'Sea ambience · 3 min', emoji:'🌊', bg:'linear-gradient(135deg,#D4E8D0,#A8BEA0)', src:'https://www.soundjay.com/nature/sounds/ocean-wave-1.mp3', fallback:'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3' },
  { id:2, mood:'Soft · Warm',     title:'Morning Light',         meta:'Soft acoustic · 2 min', emoji:'🌿', bg:'linear-gradient(135deg,#FDEBD0,#E8B4A0)', src:'https://assets.mixkit.co/music/preview/mixkit-life-is-a-dream-837.mp3', fallback:'' },
  { id:3, mood:'Calm · Focus',    title:'Velvet Lo-fi',          meta:'Lo-fi mellow · 3 min',   emoji:'🔮', bg:'linear-gradient(135deg,#D8D0F0,#C5B8D8)', src:'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3', fallback:'' },
  { id:4, mood:'Restful · Soft',  title:'Moonlit Drift',         meta:'Ambient slow · 3 min',  emoji:'🌙', bg:'linear-gradient(135deg,#CCD8E8,#8AAAC0)', src:'https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3', fallback:'' },
  { id:5, mood:'Cozy · Gentle',   title:'Rain & Piano',          meta:'Soft piano · 2 min',    emoji:'🍂', bg:'linear-gradient(135deg,#E0D4CC,#C0A890)', src:'https://assets.mixkit.co/music/preview/mixkit-sad-violin-371.mp3', fallback:'' },
  { id:6, mood:'Warm · Easy',     title:'Glow & Drift',          meta:'Ambient calm · 2 min',  emoji:'⚡', bg:'linear-gradient(135deg,#FCF0C8,#E8C860)', src:'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3', fallback:'' },
];

function MusicCard({ track, index }) {
  const [playing,   setPlaying]   = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [vol,       setVol]       = useState(0.7);
  const [errored,   setErrored]   = useState(false);
  const audioRef = useRef(null);
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.1 });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => setProgress(audio.duration ? (audio.currentTime/audio.duration)*100 : 0);
    const ended  = () => { setPlaying(false); setProgress(0); };
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('ended', ended);
    return () => { audio.removeEventListener('timeupdate', update); audio.removeEventListener('ended', ended); };
  }, []);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = vol; }, [vol]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (playing) { audio.pause(); setPlaying(false); }
      else { await audio.play(); setPlaying(true); }
    } catch(e) { setErrored(true); }
  };

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  return (
    <motion.div ref={ref}
      style={{ background:'#fff', borderRadius:24, overflow:'hidden',
        boxShadow:'var(--shadow-sm)', cursor:'pointer' }}
      initial={{ opacity:0, y:32 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:0.5, delay:index*0.08 }}
      whileHover={{ y:-6, boxShadow:'0 16px 48px rgba(46,42,38,0.12)' }}>

      {/* Thumb */}
      <div style={{ height:130, background:track.bg,
        display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative', overflow:'hidden' }}>
        <motion.span style={{ fontSize:46 }}
          animate={playing ? { scale:[1,1.2,1], rotate:[0,10,-10,0] } : {}}
          transition={{ duration:1.2, repeat:playing ? Infinity : 0 }}>
          {track.emoji}
        </motion.span>
        {playing && (
          <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)',
            display:'flex', gap:3, alignItems:'flex-end', height:20 }}>
            {[0,0.1,0.2,0.3,0.4].map(d => (
              <motion.span key={d} style={{ display:'block', width:3, height:16,
                background:'rgba(255,255,255,0.85)', borderRadius:2, transformOrigin:'bottom' }}
                animate={{ scaleY:[0.4,1,0.4] }}
                transition={{ duration:0.7, delay:d, repeat:Infinity }} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:'16px 18px 20px' }}>
        <p style={{ fontSize:11, color:'var(--sage-d)', fontWeight:500,
          letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:5 }}>
          {track.mood}
        </p>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:17,
          color:'var(--ink)', marginBottom:4 }}>{track.title}</p>
        <p style={{ fontSize:12, color:'var(--light)', marginBottom:12 }}>{track.meta}</p>

        <div style={{ padding:'14px 0 0' }}>
          <p style={{ margin:0, fontSize:13, color:'var(--light)', marginBottom:10 }}>
            Press play below to listen to this calming track.
          </p>
          <audio ref={audioRef} src={track.src} preload="metadata" controls style={{ width:'100%', borderRadius:16, background:'#f6f5f1' }} onError={() => setErrored(true)}>
            Your browser does not support the audio element.
          </audio>
          {errored && <p style={{ marginTop:10, fontSize:12, color:'#D04747' }}>Unable to load this track right now.</p>}
        </div>
      </div>
    </motion.div>
  );
}

export default function MusicSection() {
  return (
    <section id="music" style={{ background:'var(--warm)' }} className="section-padding">
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionHeader tag="Smooth & Calm"
          title="Music for <em style='color:var(--sage-d);font-style:italic'>a gentler mind</em>"
          sub="Start with soothing soundscapes that help you feel grounded, calm, and ready for the day." />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}
          className="music-grid">
          {TRACKS.map((t,i) => <MusicCard key={t.id} track={t} index={i} />)}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.music-grid{grid-template-columns:repeat(2,1fr)!important;}}
        @media(max-width:560px){.music-grid{grid-template-columns:1fr!important;}}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;background:var(--warm);}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--sage-d);cursor:pointer;}
      `}</style>
    </section>
  );
}
