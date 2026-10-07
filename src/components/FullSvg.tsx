import React from 'react';
import { PapyrusIcon } from './SVG';

interface FullSvgProps {
  className?: string;
  variant?: 'light' | 'dark' | 'brand';
  showSubtitle?: boolean;
}

export const PapyrusBrandLogo: React.FC<FullSvgProps> = ({
  className = '',
  showSubtitle = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-[#2D261E] text-[#EADDCB] flex items-center justify-center shadow-xs border border-[#44382B]">
        <PapyrusIcon className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <span className="font-papyrus-brand tracking-wider font-bold text-lg leading-tight text-[#2B241D]">
          PAPYRUS
        </span>
        {showSubtitle && (
          <span className="text-[10px] tracking-widest uppercase font-medium text-[#7D7163] -mt-0.5">
            Notes & Tasks
          </span>
        )}
      </div>
    </div>
  );
};
