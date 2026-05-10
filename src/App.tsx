import React, { useState, useEffect, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, ReactElement } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  MapPin,
  History,
  LayoutDashboard,
  Satellite,
  X,
  Mail,
  Phone,
  Compass,
  ArrowRight,
  Volume2,
  VolumeX,
  Info,
  Download,
  ExternalLink
} from 'lucide-react';
import { CV_DATA } from './data';
import { useWindowSize } from './hooks';
import { LinkedInIcon } from './icons';
import { THEMES, type Theme, type ThemeConfig } from './themes';

type ModalId = 'bio' | 'experience' | 'projects' | 'contact';

interface MapNodeProps {
  position?: CSSProperties;
  label: string;
  sec: string;
  icon: ReactElement<{ size?: number; className?: string }>;
  themeColor: string;
  activeConfig: ThemeConfig;
  onClick: () => void;
  useGridLayout: boolean;
  mobileOrder?: number;
}

interface ContentModalProps {
  id: ModalId;
  themeColor: string;
  activeConfig: ThemeConfig;
  onClose: () => void;
}

export default function App() {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const useGridLayout = width < 1024;

  const [theme, setThemeState] = useState<Theme>('hydro');
  const [activeTab, setActiveTab] = useState<ModalId | null>(null);
  const [telemetryPing, setTelemetryPing] = useState(14);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isStrengthsOpen, setIsStrengthsOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(140);
  const headerRef = useRef<HTMLElement>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Measure header height
  useEffect(() => {
    if (!headerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setHeaderHeight(entry.target.clientHeight);
      }
    });
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  const setTheme = (newTheme: Theme) => {
    if (newTheme === theme) return;
    setIsTransitioning(true);
    setThemeState(newTheme);
    playSound(THEMES[newTheme].sound);
    if (!hasInteracted) setHasInteracted(true);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleOpenTab = (tab: ModalId) => {
    setActiveTab(tab);
    playSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    if (!hasInteracted) setHasInteracted(true);
  };

  // Background Audio Controller
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;
    let fadeIn: number | undefined;
    
    // Reset volume and change source
    const currentBgSound = THEMES[theme].bgSound;
    
    const playAudio = async () => {
      if (isMuted || !hasInteracted) {
        audio.pause();
        return;
      }

      try {
        if (audio.src !== currentBgSound) {
          audio.src = currentBgSound;
          audio.load();
        }
        
        await audio.play();
        
        // Fade In
        audio.volume = 0;
        let vol = 0;
        fadeIn = window.setInterval(() => {
          vol = Math.min(0.2, vol + 0.02);
          audio.volume = vol;
          if (vol >= 0.2) clearInterval(fadeIn);
        }, 100);
      } catch (err) {
        console.warn("Autoplay blocked", err);
      }
    };

    playAudio();

    return () => {
      if (fadeIn) window.clearInterval(fadeIn);
      // Small fade out
      let vol = audio.volume;
      const fadeOut = window.setInterval(() => {
        vol = Math.max(0, vol - 0.05);
        audio.volume = vol;
        if (vol <= 0) {
          window.clearInterval(fadeOut);
        }
      }, 50);
    };
  }, [theme, isMuted, hasInteracted]);

  // Ping fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryPing(Math.floor(Math.random() * 5) + 12);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeColor = THEMES[theme].color;
  const activeConfig = THEMES[theme];

  return (
    <div className="relative h-screen w-full select-none overflow-hidden bg-[#080a0b] text-white selection:bg-white/20 transition-colors duration-700 font-sans">
      {/* Themed Background Images */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: theme === 'gis' ? 0.4 : theme === 'precision' ? 0.35 : 0.3, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`absolute inset-0 bg-cover bg-center ${
              theme === 'gis' 
                ? 'mix-blend-overlay' 
                : theme === 'precision'
                ? 'grayscale brightness-75 contrast-125 opacity-80'
                : 'grayscale brightness-75 contrast-125'
            }`}
            style={{ backgroundImage: `url(${THEMES[theme].bg})` }}
          />
        </AnimatePresence>
        
        {/* Hydro Mode Bathymetry Pattern Overlay */}
        {theme === 'hydro' && (
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 162, 255, 0.1) 0%, transparent 70%), repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, rgba(0, 162, 255, 0.05) 41px, transparent 42px)` 
            }} 
          />
        )}
        
        {/* Mode-specific Decorative Overlays */}
        {theme === 'hydro' && (
          <>
            <div className="sonar-ripple" style={{ color: activeColor }} />
            <div className="sonar-ripple" style={{ color: activeColor, animationDelay: '1.5s' }} />
            <div className="sonar-ripple" style={{ color: activeColor, animationDelay: '3s' }} />
          </>
        )}

        {theme === 'gis' && (
          <div className="absolute inset-0 data-stream pointer-events-none opacity-20" />
        )}

        {theme === 'land' && (
          <div className="absolute inset-0 topo-pattern pointer-events-none opacity-40 mix-blend-overlay" />
        )}

        {theme === 'precision' && (
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
            style={{ 
              backgroundImage: `linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }} 
          />
        )}
        
        {/* Vignette Overlay untuk kedalaman visual */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            background: 'radial-gradient(circle at center, transparent 50%, #080a0b 100%)' 
          }} 
        />
        <div className="absolute inset-0 scanline-overlay opacity-[0.05] pointer-events-none" />
      </div>

      {/* Background Grid */}
      <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none z-1" />
      
      {/* Dynamic Scanline */}
      <div className="scanline" style={{ color: activeColor }} />

      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
          >
            <div className="w-full h-[2px] bg-white absolute top-1/2 -translate-y-1/2 blur-sm shadow-[0_0_50px_white]" />
            <div className="absolute inset-0 bg-white/5 backdrop-brightness-150 transition-all" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Compass Overlay */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <Compass size={800} strokeWidth={0.2} style={{ color: activeColor }} />
        </motion.div>
      </div>

      {/* Header */}
      <header ref={headerRef} className="fixed top-0 z-50 flex w-full flex-col gap-3 p-4 md:p-6 md:flex-row md:items-center md:justify-between lg:px-10 lg:py-6 pointer-events-none">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col items-start pointer-events-auto"
        >
          <div className="flex items-center gap-3 md:gap-4 flex-row justify-start">
            <motion.div
              key={theme}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="p-2 md:p-3 lg:p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden group"
              style={{ color: activeColor }}
            >
              <activeConfig.icon size={24} strokeWidth={2.5} className="md:w-8 md:h-8 lg:w-10 lg:h-10 relative z-10" />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <h1
              className="text-2xl font-bold tracking-[-0.03em] md:text-5xl lg:text-7xl xl:text-8xl uppercase"
              style={{ color: activeColor, textShadow: `0 0 35px ${activeColor}33`, fontWeight: 700 }}
            >
              Hello!
            </h1>
          </div>
          <div className="mt-1 flex items-center gap-1.5 md:gap-3 font-mono text-[8px] md:text-[11px] font-medium tracking-[0.2em] md:tracking-[0.4em] text-white/40">
            <div className="h-1 w-1 rounded-full animate-pulse shadow-lg" style={{ backgroundColor: activeColor, boxShadow: `0 0 8px ${activeColor}` }} />
            {activeConfig.subtext.toUpperCase()}
          </div>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 md:gap-3 self-center pointer-events-auto">
          <button 
            type="button"
            aria-label={isMuted ? 'Enable interface sound' : 'Mute interface sound'}
            aria-pressed={!isMuted}
            onClick={() => {
              setIsMuted(!isMuted);
              if (!hasInteracted) setHasInteracted(true);
              playSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
            }}
            className="p-2 md:p-3 bg-[#0a0b0c]/80 backdrop-blur-3xl border border-white/10 rounded-xl md:rounded-2xl text-white/40 hover:text-white hover:border-white/20 transition-all shadow-xl"
            style={{ color: isMuted ? undefined : activeColor }}
          >
            {isMuted ? <VolumeX size={16} className="md:w-5 md:h-5" /> : <Volume2 size={16} className="md:w-5 md:h-5" />}
          </button>

          <div className="relative flex gap-1 p-1 bg-[#0a0b0c]/80 backdrop-blur-3xl border border-white/10 rounded-xl md:rounded-2xl overflow-x-auto max-w-[85vw] md:max-w-full shadow-2xl scrollbar-hide">
            {(Object.keys(THEMES) as Theme[]).map((t) => {
            const Icon = THEMES[t].icon;
            const isActive = theme === t;
            return (
              <button
                key={t}
                type="button"
                aria-label={`Switch to ${THEMES[t].label} mode`}
                aria-pressed={isActive}
                onClick={() => setTheme(t)}
                className={`relative flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-3 px-2 md:px-10 py-2 md:py-3 font-mono text-[9px] md:text-[12px] font-bold tracking-[0.05em] md:tracking-[0.15em] transition-all rounded-lg md:rounded-xl whitespace-nowrap z-10 min-w-0 flex-shrink ${
                  isActive 
                    ? 'text-[#080a0b]' 
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 rounded-lg md:rounded-xl shadow-xl"
                    style={{ backgroundColor: activeColor }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon 
                  size={isMobile ? 14 : 10} 
                  className="md:w-[16px] md:h-[16px] relative z-20" 
                  strokeWidth={isActive ? 3 : 2} 
                  style={{ color: isActive ? 'inherit' : THEMES[t].color }}
                />
                <span className="relative z-20 md:hidden text-[7px]">{THEMES[t].label.slice(0, 2)}</span>
                <span className="relative z-20 hidden md:inline">{THEMES[t].label}</span>
              </button>
            );
          })}
          </div>

          <button 
            type="button"
            aria-label={isStrengthsOpen ? 'Close core advantage details' : 'Open core advantage details'}
            aria-expanded={isStrengthsOpen}
            onClick={() => setIsStrengthsOpen(!isStrengthsOpen)}
            className="lg:hidden p-2 md:p-3 bg-[#0a0b0c]/80 backdrop-blur-3xl border border-white/10 rounded-xl md:rounded-2xl text-white/40 hover:text-white hover:border-white/20 transition-all shadow-xl"
            style={{ color: isStrengthsOpen ? activeColor : undefined }}
          >
            <Info size={16} className="md:w-5 md:h-5" />
          </button>
        </div>

        {/* Compact Mobile Identity */}
        <div className="md:hidden flex justify-center w-full">
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 pointer-events-auto"
          >
            <div className="h-6 w-6 rounded-full border border-white/20 overflow-hidden">
               <img src={CV_DATA.profile.profileImage} alt="Andhika profile" className="h-full w-full object-cover grayscale" decoding="async" />
            </div>
            <span className="text-[8px] font-bold tracking-widest text-white/60">ANDHIKA</span>
            <div className="h-3 w-[1px] bg-white/10" />
            <span className="text-[8px] font-mono text-white/30 truncate max-w-[100px]">{CV_DATA.profile.coordinates}</span>
          </motion.div>
        </div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden md:flex flex-col items-end gap-3 pointer-events-auto"
        >
          <div className="flex items-center gap-4 mb-2 group">
            <div className="flex flex-col items-end">
              <div className="text-[11px] font-black tracking-widest text-white/80 group-hover:text-white transition-colors">ANDHIKA PRASETYA</div>
              <div className="text-[9px] font-mono font-medium text-white/20 group-hover:text-white/40 transition-colors">IDENT_STATUS: VERIFIED</div>
            </div>
            <div className={`relative h-14 w-14 border border-white/20 bg-white/5 overflow-hidden transition-all duration-500 group-hover:border-white/40 group-hover:scale-105 shadow-2xl ${activeConfig.shape}`}
                 style={{ boxShadow: `0 0 25px ${activeColor}22` }}>
              <img 
                src={CV_DATA.profile.profileImage} 
                alt="Andhika profile"
                className="h-full w-full object-cover grayscale brightness-110 contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              {/* Dynamic Theme Filter */}
              <div className="absolute inset-0 opacity-40 mix-blend-color" style={{ backgroundColor: activeColor }} />
              <div className="absolute inset-0 scanline-overlay opacity-30" />
              <div className="absolute inset-0 holo-gradient" />
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40" />
            </div>
          </div>
          <div className={`border border-white/10 bg-white/5 px-5 py-3 font-mono text-[12px] font-bold tracking-[0.2em] text-white/80 backdrop-blur-md shadow-2xl ${activeConfig.shape}`}>
            {CV_DATA.profile.coordinates}
          </div>
          <div className="flex items-center gap-2 font-mono text-[9px] text-white/30 tracking-[0.2em]">
            <span className="w-1 h-1 rounded-full bg-blue-400 animate-ping" />
            SYS_CMD: BOOT_COMPLETE
          </div>
        </motion.div>
      </header>

      {/* Main Interactive Viewport */}
      <main className="relative h-full w-full" style={{ paddingTop: useGridLayout ? headerHeight : 0 }}>
        {/* Enhanced Connection Lines (SVG) - Hidden on mobile/tablet for performance and clarity */}
        {!useGridLayout && (
          <svg className="absolute inset-0 h-full w-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Updated Route Line for optimized non-colliding topology */}
            <motion.path
              d="M 22 38 L 36 62 L 55 30 L 70 55"
              fill="none"
              stroke={activeColor}
              strokeWidth="0.15"
              strokeDasharray="1.5 1"
              className="opacity-40"
              style={{ filter: 'url(#glow)' }}
              animate={{ strokeDashoffset: [0, -10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            />

            {/* Secondary Glow Path */}
            <path
              d="M 22 38 L 36 62 L 55 30 L 70 55"
              fill="none"
              stroke={activeColor}
              strokeWidth="0.05"
              className="opacity-10"
            />

            {/* Moving Data Packets */}
            <motion.circle r="0.3" fill={activeColor} className="shadow-lg">
              <animateMotion 
                dur="6s" 
                repeatCount="indefinite" 
                path="M 22 38 L 36 62 L 55 30 L 70 55" 
              />
            </motion.circle>
            <motion.circle r="0.3" fill={activeColor}>
              <animateMotion 
                dur="6s" 
                begin="3s"
                repeatCount="indefinite" 
                path="M 22 38 L 36 62 L 55 30 L 70 55" 
              />
            </motion.circle>
          </svg>
        )}

        <div className={`relative h-full w-full max-w-[1400px] mx-auto ${useGridLayout ? 'flex items-start justify-center overflow-y-auto overflow-x-hidden' : ''}`}>
          <div className={useGridLayout ? `grid grid-cols-2 gap-5 md:gap-8 w-full px-4 md:max-w-lg mx-auto pb-28 ${isTablet && !isMobile ? 'pt-8' : ''}` : "relative h-full w-full"}>
            <MapNode 
              position={useGridLayout ? undefined : { top: '38%', left: '22%' }}
              label={theme === 'hydro' ? "Sonar Origin" : theme === 'gis' ? "Root Node" : theme === 'land' ? "Station 001" : "Base Geoid"}
              sec={`${activeConfig.labelPrefix}.01 // BIO`}
              icon={<MapPin size={28} />}
              themeColor={activeColor}
              activeConfig={activeConfig}
              onClick={() => handleOpenTab('bio')}
              useGridLayout={useGridLayout}
              mobileOrder={1}
            />

            <MapNode 
              position={useGridLayout ? undefined : { top: '62%', left: '36%' }}
              label={theme === 'hydro' ? "Sounding Dept" : theme === 'gis' ? "Logic Layer" : theme === 'land' ? "Field Grid" : "Prec Bench"}
              sec={`${activeConfig.labelPrefix}.02 // HIST`}
              icon={<History size={28} />}
              themeColor={activeColor}
              activeConfig={activeConfig}
              onClick={() => handleOpenTab('experience')}
              useGridLayout={useGridLayout}
              mobileOrder={2}
            />

            <MapNode 
              position={useGridLayout ? undefined : { top: '30%', left: '55%' }}
              label={theme === 'hydro' ? "Wreck Data" : theme === 'gis' ? "Geo Registry" : theme === 'land' ? "Site Plan" : "Sat Link"}
              sec={`${activeConfig.labelPrefix}.03 // DATA`}
              icon={<LayoutDashboard size={28} />}
              themeColor={activeColor}
              activeConfig={activeConfig}
              onClick={() => handleOpenTab('projects')}
              useGridLayout={useGridLayout}
              mobileOrder={3}
            />

            <MapNode 
              position={useGridLayout ? undefined : { top: '55%', left: '70%' }}
              label={theme === 'hydro' ? "Comms Buoy" : theme === 'gis' ? "API Portal" : theme === 'land' ? "Heliport" : "Ref Center"}
              sec={`${activeConfig.labelPrefix}.04 // COMM`}
              icon={<Satellite size={28} />}
              themeColor={activeColor}
              activeConfig={activeConfig}
              onClick={() => handleOpenTab('contact')}
              useGridLayout={useGridLayout}
              mobileOrder={4}
            />
          </div>
        </div>
      </main>

      {/* Dynamic Strength Indicator - Fixed on desktop (lg+), Bottom sheet on (<lg) */}
      <div className="fixed bottom-12 right-12 z-40 hidden lg:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme + '-strength-desktop'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`p-6 bg-[#0a0b0c]/95 backdrop-blur-3xl border border-white/10 w-72 shadow-[0_20px_50px_rgba(0,0,0,0.8)] ${activeConfig.shape}`}
            style={{ borderRight: `4px solid ${activeColor}` }}
          >
            <div className="mb-2 font-mono text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">CORE_ADVANTAGE</div>
            <h3 className="text-xl font-black mb-2 tracking-tight uppercase" style={{ color: activeColor }}>{activeConfig.strengths.title}</h3>
            <p className="text-[11px] text-white/50 mb-4 leading-relaxed font-medium">{activeConfig.strengths.description}</p>

            <div className="space-y-2">
              {activeConfig.strengths.points.map((pt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-[1px] bg-current" style={{ color: activeColor }} />
                  <span className="text-[9px] font-mono font-bold text-white/70 tracking-widest uppercase">{pt}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="text-[8px] font-mono text-white/30 tracking-[0.2em] mb-1">EQUIPMENT_STACK</div>
              <div className="text-[10px] font-bold text-white/60 tracking-tight">{activeConfig.strengths.equipment}</div>
            </div>
            
            <div className="mt-6 flex justify-between items-center opacity-20">
              <div className="h-[1px] flex-1 bg-white" />
              <span className="mx-2 font-mono text-[8px]">V.04_SEC_AUTO</span>
              <div className="h-[1px] w-4 bg-white" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Sheet for Strengths */}
      <AnimatePresence>
        {isStrengthsOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden rounded-t-3xl bg-[#0a0b0c]/98 border-t-4 p-6 pb-10 backdrop-blur-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
            style={{ borderColor: activeColor }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-1.5 bg-white/10 rounded-full" onClick={() => setIsStrengthsOpen(false)} />
            </div>
            
            <div className="mb-2 font-mono text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">CORE_ADVANTAGE</div>
            <h3 className="text-2xl font-black mb-2 tracking-tight uppercase" style={{ color: activeColor }}>{activeConfig.strengths.title}</h3>
            <p className="text-[12px] text-white/50 mb-6 leading-relaxed font-medium">{activeConfig.strengths.description}</p>

            <div className="space-y-3">
              {activeConfig.strengths.points.map((pt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-[1px] bg-current" style={{ color: activeColor }} />
                  <span className="text-[11px] font-mono font-bold text-white/70 tracking-widest uppercase">{pt}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <div className="text-[9px] font-mono text-white/30 tracking-[0.2em] mb-1">EQUIPMENT_STACK</div>
              <div className="text-[11px] font-bold text-white/60 tracking-tight">{activeConfig.strengths.equipment}</div>
            </div>
            
            <button 
              type="button"
              onClick={() => setIsStrengthsOpen(false)}
              className="mt-8 w-full py-4 rounded-xl border border-white/10 bg-white/5 font-mono text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase"
            >
              CLOSE_DETAILS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Telemetry Fixed Panel - Responsive width and padding */}
      <div className="fixed bottom-6 md:bottom-12 left-6 md:left-12 lg:left-12 lg:bottom-12 max-w-[calc(100%-3rem)] md:w-64 lg:w-64 z-40">
        <div 
          className={`glass-panel p-3 md:p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 max-w-[180px] md:max-w-none lg:w-64 lg:max-w-none ${activeConfig.shape} ${theme === 'gis' ? 'bg-white/5' : 'bg-[#0a0b0c]/80'}`}
          style={{ 
            borderLeft: `4px solid ${activeColor}`,
            boxShadow: `0 0 40px ${activeColor}11`
          }}
        >
          <div className="mb-2 md:mb-4 flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-mono text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-bold text-white/40 uppercase truncate mr-2">SYS_LINK // ACTIVE</span>
            <div className="flex gap-0.5 md:gap-1 items-end h-2 md:h-3 flex-shrink-0">
              {[0.4, 0.7, 1, 0.6, 0.8].map((h, i) => (
                <motion.div 
                  key={i}
                  className="w-[1px] md:w-[2px]" 
                  style={{ backgroundColor: activeColor, height: `${h * 100}%` }}
                  animate={{ scaleY: [0.8, 1.3, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-1.5 md:gap-4 font-mono text-[9px] md:text-[11px] tracking-tighter">
            {activeConfig.telemetry.slice(0, isMobile ? 2 : 3).map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center justify-between gap-1">
                  <span className="text-white/20 whitespace-nowrap">{item.label}:</span>
                  <div className="flex items-center gap-1 font-bold whitespace-nowrap" style={{ color: activeColor }}>
                    <span className="truncate">{item.value}</span>
                    <Icon size={8} className="md:w-3 md:h-3" />
                  </div>
                </div>
              );
            })}
            <div className="hidden md:flex items-center justify-between">
              <span className="text-white/20">LATENCY:</span>
              <div className="flex items-center gap-1 font-bold" style={{ color: activeColor }}>
                {telemetryPing}ms
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeTab && (
          <ContentModal 
            id={activeTab} 
            themeColor={activeColor} 
            activeConfig={activeConfig}
            onClose={() => setActiveTab(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MapNode({ position, label, sec, icon, themeColor, activeConfig, onClick, useGridLayout }: MapNodeProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onClick();
  };

  return (
    <motion.div
      style={!useGridLayout ? { ...position } : {}}
      className={`${useGridLayout ? 'relative col-span-1 w-full' : 'absolute -translate-x-1/2 -translate-y-1/2'} flex flex-col items-center group cursor-pointer z-20`}
      role="button"
      tabIndex={0}
      aria-label={`Open ${label} details`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {/* Icon button */}
      <div
        className={`relative flex h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 items-center justify-center border border-white/10 bg-[#080a0b]/80 backdrop-blur-md shadow-2xl transition-all duration-300 group-hover:border-white/30 ${activeConfig.shape}`}
      >
        {/* BG tint fill */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{ backgroundColor: themeColor, borderRadius: 'inherit' }}
        />

        {/* Icon */}
        <div className="z-10 transition-transform duration-300 group-hover:scale-110" style={{ color: themeColor }}>
          {React.cloneElement(icon, { size: 28, className: "md:w-7 md:h-7 lg:w-9 lg:h-9" })}
        </div>

        {/* Outer dashed orbit ring */}
        <div
          className="absolute -inset-3 md:-inset-4 border border-dashed border-white/5 group-hover:border-white/15 animate-spin-slow rounded-full transition-colors duration-700"
          style={{ animationDuration: '20s' }}
        />

        {/* Hydro: sonar sweep */}
        {activeConfig.labelPrefix === 'DEPTH_SEC' && (
          <>
            <motion.div
              className="absolute inset-0 border-r-2 rounded-full"
              style={{ borderColor: `${themeColor}55` }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <div
              className="absolute inset-0 border border-transparent group-hover:scale-125 transition-all duration-500 rounded-full"
              style={{ borderColor: `${themeColor}20` }}
            />
          </>
        )}

        {/* GIS: 4-corner brackets */}
        {activeConfig.labelPrefix === 'LAYER_ID' && (
          <>
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/30 group-hover:border-white/70 transition-colors duration-200" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/30 group-hover:border-white/70 transition-colors duration-200" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/30 group-hover:border-white/70 transition-colors duration-200" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/30 group-hover:border-white/70 transition-colors duration-200" />
          </>
        )}

        {/* Survey: crosshair */}
        {activeConfig.labelPrefix === 'STA_REF' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-35 transition-opacity duration-300 pointer-events-none">
            <div className="w-full h-px bg-white" />
            <div className="h-full w-px bg-white absolute" />
          </div>
        )}

        {/* GEO: precision reticle */}
        {activeConfig.labelPrefix === 'PREC_LVL' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 group-hover:opacity-50 transition-opacity duration-300">
            <div className="w-2 h-2 border border-white/70 rounded-full" />
            <div className="absolute w-8 h-px bg-white/30" />
            <div className="absolute h-8 w-px bg-white/30" />
          </div>
        )}

        {/* Glow halo on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: `0 0 18px ${themeColor}44, 0 0 40px ${themeColor}11`, borderRadius: 'inherit' }}
        />
      </div>

      {/* Label card */}
      <div className={`mt-3 md:mt-4 relative flex flex-col items-center overflow-hidden border border-white/5 group-hover:border-white/20 bg-white/[0.03] group-hover:bg-white/[0.07] px-3 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3.5 backdrop-blur-xl transition-all duration-300 ${useGridLayout ? 'w-full' : 'min-w-[120px] md:min-w-[165px] lg:min-w-[195px]'} ${activeConfig.shape}`}>
        {/* Theme-colored top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: themeColor }}
        />

        <span className="text-[10px] md:text-[13px] lg:text-[14px] font-bold tracking-[0.08em] text-white/75 group-hover:text-white uppercase text-center block w-full transition-colors duration-200">
          {label}
        </span>
        <span className="mt-0.5 font-mono text-[7px] md:text-[9px] font-normal text-white/25 group-hover:text-white/45 tracking-tight transition-colors duration-200">
          {sec}
        </span>

        {/* OPEN indicator — slides in on hover */}
        <div className="flex items-center gap-1 mt-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="font-mono text-[7px] font-bold tracking-[0.2em] uppercase" style={{ color: themeColor }}>
            OPEN
          </span>
          <ArrowRight size={7} style={{ color: themeColor }} />
        </div>
      </div>
    </motion.div>
  );
}

function ContentModal({ id, themeColor, activeConfig, onClose }: ContentModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3');
    audio.volume = 0.1;
    audio.play().catch(() => {});
    onClose();
  };

  useEffect(() => {
    dialogRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 backdrop-blur-xl bg-black/60 cursor-pointer"
    >
      <motion.div 
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-modal-title"
        tabIndex={-1}
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0b0c]/95 border border-white/10 p-5 md:p-12 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] md:pb-12 shadow-2xl cursor-default transition-all duration-500 ${activeConfig.shape}`}
        style={{ 
          borderTop: `6px solid ${themeColor}`,
          boxShadow: `0 0 50px ${themeColor}11`
        }}
      >
        {/* Modal Decorative Elements based on theme */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <activeConfig.icon size={200} />
        </div>
        <button
          type="button"
          aria-label="Close details"
          onClick={handleClose}
          className="absolute top-4 right-4 md:top-5 md:right-5 group/close z-50 flex items-center gap-2 px-2 py-2 md:px-3 rounded-xl border border-white/8 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200"
        >
          <span className="text-[9px] font-mono font-bold text-white/30 group-hover/close:text-white/80 transition-colors hidden md:block tracking-widest">ESC</span>
          <X size={16} className="text-white/35 group-hover/close:text-white transition-all duration-200 group-hover/close:rotate-90" />
        </button>

        {id === 'bio' && (
          <div className="space-y-6 md:space-y-8">
            {/* Profile header */}
            <div className="block md:flex gap-8 items-start">
              <div className="flex-1 order-2 md:order-1">
                {/* Mobile floating image */}
                <div className="md:hidden">
                  <div
                    className="float-right ml-4 mb-4 relative h-20 w-20 border-2 border-white/20 rounded-full overflow-hidden shadow-xl flex-shrink-0"
                    style={{ boxShadow: `0 0 20px ${themeColor}33` }}
                  >
                    <img src={CV_DATA.profile.profileImage} alt="Andhika profile" className="h-full w-full object-cover grayscale brightness-110" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 opacity-20 mix-blend-soft-light" style={{ backgroundColor: themeColor }} />
                  </div>
                </div>

                <div className="mb-2 font-mono text-[8px] md:text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">SUBJECT_IDENTIFIER</div>
                <h2
                  id="content-modal-title"
                  className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight uppercase leading-none"
                  style={{ color: themeColor }}
                >
                  {CV_DATA.profile.name}
                </h2>
                <div className="h-px w-16 md:w-24 mb-5 md:mb-7" style={{ backgroundColor: themeColor }} />
                <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed tracking-tight clear-both md:clear-none max-w-lg">
                  {CV_DATA.profile.summary}
                </p>
              </div>

              {/* Desktop profile card */}
              <div
                className={`hidden md:block relative w-48 lg:w-56 h-64 lg:h-72 flex-shrink-0 border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/25 order-1 md:order-2 ${activeConfig.shape}`}
                style={{ boxShadow: `0 0 30px ${themeColor}18` }}
              >
                <img
                  src={CV_DATA.profile.profileImage}
                  alt="Andhika profile"
                  className="h-full w-full object-cover grayscale brightness-110 hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 opacity-25 mix-blend-soft-light transition-opacity hover:opacity-0" style={{ backgroundColor: themeColor }} />
                <div className="absolute inset-0 scanline-overlay opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                  <div className="h-6 w-px bg-white/10" />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-[7px] font-mono text-white/40 tracking-[0.25em] uppercase mb-0.5">AUTH // ID_VERIFIED</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-white tracking-wider">ANDHIKA P.</span>
                    <div className="h-px w-8" style={{ backgroundColor: themeColor }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {/* Academic record */}
              <div className="rounded-xl p-5 md:p-6 border border-white/8 bg-white/[0.02]" style={{ borderLeft: `3px solid ${themeColor}55` }}>
                <h4 className="font-mono text-[8px] md:text-[9px] text-white/35 mb-4 tracking-[0.35em] flex items-center gap-2 uppercase">
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: themeColor }} />
                  Academic_Record
                </h4>
                {CV_DATA.education.map((edu, i) => (
                  <div key={i} className="space-y-1.5 md:space-y-2">
                    <p className="font-bold text-base md:text-lg leading-tight">{edu.institution}</p>
                    <p className="text-xs md:text-sm font-medium" style={{ color: themeColor }}>{edu.degree}</p>
                    <div className="mt-3 p-3 border border-white/5 bg-black/30 rounded-lg text-[11px] md:text-xs text-white/45 leading-relaxed">
                      {edu.specialization}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comm channels */}
              <div className="rounded-xl p-5 md:p-6 border border-white/8 bg-white/[0.02] flex flex-col gap-3" style={{ borderLeft: `3px solid ${themeColor}33` }}>
                <h4 className="font-mono text-[8px] md:text-[9px] text-white/35 tracking-[0.35em] uppercase">Comm_Channels</h4>
                {[
                  { href: `mailto:${CV_DATA.profile.email}`, icon: <Mail size={15} style={{ color: themeColor }} />, label: CV_DATA.profile.email },
                  { href: CV_DATA.profile.linkedinUrl, icon: <LinkedInIcon size={15} style={{ color: themeColor }} />, label: 'LinkedIn Profile', external: true },
                  { href: CV_DATA.profile.mapsUrl, icon: <MapPin size={15} style={{ color: themeColor }} />, label: CV_DATA.profile.location, external: true },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    className="flex items-center gap-3 text-xs md:text-sm group/link rounded-lg px-3 py-2.5 border border-white/0 hover:border-white/8 hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <div className="p-2 bg-white/[0.04] rounded-lg group-hover/link:bg-white/[0.08] transition-colors flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-white/55 group-hover/link:text-white/90 transition-colors truncate group-hover/link:translate-x-0.5 transform duration-200">
                      {item.label}
                    </span>
                    <ArrowRight size={12} className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" style={{ color: themeColor }} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {id === 'experience' && (
          <div className="space-y-10 md:space-y-14">
            {/* Work History */}
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 pb-4 border-b border-white/8">
                <div>
                  <p className="font-mono text-[8px] md:text-[9px] text-white/25 mb-1 uppercase tracking-[0.3em]">Primary Professional Records</p>
                  <h2 id="content-modal-title" className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: themeColor }}>Work History</h2>
                </div>
                <div className="font-mono text-[8px] text-white/20 tracking-widest whitespace-nowrap bg-white/[0.04] border border-white/8 px-2.5 py-1 rounded-md">
                  TIMELINE_LOG // V.01
                </div>
              </div>

              <div className="space-y-5 md:space-y-7">
                {CV_DATA.experience.map((exp, i) => (
                  <div key={i} className="relative pl-7 md:pl-10 group">
                    {/* Timeline line */}
                    <div
                      className="absolute left-[7px] md:left-[9px] top-5 bottom-[-20px] w-px"
                      style={{ background: `linear-gradient(to bottom, ${themeColor}44, transparent)` }}
                    />
                    {/* Timeline dot */}
                    <div
                      className="absolute left-0 top-1 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-[#080a0b] border-2 transition-all duration-300 group-hover:scale-110 flex items-center justify-center"
                      style={{ borderColor: themeColor }}
                    >
                      <div
                        className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ backgroundColor: themeColor }}
                      />
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 group-hover:border-white/10 rounded-xl p-4 md:p-5 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-base md:text-lg lg:text-xl text-white/80 group-hover:text-white transition-colors leading-tight">{exp.company}</h3>
                          <p className="text-xs md:text-sm font-medium mt-1 leading-snug" style={{ color: themeColor }}>{exp.role}</p>
                        </div>
                        <span
                          className="font-mono text-[8px] md:text-[9px] text-white/35 whitespace-nowrap border border-white/8 px-2.5 py-1 rounded-md w-fit self-start"
                          style={{ borderLeftColor: themeColor, borderLeftWidth: '2px' }}
                        >
                          {exp.period}
                        </span>
                      </div>
                      <ul className="space-y-1.5 md:space-y-2">
                        {exp.points.map((p, j) => (
                          <li key={j} className="text-[11px] md:text-xs text-white/45 flex gap-2.5 leading-relaxed group-hover:text-white/65 transition-colors">
                            <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: themeColor }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leadership */}
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 pb-4 border-b border-white/8">
                <div>
                  <p className="font-mono text-[8px] md:text-[9px] text-white/25 mb-1 uppercase tracking-[0.3em]">Organizational Contribution</p>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: themeColor }}>Leadership</h2>
                </div>
              </div>

              <div className="space-y-5 md:space-y-7">
                {CV_DATA.organizations.map((org, i) => (
                  <div key={i} className="relative pl-7 md:pl-10 group">
                    <div
                      className="absolute left-[7px] md:left-[9px] top-5 bottom-[-20px] w-px"
                      style={{ background: `linear-gradient(to bottom, ${themeColor}33, transparent)` }}
                    />
                    <div
                      className="absolute left-0 top-1 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-[#080a0b] border-2 transition-all duration-300 group-hover:scale-110 flex items-center justify-center"
                      style={{ borderColor: themeColor }}
                    >
                      <div
                        className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ backgroundColor: themeColor }}
                      />
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 group-hover:border-white/10 rounded-xl p-4 md:p-5 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-base md:text-lg lg:text-xl text-white/80 group-hover:text-white transition-colors leading-tight">{org.company}</h3>
                          <p className="text-xs md:text-sm font-medium mt-1" style={{ color: themeColor }}>{org.role}</p>
                        </div>
                        <span
                          className="font-mono text-[8px] md:text-[9px] text-white/35 whitespace-nowrap border border-white/8 px-2.5 py-1 rounded-md w-fit self-start"
                          style={{ borderLeftColor: themeColor, borderLeftWidth: '2px' }}
                        >
                          {org.period}
                        </span>
                      </div>
                      <ul className="space-y-1.5 md:space-y-2">
                        {org.points.map((p, j) => (
                          <li key={j} className="text-[11px] md:text-xs text-white/45 flex gap-2.5 leading-relaxed group-hover:text-white/65 transition-colors">
                            <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: themeColor }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {id === 'projects' && (
          <div className="space-y-6 md:space-y-8">
            <div>
              <p className="font-mono text-[8px] md:text-[9px] text-white/25 mb-1.5 uppercase tracking-[0.3em]">Capabilities & Tools</p>
              <h2 id="content-modal-title" className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: themeColor }}>Tech Stack</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {/* Field experience */}
              <div className="border border-white/8 bg-white/[0.02] rounded-xl p-5 md:p-6" style={{ borderTop: `2px solid ${themeColor}55` }}>
                <div className="flex items-center gap-2 mb-4">
                  <Satellite size={14} style={{ color: themeColor }} />
                  <h3 className="font-mono text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Field_Expertise</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CV_DATA.skills.technical.map((s, i) => (
                    <span
                      key={i}
                      className="text-[10px] md:text-[11px] px-2.5 py-1 md:px-3 md:py-1.5 bg-black/30 border border-white/8 hover:border-white/20 rounded-lg text-white/60 hover:text-white/90 transition-all duration-200 cursor-default"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Software tools */}
              <div className="border border-white/8 bg-white/[0.02] rounded-xl p-5 md:p-6" style={{ borderTop: `2px solid ${themeColor}33` }}>
                <div className="flex items-center gap-2 mb-4">
                  <LayoutDashboard size={14} style={{ color: themeColor }} />
                  <h3 className="font-mono text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">System_Tools</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CV_DATA.skills.tools.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] md:text-[11px] px-2.5 py-1 md:px-3 md:py-1.5 bg-black/30 border rounded-lg font-medium hover:bg-white/[0.04] transition-all duration-200 cursor-default"
                      style={{ borderColor: `${themeColor}44`, color: themeColor }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Research thesis */}
            <div className="border border-white/8 bg-white/[0.02] rounded-xl md:rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   style={{ background: `radial-gradient(ellipse at top right, ${themeColor}08 0%, transparent 70%)` }} />
              <motion.div
                className="absolute top-[-20%] right-[-5%] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              >
                <Layers size={220} />
              </motion.div>

              <div className="relative p-6 md:p-8 lg:p-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                  <span className="font-mono text-[8px] md:text-[9px] text-white/30 tracking-[0.35em] uppercase">Research_Thesis</span>
                </div>
                <h3 className="font-bold text-lg md:text-xl lg:text-2xl mb-3 leading-tight text-white/90">
                  Spatial Information Systems for Disaster Mitigation
                </h3>
                <div className="h-px w-12 mb-4" style={{ backgroundColor: `${themeColor}66` }} />
                <p className="text-xs md:text-sm text-white/45 leading-relaxed italic max-w-xl">
                  {CV_DATA.education[0].thesis}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.28em] text-white/25">
                    <span className="h-px w-8" style={{ backgroundColor: `${themeColor}44` }} />
                    PADIS_WEBGIS
                  </div>
                  <a
                    href={CV_DATA.education[0].thesisUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group/thesis inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                    style={{ boxShadow: `0 0 24px ${themeColor}10` }}
                  >
                    <span>Open System</span>
                    <ExternalLink
                      size={13}
                      className="transition-transform duration-300 group-hover/thesis:translate-x-0.5 group-hover/thesis:-translate-y-0.5"
                      style={{ color: themeColor }}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {id === 'contact' && (
          <div className="space-y-8 md:space-y-10 py-2 md:py-4 text-center">
            <div className="space-y-1 md:space-y-2">
              <p className="font-mono text-[8px] md:text-[9px] text-white/25 tracking-[0.4em] uppercase mb-2">Awaiting_Comm_Link</p>
              <h2 id="content-modal-title" className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight" style={{ color: themeColor }}>Get In Touch</h2>
            </div>

            <div className="flex flex-col items-center gap-8 md:gap-10">
              {/* Animated orbit icon */}
              <div className="relative flex items-center justify-center h-36 w-36 md:h-44 md:w-44">
                <div
                  className="absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow"
                  style={{ borderColor: `${themeColor}33`, animationDuration: '12s' }}
                />
                <div
                  className="absolute inset-3 rounded-full border border-dashed animate-spin-slow"
                  style={{ borderColor: `${themeColor}18`, animationDuration: '20s', animationDirection: 'reverse' }}
                />
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center"
                  style={{ background: `radial-gradient(circle, ${themeColor}12 0%, transparent 70%)` }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Satellite size={52} className="md:w-16 md:h-16" style={{ color: themeColor }} />
                  </motion.div>
                </div>
              </div>

              {/* Contact buttons */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-xs md:max-w-sm">
                {[
                  { icon: <Mail size={22} className="md:w-6 md:h-6" />, label: 'EMAIL', link: `mailto:${CV_DATA.profile.email}` },
                  { icon: <LinkedInIcon size={22} className="md:w-6 md:h-6" />, label: 'LINKED', link: CV_DATA.profile.linkedinUrl, external: true },
                  { icon: <Phone size={22} className="md:w-6 md:h-6" />, label: 'CALL', link: CV_DATA.profile.phoneUrl },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    className="flex flex-col items-center gap-2 md:gap-3 group"
                  >
                    <div
                      className="p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/8 bg-white/[0.03] group-hover:bg-white/[0.07] group-hover:border-white/20 group-hover:scale-105 transition-all duration-300"
                      style={{ color: themeColor }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-[8px] md:text-[10px] font-mono font-bold tracking-[0.15em] md:tracking-[0.25em] text-white/25 group-hover:text-white/80 transition-colors">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>

              <a
                href={CV_DATA.profile.cvUrl}
                download="Andhika_Nugroho_CV_Resume.pdf"
                className="group/cv inline-flex w-full max-w-xs md:max-w-sm items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-white/45 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07] hover:text-white/85"
                style={{ boxShadow: `0 0 28px ${themeColor}10` }}
              >
                <Download
                  size={16}
                  className="transition-transform duration-300 group-hover/cv:translate-y-0.5"
                  style={{ color: themeColor }}
                />
                <span>Download CV Andhika</span>
              </a>

              {/* Status indicator */}
              <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/8 bg-white/[0.02]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <p className="text-white/35 font-mono text-[8px] md:text-[9px] tracking-[0.2em] uppercase">
                  Transmission Stable // No Drop
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
