export interface PixelScene {
  id: string;
  name: string;
  nameFa: string;
  tagline: string;
  description: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    text: string;
  };
  ambientAudioName?: string;
  category: 'fantasy' | 'urban' | 'nature' | 'sci-fi' | 'cozy';
}

export const PIXEL_SCENES: PixelScene[] = [
  {
    id: 'wanderer',
    name: 'The Ancient Wanderer',
    nameFa: 'سرگردان کهن و ماه',
    tagline: 'Solitary nomad across ancient sands',
    description: 'A masked pilgrim bearing a crescent moon spear, patterned nomad robes, and sacred red ribbons.',
    palette: {
      primary: '#3B3247',
      secondary: '#0D9488',
      accent: '#F43F5E',
      bg: '#ECE5D8',
      text: '#2A231C',
    },
    category: 'fantasy',
  },
  {
    id: 'ramen-shop',
    name: 'Daytime Ramen & Cyber Shop',
    nameFa: 'کیوسک نئونی و رامن روز',
    tagline: 'Bustling pastel storefront with sizzling broths',
    description: 'A pastel cyan & magenta street stall with awning, glowing signs, AC compressor, and street signs.',
    palette: {
      primary: '#38BDF8',
      secondary: '#F472B6',
      accent: '#FDE047',
      bg: '#E0F2FE',
      text: '#1E293B',
    },
    category: 'urban',
  },
  {
    id: 'cyberpunk-rain',
    name: 'Midnight Rain Alley',
    nameFa: 'کوچه بارانی نئونی نیمه‌شب',
    tagline: 'Reflective puddles and purple neon lights',
    description: 'A rainy city street glowing with purple neon signs, street lanterns, wet reflections, and a cozy red car.',
    palette: {
      primary: '#6366F1',
      secondary: '#EC4899',
      accent: '#FBBF24',
      bg: '#1E1B4B',
      text: '#F8FAFC',
    },
    category: 'urban',
  },
  {
    id: 'sakura-cliff',
    name: 'Sunset Sakura & Waterfall',
    nameFa: 'شکوفه گیلاس و آبشار غروب',
    tagline: 'Ancient cliff overlooking glowing waters',
    description: 'A blooming pink cherry blossom tree rooted to a cliff overlooking cascading waterfalls at sunset.',
    palette: {
      primary: '#F472B6',
      secondary: '#EA580C',
      accent: '#FDE047',
      bg: '#2E1065',
      text: '#FDF2F8',
    },
    category: 'nature',
  },
  {
    id: 'ghibli-meadow',
    name: 'Summer Anime Meadow',
    nameFa: 'دشت سرسبز و ابرهای استودیو جیبلی',
    tagline: 'Rolling green hills and majestic cumulus clouds',
    description: 'Lush pastures dotted with pink wildflowers, distant blue mountains, and towering anime summer clouds.',
    palette: {
      primary: '#22C55E',
      secondary: '#38BDF8',
      accent: '#EC4899',
      bg: '#DCFCE7',
      text: '#14532D',
    },
    category: 'nature',
  },
  {
    id: 'spacewalker',
    name: 'Deep Space Orbit',
    nameFa: 'فضانورد کیهانی و زمین چرخان',
    tagline: 'Weightless serenity among the stars',
    description: 'An astronaut in an orange space suit floating peacefully beside a swirling planet and orbital shuttle.',
    palette: {
      primary: '#F97316',
      secondary: '#06B6D4',
      accent: '#A855F7',
      bg: '#0F172A',
      text: '#F8FAFC',
    },
    category: 'sci-fi',
  },
  {
    id: 'cozy-desk-cat',
    name: 'Cozy Desk & Sleeping Cat',
    nameFa: 'میز طراحی و گربه لم‌داده',
    tagline: 'Purrs and strokes under warm studio lamplight',
    description: 'A striped tabby cat curled up snoozing right next to an artist graphic tablet and stylus.',
    palette: {
      primary: '#EA580C',
      secondary: '#818CF8',
      accent: '#F472B6',
      bg: '#FEF3C7',
      text: '#451A03',
    },
    category: 'cozy',
  },
];

export function getSceneById(id?: string): PixelScene {
  if (!id) return PIXEL_SCENES[0];
  return PIXEL_SCENES.find(s => s.id === id) || PIXEL_SCENES[0];
}
