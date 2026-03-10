import React from 'react';

interface SpepasLoaderProps {
  /** Size variant: 'sm' (32px), 'md' (48px), 'lg' (64px), 'xl' (96px) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional label shown below the spinner */
  label?: string;
  /** If true, renders as a full-section centered loader with padding */
  fullSection?: boolean;
  /** Additional className for the wrapper */
  className?: string;
}

const SIZES = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
} as const;

const SpepasLoader: React.FC<SpepasLoaderProps> = ({
  size = 'md',
  label,
  fullSection = false,
  className = '',
}) => {
  const loader = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <img
        src="/spepasLogo.gif"
        alt="Loading..."
        className={`${SIZES[size]} object-contain`}
      />
      {label && (
        <p className="text-sm text-dark-4 font-medium">{label}</p>
      )}
    </div>
  );

  if (fullSection) {
    return (
      <div className="flex items-center justify-center py-16">
        {loader}
      </div>
    );
  }

  return loader;
};

export default SpepasLoader;
