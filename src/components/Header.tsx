import React, { useState } from 'react';
import { ViewMode, CharacterProfile } from '../types';
import { PapyrusBrandLogo } from './FullSvg';
import { PixelAvatar } from './PixelAvatar';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Plus, 
  Search, 
  Flame, 
  User as UserIcon,
  Cloud,
  LogOut,
  LogIn,
  ChevronDown,
  Feather,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenQuickCapture: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notesCount: number;
  journalsCount?: number;
  pendingTasksCount: number;
  character: CharacterProfile;
  user?: { displayName?: string | null; email?: string | null; photoURL?: string | null } | null;
  onSignOut?: () => void;
  onSignIn?: () => void;
  isCloudSynced?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenQuickCapture,
  searchQuery,
  onSearchChange,
  notesCount,
  journalsCount = 0,
  pendingTasksCount,
  character,
  user,
  onSignOut,
  onSignIn,
  isCloudSynced = true,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DEC9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Brand Logo */}
          <div 
            className="cursor-pointer transition-transform active:scale-95 flex-shrink-0"
            onClick={() => onViewChange('dashboard')}
          >
            <PapyrusBrandLogo />
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#F0ECE2] rounded-xl border border-[#E4DCB] shadow-xs">
            <button
              id="nav-tab-dashboard"
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentView === 'dashboard'
                  ? 'bg-[#FAF6EE] text-[#2C241C] shadow-xs border border-[#E3D9C4]'
                  : 'text-[#6B5E51] hover:text-[#2C241C] hover:bg-[#F7F3EB]/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-tab-pomodoro"
              onClick={() => onViewChange('pomodoro')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentView === 'pomodoro'
                  ? 'bg-[#FAF6EE] text-[#2C241C] shadow-xs border border-[#E3D9C4]'
                  : 'text-[#6B5E51] hover:text-[#2C241C] hover:bg-[#F7F3EB]/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Focus</span>
            </button>

            <button
              id="nav-tab-notes"
              onClick={() => onViewChange('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentView === 'notes'
                  ? 'bg-[#FAF6EE] text-[#2C241C] shadow-xs border border-[#E3D9C4]'
                  : 'text-[#6B5E51] hover:text-[#2C241C] hover:bg-[#F7F3EB]/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Notes</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#E8DEC9] text-[#554737]">
                {notesCount}
              </span>
            </button>

            <button
              id="nav-tab-journal"
              onClick={() => onViewChange('journal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentView === 'journal'
                  ? 'bg-[#FAF6EE] text-[#2C241C] shadow-xs border border-[#E3D9C4]'
                  : 'text-[#6B5E51] hover:text-[#2C241C] hover:bg-[#F7F3EB]/60'
              }`}
            >
              <Feather className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Journal</span>
              {journalsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#E8DEC9] text-[#554737]">
                  {journalsCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-tasks"
              onClick={() => onViewChange('tasks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentView === 'tasks'
                  ? 'bg-[#FAF6EE] text-[#2C241C] shadow-xs border border-[#E3D9C4]'
                  : 'text-[#6B5E51] hover:text-[#2C241C] hover:bg-[#F7F3EB]/60'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Tasks</span>
              {pendingTasksCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#D4B37D] text-[#2E2413]">
                  {pendingTasksCount}
                </span>
              )}
            </button>
          </nav>

          {/* Search bar */}
          <div className="relative flex-1 max-w-xs hidden sm:block">
            <Search className="w-4 h-4 text-[#8C7E6F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search notes, journals, tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-[#F2EDE1] hover:bg-[#ECE5D7] focus:bg-[#FFFDF9] text-xs text-[#2C241C] placeholder-[#8C7E6F] rounded-xl border border-[#DDD3BF] focus:outline-none focus:ring-1 focus:ring-[#8C724B] focus:border-[#8C724B] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C7E6F] hover:text-[#2C241C]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Action buttons, Quick Capture & Unified Avatar/Account Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cloud Sync Status Indicator */}
            <div 
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F0ECE2] border border-[#DDD2BC] text-[11px] font-medium text-[#554737]"
              title="Data is backed up in real-time to Google Cloud Firestore"
            >
              <Cloud className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Synced</span>
            </div>

            {/* Quick capture button */}
            <button
              id="btn-quick-capture-header"
              onClick={onOpenQuickCapture}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E251C] hover:bg-[#433629] active:scale-95 text-[#F8F4EC] text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Capture</span>
            </button>

            {/* Unified Avatar & Sign-In/Login Section */}
            <div className="relative">
              {user ? (
                /* Signed In Avatar Pill with Google info & companion */
                <button
                  id="user-avatar-account-button"
                  onClick={() => setShowUserDropdown(prev => !prev)}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#F0ECE2] hover:bg-[#EAE4D6] border border-[#DDD2BC] transition-all cursor-pointer shadow-2xs group"
                  title={`${user.displayName || 'Google User'} - Manage Account & Avatar`}
                >
                  <div className="relative flex items-center">
                    <PixelAvatar character={character} size="xs" animated={true} />
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="" 
                        className="w-4 h-4 rounded-full border border-white -ml-1.5 object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-[9px] text-white flex items-center justify-center font-bold -ml-1.5 border border-white">
                        ✓
                      </div>
                    )}
                  </div>
                  
                  <div className="hidden sm:block text-left">
                    <div className="text-[11px] font-bold text-[#2A231C] leading-none group-hover:text-[#8C724B] transition-colors truncate max-w-[85px]">
                      {user.displayName?.split(' ')[0] || character.name}
                    </div>
                    <div className="text-[9px] text-[#16A34A] font-semibold flex items-center gap-0.5 leading-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Online</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#7A6D5E] hidden sm:block" />
                </button>
              ) : (
                /* Not Signed In: Clear login/sign-up call-to-action right in the avatar section */
                <div className="flex items-center gap-1.5">
                  <div 
                    onClick={() => onViewChange('character')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-[#F0ECE2] hover:bg-[#EAE4D6] border border-[#DDD2BC] cursor-pointer"
                    title="Avatar Companion"
                  >
                    <PixelAvatar character={character} size="xs" animated={true} />
                  </div>
                  {onSignIn && (
                    <button
                      onClick={onSignIn}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-[#FEF08A] text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title="Sign in with Google"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              )}

              {/* Avatar & Account Dropdown */}
              {showUserDropdown && user && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserDropdown(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#FAF7F0] border-2 border-[#E2D8C3] shadow-xl p-3.5 z-50 animate-fade-in space-y-3">
                    {/* User Profile Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-[#E8DFC8]">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || 'User'} 
                          className="w-11 h-11 rounded-2xl object-cover border-2 border-[#8C724B] shadow-2xs"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-[#2E251C] text-[#FEF08A] font-bold text-base flex items-center justify-center shadow-2xs">
                          {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-[#2A231C] truncate">
                            {user.displayName || 'Google Traveler'}
                          </p>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        </div>
                        <p className="text-[11px] text-[#7A6D5E] truncate">
                          {user.email}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Signed In & Cloud Synced
                        </span>
                      </div>
                    </div>

                    {/* Companion & Avatar Settings link */}
                    <div 
                      onClick={() => {
                        setShowUserDropdown(false);
                        onViewChange('character');
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#F0ECE2] hover:bg-[#E7E0D0] cursor-pointer transition-colors border border-[#DDD2BC]"
                    >
                      <div className="flex items-center gap-2.5">
                        <PixelAvatar character={character} size="sm" animated={true} />
                        <div>
                          <div className="text-xs font-bold text-[#2A231C]">{character.name}</div>
                          <div className="text-[10px] text-[#7A6D5E]">Companion Avatar Profile</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#8C724B] uppercase tracking-wide">
                        Customize →
                      </span>
                    </div>

                    {/* Navigation shortcuts inside avatar dropdown */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onViewChange('journal');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#554737] hover:bg-[#F2EDE1] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Feather className="w-3.5 h-3.5 text-[#B08D57]" />
                          Daily Journal
                        </span>
                        <span className="text-[10px] text-[#8C7A68]">{journalsCount} entries</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onViewChange('notes');
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#554737] hover:bg-[#F2EDE1] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-[#8C724B]" />
                          Notes & Thoughts
                        </span>
                        <span className="text-[10px] text-[#8C7A68]">{notesCount} notes</span>
                      </button>
                    </div>

                    {/* Sign out */}
                    {onSignOut && (
                      <div className="pt-2 border-t border-[#E8DFC8]">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            onSignOut();
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] text-xs font-bold transition-all cursor-pointer shadow-2xs"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out of Google Account</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
