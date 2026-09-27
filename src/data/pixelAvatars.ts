import { UserProfile } from '../types';

export type AvatarCategory = 'featured' | 'cats' | 'animals' | 'people' | 'fantasy' | 'cozy';

export interface PixelAvatarItem {
  id: string;
  name: string;
  nameFa: string;
  category: AvatarCategory;
  description: string;
  bgHex: string;
  borderHex: string;
  isScene?: boolean;
}

export const AVATAR_CATEGORIES: { id: AvatarCategory | 'all'; label: string; labelFa: string; emoji: string }[] = [
  { id: 'all', label: 'All Avatars', labelFa: 'همه', emoji: '✨' },
  { id: 'featured', label: 'Featured Scenes', labelFa: 'صحنه‌های ویژه', emoji: '🎨' },
  { id: 'cats', label: 'Cats & Kittens', labelFa: 'گربه‌ها', emoji: '🐱' },
  { id: 'animals', label: 'Pets & Animals', labelFa: 'حیوانات', emoji: '🐾' },
  { id: 'people', label: 'Characters', labelFa: 'کاراکترها', emoji: '🧑' },
  { id: 'fantasy', label: 'Fantasy & Bots', labelFa: 'فانتزی و ربات', emoji: '👾' },
  { id: 'cozy', label: 'Cozy & Plants', labelFa: 'کوزی و گیاهان', emoji: '🌱' },
];

