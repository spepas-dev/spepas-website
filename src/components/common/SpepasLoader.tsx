import React from 'react';

interface SpepasLoaderProps {
  /** sm = inline/button (16px), md = section (32px), lg = page-level (48px) */
  size?: 'sm' | 'md' | 'lg';
  /** Optional text shown below the spinner */
  label?: string;
  /** Wrapper className override */
  className?: string;
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4'
};

const SpepasLoader: React.FC<SpepasLoaderProps> = ({ size = 'md', label, className }) => (
  <div className={className ?? 'flex flex-col items-center justify-center py-12'}>
    <div className={`${sizes[size]} rounded-full border-blue/25 border-t-blue animate-spin`} />
    {label && <p className="mt-3 text-sm text-gray-500">{label}</p>}
  </div>
);

export default SpepasLoader;
