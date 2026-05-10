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
import { BrandLogo, LinkedInIcon } from './icons';
import { CV_CONTENT, LANGUAGES, UI_COPY, type Language } from './i18n';
import { THEMES, type Theme, type ThemeConfig } from './themes';

type ModalId = 'bio' | 'experience' | 'projects' | 'contact';

interface ControlPoint {
  code: string;
  sheet: string;
  easting: string;
  northing: string;
  z: string;
  datum: string;
  projection: string;
  quality: string;
}

interface LayerRecord {
  code: string;
  label: string;
  symbol: 'point' | 'line' | 'area' | 'grid';
}

interface ProjectGeoRecord {
  label: string;
  value: string;
}

interface MapNodeProps {
  position?: CSSProperties;
  label: string;
  sec: string;
  control: ControlPoint;
  icon: ReactElement<{ size?: number; className?: string }>;
  themeColor: string;
  activeConfig: ThemeConfig;
  onClick: () => void;
  useGridLayout: boolean;
  openLabel: string;
  ariaLabel: string;
  mobileOrder?: number;
}

interface ContentModalProps {
  id: ModalId;
  language: Language;
  themeColor: string;
  activeConfig: ThemeConfig;
  onClose: () => void;
}

const CONTROL_POINTS: Record<ModalId, ControlPoint> = {
  bio: {
    code: 'GCP-001',
    sheet: 'BDG-48S-A01',
    easting: '789432.21',
    northing: '9238812.44',
    z: '+724.6 m',
    datum: 'WGS84',
    projection: 'UTM 48S',
    quality: 'RTK FIX',
  },
  experience: {
    code: 'BM-002',
    sheet: 'BDG-48S-H02',
    easting: '789618.07',
    northing: '9238588.31',
    z: '+719.2 m',
    datum: 'SRGI2013',
    projection: 'UTM 48S',
    quality: 'CONTROL OK',
  },
  projects: {
    code: 'CP-003',
    sheet: 'BDG-48S-D03',
    easting: '789894.55',
    northing: '9239006.72',
    z: '+732.8 m',
    datum: 'WGS84',
    projection: 'EPSG:32748',
    quality: 'LAYER LIVE',
  },
  contact: {
    code: 'COM-004',
    sheet: 'BDG-48S-C04',
    easting: '790112.90',
    northing: '9238751.66',
    z: '+721.0 m',
    datum: 'WGS84',
    projection: 'UTM 48S',
    quality: 'LINK READY',
  },
};

const MAP_LAYERS: Record<Language, LayerRecord[]> = {
  en: [
    { code: 'GCP', label: 'Control points', symbol: 'point' },
    { code: 'TRN', label: 'Survey transect', symbol: 'line' },
    { code: 'CNT', label: 'Contour interval', symbol: 'area' },
    { code: 'GRD', label: 'UTM grid sheet', symbol: 'grid' },
  ],
  id: [
    { code: 'GCP', label: 'Titik kontrol', symbol: 'point' },
    { code: 'TRN', label: 'Jalur survei', symbol: 'line' },
    { code: 'CNT', label: 'Interval kontur', symbol: 'area' },
    { code: 'GRD', label: 'Grid UTM', symbol: 'grid' },
  ],
};

const PROJECT_GEO_RECORDS: Record<Language, ProjectGeoRecord[]> = {
  en: [
    { label: 'METHOD', value: 'WebGIS + spatial model' },
    { label: 'CRS', value: 'WGS84 / UTM 48S' },
    { label: 'DATA', value: 'Flood, drought, crop productivity' },
    { label: 'OUTPUT', value: 'Loss estimation dashboard' },
  ],
  id: [
    { label: 'METODE', value: 'WebGIS + model spasial' },
    { label: 'CRS', value: 'WGS84 / UTM 48S' },
    { label: 'DATA', value: 'Banjir, kekeringan, produktivitas' },
    { label: 'OUTPUT', value: 'Dashboard estimasi kerugian' },
  ],
};