export const PIXEL_AVATARS: PixelAvatarItem[] = [
  // 7 Featured Masterpiece Pixel Art Illustrations (Inspired by user's references)
  {
    id: 'wanderer',
    name: 'Ancient Wanderer',
    nameFa: 'سرگردان کهن و ماه',
    category: 'featured',
    description: 'Solitary nomad bearing a crescent moon spear, feathered mask, and woven traveler robes.',
    bgHex: '#E8DEC9',
    borderHex: '#0D9488',
    isScene: true,
  },
  {
    id: 'ramen-shop',
    name: 'Daytime Ramen Stall',
    nameFa: 'کیوسک نئونی و رامن روز',
    category: 'featured',
    description: 'Pastel cyan & magenta cyberpunk noodle shop with striped awnings and street signs.',
    bgHex: '#E0F2FE',
    borderHex: '#0284C7',
    isScene: true,
  },
  {
    id: 'cyberpunk-rain',
    name: 'Midnight Rain Alley',
    nameFa: 'کوچه بارانی نئونی نیمه‌شب',
    category: 'featured',
    description: 'Reflective wet pavement, purple neon signs, warm streetlamps, and a cozy red car.',
    bgHex: '#1F1538',
    borderHex: '#8B5CF6',
    isScene: true,
  },
  {
    id: 'sakura-cliff',
    name: 'Sunset Sakura Cliff',
    nameFa: 'شکوفه گیلاس و آبشار غروب',
    category: 'featured',
    description: 'Ancient blooming cherry blossom tree overlooking cascading waterfalls at sunset.',
    bgHex: '#2E1065',
    borderHex: '#F472B6',
    isScene: true,
  },
  {
    id: 'ghibli-meadow',
    name: 'Summer Anime Meadow',
    nameFa: 'دشت سرسبز و ابرهای استودیو جیبلی',
    category: 'featured',
    description: 'Lush rolling green hills, wildflowers, and towering majestic anime clouds.',
    bgHex: '#DCFCE7',
    borderHex: '#16A34A',
    isScene: true,
  },
  {
    id: 'spacewalker',
    name: 'Cosmic Spacewalker',
    nameFa: 'فضانورد کیهانی در مدار',
    category: 'featured',
    description: 'Astronaut in an orange space suit drifting serenely above a swirling teal planet.',
    bgHex: '#0F172A',
    borderHex: '#F97316',
    isScene: true,
  },
  {
    id: 'cozy-desk-cat',
    name: 'Studio Desk & Sleeping Cat',
    nameFa: 'میز طراحی و گربه خواب‌آلود',
    category: 'featured',
    description: 'Chubby striped cat sleeping peacefully beside an artist graphics tablet.',
    bgHex: '#FEF3C7',
    borderHex: '#EA580C',
    isScene: true,
  },

  // Cats
  {
    id: 'cat-tabby',
    name: 'Ginger Tabby',
    nameFa: 'گربه زنجبیلی',
    category: 'cats',
    description: 'Cozy ginger kitten who loves sunbeams and warm desks.',
    bgHex: '#FEF3C7',
    borderHex: '#F59E0B',
  },
  {
    id: 'cat-black',
    name: 'Midnight Cat',
    nameFa: 'گربه سیاه نیمه‌شب',
    category: 'cats',
    description: 'Sleek black cat with bright golden eyes and a curious mind.',
    bgHex: '#1E1B18',
    borderHex: '#FBBF24',
  },
  {
    id: 'cat-white',
    name: 'Snowy Kitten',
    nameFa: 'گربه سفید برفی',
    category: 'cats',
    description: 'Fluffy white kitten with gentle pink ears and crystal blue eyes.',
    bgHex: '#F1F5F9',
    borderHex: '#93C5FD',
  },
  {
    id: 'cat-calico',
    name: 'Calico Cat',
    nameFa: 'گربه کالیکو',
    category: 'cats',
    description: 'Playful tricolor cat bringing good luck and cozy vibes.',
    bgHex: '#FFEDD5',
    borderHex: '#FB923C',
  },

  // Animals & Pets
  {
    id: 'dog-shiba',
    name: 'Shiba Inu',
    nameFa: 'سگ شیبا',
    category: 'animals',
    description: 'Loyal companion cheering you on with a joyful smile.',
    bgHex: '#FEF3C7',
    borderHex: '#D97706',
  },
  {
    id: 'dog-corgi',
    name: 'Corgi Pup',
    nameFa: 'توله کورگی',
    category: 'animals',
    description: 'Energetic puppy with big alert ears and boundless enthusiasm.',
    bgHex: '#FFEDD5',
    borderHex: '#EA580C',
  },
  {
    id: 'bunny',
    name: 'Fluffy Bunny',
    nameFa: 'خرگوش پشمالو',
    category: 'animals',
    description: 'Gentle rabbit with soft twitching ears and a peaceful heart.',
    bgHex: '#FCE7F3',
    borderHex: '#F472B6',
  },
  {
    id: 'hamster',
    name: 'Cheeky Hamster',
    nameFa: 'همستر تپل',
    category: 'animals',
    description: 'Always stashing away little ideas in chubby cheeks.',
    bgHex: '#FEF9C3',
    borderHex: '#EAB308',
  },
  {
    id: 'frog',
    name: 'Rainforest Frog',
    nameFa: 'قورباغه سبز',
    category: 'animals',
    description: 'Calm green tree frog resting under a giant dewdrop leaf.',
    bgHex: '#DCFCE7',
    borderHex: '#22C55E',
  },
  {
    id: 'panda',
    name: 'Cozy Panda',
    nameFa: 'پاندای بامبو',
    category: 'animals',
    description: 'Master of peaceful pacing, taking life one bamboo shoot at a time.',
    bgHex: '#F3F4F6',
    borderHex: '#4B5563',
  },
  {
    id: 'bear',
    name: 'Honey Bear',
    nameFa: 'خرس قهوه‌ای',
    category: 'animals',
    description: 'Sturdy brown bear who loves cozy afternoons and sweet teas.',
    bgHex: '#FEE2E2',
    borderHex: '#B45309',
  },
  {
    id: 'polar-bear',
    name: 'Polar Bear',
    nameFa: 'خرس قطبی',
    category: 'animals',
    description: 'Chilly friend wearing a cozy sky-blue knit scarf.',
    bgHex: '#E0F2FE',
    borderHex: '#38BDF8',
  },
  {
    id: 'penguin',
    name: 'Little Penguin',
    nameFa: 'پنگوئن برفی',
    category: 'animals',
    description: 'Waddling in style with a neat tuxedo coat and bright orange beak.',
    bgHex: '#F1F5F9',
    borderHex: '#F97316',
  },
  {
    id: 'owl',
    name: 'Wise Barn Owl',
    nameFa: 'جغد دانا',
    category: 'animals',
    description: 'Observant night owl who shines during late-night study sessions.',
    bgHex: '#FEF3C7',
    borderHex: '#A16207',
  },
  {
    id: 'fox',
    name: 'Rust Fox',
    nameFa: 'روباه زرد و قرمز',
    category: 'animals',
    description: 'Clever forest fox with a fluffy white-tipped tail.',
    bgHex: '#FFEDD5',
    borderHex: '#EA580C',
  },
  {
    id: 'duck',
    name: 'Yellow Duckling',
    nameFa: 'اردک زرد',
    category: 'animals',
    description: 'Friendly rubber duckling ready to listen through your thoughts.',
    bgHex: '#FEF9C3',
    borderHex: '#FACC15',
  },

  // People & Personalities
  {
    id: 'human-headphones',
    name: 'Lo-Fi Listener',
    nameFa: 'هدفون دار لو-فای',
    category: 'people',
    description: 'Lost in ambient beats and deep flow state.',
    bgHex: '#CFFAFE',
    borderHex: '#06B6D4',
  },
  {
    id: 'human-glasses',
    name: 'Bookish Scholar',
    nameFa: 'محقق با عینک',
    category: 'people',
    description: 'Avid reader with round spectacles and stacks of manuscripts.',
    bgHex: '#CCFBF1',
    borderHex: '#0D9488',
  },
  {
    id: 'human-beanie',
    name: 'Cozy Nomad',
    nameFa: 'کاراکتر کلاه بافتنی',
    category: 'people',
    description: 'Ready for chilly mornings with a mustard beanie and warm cocoa.',
    bgHex: '#FEF3C7',
    borderHex: '#EAB308',
  },
  {
    id: 'human-girl-pink',
    name: 'Starry Pixie',
    nameFa: 'دختر با گیره ستاره',
    category: 'people',
    description: 'Creative thinker with pastel buns and golden star hairclips.',
    bgHex: '#F3E8FF',
    borderHex: '#A855F7',
  },
  {
    id: 'human-artist',
    name: 'Coffee Artist',
    nameFa: 'هنرمند با کلاه بره',
    category: 'people',
    description: 'Sketching life in pixel strokes with a red beret.',
    bgHex: '#FFE4E6',
    borderHex: '#E11D48',
  },
  {
    id: 'human-hoodie',
    name: 'Night Coder',
    nameFa: 'کاراکتر هودی مشکی',
    category: 'people',
    description: 'Dark mode enthusiast typing away in a comfortable oversized hoodie.',
    bgHex: '#EDE9FE',
    borderHex: '#6366F1',
  },

  // Fantasy & Bots
  {
    id: 'ghost',
    name: 'Friendly Ghost',
    nameFa: 'روح مهربان',
    category: 'fantasy',
    description: 'Gentle floating phantom with cute rosy cheeks.',
    bgHex: '#EDE9FE',
    borderHex: '#8B5CF6',
  },
  {
    id: 'robot',
    name: 'Pixel Bot',
    nameFa: 'ربات پیکسلی',
    category: 'fantasy',
    description: 'Calculating optimal task sequences with a cheerful blinking antenna.',
    bgHex: '#E0F2FE',
    borderHex: '#0284C7',
  },
  {
    id: 'dragon',
    name: 'Mini Dragon',
    nameFa: 'اژدهای کوچولو',
    category: 'fantasy',
    description: 'Tiny emerald dragon breathing little puffs of creative spark.',
    bgHex: '#DCFCE7',
    borderHex: '#16A34A',
  },
  {
    id: 'astronaut',
    name: 'Spacewalker',
    nameFa: 'فضانورد',
    category: 'fantasy',
    description: 'Drifting serenely among cosmic stars and endless possibilities.',
    bgHex: '#E0E7FF',
    borderHex: '#4F46E5',
  },
  {
    id: 'alien',
    name: 'Green Martian',
    nameFa: 'موجود فضایی',
    category: 'fantasy',
    description: 'Curious extraterrestrial visitor studying human writing scrolls.',
    bgHex: '#ECFCCB',
    borderHex: '#84CC16',
  },
  {
    id: 'wizard',
    name: 'Star Wizard',
    nameFa: 'جادوگر ستاره‌ای',
    category: 'fantasy',
    description: 'Keeper of enchanted ink in a tall pointy midnight hat.',
    bgHex: '#F3E8FF',
    borderHex: '#7C3AED',
  },
  {
    id: 'ninja',
    name: 'Shadow Ninja',
    nameFa: 'نینجای شب',
    category: 'fantasy',
    description: 'Swift and silent, slicing through distractions with pinpoint focus.',
    bgHex: '#1E1B18',
    borderHex: '#DC2626',
  },

  // Cozy & Plants
  {
    id: 'plant-pot',
    name: 'Little Cactus',
    nameFa: 'کاکتوس گلدانی',
    category: 'cozy',
    description: 'Resilient little succulent blooming with a tiny pink flower.',
    bgHex: '#DCFCE7',
    borderHex: '#15803D',
  },
  {
    id: 'coffee-cup',
    name: 'Steaming Mug',
    nameFa: 'ماگ قهوه گرم',
    category: 'cozy',
    description: 'Freshly brewed aromatic cup fueling long writing sessions.',
    bgHex: '#FEF3C7',
    borderHex: '#92400E',
  },
  {
    id: 'star',
    name: 'Cosmic Star',
    nameFa: 'ستاره درخشان',
    category: 'cozy',
    description: 'A little celestial spark to brighten up your workday.',
    bgHex: '#FEF9C3',
    borderHex: '#EAB308',
  },
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'User',
  avatarId: 'cat-tabby',
  totalFocusMinutes: 0,
  completedPomodoros: 0,
};

// Backward-compatibility alias
export const DEFAULT_CHARACTER = DEFAULT_USER_PROFILE;

export function getAvatarById(id?: string): PixelAvatarItem {
  if (!id) return PIXEL_AVATARS[0];
  const found = PIXEL_AVATARS.find(a => a.id === id);
  if (found) return found;

  // Handle legacy avatar IDs gracefully
  if (id.includes('cat')) return PIXEL_AVATARS[0];
  if (id.includes('knight')) return PIXEL_AVATARS[17];
  if (id.includes('mage') || id.includes('wizard')) return PIXEL_AVATARS[27];
  if (id.includes('scholar')) return PIXEL_AVATARS[17];
  if (id.includes('rogue')) return PIXEL_AVATARS[28];
  return PIXEL_AVATARS[0];
}
