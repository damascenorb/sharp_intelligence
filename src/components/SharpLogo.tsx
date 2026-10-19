import React from 'react';
import { useApp } from '../context/AppContext';

interface SharpLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  onClick?: () => void;
  customLogoUrl?: string;
}

export const SharpLogo: React.FC<SharpLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-slate-900',
  onClick,
  customLogoUrl
}) => {
  let contextLogoUrl: string | null = null;
  try {
    const app = useApp();
    if (app && app.sharpLogoUrl) {
      contextLogoUrl = app.sharpLogoUrl;
    }
  } catch {
    // In case SharpLogo is rendered outside of AppProvider
  }

  const effectiveLogoUrl = customLogoUrl || contextLogoUrl;

  const sizeMap = {
    sm: { logo: 'w-6 h-6', text: 'text-base' },
    md: { logo: 'w-8 h-8', text: 'text-xl' },
    lg: { logo: 'w-11 h-11', text: 'text-2xl' },
    xl: { logo: 'w-16 h-16', text: 'text-3xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div 
      className={`flex items-center space-x-3 ${onClick ? 'cursor-pointer select-none hover:opacity-90 transition-opacity' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Sharp Emblem or Custom Uploaded Logo */}
      <div className={`relative ${currentSize.logo} flex items-center justify-center shrink-0`}>
        {effectiveLogoUrl ? (
          <img 
            src={effectiveLogoUrl} 
            alt="SHARP Logo" 
            className="w-full h-full object-contain rounded-md"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg
            viewBox="0 0 100 104"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main Elegant 'S' Monogram */}
            <path
              d="M 58 22 C 58 14 46 8 34 8 C 18 8 8 18 8 32 C 8 45 20 52 38 58 C 57 65 66 72 66 83 C 66 95 52 102 34 102 C 18 102 8 94 6 82 L 18 80 C 20 87 27 92 34 92 C 45 92 54 87 54 80 C 54 72 42 67 25 61 C 11 55 2 45 2 32 C 2 16 16 2 36 2 C 50 2 61 8 63 20 Z"
              fill="currentColor"
              className={textColor}
            />

            {/* Top Right Cyan 4-Point Sparkle Star */}
            <path
              d="M 78 4 C 78 14 84 20 94 20 C 84 20 78 26 78 36 C 78 26 72 20 62 20 C 72 20 78 14 78 4 Z"
              fill="#0EA5E9"
            />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className={`font-serif font-extrabold tracking-tight ${currentSize.text} ${textColor}`}>
              SHARP
            </span>
            <span className="text-[10px] uppercase tracking-widest font-sans font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-md">
              Intelligence
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-sans tracking-tight">
            Branding & Presença Digital
          </span>
        </div>
      )}
    </div>
  );
};
