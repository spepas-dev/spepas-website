// src/components/layout/auth/AuthLayout.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';


export const AuthLayout = () => {
  const location = useLocation();

  return (
    <HelmetProvider>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md p-6 bg-white shadow-md rounded-md"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </HelmetProvider>
  );
};
