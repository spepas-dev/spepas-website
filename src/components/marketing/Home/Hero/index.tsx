'use client';

import { useRef } from 'react';

import HeroCarousel from './HeroCarousel';
import HeroFeature from './HeroFeature';

const Hero = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollOffset = 300; // pixels to scroll on arrow click

  // useEffect(() => {
  //   let requestId;
  //   const scrollContainer = scrollRef.current;
  //   const speed = 0.5; // pixels per frame

  //   const scrollStep = () => {
  //     if (scrollContainer) {
  //       scrollContainer.scrollLeft += speed;
  //       // Reset scroll when reaching the end
  //       if (
  //         scrollContainer.scrollLeft >=
  //         scrollContainer.scrollWidth - scrollContainer.clientWidth
  //       ) {
  //         scrollContainer.scrollLeft = 0;
  //       }
  //     }
  //     requestId = requestAnimationFrame(scrollStep);
  //   };

  //   requestId = requestAnimationFrame(scrollStep);
  //   return () => cancelAnimationFrame(requestId);
  // }, []);

  // Functions to handle manual scrolling via arrows
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current?.scrollBy({ left: -scrollOffset, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current?.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full overflow-hidden pb-4 lg:pb-8.5 xl:pb-12   pt-4.5 sm:pt-6 lg:pt-9 xl:pt-16.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Carousel */}
        <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
          {/* bg shapes */}
          <img src="/images/hero/hero-bg.png" alt="hero bg shapes" className="absolute right-0 bottom-0 -z-1" width={534} height={520} />
          <HeroCarousel />
        </div>
      </div>
      <div className=" max-w-[1170px] w-full mx-auto bg-[#F6F7FB] pb-8 lg:pb-12.5 xl:pb-15 pr-2">
        {/* Featured Products */}
        <div className="pt-8 pl-4 sm:pl-8 xl:pl-8">
          <h2 className="text-dark text-xl font-semibold mb-4">Featured Products</h2>
          {/* Relative container to hold scroll container and arrows */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={handleScrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-[#F6F7FB] bg-opacity-0 rounded-full shadow-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Horizontal scroll container */}
            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide"
              // Inline styles to hide scrollbars for Firefox (Webkit handled by .scrollbar-hide class)
              style={{ scrollbarWidth: 'none' }}
            >
              <div className="flex gap-5">
                {/* Product Card 1 */}
                <div className="min-w-[250px] relative rounded-[10px] bg-white p-4 sm:p-7.5 flex-shrink-0">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-5">
                        <a href="#">Item 1</a>
                      </h2>
                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">offer</p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-heading-5 text-red">GH₵ 200</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <img src="/images/products/part 1.jpg" alt="product image" width={123} height={161} />
                    </div>
                  </div>
                </div>

                {/* Product Card 2 */}
                <div className="min-w-[250px] relative rounded-[10px] bg-white p-4 sm:p-7.5 flex-shrink-0">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-5">
                        <a href="#">Item 2</a>
                      </h2>
                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">offer</p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-heading-5 text-red">GH₵ 500</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <img src="/images/products/part 2.jpg" alt="mobile image" width={123} height={161} />
                    </div>
                  </div>
                </div>

                {/* Product Card 3 */}
                <div className="min-w-[250px] relative rounded-[10px] bg-white p-4 sm:p-7.5 flex-shrink-0">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-5">
                        <a href="#">Item 3</a>
                      </h2>
                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">offer</p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-heading-5 text-red">GH₵ 750</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <img src="/images/products/part 3.jpg" alt="mobile image" width={123} height={161} />
                    </div>
                  </div>
                </div>

                {/* Product Card 4 */}
                <div className="min-w-[250px] relative rounded-[10px] bg-white p-4 sm:p-7.5 flex-shrink-0">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-5">
                        <a href="#">Item 4</a>
                      </h2>
                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">offer</p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-heading-5 text-red">GH₵ 321</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <img src="/images/products/part 4.jpg" alt="mobile image" width={123} height={161} />
                    </div>
                  </div>
                </div>

                {/* Product Card 5 */}
                <div className="min-w-[250px] relative rounded-[10px] bg-white p-4 sm:p-7.5 flex-shrink-0">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-5">
                        <a href="#">Item 5</a>
                      </h2>
                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">offer</p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-heading-5 text-red">GH₵ 999</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <img src="/images/products/part 5.jpg" alt="mobile image" width={123} height={161} />
                    </div>
                  </div>
                </div>

                {/* Product Card 6 */}
                <div className="min-w-[250px] relative rounded-[10px] bg-white p-4 sm:p-7.5 flex-shrink-0">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-5">
                        <a href="#">Item 6</a>
                      </h2>
                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">offer</p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-heading-5 text-red">GH₵ 150</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <img src="/images/products/part 6.jpg" alt="mobile image" width={123} height={161} />
                    </div>
                  </div>
                </div>

                {/* Product Card 7 */}
                <div className="min-w-[250px] relative rounded-[10px] bg-white p-4 sm:p-7.5 flex-shrink-0">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-5">
                        <a href="#">Item 7</a>
                      </h2>
                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">offer</p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-heading-5 text-red">GH₵ 25</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <img src="/images/products/part 7.jpg" alt="mobile image" width={123} height={161} />
                    </div>
                  </div>
                </div>

                {/* Product Card 8 */}
                <div className="min-w-[250px] relative rounded-[10px] bg-white p-4 sm:p-7.5 flex-shrink-0">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-5">
                        <a href="#">Item 8</a>
                      </h2>
                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">offer</p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-heading-5 text-red">GH₵ 5</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <img src="/images/products/part 8.jpg" alt="mobile image" width={123} height={161} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleScrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-[#F6F7FB] bg-opacity-0 rounded-full shadow-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        {/* Hero features */}
        <HeroFeature />
      </div>
    </section>
  );
};

export default Hero;
