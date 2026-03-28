import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function SectionHeader({ tag, title, sub, light }) {
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.2 });
  const c = light ? { tag:'var(--sage)', line:'var(--sage)', title:'#fff', sub:'rgba(255,255,255,0.62)' }
                  : { tag:'var(--sage-d)', line:'var(--sage-d)', title:'var(--ink)', sub:'var(--mid)' };
  return (
    <motion.div ref={ref} style={{ marginBottom:44 }}
      initial={{ opacity:0, y:28 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:0.6, ease:[0.25,0.46,0.45,0.94] }}>
      {tag && (
        <p style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:11,
          letterSpacing:'0.13em', textTransform:'uppercase', color:c.tag,
          fontWeight:500, marginBottom:12 }}>
          <span style={{ display:'block', width:22, height:1.5, background:c.line, borderRadius:1 }} />
          {tag}
        </p>
      )}
      <h2 style={{ fontFamily:"'Playfair Display',serif",
        fontSize:'clamp(26px,3.5vw,40px)', color:c.title, lineHeight:1.2, marginBottom:12 }}
        dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p style={{ fontSize:15, color:c.sub, maxWidth:540, lineHeight:1.7 }}>{sub}</p>}
    </motion.div>
  );
}
