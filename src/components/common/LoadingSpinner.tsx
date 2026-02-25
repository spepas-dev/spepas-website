import React from 'react';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/spepasLogo.gif"
          alt="Loading..."
          className="h-24 w-24 object-contain"
        />
        <p className="text-sm text-dark-4 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export const usePageLoader = () => {
  return {
    PageLoader,
  };
};
