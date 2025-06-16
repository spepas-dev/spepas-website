// src/components/layout/alt-home/AltHomeLayout.tsx
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';

/**
 * A full-screen, edge-to-edge layout for the AltHome page.
 * Includes page-transition animations but no header/footer or max-width container.
 */
const AltHomeLayout: React.FC = () => {
  const location = useLocation();

  return (
    <HelmetProvider>
      <div className="min-h-screen w-full bg-background">
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </HelmetProvider>
  );
};

export default AltHomeLayout;
