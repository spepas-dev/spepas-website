import Services from '../extras/Services';
import AdvertSlider from './AdvertSlider';
import Hero from './Hero';
import Testimonials from './Testimonials';

const MarketingLanding = () => {
  return (
    <main className="overflow-hidden">
      <Hero />
      <AdvertSlider />
      <Services />
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="relative bg-dark rounded-2xl overflow-hidden px-6 sm:px-12 lg:px-20 py-14 sm:py-16 lg:py-20 text-center">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue/10 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              <h2 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4 max-w-2xl mx-auto">
                Ready to Find the Perfect Part?
              </h2>
              <p className="text-gray-4 text-base sm:text-lg max-w-xl mx-auto mb-8">
                Join thousands of satisfied customers who trust SpePas for quality auto
                parts, secure payments, and reliable delivery.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/95668339501103956045/shop"
                  className="
                    inline-flex items-center justify-center
                    font-semibold text-dark text-sm sm:text-base
                    rounded-lg h-12 sm:h-[52px] px-8 sm:px-10
                    bg-white hover:bg-gray-1
                    shadow-md hover:shadow-lg
                    transform hover:-translate-y-0.5
                    transition-all duration-300
                  "
                >
                  Start Shopping
                  <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="/95668339501103956045/contact"
                  className="
                    inline-flex items-center justify-center
                    font-semibold text-white text-sm sm:text-base
                    rounded-lg h-12 sm:h-[52px] px-8 sm:px-10
                    bg-white/10 hover:bg-white/20 border border-white/20
                    transform hover:-translate-y-0.5
                    transition-all duration-300
                  "
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MarketingLanding;
