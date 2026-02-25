import React, { useRef } from 'react';
import HeroCarousel from './HeroCarousel';
import HeroFeature from './HeroFeature';

const Hero: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollOffset = 300;

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollOffset, behavior: 'smooth' });
  };
  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollOffset, behavior: 'smooth' });
  };

  return (
    <section className="w-full overflow-hidden pt-2 sm:pt-4 lg:pt-6">
      {/* Hero Carousel */}
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative z-10 rounded-2xl bg-gradient-to-br from-white to-blue-light-5/30 overflow-hidden shadow-2">
          <img
            src="/images/hero/hero-bg.png"
            alt=""
            aria-hidden="true"
            className="absolute right-0 bottom-0 -z-10 w-32 sm:w-48 md:w-72 lg:w-[534px] h-auto opacity-60"
            width={534}
            height={520}
          />
          <HeroCarousel />
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-[1170px] w-full mx-auto mt-8 sm:mt-10 lg:mt-14">
        <div className="bg-white rounded-2xl shadow-2 overflow-hidden px-4 sm:px-8 py-8 sm:py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-dark font-semibold text-xl sm:text-2xl">
                Featured Products
              </h2>
              <p className="text-dark-3 text-sm mt-1">Top picks from our marketplace</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleScrollLeft}
                aria-label="Scroll left"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-1 border border-gray-3 hover:bg-blue hover:text-white hover:border-blue transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleScrollRight}
                aria-label="Scroll right"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-1 border border-gray-3 hover:bg-blue hover:text-white hover:border-blue transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide -mx-1"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex gap-4 sm:gap-5 px-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="min-w-[220px] sm:min-w-[260px] rounded-xl border border-gray-3 bg-white p-4 sm:p-5 flex-shrink-0 hover:shadow-3 hover:border-blue-light-4 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-dark text-base sm:text-lg mb-1 truncate">
                        <a href="#" className="hover:text-blue transition-colors">{`Item ${n}`}</a>
                      </h3>
                      <p className="text-dark-4 text-xs sm:text-sm mb-2">Auto part</p>
                      <span className="font-bold text-lg sm:text-xl text-blue">
                        GH₵ {n * 100}
                      </span>
                    </div>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-1 flex-shrink-0">
                      <img
                        src={`/images/products/part ${n}.jpg`}
                        alt={`Item ${n}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
