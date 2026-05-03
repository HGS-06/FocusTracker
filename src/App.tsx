/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, BarChart3, Settings, Sprout, User } from 'lucide-react';
import TimerView from './components/TimerView';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';
import SessionDetailView from './components/SessionDetailView';

export type View = 'timer' | 'stats' | 'settings' | 'session-detail';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('timer');
  const [prevView, setPrevView] = useState<View>('stats');
  
  const [sessionDuration, setSessionDuration] = useState(() => {
    const saved = localStorage.getItem('focus_sessionDuration');
    return saved ? parseInt(saved, 10) : 25;
  });
  const [breakDuration, setBreakDuration] = useState(() => {
    const saved = localStorage.getItem('focus_breakDuration');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('focus_soundEnabled');
    return saved ? saved === 'true' : true;
  });
  const [vibrationEnabled, setVibrationEnabled] = useState(() => {
    const saved = localStorage.getItem('focus_vibrationEnabled');
    return saved ? saved === 'true' : false;
  });

  useEffect(() => { localStorage.setItem('focus_sessionDuration', sessionDuration.toString()); }, [sessionDuration]);
  useEffect(() => { localStorage.setItem('focus_breakDuration', breakDuration.toString()); }, [breakDuration]);
  useEffect(() => { localStorage.setItem('focus_soundEnabled', soundEnabled.toString()); }, [soundEnabled]);
  useEffect(() => { localStorage.setItem('focus_vibrationEnabled', vibrationEnabled.toString()); }, [vibrationEnabled]);

  const navigateToDetails = () => {
    setPrevView(currentView);
    setCurrentView('session-detail');
  };

  const goBack = () => {
    setCurrentView(prevView);
  };

  return (
    <div className="min-h-screen bg-mesh font-sans selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-16 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <Sprout className="text-primary-container w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tighter text-primary-container">FocusTrack</h1>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-8">
            <NavButton 
              active={currentView === 'timer'} 
              onClick={() => setCurrentView('timer')}
              icon={<Timer className="w-4 h-4" />}
              label="Timer"
            />
            <NavButton 
              active={currentView === 'stats' || currentView === 'session-detail'} 
              onClick={() => setCurrentView('stats')}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Stats"
            />
            <NavButton 
              active={currentView === 'settings'} 
              onClick={() => setCurrentView('settings')}
              icon={<Settings className="w-4 h-4" />}
              label="Settings"
            />
          </nav>
          
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-surface-container-low text-outline-variant cursor-pointer hover:opacity-80 hover:border-primary-container/30 transition-all">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'timer' && (
              <TimerView sessionDuration={sessionDuration} />
            )}
            {currentView === 'stats' && (
              <StatsView onViewDetails={navigateToDetails} />
            )}
            {currentView === 'session-detail' && (
              <SessionDetailView onBack={goBack} />
            )}
            {currentView === 'settings' && (
              <SettingsView 
                sessionDuration={sessionDuration} 
                setSessionDuration={setSessionDuration}
                breakDuration={breakDuration}
                setBreakDuration={setBreakDuration}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
                vibrationEnabled={vibrationEnabled}
                setVibrationEnabled={setVibrationEnabled}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-surface-container/90 backdrop-blur-2xl border-t border-white/5 px-6 pb-8 pt-4 flex justify-around items-center rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,194,255,0.05)]">
        <MobileNavButton 
          active={currentView === 'timer'} 
          onClick={() => setCurrentView('timer')}
          icon={<Timer className="w-6 h-6" />}
          label="Timer"
        />
        <MobileNavButton 
          active={currentView === 'stats'} 
          onClick={() => setCurrentView('stats')}
          icon={<BarChart3 className="w-6 h-6" />}
          label="Stats"
        />
        <MobileNavButton 
          active={currentView === 'settings'} 
          onClick={() => setCurrentView('settings')}
          icon={<Settings className="w-6 h-6" />}
          label="Settings"
        />
      </nav>

      {/* Background Decorative Elements */}
      <div className="fixed top-[20%] left-[10%] w-[300px] h-[300px] bg-primary-container/5 blur-[120px] -z-10 rounded-full" />
      <div className="fixed bottom-[10%] right-[5%] w-[400px] h-[400px] bg-secondary/5 blur-[150px] -z-10 rounded-full" />
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 font-display text-sm font-medium tracking-widest uppercase transition-all hover:opacity-80 ${active ? 'text-primary-container' : 'text-outline'}`}
    >
      {/* {icon} */}
      {label}
    </button>
  );
}

function MobileNavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-6 py-2 rounded-2xl transition-all duration-300 ${active ? 'text-primary-container bg-primary-container/10 scale-110' : 'text-outline hover:text-primary-container/50'}`}
    >
      {icon}
      <span className="text-[10px] font-bold tracking-wide uppercase mt-1 font-sans">{label}</span>
    </button>
  );
}
