// src/components/chat/Lightbox.tsx
import React from 'react';

const Lightbox: React.FC<{ src: string; alt?: string; onClose: () => void }> = ({ src, alt, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={onClose}>
      <img src={src} alt={alt} className="max-h-[90vh] max-w-[95vw] object-contain" />
    </div>
  );
};

export default Lightbox;
