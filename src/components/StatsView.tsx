import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Timer, Zap, Flame, Target, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { ReactNode, useState, useEffect } from 'react';

interface Session {
  id: number;
  date: string;
  duration: number;
  distractions: number;
  tag: string;
  score: number;
}

interface StatsViewProps {
  onViewDetails?: () => void;
}

export default function StatsView({ onViewDetails }: StatsViewProps) {
  const [history, setHistory] = useState<Session[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('focus_history');
    if (raw) {
      setHistory(JSON.parse(raw));
    }
  }, []);

  const totalMinutes = history.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMinsRemainder = totalMinutes % 60;
  const totalFocusTimeStr = `${totalHours}h ${totalMinsRemainder}m`;

  const today = new Date().toDateString();
  const distractionsToday = history
    .filter(s => new Date(s.date).toDateString() === today)
    .reduce((acc, s) => acc + s.distractions, 0);

  const uniqueDays = Array.from(new Set(history.map(s => new Date(s.date).toDateString())));
  let streak = 0;
  let d = new Date();
  while (uniqueDays.includes(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  const chartData = Array.from({length: 7}).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const daySessions = history.filter(s => new Date(s.date).toDateString() === date.toDateString());
    const val = daySessions.reduce((acc, s) => acc + s.duration, 0);
    return { day: dayStr, value: val, type: val > 60 ? 'deep' : 'light' };
  });

  const lastSession = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="space-y-2">
        <h2 className="font-sans text-3xl md:text-4xl font-bold text-on-surface">Your Progress</h2>
        <p className="text-on-surface-variant text-lg">Visualizing your journey towards deep clarity and consistent work habits.</p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Focus Time" 
          value={totalFocusTimeStr} 
          change="Tracked across all sessions" 
          icon={<Timer className="text-primary-container" />}
          positive={true}
        />
        <StatCard 
          label="Distractions Today" 
          value={distractionsToday.toString()} 
          change="Stay focused!" 
          icon={<Zap className="text-error" />}
          positive={distractionsToday === 0}
        />
        <StatCard 
          label="Current Streak" 
          value={`${streak} Days`} 
          change="Keep it up!" 
          icon={<Flame className="text-secondary" />}
          positive={streak > 0}
        />
      </section>

      {/* Activity Chart */}
      <section className="glass-card p-6 md:p-8 rounded-3xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="font-display text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-outline">Weekly Activity</span>
            <h3 className="text-2xl font-bold text-on-surface">Focus Intensity</h3>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-container" />
              <span className="text-xs text-on-surface-variant font-medium">Deep Work</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
              <span className="text-xs text-on-surface-variant font-medium">Light Focus</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={0} barSize={40}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#86929a', fontSize: 10, fontWeight: 600, fontFamily: 'Space Grotesk' }}
                dy={10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1c2026', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.type === 'deep' ? '#00c2ff' : '#00b55d'} 
                    fillOpacity={0.2 + (Math.min(entry.value, 250) / 250) * 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Last Session */}
      <section className="space-y-4">
        <span className="font-display text-xs font-semibold uppercase tracking-widest text-outline px-1">Last Session Performance</span>
        {lastSession ? (
          <div className="glass-card overflow-hidden rounded-[32px] border-l-4 border-l-secondary p-8">
             <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                    <Target className="w-10 h-10 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-on-surface">Focus Complete</h4>
                    <p className="text-on-surface-variant">{new Date(lastSession.date).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-12 text-center md:text-left">
                  <div>
                    <span className="font-display text-[10px] text-outline block mb-1">DURATION</span>
                    <div className="text-2xl font-bold text-on-surface">{lastSession.duration} min</div>
                  </div>
                  <div>
                    <span className="font-display text-[10px] text-outline block mb-1">FOCUS SCORE</span>
                    <div className="text-2xl font-bold text-secondary flex items-center gap-2">
                      {lastSession.score}
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <span className="font-display text-[10px] text-outline block mb-1">TAGS</span>
                    <div className="flex gap-2 mt-1">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{lastSession.tag}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={onViewDetails}
                  className="whitespace-nowrap bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,194,255,0.3)]"
                >
                  View Details
                </button>
             </div>
          </div>
        ) : (
          <div className="glass-card p-8 rounded-[32px] text-center text-on-surface-variant">
            No completed sessions yet. Start a timer to see your stats!
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, change, icon, positive }: { label: string; value: string; change: string; icon: ReactNode; positive: boolean }) {
  return (
    <div className="glass-card p-6 rounded-3xl flex flex-col justify-between h-44 hover:border-white/20 transition-all group">
      <div className="flex justify-between items-start">
        <span className="font-display text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-outline">{label}</span>
        <div className="group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-on-surface">{value}</div>
        <div className={`text-xs font-medium flex items-center gap-1 ${positive ? 'text-secondary' : 'text-error'}`}>
          {change}
        </div>
      </div>
    </div>
  );
}
