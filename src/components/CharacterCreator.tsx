import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { User } from 'firebase/auth';
import { 
  PIXEL_AVATARS, 
  AVATAR_CATEGORIES, 
  AvatarCategory, 
  getAvatarById 
} from '../data/pixelAvatars';
import { PixelAvatar } from './PixelAvatar';
import { 
  Sparkles, 
  Dices, 
  Check, 
  Play, 
  Search,
  Smile,
  Timer,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  LogIn,
  Cloud,
  User as UserIcon,
  RefreshCw
} from 'lucide-react';

interface CharacterCreatorProps {
  character: UserProfile;
  onSaveCharacter: (char: UserProfile) => void;
  onStartFocusSession?: () => void;
  currentUser?: User | null;
  onSignOut?: () => void;
  onSignIn?: () => void;
  stats?: {
    totalNotes: number;
    totalJournals: number;
    totalTasks: number;
  };
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  character,
  onSaveCharacter,
  onStartFocusSession,
  currentUser,
  onSignOut,
  onSignIn,
  stats,
}) => {
  const [name, setName] = useState(character.name || 'User');
  const [selectedAvatarId, setSelectedAvatarId] = useState(character.avatarId || 'cat-tabby');
  const [activeCategory, setActiveCategory] = useState<AvatarCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewWorkingState, setPreviewWorkingState] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Selected avatar item details
  const currentAvatar = useMemo(() => getAvatarById(selectedAvatarId), [selectedAvatarId]);

  // Filtered avatars based on category & search query
  const filteredAvatars = useMemo(() => {
    return PIXEL_AVATARS.filter(av => {
      const matchCategory = activeCategory === 'all' || av.category === activeCategory;
      const matchSearch = searchQuery.trim() === '' || 
        av.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        av.nameFa.includes(searchQuery) ||
        av.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleRandomize = () => {
    const randomItem = PIXEL_AVATARS[Math.floor(Math.random() * PIXEL_AVATARS.length)];
    setSelectedAvatarId(randomItem.id);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updatedProfile: UserProfile = {
      ...character,
      name: name.trim() || 'User',
      avatarId: selectedAvatarId,
    };
    onSaveCharacter(updatedProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      
      {/* Account & Cloud Sync Status Card (Avatar Section Population) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FAF6EE] via-[#FFFDF9] to-[#F5EFE3] border-2 border-[#E4DBC8] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          
          <div className="flex items-center gap-4">
            {/* Google Profile Photo or fallback */}
            <div className="relative">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Google User'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#8C724B] shadow-xs"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#8C724B] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  {currentUser?.displayName?.[0]?.toUpperCase() || 'U'} 
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-2xs" title="Cloud Active">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-serif font-bold text-[#2A231C]">
                  {currentUser?.displayName || name || 'Signed in Traveler'}
                </h2>
              </div>
              <p className="text-xs text-[#7A6D5E]">
                {currentUser?.email || 'Connected to Google Account Vault'}
              </p>
            </div>
          </div>

          {/* Sync Stats & Auth Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            {stats && (
              <div className="flex items-center gap-2 text-xs bg-[#EFE8D6] px-3.5 py-2 rounded-2xl border border-[#DFD4BF]">
                <div className="text-center px-1">
                  <div className="font-bold text-[#2A231C]">{stats.totalNotes}</div>
                  <div className="text-[9px] text-[#7A6B5B] uppercase font-semibold">Notes</div>
                </div>
                <div className="w-px h-6 bg-[#DDD0B7]" />
                <div className="text-center px-1">
                  <div className="font-bold text-[#2A231C]">{stats.totalJournals}</div>
                  <div className="text-[9px] text-[#7A6B5B] uppercase font-semibold">Journals</div>
                </div>
                <div className="w-px h-6 bg-[#DDD0B7]" />
                <div className="text-center px-1">
                  <div className="font-bold text-[#2A231C]">{stats.totalTasks}</div>
                  <div className="text-[9px] text-[#7A6B5B] uppercase font-semibold">Tasks</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {currentUser?.displayName && name !== currentUser.displayName && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser.displayName) setName(currentUser.displayName);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#FAF6EE] hover:bg-[#F2ECE0] border border-[#DDD2BC] text-xs font-semibold text-[#554737] transition-all cursor-pointer"
                  title="Use your Google name for the avatar"
                >
                  Sync Name
                </button>
              )}

              {onSignOut ? (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#FCA5A5] text-xs font-bold text-[#991B1B] transition-all cursor-pointer shadow-2xs"
                  title="Sign out of Google Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : onSignIn ? (
                <button
                  type="button"
                  onClick={onSignIn}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-[#FEF08A] text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In with Google</span>
                </button>
              ) : null}
            </div>
          </div>

        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C724B] flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-[#B08D57]" /> User Profile & Pixel Avatar
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#2A231C] mt-1">
            Choose Your Pixel Avatar
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6D5E] mt-1">
            Pick a cute animated pixel companion to represent you across your sanctum, notes, and focus timer.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRandomize}
            className="px-3.5 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F2ECE0] border border-[#DDD2BC] text-xs font-semibold text-[#554637] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Pick a random avatar"
          >
            <Dices className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>Surprise Me</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-2 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Save Avatar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F3E6] border border-[#BEDDB8] text-[#285724] font-semibold text-xs flex items-center gap-2 shadow-xs animate-bounce-subtle">
          <CheckCircle2 className="w-4 h-4 text-[#3A7E35]" />
          <span>Profile and pixel avatar saved successfully!</span>
        </div>
      )}

      {/* Main Grid: Left Side = Avatar Selection Grid, Right Side = Active Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: Filters & Avatar Grid (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Search & Category Filter Bar */}
          <div className="bg-[#FAF7F0] border border-[#E2D8C3] rounded-2xl p-4 shadow-2xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C7E6F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search avatars (cat, dog, bunny, robot, wizard, etc.)..."
                className="w-full pl-9 pr-8 py-2 bg-[#F2EDE1] text-xs text-[#2C241C] placeholder-[#8C7E6F] rounded-xl border border-[#DDD3BF] focus:outline-none focus:ring-1 focus:ring-[#8C724B] focus:bg-[#FFFDF9] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C7E6F] hover:text-[#2C241C]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {AVATAR_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#2E251C] text-white shadow-xs'
                      : 'bg-[#EFE9DC] hover:bg-[#E5DDC9] text-[#554637] border border-[#DDD2BC]'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {filteredAvatars.map(av => {
              const isSelected = selectedAvatarId === av.id;
              return (
                <div
                  key={av.id}
                  onClick={() => setSelectedAvatarId(av.id)}
                  className={`relative p-3.5 rounded-2xl transition-all cursor-pointer flex flex-col items-center text-center group ${
                    isSelected
                      ? 'bg-[#FAF6EE] ring-2 ring-[#8C724B] shadow-md border-transparent scale-[1.02]'
                      : 'bg-[#FAF7F0] hover:bg-[#F4EFE3] border border-[#E2D8C3] hover:border-[#CFC3AB] shadow-2xs hover:-translate-y-0.5'
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8C724B] text-white flex items-center justify-center text-[10px] shadow-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}

                  {/* Pixel Art Rendering */}
                  <div className="p-2.5 rounded-2xl bg-[#1C1814]/5 mb-2.5 transition-transform group-hover:scale-105">
                    <PixelAvatar 
                      avatarId={av.id} 
                      size="md" 
                      animated={isSelected} 
                      isWorking={isSelected && previewWorkingState} 
                    />
                  </div>

                  {/* Avatar Name & Persian Subtitle */}
                  <div className="w-full">
                    <div className="text-xs font-bold text-[#2A231C] truncate group-hover:text-[#8C724B] transition-colors">
                      {av.name}
                    </div>
                    <div className="text-[10px] text-[#8C7E6F] truncate mt-0.5">
                      {av.nameFa}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAvatars.length === 0 && (
            <div className="p-12 text-center bg-[#FAF7F0] border border-[#E2D8C3] rounded-2xl">
              <Smile className="w-8 h-8 text-[#A89887] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#554637]">No avatars found</p>
              <p className="text-xs text-[#8C7E6F] mt-1">Try clearing your search query or selecting another category.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-3 px-3 py-1.5 rounded-xl bg-[#EFE9DC] text-xs font-semibold text-[#483B2D]"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Right Section: Selected Profile Preview Card (4 Cols Sticky) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          
          <div className="bg-[#FAF7F0] border border-[#E2D8C3] rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7966] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" /> Selected Avatar Preview
            </h3>

            {/* Big Centered Avatar Showcase */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F2EDE1] border border-[#E0D6C3] shadow-inner relative overflow-hidden">
              <div className="relative">
                <PixelAvatar 
                  avatarId={currentAvatar.id} 
                  size="xl" 
                  animated={true} 
                  isWorking={previewWorkingState} 
                />
              </div>

              {/* Avatar Name & Description */}
              <div className="text-center mt-4 space-y-1">
                <h4 className="font-serif-display font-bold text-xl text-[#2A231C]">
                  {currentAvatar.name}
                </h4>
                <p className="text-xs text-[#7A6D5E] max-w-xs leading-relaxed">
                  {currentAvatar.description}
                </p>
              </div>

              {/* Animation Mode Toggle */}
              <div className="mt-4 pt-3 border-t border-[#DDD2BC] w-full flex items-center justify-center gap-2">
                <span className="text-[11px] text-[#7A6D5E] font-medium">Preview Animation:</span>
                <button
                  type="button"
                  onClick={() => setPreviewWorkingState(!previewWorkingState)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    previewWorkingState
                      ? 'bg-[#B08D57] text-white shadow-xs'
                      : 'bg-[#E5DEC9] text-[#554637] hover:bg-[#DDD3BD]'
                  }`}
                >
                  {previewWorkingState ? '⚡ Focus Mode (Active)' : '🍃 Gentle Float'}
                </button>
              </div>
            </div>

            {/* Edit Display Name Form */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#453729] block">
                Your Display Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={30}
                className="w-full px-3.5 py-2 bg-[#F2EDE1] text-sm font-semibold text-[#2C241C] placeholder-[#8C7E6F] rounded-xl border border-[#DDD3BF] focus:outline-none focus:ring-1 focus:ring-[#8C724B] focus:bg-[#FFFDF9] transition-all"
              />
            </div>

            {/* Profile Statistics (Simple Focus Time, no levels/XP) */}
            <div className="pt-3 border-t border-[#E5DEC9] space-y-2">
              <span className="text-[11px] font-bold text-[#8A7966] uppercase tracking-wider block">
                Focus Statistics
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-[#F2ECE0] border border-[#DDD2BC] text-center">
                  <div className="text-base font-bold text-[#2A231C]">
                    {character.totalFocusMinutes || 0}m
                  </div>
                  <div className="text-[10px] text-[#7A6D5E]">
                    Total Focus Time
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F2ECE0] border border-[#DDD2BC] text-center">
                  <div className="text-base font-bold text-[#2A231C]">
                    {character.completedPomodoros || 0}
                  </div>
                  <div className="text-[10px] text-[#7A6D5E]">
                    Pomodoros Done
                  </div>
                </div>
              </div>
            </div>

            {/* Save & Start Focus Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleSave()}
                className="w-full py-3 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Save Profile & Avatar</span>
              </button>

              {onStartFocusSession && (
                <button
                  type="button"
                  onClick={onStartFocusSession}
                  className="w-full py-2.5 rounded-xl bg-[#EFE9DC] hover:bg-[#E5DDC9] border border-[#DDD2BC] text-[#483B2D] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-[#483B2D]" />
                  <span>Go to Focus Timer</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
