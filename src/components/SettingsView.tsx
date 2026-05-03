import { Volume2, VolumeX, Smartphone, SmartphoneNfc, ShieldCheck } from 'lucide-react';

interface SettingsViewProps {
  sessionDuration: number;
  setSessionDuration: (val: number) => void;
  breakDuration: number;
  setBreakDuration: (val: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (val: boolean) => void;
}

export default function SettingsView({
  sessionDuration,
  setSessionDuration,
  breakDuration,
  setBreakDuration,
  soundEnabled,
  setSoundEnabled,
  vibrationEnabled,
  setVibrationEnabled
}: SettingsViewProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-12">
      {/* Header */}
      <section className="space-y-2">
        <h2 className="font-sans text-3xl md:text-4xl font-bold text-on-surface">Settings</h2>
        <p className="text-on-surface-variant text-lg">Refine your environment for maximum clarity.</p>
      </section>

      {/* Session Parameters */}
      <div className="space-y-6">
        <h3 className="font-display text-xs font-semibold text-primary uppercase tracking-[0.2em] px-1">Session Parameters</h3>
        <div className="glass-card rounded-[32px] p-6 md:p-8 space-y-8 shadow-[0_20px_50px_-12px_rgba(0,194,255,0.15)]">
          {/* Session Duration */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xl font-bold block">Session Duration</span>
              <span className="text-on-surface-variant text-sm block">Length of a single focus sprint</span>
            </div>
            <div className="flex bg-surface-container-lowest p-1.5 rounded-full border border-white/5 self-start sm:self-auto">
              {[25, 50].map(val => (
                <button 
                  key={val}
                  onClick={() => setSessionDuration(val)}
                  className={`px-6 py-2 rounded-full font-display text-xs font-bold transition-all ${
                    sessionDuration === val 
                      ? 'bg-primary-container text-on-primary-container shadow-lg' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {val} min
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Break Duration */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xl font-bold block">Break Duration</span>
              <span className="text-on-surface-variant text-sm block">Interval for mental recovery</span>
            </div>
            <div className="flex bg-surface-container-lowest p-1.5 rounded-full border border-white/5 self-start sm:self-auto">
              {[5, 10].map(val => (
                <button 
                  key={val}
                  onClick={() => setBreakDuration(val)}
                  className={`px-6 py-2 rounded-full font-display text-xs font-bold transition-all ${
                    breakDuration === val 
                      ? 'bg-primary-container text-on-primary-container shadow-lg' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {val} min
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sensory Preferences */}
      <div className="space-y-6">
        <h3 className="font-display text-xs font-semibold text-primary uppercase tracking-[0.2em] px-1">Sensory Feedback</h3>
        <div className="glass-card rounded-[32px] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,194,255,0.15)]">
          {/* Sound Toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-white/5 transition-all text-left"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center">
                {soundEnabled ? <Volume2 className="text-primary-container" /> : <VolumeX className="text-outline" />}
              </div>
              <div className="space-y-1">
                <span className="text-xl font-bold block">Sound</span>
                <span className="text-on-surface-variant text-sm block">Audible alerts for timer events</span>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${soundEnabled ? 'bg-primary-container' : 'bg-surface-container-highest border border-white/10'}`}>
              <div className={`w-6 h-6 rounded-full transition-all shadow-sm ${soundEnabled ? 'bg-on-primary-container translate-x-6' : 'bg-outline-variant'}`} />
            </div>
          </button>

          <div className="h-px bg-white/5 mx-8" />

          {/* Vibration Toggle */}
          <button 
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
            className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-white/5 transition-all text-left"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center">
                {vibrationEnabled ? <SmartphoneNfc className="text-primary-container" /> : <Smartphone className="text-outline" />}
              </div>
              <div className="space-y-1">
                <span className="text-xl font-bold block">Vibration</span>
                <span className="text-on-surface-variant text-sm block">Haptic feedback on transitions</span>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${vibrationEnabled ? 'bg-primary-container' : 'bg-surface-container-highest border border-white/10'}`}>
              <div className={`w-6 h-6 rounded-full transition-all shadow-sm ${vibrationEnabled ? 'bg-on-primary-container translate-x-6' : 'bg-outline-variant'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Offline Badge */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3 bg-surface-container-low px-6 py-2.5 rounded-full border border-white/5">
          <ShieldCheck className="w-4 h-4 text-outline" />
          <span className="font-display text-[10px] text-outline uppercase tracking-[0.2em] font-bold">Offline Mode Active</span>
        </div>
      </div>
    </div>
  );
}
