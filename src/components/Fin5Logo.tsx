import React from 'react';

interface Fin5LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  variant?: 'default' | 'white';
}

export function Fin5Logo({ size = 'md', showTagline = false, className = '', variant = 'default' }: Fin5LogoProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const circleSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const fiveSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const textColor = variant === 'white' ? 'text-white' : 'text-blue-900';
  const taglineColor = variant === 'white' ? 'text-white' : 'text-blue-700';

  return (
    <div className={`flex items-center ${className}`}>
      {/* Circular Emblem with gradient */}
      <div className={`${circleSizes[size]} bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-3 shadow-lg`}>
        <span className={`${fiveSizes[size]} font-bold text-white`}>5</span>
      </div>
      
      {/* Fin Text */}
      <span className={`${sizeClasses[size]} font-bold ${textColor} mr-2 tracking-wide`}>Fin</span>
      
      {/* Standalone 5 with gradient */}
      <div className={`${fiveSizes[size]} font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent`}>
        5
      </div>
      
      {/* Tagline */}
      {showTagline && (
        <div className={`ml-6 ${taglineColor} text-xs font-medium opacity-80`}>
          Finance. Fast. Five minutes flat.
        </div>
      )}
    </div>
  );
} 