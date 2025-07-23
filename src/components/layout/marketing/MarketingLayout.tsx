// src/components/layout/marketing/MarketingLayout.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Footer from './Footer';
import Header from './Header';
import ScrollToTop from '@/components/Scroll/ScrollToTop';   // ← import it

export const MarketingLayout = () => {
  const location = useLocation();

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <ScrollToTop />        {/* ← drop it in here */}
        <Header />

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow"
          >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Outlet />
            </div>
          </motion.main>
        </AnimatePresence>

        <Footer />
      </div>
    </HelmetProvider>
  );
};
