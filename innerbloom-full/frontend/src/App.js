import React, { useState, useEffect } from 'react';
import Navbar          from './components/Navbar';
import AuthPortal      from './components/AuthPortal';
import Hero            from './components/Hero';
import MusicSection    from './components/MusicSection';
import MoodTracker     from './components/MoodTracker';
import Affirmations    from './components/Affirmations';
import MindfulGames    from './components/MindfulGames';
import AICompanion     from './components/AICompanion';
import Counselling     from './components/Counselling';
import Personalization from './components/Personalization';
import GrowthTimeline  from './components/GrowthTimeline';
import AppDownload     from './components/AppDownload';
import Footer          from './components/Footer';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('innerbloom-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('innerbloom-user');
      }
    }
  }, []);

  const handleAuth = (profile) => {
    setUser(profile);
    localStorage.setItem('innerbloom-user', JSON.stringify(profile));
  };

  return (
    <>
      {!user && <AuthPortal onAuth={handleAuth} />}
      <Navbar />
      <main style={!user ? { filter:'blur(0.8px) brightness(0.92)', pointerEvents:'none', userSelect:'none' } : undefined}>
        <Hero userName={user?.name} />
        <MusicSection />
        <MoodTracker />
        <Affirmations />
        <MindfulGames />
        <AICompanion />
        <Counselling />
        <Personalization />
        <GrowthTimeline userName={user?.name} />
        <AppDownload />
      </main>
      <Footer />
    </>
  );
}
