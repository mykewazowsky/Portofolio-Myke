import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Compass,
  Layers,
  Monitor,
  Mountain,
  Satellite,
  Signal,
  Waves,
} from 'lucide-react';

export type Theme = 'hydro' | 'gis' | 'land' | 'precision';

export interface ThemeConfig {
  color: string;
  accent: string;
  label: string;
  icon: LucideIcon;
  subtext: string;
  bg: string;
  labelPrefix: string;
  shape: string;
  aesthetic: 'fluid' | 'brutal' | 'rugged' | 'precision';
  sound: string;
  bgSound: string;
  telemetry: {
    label: string;
    value: string;
    icon: LucideIcon;
  }[];
  strengths: {
    title: string;
    description: string;
    points: string[];
    equipment: string;
  };
}

export const THEMES: Record<Theme, ThemeConfig> = {
  hydro: {
    color: '#00ccff',
    accent: '#0066ff',
    label: 'HYDRO',
    icon: Waves,
    subtext: 'Hydrographic Surveyor',
    bg: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&q=80&w=2000',
    labelPrefix: 'DEPTH_SEC',
    shape: 'rounded-2xl',
    aesthetic: 'fluid',
    sound: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    bgSound: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    telemetry: [
      { label: 'BATY', value: '24.5m', icon: Waves },
      { label: 'SONAR', value: '1540m/s', icon: Monitor },
      { label: 'BEAM', value: '200kHz', icon: Activity },
    ],
    strengths: {
      title: 'Adaptive Versatility',
      description: 'Mastery in bathymetric acquisition and sonar interpretation. Navigating complex underwater environments with fluid problem-solving and deep technical insight.',
      points: ['Sub-bottom Profiling', 'Multibeam Acquisition', 'Real-time Data Processing'],
      equipment: 'Kongsberg EM2040 / EdgeTech 4125',
    },
  },
  gis: {
    color: '#ffffff',
    accent: '#333333',
    label: 'GIS',
    icon: Layers,
    subtext: 'GIS Analyst & Modeler',
    bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000',
    labelPrefix: 'LAYER_ID',
    shape: 'tech-clip',
    aesthetic: 'brutal',
    sound: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    bgSound: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    telemetry: [
      { label: 'BAND', value: 'L-BAND', icon: Satellite },
      { label: 'FLUX', value: '1.2GB/s', icon: Monitor },
      { label: 'LYR', value: '1288', icon: Layers },
    ],
    strengths: {
      title: 'Analytical Depth',
      description: 'Architecting complex geospatial databases and topological models. Converting raw spatial data into strategic intelligence through layered logic.',
      points: ['Network Topology', 'Raster Analysis', 'Python Automation'],
      equipment: 'ArcGIS Pro / PostgreSQL-PostGIS',
    },
  },
  land: {
    color: '#ffcc00',
    accent: '#ff6600',
    label: 'SURVEY',
    icon: Mountain,
    subtext: 'Land Surveyor Specialist',
    bg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',
    labelPrefix: 'STA_REF',
    shape: 'rounded-xl',
    aesthetic: 'rugged',
    sound: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3',
    bgSound: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    telemetry: [
      { label: 'H-ACC', value: '0.012m', icon: Signal },
      { label: 'V-ACC', value: '0.018m', icon: Monitor },
      { label: 'DATUM', value: 'WGS84', icon: Mountain },
    ],
    strengths: {
      title: 'Grounded Reliability',
      description: 'Establishing geodetic control in the most demanding terrains. Precision execution through rigorous field procedures and engineering mastery.',
      points: ['Cadastral Mapping', 'Topographic Detail', 'Boundary Recovery'],
      equipment: 'Leica TS16 / Nikon Nivel',
    },
  },
  precision: {
    color: '#00ff88',
    accent: '#006633',
    label: 'GEO',
    icon: Compass,
    subtext: 'Geodetic Engineer',
    bg: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2000',
    labelPrefix: 'PREC_LVL',
    shape: 'rounded-sm',
    aesthetic: 'precision',
    sound: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
    bgSound: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    telemetry: [
      { label: 'ITRF', value: 'ITRF20', icon: Satellite },
      { label: 'REF', value: 'SRGI2013', icon: Signal },
      { label: 'PPM', value: '0.5ppm', icon: Activity },
    ],
    strengths: {
      title: 'Extreme Precision',
      description: 'Pushing the limits of measurement through satellite geodesy and high-frequency sensor fusion. Eliminating error through absolute mathematical rigor.',
      points: ['CORS Management', 'GNSS Post-Processing', 'Deformation Analysis'],
      equipment: 'Trimble R12i / RTK-DGPS',
    },
  },
};
