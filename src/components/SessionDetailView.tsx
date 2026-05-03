import { motion } from 'motion/react';
import { ChevronLeft, Target, Zap, Clock, Calendar, Bookmark, Share2 } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';

interface Session {
  id: number;
  date: string;
  duration: number;
  distractions: number;
  tag: string;
  score: number;
}

interface SessionDetailViewProps {
  onBack: () => void;
}

export default function SessionDetailView({ onBack }: SessionDetailViewProps) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('focus_history');
    if (raw) {
      const history = JSON.parse(raw);
      if (history.length > 0) {
        setSession(history[history.length - 1]);
      }
    }
  }, []);

  if (!session) {
    return (
      <div className="space-y-12">
        <button onClick={onBack} className="flex items-center gap-2 text-outline hover:text-primary-container transition-colors font-display text-xs font-bold uppercase tracking-widest mb-4 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Stats
        </button>
        <div className="text-center text-on-surface-variant p-8 glass-card rounded-[32px]">No sessions recorded yet.</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-outline hover:text-primary-container transition-colors font-display text-xs font-bold uppercase tracking-widest mb-4 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Stats
          </button>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-on-surface">Session Details</h2>
          <p className="text-on-surface-variant text-lg">Detailed breakdown of your most recent focus sprint.</p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-high border border-white/10 hover:bg-surface-bright transition-all text-on-surface font-bold text-xs uppercase tracking-widest">
          <Share2 className="w-4 h-4" />
          Share result
        </button>
      </section>

      {/* Hero card */}
      <div className="glass-card rounded-[40px] overflow-hidden border-l-8 border-l-secondary shadow-[0_20px_50px_-12px_rgba(0,194,255,0.15)]">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 relative">
               <div className="absolute inset-0 bg-secondary/5 blur-2xl rounded-full" />
               <Target className="w-12 h-12 text-secondary relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-tighter border border-primary/20">{session.tag}</span>
                <span className="text-outline text-[10px] uppercase font-bold tracking-widest">• {new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-on-surface">{session.score > 80 ? 'Perfect Focus' : 'Good Focus'}</h4>
              <p className="text-on-surface-variant font-medium text-lg mt-1">{session.score > 80 ? 'Excellent focus 🔥 Keep it up!' : 'Good effort! Stay focused.'}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <span className="font-display text-[12px] text-outline uppercase tracking-[0.2em] mb-2">SCORE</span>
            <div className="text-7xl font-bold text-secondary tracking-tighter">{session.score}</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricItem label="Duration" value={`${session.duration} min`} icon={<Clock className="w-5 h-5 text-primary-container" />} />
        <MetricItem label="Distractions" value={`${session.distractions}`} icon={<Zap className="w-5 h-5 text-error" />} />
        <MetricItem label="Session Goal" value="Finished" icon={<Target className="w-5 h-5 text-secondary" />} />
        <MetricItem label="Date" value={new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} icon={<Calendar className="w-5 h-5 text-outline" />} />
      </section>

      {/* Highlights / Notes Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-display text-xs font-semibold text-primary uppercase tracking-[0.2em] px-1">Session Insights</h3>
          <div className="glass-card rounded-3xl p-8 space-y-6">
            <div className="space-y-4">
               <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 shadow-[0_0_8px_rgba(77,224,130,0.5)]" />
                  <p className="text-on-surface leading-relaxed">Stable focus maintained throughout the duration with no reported context switching.</p>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shadow-[0_0_8px_rgba(0,194,255,0.5)]" />
                  <p className="text-on-surface leading-relaxed">Pulse rate remained within the optimal deep-work zone (65-75 BPM).</p>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-outline mt-2" />
                  <p className="text-on-surface leading-relaxed">Environment isolation was 100% effective based on device usage data.</p>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-display text-xs font-semibold text-primary uppercase tracking-[0.2em] px-1">Tags & Project</h3>
          <div className="glass-card rounded-3xl p-8 space-y-8">
            <div className="space-y-3">
              <span className="text-outline text-[10px] font-bold uppercase tracking-widest block">Project</span>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-container-low border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center">
                  <Bookmark className="w-4 h-4 text-primary-container" />
                </div>
                <span className="font-bold text-on-surface">Client Website</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-outline text-[10px] font-bold uppercase tracking-widest block">Environment</span>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-container-low border border-white/5">
                 <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                    🌿
                 </div>
                <span className="font-bold text-on-surface">Ambient Garden</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricItem({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="glass-card p-6 rounded-3xl flex items-center gap-4 hover:border-white/20 transition-all">
       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
         {icon}
       </div>
       <div className="space-y-0.5">
          <span className="text-outline text-[10px] font-bold uppercase tracking-widest block">{label}</span>
          <span className="text-xl font-bold text-on-surface block">{value}</span>
       </div>
    </div>
  );
}
