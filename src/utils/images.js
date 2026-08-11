// Ultra-Fast Zero-Network Category Graphic Theme Manager for ONE MORE
// 0 External HTTP Requests • 0 Network Latency • 0ms Instant Rendering

export const CATEGORY_THEMES = {
  YOUTUBE: {
    accent: '#FF0033',
    bgDark: 'bg-red-950/30',
    border: 'border-[#FF0033]',
    badge: 'bg-[#FF0033] text-white',
    icon: '▶',
  },
  INFLUENCERS: {
    accent: '#EC4899',
    bgDark: 'bg-pink-950/30',
    border: 'border-[#EC4899]',
    badge: 'bg-[#EC4899] text-white',
    icon: '✦',
  },
  MUSIC: {
    accent: '#A855F7',
    bgDark: 'bg-purple-950/30',
    border: 'border-[#A855F7]',
    badge: 'bg-[#A855F7] text-white',
    icon: '🎵',
  },
  COMPANIES: {
    accent: '#00E664',
    bgDark: 'bg-emerald-950/30',
    border: 'border-[#00E664]',
    badge: 'bg-[#00E664] text-black',
    icon: '⚡',
  },
  TECH: {
    accent: '#00E664',
    bgDark: 'bg-emerald-950/30',
    border: 'border-[#00E664]',
    badge: 'bg-[#00E664] text-black',
    icon: '💻',
  },
  MOVIES: {
    accent: '#3B82F6',
    bgDark: 'bg-blue-950/30',
    border: 'border-[#3B82F6]',
    badge: 'bg-[#3B82F6] text-white',
    icon: '🎬',
  },
  GAMING: {
    accent: '#F59E0B',
    bgDark: 'bg-amber-950/30',
    border: 'border-[#F59E0B]',
    badge: 'bg-[#F59E0B] text-black',
    icon: '🎮',
  },
  SPORTS: {
    accent: '#F97316',
    bgDark: 'bg-orange-950/30',
    border: 'border-[#F97316]',
    badge: 'bg-[#F97316] text-white',
    icon: '🏆',
  },
  GEOGRAPHY: {
    accent: '#E2FF00',
    bgDark: 'bg-yellow-950/30',
    border: 'border-[#E2FF00]',
    badge: 'bg-[#E2FF00] text-black',
    icon: '🌍',
  },
  DEFAULT: {
    accent: '#E2FF00',
    bgDark: 'bg-slate-900',
    border: 'border-[#E2FF00]',
    badge: 'bg-[#E2FF00] text-black',
    icon: '🔥',
  },
};

export const getCategoryTheme = (category = '') => {
  const catUpper = category.toUpperCase();
  for (const key of Object.keys(CATEGORY_THEMES)) {
    if (catUpper.includes(key)) {
      return CATEGORY_THEMES[key];
    }
  }
  return CATEGORY_THEMES.DEFAULT;
};

// No-op compatibility stubs
export const getEntityImageSync = () => '';
export const fetchWikipediaImage = async () => null;
export const preloadQuestionImages = () => {};
