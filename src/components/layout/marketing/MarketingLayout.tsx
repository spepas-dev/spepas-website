// src/components/layout/marketing/MarketingLayout.tsx
import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Footer from './Footer';
import Header from './Header';
import ScrollToTop from '@/components/Scroll/ScrollToTop';

export const MarketingLayout = () => {
  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <ScrollToTop />
        <Header />

        <main className="flex-grow">
          <Outlet />
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};
