import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionSectionProps {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  summaryBadge?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  icon,
  summaryBadge,
  isOpen,
  onToggle,
  children,
  className = '',
}) => {
  return (
    <div className={`rounded-2xl border border-[#E6DCB8] bg-[#FFFDF9]/90 shadow-2xs overflow-hidden transition-all duration-200 ${className}`}>
      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-3 text-left hover:bg-[#FAF4E8] transition-colors cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 flex-wrap min-w-0 pr-2">
          {icon && <span className="text-[#8C724B] shrink-0">{icon}</span>}
          <span className="text-xs sm:text-sm font-bold text-[#352B20] tracking-wide truncate">
            {title}
          </span>
          {!isOpen && summaryBadge && (
            <div className="text-[11px] text-[#7A6C5B] font-medium flex items-center gap-1.5 ml-1 flex-wrap">
              {summaryBadge}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#8C7A68] shrink-0">
          <span className="text-[11px] hidden sm:inline text-[#9A8977]">
            {isOpen ? 'Minimize' : 'Maximize'}
          </span>
          <div className="p-1 rounded-lg bg-[#EFE8D6] text-[#695B4B]">
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-[#EAE1CF] space-y-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};
