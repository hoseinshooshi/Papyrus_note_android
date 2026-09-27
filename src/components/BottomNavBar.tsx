import React from 'react';
import { ViewMode } from '../types';
import { LayoutDashboard, BookOpen, CheckSquare, Flame, User, Feather } from 'lucide-react';

interface BottomNavBarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  notesCount: number;
  journalsCount?: number;
  pendingTasksCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentView,
  onViewChange,
  notesCount,
  journalsCount = 0,
  pendingTasksCount,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E5DEC9] px-2 py-1.5 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[11px] transition-colors ${
            currentView === 'dashboard'
              ? 'text-[#2C241C] font-bold'
              : 'text-[#827464] hover:text-[#2C241C]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onViewChange('pomodoro')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[11px] transition-colors ${
            currentView === 'pomodoro'
              ? 'text-[#2C241C] font-bold'
              : 'text-[#827464] hover:text-[#2C241C]'
          }`}
        >
          <Flame className="w-4 h-4 mb-0.5 text-[#B08D57]" />
          <span>Focus</span>
        </button>

        <button
          onClick={() => onViewChange('notes')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[11px] transition-colors ${
            currentView === 'notes'
              ? 'text-[#2C241C] font-bold'
              : 'text-[#827464] hover:text-[#2C241C]'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Notes</span>
          {notesCount > 0 && (
            <span className="absolute top-0 right-1 px-1 py-0.2 bg-[#E0D4BE] text-[#4A3D2D] rounded-full text-[8px] font-bold">
              {notesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onViewChange('journal')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[11px] transition-colors ${
            currentView === 'journal'
              ? 'text-[#2C241C] font-bold'
              : 'text-[#827464] hover:text-[#2C241C]'
          }`}
        >
          <Feather className="w-4 h-4 mb-0.5 text-[#B08D57]" />
          <span>Journal</span>
          {journalsCount > 0 && (
            <span className="absolute top-0 right-1 px-1 py-0.2 bg-[#E0D4BE] text-[#4A3D2D] rounded-full text-[8px] font-bold">
              {journalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onViewChange('tasks')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[11px] transition-colors ${
            currentView === 'tasks'
              ? 'text-[#2C241C] font-bold'
              : 'text-[#827464] hover:text-[#2C241C]'
          }`}
        >
          <CheckSquare className="w-4 h-4 mb-0.5" />
          <span>Tasks</span>
          {pendingTasksCount > 0 && (
            <span className="absolute top-0 right-1 px-1 py-0.2 bg-[#C29D38] text-white rounded-full text-[8px] font-bold">
              {pendingTasksCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onViewChange('character')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[11px] transition-colors ${
            currentView === 'character'
              ? 'text-[#2C241C] font-bold'
              : 'text-[#827464] hover:text-[#2C241C]'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span>Avatar</span>
        </button>
      </div>
    </div>
  );
};
