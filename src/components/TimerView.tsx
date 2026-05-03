import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Ban, Sprout, RotateCcw } from 'lucide-react';

interface TimerViewProps {
  sessionDuration: number;
}

export default function TimerView({ sessionDuration }: TimerViewProps) {
  const getInitialState = () => {
    const savedEndTime = localStorage.getItem('focus_endTime');
    const savedIsActive = localStorage.getItem('focus_isActive') === 'true';
    const savedDistractions = localStorage.getItem('focus_distractions');
    const savedTimeLeft = localStorage.getItem('focus_timeLeft');

    let initialTimeLeft = sessionDuration * 60;
    let initialIsActive = false;
    let initialEndTime: number | null = null;
    let initialDistractions = savedDistractions ? parseInt(savedDistractions, 10) : 0;

    if (savedIsActive && savedEndTime) {
      const parsedEndTime = parseInt(savedEndTime, 10);
      if (Date.now() >= parsedEndTime) {
        // Session should have already ended
        initialTimeLeft = 0;
        initialIsActive = false;
        initialEndTime = null;
      } else {
        initialTimeLeft = Math.floor((parsedEndTime - Date.now()) / 1000);
        initialIsActive = true;
        initialEndTime = parsedEndTime;
      }
    } else if (savedTimeLeft) {
      initialTimeLeft = parseInt(savedTimeLeft, 10);
    }

    if (Number.isNaN(initialTimeLeft) || initialTimeLeft < 0) initialTimeLeft = sessionDuration * 60;
    if (Number.isNaN(initialDistractions) || initialDistractions < 0) initialDistractions = 0;

    return { initialTimeLeft, initialIsActive, initialDistractions, initialEndTime };
  };

  const initialState = getInitialState();
  const [timeLeft, setTimeLeft] = useState(initialState.initialTimeLeft);
  const [isActive, setIsActive] = useState(initialState.initialIsActive);
  const [distractions, setDistractions] = useState(initialState.initialDistractions);
  const [endTime, setEndTime] = useState<number | null>(initialState.initialEndTime);
  const [activeTag, setActiveTag] = useState('Deep Work');

  const totalSeconds = sessionDuration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Reset timeLeft when sessionDuration changes only if timer is at original state or unstarted
  useEffect(() => {
    const currentMax = sessionDuration * 60;
    if (!isActive && timeLeft > currentMax) {
       setTimeLeft(currentMax);
    }
  }, [sessionDuration]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('focus_timeLeft', timeLeft.toString());
    localStorage.setItem('focus_isActive', isActive.toString());
    localStorage.setItem('focus_distractions', distractions.toString());
    if (endTime) {
      localStorage.setItem('focus_endTime', endTime.toString());
    } else {
      localStorage.removeItem('focus_endTime');
    }
  }, [timeLeft, isActive, distractions, endTime]);

  // Session tracking ref for stale closures
  const sessionRef = useRef({ duration: sessionDuration, tag: activeTag, dists: distractions });
  useEffect(() => {
    sessionRef.current = { duration: sessionDuration, tag: activeTag, dists: distractions };
  }, [sessionDuration, activeTag, distractions]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && endTime) {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) {
          setIsActive(false);
          setEndTime(null);
          
          // Save session
          const { duration, tag, dists } = sessionRef.current;
          const historyRaw = localStorage.getItem('focus_history');
          const history = historyRaw ? JSON.parse(historyRaw) : [];
          history.push({
            id: Date.now(),
            date: new Date().toISOString(),
            duration: duration,
            distractions: dists,
            tag: tag,
            score: Math.max(0, 100 - (dists * 5))
          });
          localStorage.setItem('focus_history', JSON.stringify(history));
        }
      }, 100);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setEndTime(null);
    }
    return () => clearInterval(interval);
  }, [isActive, endTime, timeLeft]);

  // Distraction tracking
  const wasVisible = useRef(!document.hidden);
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      if (wasVisible.current && !isVisible && isActive) {
        setDistractions((d) => d + 1);
      }
      wasVisible.current = isVisible;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isActive && timeLeft > 0) {
      setEndTime(Date.now() + timeLeft * 1000);
      setIsActive(true);
    } else {
      setEndTime(null);
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setEndTime(null);
    setTimeLeft(sessionDuration * 60);
    setDistractions(0);
    localStorage.removeItem('focus_timeLeft');
    localStorage.removeItem('focus_isActive');
    localStorage.removeItem('focus_distractions');
    localStorage.removeItem('focus_endTime');
  };

  return (
    <div className="flex flex-col items-center">
      {/* Level Indicator */}
      <div className="mb-12 flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-white/5">
        <Sprout className="w-4 h-4 text-secondary" />
        <span className="font-display text-[10px] sm:text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant">Beginner Level</span>
      </div>

      {/* Timer Display */}
      <div className="relative flex items-center justify-center">
        {/* Progress Ring */}
        <div className="absolute inset-0 flex items-center justify-center scale-110 md:scale-125">
          <svg className="w-[320px] h-[320px] md:w-[420px] md:h-[420px] -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-white/5"
              cx="50"
              cy="50"
              fill="none"
              r="46"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <motion.circle
              cx="50"
              cy="50"
              fill="none"
              r="46"
              stroke="url(#timerGradient)"
              strokeWidth="1.5"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * progress) / 100}
              strokeLinecap="round"
              className="drop-shadow-[0_0_12px_rgba(0,194,255,0.4)]"
              transition={{ ease: "linear" }}
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00C2FF" />
                <stop offset="100%" stopColor="#4de082" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Central Content */}
        <div className="timer-glow relative z-10 w-[260px] h-[260px] md:w-[340px] md:h-[340px] rounded-full bg-surface-container-low/40 backdrop-blur-3xl border border-white/5 flex flex-col items-center justify-center">
          <span className="font-display text-xs md:text-sm text-primary-container tracking-[0.3em] uppercase mb-2 md:mb-4">Focus Session</span>
          <span className="font-display text-6xl md:text-8xl lg:text-9xl text-on-surface font-bold tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <button 
            onClick={() => setDistractions(d => d + 1)}
            className="mt-4 flex items-center gap-2 text-outline font-display text-[10px] md:text-xs uppercase tracking-wider hover:text-on-surface transition-colors"
          >
            <Ban className="w-3 h-3" />
            <span>Distractions: {distractions}</span>
          </button>
        </div>
      </div>

      {/* Action Controls */}
      <div className="mt-16 flex flex-col items-center gap-8 w-full max-w-sm">
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className="bg-primary-container text-on-primary-container px-12 py-4 rounded-full font-sans text-xl font-bold shadow-[0_20px_50px_rgba(0,194,255,0.3)] flex items-center gap-3 active:brightness-90 transition-all"
          >
            {isActive ? (
              <>
                <Pause className="w-6 h-6 fill-current" />
                <span>Pause Focus</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </motion.button>
          
          {timeLeft !== sessionDuration * 60 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetTimer}
              className="w-14 h-14 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center text-on-surface hover:bg-surface-bright transition-all"
            >
              <RotateCcw className="w-6 h-6" />
            </motion.button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-3">
          {['Deep Work', 'Reading', 'Coding'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1 rounded-full text-[10px] font-display font-medium uppercase tracking-tight border transition-all ${
                activeTag === tag 
                  ? 'bg-primary-container/20 text-primary-container border-primary-container/30' 
                  : 'bg-white/5 text-outline border-white/10 hover:border-white/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
