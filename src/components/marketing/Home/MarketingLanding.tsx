// src/components/marketing/Home/MarketingLanding.tsx
import Services from '../extras/Services';
// import Values from '../extras/Values';
import BestSeller from './BestSeller';
import Hero from './Hero';
import Testimonials from './Testimonials';

const MarketingLanding = () => {
  return (
    <main>
      <Hero />
      {/* <Values /> */}
      <Services />
      {/* <Categories /> */}
      {/* <NewArrival /> */}
      {/* <PromoBanner /> */}
      <BestSeller />
      {/* <CounDown /> */}
      <Testimonials />
      {/* <Newsletter /> */}
    </main>
  );
};

export default MarketingLanding;
