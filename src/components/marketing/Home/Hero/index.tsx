// src/components/Hero.tsx
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
    <section className="w-full overflow-hidden pb-4 lg:pb-8.5 xl:pb-12 pt-4.5 sm:pt-6 lg:pt-9 xl:pt-16.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Carousel */}
        <div className="relative z-10 rounded-[10px] bg-white overflow-hidden">
          {/* background shapes */}
          <img
            src="/images/hero/hero-bg.png"
            alt="hero background shapes"
            className="absolute right-0 bottom-0 -z-10
    w-32    
    sm:w-48 
    md:w-72 
    lg:w-[534px] 
    h-auto"
            width={534}
            height={520}
          />
          <HeroCarousel />
        </div>
      </div>

      <div className="max-w-[1170px] w-full mx-auto bg-[#F6F7FB] pb-8 lg:pb-12.5 xl:pb-15 border-rounded-[20px] mt-6 sm:mt-8 lg:mt-12 xl:mt-16.5 shadow-md overflow-hidden">
        {/* Featured Products */}
        <div className="pt-8 pl-4 sm:pl-8 xl:pl-8 pr-2">
          <h2 className="text-dark text-xl font-semibold mb-4">
            Featured Products
          </h2>

          <div className="relative">
            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none' }}
            >
              <div className="flex gap-5">
                {[1,2,3,4,5,6,7,8].map((n) => (
                  <div
                    key={n}
                    className="min-w-[250px] rounded-[10px] bg-white p-4 sm:p-7.5 flex-shrink-0"
                  >
                    <div className="flex items-center gap-14">
                      <div>
                        <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-5">
                          <a href="#">{`Item ${n}`}</a>
                        </h2>
                        <p className="font-medium text-gray-500 text-sm mb-1.5">
                          offer
                        </p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-xl text-red-500">
                            GH₵ {n * 100}
                          </span>
                        </span>
                      </div>
                      <img
                        src={`/images/products/part ${n}.jpg`}
                        alt={`Item ${n}`}
                        width={123}
                        height={161}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleScrollLeft}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full shadow-md hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleScrollRight}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full shadow-md hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hero features (you already imported) */}
        <HeroFeature />
      </div>
    </section>
  );
};

export default Hero;
