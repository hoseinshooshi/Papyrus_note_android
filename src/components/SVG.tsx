import React from 'react';

interface SvgProps {
  className?: string;
  size?: number;
}

export const PapyrusIcon: React.FC<SvgProps> = ({ className = 'w-6 h-6', size }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Stylized papyrus scroll and feather quill */}
      <path
        d="M6 8C6 6.34315 7.34315 5 9 5H21C22.6569 5 24 6.34315 24 8V23C24 24.6569 22.6569 26 21 26H8C6.34315 26 5 24.6569 5 23C5 21.3431 6.34315 20 8 20H23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Internal scroll text lines */}
      <path
        d="M10 10H19"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M10 14H16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Minimalist quill tip accent */}
      <path
        d="M26 4L22 12L20 10L26 4Z"
        fill="currentColor"
        opacity="0.85"
      />
      <circle cx="8" cy="23" r="1.5" fill="currentColor" />
    </svg>
  );
};

export const FeatherIcon: React.FC<SvgProps> = ({ className = 'w-5 h-5', size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
};
