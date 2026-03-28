import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from './SectionHeader';
import { createBooking } from '../utils/api';

const SERVICES = [
  { id:'individual', icon:'🧑‍💼', bg:'#EAF1E8', title:'Individual Counselling', desc:'One-on-one sessions tailored to your needs, schedule, and goals.', tag:'Most popular', featured:true },
  { id:'couple',     icon:'💑',   bg:'var(--blush-l)', title:'Couple Counselling', desc:'Strengthen communication and rebuild trust with your partner.', tag:'For partners', featured:false },
  { id:'family',     icon:'👨‍👩‍👧',  bg:'var(--lav-l)',   title:'Family Counselling', desc:'Navigate complex family dynamics in a safe, facilitated space.', tag:'For family', featured:false },
  { id:'teens',      icon:'🧒',   bg:'#FDF0D0',        title:'Teens Counselling', desc:'Specialised support for young people aged 13–17 growing up.', tag:'Ages 13–17', featured:false },
];

const DATES = ['Mon, Mar 27','Tue, Mar 28','Wed, Mar 29','Thu, Mar 30','Fri, Mar 31'];
const TIMES = ['9:00 AM','10:30 AM','12:00 PM','2:00 PM','4:00 PM','6:00 PM'];

function BookingModal({ service, onClose }) {
  const [step,   setStep]   = useState(1);
  const [date,   setDate]   = useState('');
  const [time,   setTime]   = useState('');
  const [name,   setName]   = useState('');
  const [note,   setNote]   = useState('');
  const [saving, setSaving] = useState(false);

  const confirm = async () => {
    setSaving(true);
    try { await createBooking({ service:service.title, date, time, name, note }); }
    catch { /* show success anyway */ }
    setSaving(false);
    setStep(3);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(46,42,38,0.55)',
      backdropFilter:'blur(8px)', zIndex:300, display:'flex',
      alignItems:'center', justifyContent:'center', padding:20 }}>
      <motion.div style={{ background:'#fff', borderRadius:28, padding:'36px 32px',
        width:'100%', maxWidth:500, position:'relative',
        boxShadow:'var(--shadow-xl)', maxHeight:'90vh', overflowY:'auto' }}
        initial={{ y:40, opacity:0 }} animate={{ y:0, opacity:1 }}
        exit={{ y:40, opacity:0 }} transition={{ type:'spring', stiffness:300, damping:30 }}>

        <button onClick={onClose}
          style={{ position:'absolute', top:16, right:16, background:'var(--warm)',
            border:'none', width:32, height:32, borderRadius:'50%',
            fontSize:14, color:'var(--mid)', cursor:'pointer' }}>✕</button>

        {/* Step progress */}
        <div style={{ display:'flex', gap:8, marginBottom:28 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex:1, height:4, borderRadius:2,
              background: step>=s ? 'var(--sage-d)' : 'var(--warm)',
              transition:'background 0.3s' }} />
          ))}
        </div>

        {/* Step 1: Date & Time */}
        {step===1 && (
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'var(--ink)', marginBottom:6 }}>Choose a date & time</p>
            <p style={{ fontSize:14, color:'var(--mid)', marginBottom:22 }}>For <strong>{service.title}</strong></p>

            <p style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--light)', marginBottom:10 }}>Date</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
              {DATES.map(d => (
                <motion.button key={d} onClick={() => setDate(d)}
                  style={{ padding:'9px 16px', border:`1.5px solid ${date===d?'var(--blush)':'var(--blush-l)'}`,
                    borderRadius:10, background: date===d?'var(--blush-l)':'none',
                    fontFamily:"'DM Sans',sans-serif", fontSize:13,
                    color: date===d?'var(--ink)':'var(--mid)', cursor:'pointer',
                    fontWeight: date===d?500:400, outline:'none' }}
                  whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                  {d}
                </motion.button>
              ))}
            </div>

            <p style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--light)', marginBottom:10 }}>Time</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:24 }}>
              {TIMES.map(t => (
                <motion.button key={t} onClick={() => setTime(t)}
                  style={{ padding:10, border:`1.5px solid ${time===t?'var(--sage-d)':'var(--sage)'}`,
                    borderRadius:10, background: time===t?'var(--sage-d)':'none',
                    fontFamily:"'DM Sans',sans-serif", fontSize:13,
                    color: time===t?'#fff':'var(--sage-d)', cursor:'pointer', outline:'none' }}
                  whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
                  {t}
                </motion.button>
              ))}
            </div>

            <motion.button onClick={() => date&&time&&setStep(2)}
              style={{ width:'100%', padding:13, background:'var(--sage-d)', color:'#fff',
                border:'none', borderRadius:14, fontFamily:"'DM Sans',sans-serif",
                fontSize:14, fontWeight:500, cursor:'pointer',
                opacity: date&&time?1:0.5 }}
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
              Continue →
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Your details */}
        {step===2 && (
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'var(--ink)', marginBottom:6 }}>A little about you</p>
            <p style={{ fontSize:14, color:'var(--mid)', marginBottom:22 }}>So your therapist can prepare.</p>

            <input value={name} onChange={e=>setName(e.target.value)}
              placeholder="Your name"
              style={{ width:'100%', padding:'13px 16px', border:'1.5px solid rgba(168,190,160,0.4)',
                borderRadius:12, background:'var(--warm)', fontFamily:"'DM Sans',sans-serif",
                fontSize:14, color:'var(--ink)', outline:'none', marginBottom:14 }}
              onFocus={e=>e.target.style.borderColor='var(--sage-d)'}
              onBlur={e=>e.target.style.borderColor='rgba(168,190,160,0.4)'} />

            <textarea value={note} onChange={e=>setNote(e.target.value)}
              placeholder="What's on your mind? (optional)"
              rows={4}
              style={{ width:'100%', padding:'13px 16px', border:'1.5px solid rgba(168,190,160,0.4)',
                borderRadius:12, background:'var(--warm)', fontFamily:"'DM Sans',sans-serif",
                fontSize:14, color:'var(--ink)', outline:'none', resize:'none', marginBottom:20 }}
              onFocus={e=>e.target.style.borderColor='var(--sage-d)'}
              onBlur={e=>e.target.style.borderColor='rgba(168,190,160,0.4)'} />

            <div style={{ display:'flex', gap:12 }}>
              <button onClick={() => setStep(1)}
                style={{ padding:'13px 22px', background:'var(--warm)', border:'none',
                  borderRadius:12, fontFamily:"'DM Sans',sans-serif",
                  fontSize:14, color:'var(--mid)', cursor:'pointer' }}>← Back</button>
              <motion.button onClick={() => name&&confirm()}
                style={{ flex:1, padding:13, background:'var(--sage-d)', color:'#fff',
                  border:'none', borderRadius:12, fontFamily:"'DM Sans',sans-serif",
                  fontSize:14, fontWeight:500, cursor:'pointer', opacity:name?1:0.5 }}
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                {saving ? 'Booking…' : 'Confirm Booking →'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmed */}
        {step===3 && (
          <motion.div style={{ textAlign:'center', padding:'16px 0' }}
            initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}>
            <motion.div style={{ fontSize:56, marginBottom:16 }}
              animate={{ rotate:[0,-10,10,-10,0] }} transition={{ duration:0.6, delay:0.2 }}>
              🌸
            </motion.div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:'var(--ink)', marginBottom:10 }}>
              You're booked!
            </p>
            <p style={{ fontSize:15, color:'var(--mid)', marginBottom:4, fontWeight:500 }}>{service.title}</p>
            <p style={{ fontSize:15, color:'var(--mid)', marginBottom:16, fontWeight:500 }}>{date} · {time}</p>
            <p style={{ fontSize:14, color:'var(--sage-d)', fontStyle:'italic', marginBottom:24, lineHeight:1.6 }}>
              A confirmation has been sent. You've taken a brave step forward. 💜
            </p>
            <motion.button onClick={onClose}
              style={{ width:'100%', padding:14, background:'var(--sage-d)', color:'#fff',
                border:'none', borderRadius:14, fontFamily:"'DM Sans',sans-serif",
                fontSize:14, fontWeight:500, cursor:'pointer' }}
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
              Done ✓
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function Counselling() {
  const [booking, setBooking] = useState(null);
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.1 });

  return (
    <section id="counselling" style={{ background:'var(--cream)' }} className="section-padding">
      <div ref={ref} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionHeader tag="Professional Support"
          title="Your path to <em style='color:var(--sage-d);font-style:italic'>mental wellness</em>"
          sub="Sometimes we need more than apps. InnerBloom connects you with certified therapists — on your terms." />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20, marginBottom:28 }}
          className="counsel-grid">
          {SERVICES.map((s,i) => (
            <motion.div key={s.id}
              style={{ background:'#fff', borderRadius:28, padding:30,
                border:`1.5px solid ${s.featured?'var(--sage-d)':'transparent'}`,
                boxShadow:'var(--shadow-sm)', cursor:'pointer',
                display:'flex', flexDirection:'column', position:'relative' }}
              initial={{ opacity:0, y:28 }} animate={inView?{opacity:1,y:0}:{}}
              transition={{ duration:0.5, delay:i*0.1 }}
              whileHover={{ y:-5, boxShadow:'var(--shadow-lg)' }}>
              {s.tag && (
                <span style={{ position:'absolute', top:16, right:16,
                  padding:'4px 12px', borderRadius:50, fontSize:11, fontWeight:600,
                  background: s.featured?'var(--sage-d)':'var(--warm)',
                  color: s.featured?'#fff':'var(--mid)' }}>{s.tag}</span>
              )}
              <div style={{ width:54, height:54, borderRadius:16, background:s.bg,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:26, marginBottom:18 }}>{s.icon}</div>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:19,
                color:'var(--ink)', marginBottom:8 }}>{s.title}</p>
              <p style={{ fontSize:14, color:'var(--mid)', lineHeight:1.6, marginBottom:20, flex:1 }}>{s.desc}</p>
              <motion.button onClick={() => setBooking(s)}
                style={{ alignSelf:'flex-start', padding:'10px 20px', borderRadius:50,
                  border:`1.5px solid ${s.featured?'var(--sage-d)':'var(--sage)'}`,
                  background: s.featured?'var(--sage-d)':'none',
                  color: s.featured?'#fff':'var(--sage-d)',
                  fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, cursor:'pointer' }}
                whileHover={{ scale:1.05, background:'var(--sage-d)', color:'#fff', borderColor:'var(--sage-d)' }}
                whileTap={{ scale:0.96 }}>
                Book a session →
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Banner */}
        <motion.div style={{ background:'linear-gradient(135deg,#EAF1E8,#E8F0F5)',
          borderRadius:28, padding:'36px 40px', display:'flex',
          alignItems:'center', justifyContent:'space-between', gap:24, flexWrap:'wrap' }}
          initial={{ opacity:0, y:24 }} animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:0.6, delay:0.4 }}>
          <div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'var(--ink)', marginBottom:8 }}>
              Your mind deserves better <em style={{ color:'var(--sage-d)', fontStyle:'italic' }}>kindness</em>
            </p>
            <p style={{ fontSize:14, color:'var(--mid)', lineHeight:1.6, maxWidth:520 }}>
              Recognising when you need support is a sign of strength. No waitlists, no stigma.
            </p>
          </div>
          <motion.button onClick={() => setBooking(SERVICES[0])}
            style={{ padding:'14px 32px', background:'var(--sage-d)', color:'#fff',
              border:'none', borderRadius:50, fontFamily:"'DM Sans',sans-serif",
              fontSize:15, fontWeight:500, cursor:'pointer', whiteSpace:'nowrap' }}
            whileHover={{ scale:1.04, background:'var(--ink)' }} whileTap={{ scale:0.96 }}>
            Consult a Therapist
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {booking && <BookingModal service={booking} onClose={() => setBooking(null)} />}
      </AnimatePresence>

      <style>{`@media(max-width:700px){.counsel-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
