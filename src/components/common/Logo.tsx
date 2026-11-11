/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSlogan = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        {/* Futuristic glowing backdrop */}
        <div className="absolute inset-0 bg-blue-500 rounded-xl blur-sm opacity-50 animate-pulse"></div>
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#0D1B42] to-[#080E21] border border-blue-500/40 p-1.5 flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="logoPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D2FF" />
                <stop offset="100%" stopColor="#3A86FF" />
              </linearGradient>
              <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD166" />
                <stop offset="100%" stopColor="#F77F00" />
              </linearGradient>
            </defs>
            {/* African Chevron & Tech Apex */}
            <path
              d="M 50 12 L 82 85 L 64 85 L 50 48 L 36 85 L 18 85 Z"
              fill="url(#logoPrimary)"
            />
            {/* Core Diamond */}
            <polygon points="50,38 60,52 50,66 40,52" fill="url(#logoGold)" />
            {/* Interconnecting Circuit Node */}
            <circle cx="50" cy="52" r="3" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center tracking-wider">
          <span className={`font-black ${textSizes[size]} bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent uppercase`}>
            AFRIXA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 ml-1.5 animate-ping"></span>
        </div>
        {showSlogan && (
          <span className="text-[10px] text-blue-300/80 font-medium tracking-tight -mt-0.5">
            L'innovation africaine, sans limites.
          </span>
        )}
      </div>
    </div>
  );
};