export default function App() {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const useGridLayout = width < 1024;

  const [theme, setThemeState] = useState<Theme>('hydro');
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    return window.localStorage.getItem('portfolio-language') === 'id' ? 'id' : 'en';
  });
  const [activeTab, setActiveTab] = useState<ModalId | null>(null);
  const [telemetryPing, setTelemetryPing] = useState(14);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem('portfolio-intro-dismissed') !== 'true';
  });
  const [skipIntro, setSkipIntro] = useState(false);
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

  const handleEnterPortfolio = () => {
    if (skipIntro) {
      window.localStorage.setItem('portfolio-intro-dismissed', 'true');
    }
    setIsIntroOpen(false);
    setHasInteracted(true);
    playSound('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
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
  const copy = UI_COPY[language];
  const themeCopy = copy.themes[theme];
  const nodeCopy = copy.nodes[theme];

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem('portfolio-language', language);
  }, [language]);

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
      <CartographicOverlay themeColor={activeColor} theme={theme} />
      
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

      <MapFurniture themeColor={activeColor} language={language} />
      <LayerLegend themeColor={activeColor} language={language} />

      <AnimatePresence>
        {isIntroOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="intro-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#080a0b]/76 p-5 backdrop-blur-xl"
          >
            <motion.div
              initial={{ y: 24, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 16, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={`relative w-full max-w-[560px] overflow-hidden border border-white/10 bg-[#0a0b0c]/94 p-6 md:p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.78)] ${activeConfig.shape}`}
              style={{
                borderTop: `4px solid ${activeColor}`,
                boxShadow: `0 30px 80px rgba(0,0,0,0.78), 0 0 56px ${activeColor}14`,
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px opacity-80"
                style={{ background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)` }}
              />
              <div className="absolute right-[-3rem] top-[-3rem] opacity-[0.04]">
                <Compass size={220} />
              </div>

              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035]" style={{ color: activeColor }}>
                <BrandLogo className="h-12 w-12" />
                <div className="absolute inset-[-10px] rounded-[1.35rem] border border-dashed border-white/10 animate-spin-slow" style={{ animationDuration: '18s' }} />
              </div>

              <div className="relative mb-4 flex justify-center">
                <div className="flex gap-1 rounded-xl border border-white/10 bg-black/25 p-1" role="group" aria-label={copy.introLanguageLabel}>
                  {(Object.keys(LANGUAGES) as Language[]).map((lang) => {
                    const isActive = language === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        aria-label={LANGUAGES[lang].ariaLabel}
                        aria-pressed={isActive}
                        onClick={() => setLanguage(lang)}
                        className={`relative min-w-9 rounded-lg px-2.5 py-1.5 font-mono text-[10px] font-black tracking-[0.14em] transition-colors ${
                          isActive ? 'text-[#080a0b]' : 'text-white/35 hover:text-white/75'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="intro-active-language"
                            className="absolute inset-0 rounded-lg"
                            style={{ backgroundColor: activeColor }}
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                          />
                        )}
                        <span className="relative z-10">{LANGUAGES[lang].label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="relative mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.36em] text-white/32">
                {copy.introEyebrow}
              </p>
              <h2 id="intro-title" className="relative text-2xl md:text-4xl font-black uppercase leading-tight tracking-tight" style={{ color: activeColor }}>
                {copy.introTitle}
              </h2>
              <p className="relative mt-2 font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                {copy.introSubtitle}
              </p>
              <p className="relative mx-auto mt-5 max-w-md text-sm md:text-base leading-relaxed text-white/62">
                {copy.introDescription}
              </p>

              <div className="relative mt-7 flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={handleEnterPortfolio}
                  className="group/enter inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-xl px-5 py-3.5 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#080a0b] transition-all duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: activeColor, boxShadow: `0 0 34px ${activeColor}30` }}
                >
                  <span>{copy.introEnter}</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover/enter:translate-x-1" />
                </button>

                <label className="flex cursor-pointer items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35 transition-colors hover:text-white/65">
                  <input
                    type="checkbox"
                    checked={skipIntro}
                    onChange={(event) => setSkipIntro(event.target.checked)}
                    className="h-3.5 w-3.5 accent-current"
                    style={{ color: activeColor }}
                  />
                  {copy.introSkip}
                </label>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header ref={headerRef} className="fixed top-0 z-50 flex w-full flex-col gap-2.5 p-3.5 md:p-5 md:flex-row md:items-center md:justify-between lg:px-8 lg:py-5 pointer-events-none">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col items-start pointer-events-auto"
        >
          <div className="flex items-center gap-3 md:gap-3.5 lg:gap-4 flex-row justify-start">
            <motion.div
              key={theme}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="p-2 md:p-2.5 lg:p-3 xl:p-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden group"
              style={{ color: activeColor }}
            >
              <BrandLogo className="relative z-10 h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14" />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <h1
              className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl uppercase"
              style={{ color: activeColor, textShadow: `0 0 35px ${activeColor}33`, fontWeight: 700 }}
            >
              {copy.hello}
            </h1>
          </div>
          <div className="mt-1 flex items-center gap-1.5 md:gap-2.5 font-mono text-[8px] md:text-[10px] font-medium tracking-[0.2em] md:tracking-[0.34em] text-white/40">
            <div className="h-1 w-1 rounded-full animate-pulse shadow-lg" style={{ backgroundColor: activeColor, boxShadow: `0 0 8px ${activeColor}` }} />
            {themeCopy.subtext.toUpperCase()}
          </div>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 md:gap-2 self-center pointer-events-auto">
          <button 
            type="button"
            aria-label={isMuted ? copy.soundOffAria : copy.soundOnAria}
            aria-pressed={!isMuted}
            onClick={() => {
              setIsMuted(!isMuted);
              if (!hasInteracted) setHasInteracted(true);
              playSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
            }}
            className="p-2 md:p-2.5 bg-[#0a0b0c]/80 backdrop-blur-3xl border border-white/10 rounded-xl text-white/40 hover:text-white hover:border-white/20 transition-all shadow-xl"
            style={{ color: isMuted ? undefined : activeColor }}
          >
            {isMuted ? <VolumeX size={16} className="md:h-[18px] md:w-[18px]" /> : <Volume2 size={16} className="md:h-[18px] md:w-[18px]" />}
          </button>

          <div className="relative flex gap-1 p-1 bg-[#0a0b0c]/80 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl" role="group" aria-label="Language selector">
            {(Object.keys(LANGUAGES) as Language[]).map((lang) => {
              const isActive = language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  aria-label={LANGUAGES[lang].ariaLabel}
                  aria-pressed={isActive}
                  onClick={() => {
                    setLanguage(lang);
                    if (!hasInteracted) setHasInteracted(true);
                    playSound('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
                  }}
                  className={`relative z-10 min-w-8 md:min-w-9 rounded-lg px-2 py-2 md:px-2.5 md:py-2.5 font-mono text-[9px] md:text-[10px] font-black tracking-[0.12em] transition-all ${
                    isActive ? 'text-[#080a0b]' : 'text-white/35 hover:bg-white/5 hover:text-white/75'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-language"
                      className="absolute inset-0 rounded-lg"
                      style={{ backgroundColor: activeColor }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                    />
                  )}
                  <span className="relative z-10">{LANGUAGES[lang].label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative flex gap-1 p-1 bg-[#0a0b0c]/80 backdrop-blur-3xl border border-white/10 rounded-xl overflow-x-auto max-w-[48vw] sm:max-w-[58vw] md:max-w-full shadow-2xl scrollbar-hide">
            {(Object.keys(THEMES) as Theme[]).map((t) => {
            const Icon = THEMES[t].icon;
            const isActive = theme === t;
            return (
              <button
                key={t}
                type="button"
                aria-label={copy.switchThemeAria(THEMES[t].label)}
                aria-pressed={isActive}
                onClick={() => setTheme(t)}
                className={`relative flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-2 md:px-6 lg:px-7 xl:px-8 py-2 md:py-2.5 font-mono text-[9px] md:text-[10px] lg:text-[11px] font-bold tracking-[0.05em] md:tracking-[0.12em] transition-all rounded-lg whitespace-nowrap z-10 min-w-0 flex-shrink ${
                  isActive 
                    ? 'text-[#080a0b]' 
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 rounded-lg shadow-xl"
                    style={{ backgroundColor: activeColor }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon 
                  size={isMobile ? 14 : 10} 
                  className="md:h-[15px] md:w-[15px] relative z-20"
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
            aria-label={isStrengthsOpen ? copy.strengthsCloseAria : copy.strengthsOpenAria}
            aria-expanded={isStrengthsOpen}
            onClick={() => setIsStrengthsOpen(!isStrengthsOpen)}
            className="lg:hidden p-2 md:p-2.5 bg-[#0a0b0c]/80 backdrop-blur-3xl border border-white/10 rounded-xl text-white/40 hover:text-white hover:border-white/20 transition-all shadow-xl"
            style={{ color: isStrengthsOpen ? activeColor : undefined }}
          >
            <Info size={16} className="md:h-[18px] md:w-[18px]" />
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
              <div className="flex h-full w-full items-center justify-center bg-[#080a0b]/80" style={{ color: activeColor }}>
                <BrandLogo className="h-4 w-4" />
              </div>
            </div>
            <span className="text-[8px] font-bold tracking-widest text-white/60">ANDHIKA</span>
            <div className="h-3 w-[1px] bg-white/10" />
            <span className="text-[8px] font-mono text-white/30 truncate max-w-[100px]">{CV_DATA.profile.coordinates}</span>
          </motion.div>
        </div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden md:flex flex-col items-end gap-2.5 pointer-events-auto"
        >
          <div className="flex items-center gap-3 mb-1.5 group">
            <div className="flex flex-col items-end">
              <div className="text-[10px] font-black tracking-widest text-white/80 group-hover:text-white transition-colors">ANDHIKA PRASETYA</div>
              <div className="text-[8px] font-mono font-medium text-white/20 group-hover:text-white/40 transition-colors">{copy.identityStatus}</div>
            </div>
            <div className={`relative h-12 w-12 border border-white/20 bg-white/5 overflow-hidden transition-all duration-500 group-hover:border-white/40 group-hover:scale-105 shadow-2xl ${activeConfig.shape}`}
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
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-white/40" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-white/40" />
            </div>
          </div>
          <div className={`border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.18em] text-white/80 backdrop-blur-md shadow-2xl ${activeConfig.shape}`}>
            {CV_DATA.profile.coordinates}
          </div>
          <div className="flex items-center gap-2 font-mono text-[8px] text-white/30 tracking-[0.18em]">
            <span className="w-1 h-1 rounded-full bg-blue-400 animate-ping" />
            {copy.systemReady}
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
              d="M 24 42 L 38 61 L 57 34 L 74 54"
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
              d="M 24 42 L 38 61 L 57 34 L 74 54"
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
                path="M 24 42 L 38 61 L 57 34 L 74 54"
              />
            </motion.circle>
            <motion.circle r="0.3" fill={activeColor}>
              <animateMotion 
                dur="6s" 
                begin="3s"
                repeatCount="indefinite" 
                path="M 24 42 L 38 61 L 57 34 L 74 54"
              />
            </motion.circle>
          </svg>
        )}

        <div className={`relative h-full w-full max-w-[1400px] mx-auto ${useGridLayout ? 'flex items-start justify-center overflow-y-auto overflow-x-hidden' : ''}`}>
          <div className={useGridLayout ? `grid grid-cols-2 gap-x-4 gap-y-6 md:gap-8 w-full px-4 md:max-w-lg mx-auto pb-28 ${isTablet && !isMobile ? 'pt-8' : ''}` : "relative h-full w-full"}>
            <MapNode 
              position={useGridLayout ? undefined : { top: '42%', left: 'clamp(190px, 24%, 310px)' }}
              label={nodeCopy.bio}
              sec={`${activeConfig.labelPrefix}.01 // BIO`}
              control={CONTROL_POINTS.bio}
              icon={<MapPin size={28} />}
              themeColor={activeColor}
              activeConfig={activeConfig}
              onClick={() => handleOpenTab('bio')}
              useGridLayout={useGridLayout}
              openLabel={copy.open}
              ariaLabel={copy.openNodeAria(nodeCopy.bio)}
              mobileOrder={1}
            />

            <MapNode 
              position={useGridLayout ? undefined : { top: '61%', left: '38%' }}
              label={nodeCopy.history}
              sec={`${activeConfig.labelPrefix}.02 // HIST`}
              control={CONTROL_POINTS.experience}
              icon={<History size={28} />}
              themeColor={activeColor}
              activeConfig={activeConfig}
              onClick={() => handleOpenTab('experience')}
              useGridLayout={useGridLayout}
              openLabel={copy.open}
              ariaLabel={copy.openNodeAria(nodeCopy.history)}
              mobileOrder={2}
            />

            <MapNode 
              position={useGridLayout ? undefined : { top: '34%', left: '57%' }}
              label={nodeCopy.data}
              sec={`${activeConfig.labelPrefix}.03 // DATA`}
              control={CONTROL_POINTS.projects}
              icon={<LayoutDashboard size={28} />}
              themeColor={activeColor}
              activeConfig={activeConfig}
              onClick={() => handleOpenTab('projects')}
              useGridLayout={useGridLayout}
              openLabel={copy.open}
              ariaLabel={copy.openNodeAria(nodeCopy.data)}
              mobileOrder={3}
            />

            <MapNode 
              position={useGridLayout ? undefined : { top: '54%', left: 'clamp(70%, 74%, calc(100% - 180px))' }}
              label={nodeCopy.contact}
              sec={`${activeConfig.labelPrefix}.04 // COMM`}
              control={CONTROL_POINTS.contact}
              icon={<Satellite size={28} />}
              themeColor={activeColor}
              activeConfig={activeConfig}
              onClick={() => handleOpenTab('contact')}
              useGridLayout={useGridLayout}
              openLabel={copy.open}
              ariaLabel={copy.openNodeAria(nodeCopy.contact)}
              mobileOrder={4}
            />
          </div>
        </div>
      </main>

      {/* Dynamic Strength Indicator - Fixed on desktop (lg+), Bottom sheet on (<lg) */}
      <div className="fixed bottom-6 right-6 xl:bottom-8 xl:right-8 z-40 hidden lg:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme + '-strength-desktop'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`relative w-56 xl:w-60 overflow-hidden border border-white/10 bg-[#0a0b0c]/92 p-3 xl:p-3.5 shadow-[0_18px_44px_rgba(0,0,0,0.76)] backdrop-blur-3xl ${activeConfig.shape}`}
            style={{
              borderRight: `3px solid ${activeColor}`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.72), 0 0 32px ${activeColor}12`,
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-px opacity-70"
              style={{ background: `linear-gradient(90deg, transparent, ${activeColor}99, transparent)` }}
            />
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <div>
                <div className="font-mono text-[7px] font-bold tracking-[0.24em] text-white/35 uppercase">{copy.coreAdvantage}</div>
                <h3 className="mt-1 text-sm xl:text-[15px] font-black tracking-tight uppercase leading-tight" style={{ color: activeColor }}>
                  {themeCopy.strengths.title}
                </h3>
              </div>
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035]"
                style={{ color: activeColor, boxShadow: `inset 0 0 18px ${activeColor}0f` }}
              >
                <BrandLogo className="h-4 w-4" />
              </div>
            </div>

            <p className="text-[9px] xl:text-[10px] text-white/50 mb-3 leading-relaxed font-medium">{themeCopy.strengths.description}</p>

            <div className="grid gap-1">
              {themeCopy.strengths.points.map((pt, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border border-white/[0.04] bg-white/[0.025] px-2 py-1.5">
                  <div className="h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: activeColor }} />
                  <span className="text-[7px] xl:text-[8px] font-mono font-bold text-white/65 tracking-[0.12em] uppercase leading-tight">{pt}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10">
              <div className="text-[7px] font-mono text-white/30 tracking-[0.18em] mb-1">{copy.equipmentStack}</div>
              <div className="text-[8px] xl:text-[9px] font-bold text-white/60 tracking-tight leading-snug">{themeCopy.strengths.equipment}</div>
            </div>
            
            <div className="mt-3 flex justify-between items-center opacity-20">
              <div className="h-[1px] flex-1 bg-white" />
              <span className="mx-2 font-mono text-[7px]">V.04_SEC_AUTO</span>
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
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden rounded-t-3xl bg-[#0a0b0c]/98 border-t-4 p-5 pb-8 backdrop-blur-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
            style={{ borderColor: activeColor }}
          >
            <div className="flex justify-center mb-5">
              <div className="w-12 h-1.5 bg-white/10 rounded-full" onClick={() => setIsStrengthsOpen(false)} />
            </div>
            
            <div className="mb-1.5 font-mono text-[9px] font-bold tracking-[0.26em] text-white/40 uppercase">{copy.coreAdvantage}</div>
            <h3 className="text-xl font-black mb-2 tracking-tight uppercase" style={{ color: activeColor }}>{themeCopy.strengths.title}</h3>
            <p className="text-[11px] text-white/50 mb-5 leading-relaxed font-medium">{themeCopy.strengths.description}</p>

            <div className="space-y-2.5">
              {themeCopy.strengths.points.map((pt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-[1px] bg-current" style={{ color: activeColor }} />
                  <span className="text-[10px] font-mono font-bold text-white/70 tracking-widest uppercase">{pt}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-3 border-t border-white/10">
              <div className="text-[8px] font-mono text-white/30 tracking-[0.18em] mb-1">{copy.equipmentStack}</div>
              <div className="text-[10px] font-bold text-white/60 tracking-tight">{themeCopy.strengths.equipment}</div>
            </div>
            
            <button 
              type="button"
              onClick={() => setIsStrengthsOpen(false)}
              className="mt-6 w-full py-3.5 rounded-xl border border-white/10 bg-white/5 font-mono text-[9px] font-bold tracking-[0.26em] text-white/40 uppercase"
            >
              {copy.closeDetails}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Telemetry Fixed Panel - Responsive width and padding */}
      <div className="fixed bottom-5 left-5 z-40 max-w-[calc(100%-2.5rem)] md:bottom-8 md:left-8 md:w-56 lg:bottom-7 lg:left-8 lg:w-56">
        <div 
          className={`glass-panel p-3 md:p-3.5 backdrop-blur-2xl shadow-[0_18px_42px_rgba(0,0,0,0.76)] transition-all duration-500 max-w-[174px] md:max-w-none lg:w-52 lg:max-w-none ${activeConfig.shape} ${theme === 'gis' ? 'bg-white/5' : 'bg-[#0a0b0c]/80'}`}
          style={{ 
            borderLeft: `4px solid ${activeColor}`,
            boxShadow: `0 0 40px ${activeColor}11`
          }}
        >
          <div className="mb-2 md:mb-2.5 flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] md:tracking-[0.24em] font-bold text-white/40 uppercase truncate mr-2">SYS_LINK // ACTIVE</span>
            <div className="flex gap-0.5 md:gap-1 items-end h-2 md:h-2.5 flex-shrink-0">
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
          <div className="grid grid-cols-1 gap-1.5 md:gap-2.5 font-mono text-[9px] md:text-[10px] tracking-tighter">
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
            language={language}
            themeColor={activeColor} 
            activeConfig={activeConfig}
            onClose={() => setActiveTab(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CartographicOverlay({ themeColor, theme }: { themeColor: string; theme: Theme }) {
  const lineOpacity = theme === 'gis' ? 0.16 : theme === 'land' ? 0.14 : 0.12;

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <div
        className="absolute inset-0 map-sheet-grid opacity-70"
        style={{ color: themeColor }}
      />
      <div
        className="absolute inset-0 map-contour-texture mix-blend-screen"
        style={{ color: themeColor, opacity: lineOpacity }}
      />
      <div className="absolute inset-x-0 top-0 flex justify-between px-8 pt-2 font-mono text-[8px] tracking-[0.22em] text-white/18">
        {['E789000', 'E789500', 'E790000', 'E790500'].map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 hidden flex-col justify-around py-28 pl-2 font-mono text-[8px] tracking-[0.18em] text-white/18 lg:flex">
        {['N9239500', 'N9239000', 'N9238500'].map((tick) => (
          <span key={tick} className="-rotate-90 origin-left whitespace-nowrap">{tick}</span>
        ))}
      </div>
      <div className="absolute bottom-28 right-[18%] hidden items-center gap-2 font-mono text-[8px] uppercase tracking-[0.28em] text-white/18 lg:flex">
        <span className="h-px w-10" style={{ backgroundColor: `${themeColor}66` }} />
        MAP SERIES // GEOMATIC_CONTROL
      </div>
    </div>
  );
}

function MapFurniture({ themeColor, language }: { themeColor: string; language: Language }) {
  const copy = UI_COPY[language];

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div className="absolute left-10 top-[42%] hidden font-mono text-[8px] tracking-[0.26em] text-white/22 lg:block">
        <div className="mb-1">DATUM // WGS84</div>
        <div>PROJ // UTM 48S</div>
      </div>

      <div className="absolute right-10 top-[31%] hidden flex-col items-center gap-2 lg:flex">
        <div className="relative h-16 w-16 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm">
          <Compass size={42} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: themeColor }} strokeWidth={1.4} />
          <div className="absolute left-1/2 top-1 h-2 w-px -translate-x-1/2 bg-white/30" />
        </div>
        <div className="font-mono text-[8px] font-bold tracking-[0.24em] text-white/28">TRUE NORTH</div>
      </div>

      <div className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="flex items-end gap-1 font-mono text-[8px] text-white/30">
          <span>0</span>
          <div className="mb-1 flex h-2 w-40 border border-white/20">
            <div className="h-full flex-1" style={{ backgroundColor: themeColor }} />
            <div className="h-full flex-1 bg-white/8" />
            <div className="h-full flex-1" style={{ backgroundColor: themeColor }} />
            <div className="h-full flex-1 bg-white/8" />
          </div>
          <span>500 m</span>
        </div>
        <div className="mt-1 text-center font-mono text-[8px] tracking-[0.26em] text-white/20">SCALE 1:5000</div>
      </div>

      <div className="absolute bottom-[6.5rem] right-4 flex w-36 flex-col gap-2 rounded-xl border border-white/10 bg-[#07090a]/82 p-3 font-mono shadow-[0_18px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-between">
          <div className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/28">{copy.mobileMapStatus}</div>
          <Compass size={15} style={{ color: themeColor }} />
        </div>
        <div className="flex items-end gap-1 text-[7px] text-white/32">
          <span>0</span>
          <div className="mb-0.5 flex h-1.5 flex-1 border border-white/16">
            <div className="h-full flex-1" style={{ backgroundColor: themeColor }} />
            <div className="h-full flex-1 bg-white/8" />
            <div className="h-full flex-1" style={{ backgroundColor: themeColor }} />
          </div>
          <span>250m</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[7px] uppercase tracking-[0.14em] text-white/24">
          <span>WGS84</span>
          <span className="text-right" style={{ color: themeColor }}>UTM48S</span>
        </div>
      </div>
    </div>
  );
}

function LayerLegend({ themeColor, language }: { themeColor: string; language: Language }) {
  const copy = UI_COPY[language];
  const layers = MAP_LAYERS[language];

  return (
    <div className="pointer-events-none fixed left-8 top-[11.5rem] z-30 hidden w-52 border border-white/10 bg-[#07090a]/72 p-3 font-mono shadow-[0_18px_46px_rgba(0,0,0,0.62)] backdrop-blur-2xl lg:block xl:top-[12rem]">
      <div className="mb-2.5 flex items-center justify-between border-b border-white/8 pb-2">
        <span className="text-[7px] font-black uppercase tracking-[0.24em] text-white/34">{copy.layerLegend}</span>
        <span className="text-[8px] font-bold" style={{ color: themeColor }}>L04</span>
      </div>
      <div className="space-y-1.5">
        {layers.map((layer) => (
          <div key={layer.code} className="grid grid-cols-[1.4rem_auto_1fr] items-center gap-2 text-[7px] uppercase tracking-[0.14em] text-white/38">
            <LayerSymbol type={layer.symbol} color={themeColor} />
            <span className="font-bold" style={{ color: themeColor }}>{layer.code}</span>
            <span className="truncate">{layer.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-2 border-t border-white/8 pt-2 text-[7px] uppercase tracking-[0.2em] text-white/18">
        <span className="h-px flex-1" style={{ backgroundColor: `${themeColor}55` }} />
        EPSG:32748
      </div>
    </div>
  );
}

function LayerSymbol({ type, color }: { type: LayerRecord['symbol']; color: string }) {
  if (type === 'point') {
    return <span className="mx-auto h-2 w-2 rounded-full border" style={{ borderColor: color, boxShadow: `0 0 12px ${color}66` }} />;
  }

  if (type === 'line') {
    return <span className="h-px w-6 border-t border-dashed" style={{ borderColor: color }} />;
  }

  if (type === 'area') {
    return <span className="h-3 w-6 border border-white/12 bg-white/[0.035]" style={{ borderTopColor: color }} />;
  }

  return (
    <span
      className="h-3 w-6 border border-white/12 opacity-80"
      style={{
        backgroundImage: `linear-gradient(to right, ${color}66 1px, transparent 1px), linear-gradient(to bottom, ${color}66 1px, transparent 1px)`,
        backgroundSize: '6px 6px',
      }}
    />
  );
}

function MapNode({ position, label, sec, control, icon, themeColor, activeConfig, onClick, useGridLayout, openLabel, ariaLabel }: MapNodeProps) {
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
      aria-label={ariaLabel}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {/* Icon button */}
      <div
        className={`relative flex h-[3.75rem] w-[3.75rem] md:h-20 md:w-20 lg:h-[5.5rem] lg:w-[5.5rem] xl:h-24 xl:w-24 items-center justify-center border border-white/10 bg-[#080a0b]/80 backdrop-blur-md shadow-2xl transition-all duration-300 group-hover:border-white/30 ${activeConfig.shape}`}
      >
        <div className="absolute -top-2 left-1/2 z-20 -translate-x-1/2 rounded border border-white/10 bg-[#080a0b]/90 px-1.5 py-0.5 font-mono text-[7px] font-bold tracking-[0.18em] text-white/36">
          {control.code}
        </div>

        {/* BG tint fill */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{ backgroundColor: themeColor, borderRadius: 'inherit' }}
        />

        {/* Icon */}
        <div className="z-10 transition-transform duration-300 group-hover:scale-110" style={{ color: themeColor }}>
          {React.cloneElement(icon, { size: 28, className: "md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9" })}
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
      <div className={`mt-3 md:mt-4 relative flex min-h-[52px] md:min-h-[64px] lg:min-h-[58px] xl:min-h-[64px] flex-col items-center justify-center overflow-hidden border border-white/5 group-hover:border-white/20 bg-white/[0.03] group-hover:bg-white/[0.07] px-3 md:px-6 lg:px-6 xl:px-8 py-2 md:py-3 lg:py-3 xl:py-3.5 backdrop-blur-xl transition-all duration-300 ${useGridLayout ? 'w-full' : 'min-w-[120px] md:min-w-[165px] lg:min-w-[175px] xl:min-w-[195px]'} ${activeConfig.shape}`}>
        {/* Theme-colored top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: themeColor }}
        />

        <span className="text-[10px] md:text-[13px] lg:text-[13px] xl:text-[14px] font-bold tracking-[0.08em] text-white/75 group-hover:text-white uppercase text-center block w-full leading-tight transition-colors duration-200">
          {label}
        </span>
        <span className="mt-1 font-mono text-[7px] md:text-[9px] font-normal text-white/25 group-hover:text-white/45 tracking-tight transition-colors duration-200">
          {sec}
        </span>
        <span className="mt-1 hidden font-mono text-[7px] font-bold tracking-[0.16em] transition-colors duration-200 md:block" style={{ color: themeColor }}>
          {control.quality}
        </span>

        {/* OPEN indicator — slides in on hover */}
        <div className="flex items-center gap-1 mt-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="font-mono text-[7px] font-bold tracking-[0.2em] uppercase" style={{ color: themeColor }}>
            {openLabel}
          </span>
          <ArrowRight size={7} style={{ color: themeColor }} />
        </div>
      </div>

      <div className={`pointer-events-none absolute ${useGridLayout ? 'hidden' : 'block'} left-1/2 top-full mt-3 w-52 -translate-x-1/2 border border-white/8 bg-[#07090a]/88 p-3 font-mono text-[8px] tracking-[0.14em] text-white/35 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:translate-y-1 group-hover:opacity-100 ${activeConfig.shape}`}>
        <div className="mb-2 flex items-center justify-between">
          <span style={{ color: themeColor }}>{control.projection}</span>
          <span>{control.datum}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <span className="text-white/18">E</span>
          <span>{control.easting}</span>
          <span className="text-white/18">N</span>
          <span>{control.northing}</span>
          <span className="text-white/18">Z</span>
          <span>{control.z}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ContentModal({ id, language, themeColor, activeConfig, onClose }: ContentModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const copy = UI_COPY[language];
  const cv = CV_CONTENT[language];
  const control = CONTROL_POINTS[id];
  const projectGeoRecords = PROJECT_GEO_RECORDS[language];

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
        <div className="mb-5 border-b border-white/8 pb-4 font-mono">
          <div className="mb-2 flex items-center justify-between gap-3 text-[8px] uppercase tracking-[0.22em] text-white/24 md:text-[9px]">
            <span>{copy.modalMapIndex}</span>
            <span style={{ color: themeColor }}>{control.code}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[8px] uppercase tracking-[0.18em] text-white/28 md:grid-cols-4 md:text-[9px]">
            {[
              ['SHEET', control.sheet],
              ['DATUM', control.datum],
              ['PROJ', control.projection],
              ['QC', control.quality],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/[0.04] bg-white/[0.02] px-2.5 py-2">
                <div className="mb-1 text-white/18">{label}</div>
                <div className="font-bold" style={{ color: themeColor }}>{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-[8px] uppercase tracking-[0.16em] text-white/24">
            {[
              ['E', control.easting],
              ['N', control.northing],
              ['Z', control.z],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-md border border-white/[0.04] bg-black/20 px-2.5 py-1.5">
                <span>{label}</span>
                <span className="font-bold text-white/42">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          aria-label={copy.modalCloseAria}
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

                <div className="mb-2 font-mono text-[8px] md:text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">{copy.subjectIdentifier}</div>
                <h2
                  id="content-modal-title"
                  className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight uppercase leading-none"
                  style={{ color: themeColor }}
                >
                  {CV_DATA.profile.name}
                </h2>
                <div className="h-px w-16 md:w-24 mb-5 md:mb-7" style={{ backgroundColor: themeColor }} />
                <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed tracking-tight clear-both md:clear-none max-w-lg">
                  {cv.profile.summary}
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
                  <div className="text-[7px] font-mono text-white/40 tracking-[0.25em] uppercase mb-0.5">{copy.authVerified}</div>
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
                  {copy.academicRecord}
                </h4>
                {cv.education.map((edu, i) => (
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
                <h4 className="font-mono text-[8px] md:text-[9px] text-white/35 tracking-[0.35em] uppercase">{copy.commChannels}</h4>
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
                  <p className="font-mono text-[8px] md:text-[9px] text-white/25 mb-1 uppercase tracking-[0.3em]">{copy.workHistoryEyebrow}</p>
                  <h2 id="content-modal-title" className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: themeColor }}>{copy.workHistoryTitle}</h2>
                </div>
                <div className="font-mono text-[8px] text-white/20 tracking-widest whitespace-nowrap bg-white/[0.04] border border-white/8 px-2.5 py-1 rounded-md">
                  TIMELINE_LOG // V.01
                </div>
              </div>

              <div className="space-y-5 md:space-y-7">
                {cv.experience.map((exp, i) => (
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
                  <p className="font-mono text-[8px] md:text-[9px] text-white/25 mb-1 uppercase tracking-[0.3em]">{copy.leadershipEyebrow}</p>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: themeColor }}>{copy.leadershipTitle}</h2>
                </div>
              </div>

              <div className="space-y-5 md:space-y-7">
                {cv.organizations.map((org, i) => (
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
              <p className="font-mono text-[8px] md:text-[9px] text-white/25 mb-1.5 uppercase tracking-[0.3em]">{copy.techStackEyebrow}</p>
              <h2 id="content-modal-title" className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: themeColor }}>{copy.techStackTitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {/* Field experience */}
              <div className="border border-white/8 bg-white/[0.02] rounded-xl p-5 md:p-6" style={{ borderTop: `2px solid ${themeColor}55` }}>
                <div className="flex items-center gap-2 mb-4">
                  <Satellite size={14} style={{ color: themeColor }} />
                  <h3 className="font-mono text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">{copy.fieldExpertise}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.technical.map((s, i) => (
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
                  <h3 className="font-mono text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">{copy.systemTools}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.tools.map((t, i) => (
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
                  <span className="font-mono text-[8px] md:text-[9px] text-white/30 tracking-[0.35em] uppercase">{copy.researchThesis}</span>
                </div>
                <h3 className="font-bold text-lg md:text-xl lg:text-2xl mb-3 leading-tight text-white/90">
                  {copy.researchTitle}
                </h3>
                <div className="h-px w-12 mb-4" style={{ backgroundColor: `${themeColor}66` }} />
                <p className="text-xs md:text-sm text-white/45 leading-relaxed italic max-w-xl">
                  {cv.education[0].thesis}
                </p>
                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {projectGeoRecords.map((record) => (
                    <div key={record.label} className="rounded-lg border border-white/[0.055] bg-black/24 px-3 py-2.5">
                      <div className="mb-1 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/22">
                        {record.label}
                      </div>
                      <div className="text-[11px] font-semibold leading-snug text-white/62">
                        {record.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.28em] text-white/25">
                    <span className="h-px w-8" style={{ backgroundColor: `${themeColor}44` }} />
                    {copy.researchMetadata} // PADIS_WEBGIS
                  </div>
                  <a
                    href={CV_DATA.education[0].thesisUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group/thesis inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                    style={{ boxShadow: `0 0 24px ${themeColor}10` }}
                  >
                    <span>{copy.openSystem}</span>
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
          <div className="space-y-6 md:space-y-8 py-2 md:py-3 text-center">
            <div className="space-y-1 md:space-y-2">
              <p className="font-mono text-[8px] md:text-[9px] text-white/25 tracking-[0.4em] uppercase mb-2">{copy.contactEyebrow}</p>
              <h2 id="content-modal-title" className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight" style={{ color: themeColor }}>{copy.contactTitle}</h2>
            </div>

            <div className="flex flex-col items-center gap-6 md:gap-8">
              {/* Animated orbit icon */}
              <div className="relative flex items-center justify-center h-32 w-32 md:h-40 md:w-40">
                <div
                  className="absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow"
                  style={{ borderColor: `${themeColor}33`, animationDuration: '12s' }}
                />
                <div
                  className="absolute inset-3 rounded-full border border-dashed animate-spin-slow"
                  style={{ borderColor: `${themeColor}18`, animationDuration: '20s', animationDirection: 'reverse' }}
                />
                <div
                  className="h-[5.5rem] w-[5.5rem] md:h-28 md:w-28 rounded-full flex items-center justify-center"
                  style={{ background: `radial-gradient(circle, ${themeColor}12 0%, transparent 70%)` }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <BrandLogo className="h-12 w-12 md:h-16 md:w-16" style={{ color: themeColor }} />
                  </motion.div>
                </div>
              </div>

              {/* Contact buttons */}
              <div className="grid grid-cols-3 gap-3 md:gap-6 w-full max-w-xs md:max-w-sm">
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
                      className="p-3.5 md:p-5 rounded-xl md:rounded-2xl border border-white/8 bg-white/[0.03] group-hover:bg-white/[0.07] group-hover:border-white/20 group-hover:scale-105 transition-all duration-300"
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
                className="group/cv inline-flex w-full max-w-xs md:max-w-sm items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 md:py-4 font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.22em] md:tracking-[0.25em] text-white/45 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07] hover:text-white/85"
                style={{ boxShadow: `0 0 28px ${themeColor}10` }}
              >
                <Download
                  size={16}
                  className="transition-transform duration-300 group-hover/cv:translate-y-0.5"
                  style={{ color: themeColor }}
                />
                <span>{copy.downloadCv}</span>
              </a>

              {/* Status indicator */}
              <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/8 bg-white/[0.02]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <p className="text-white/35 font-mono text-[8px] md:text-[9px] tracking-[0.2em] uppercase">
                  {copy.transmission}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
