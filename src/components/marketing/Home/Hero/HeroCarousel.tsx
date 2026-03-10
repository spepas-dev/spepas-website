import React from 'react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const HeroCarousel: React.FC = () => {
  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(40px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-10px); }
          }
          @keyframes shimmer {
            0%, 60% { left: -100%; }
            65%     { left: 100%; }
            100%    { left: 100%; }
          }
          .hero-title {
            position: relative;
            display: inline-block;
            overflow: hidden;
          }
          .hero-title::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              120deg,
              transparent 0%,
              rgba(255, 255, 255, 0.4) 50%,
              transparent 100%
            );
            transform: skewX(-20deg);
            animation: shimmer 6s ease-in-out infinite;
          }
        `}
      </style>

      <Swiper
        spaceBetween={0}
        centeredSlides
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="hero-carousel w-full"
      >
        <SwiperSlide>
          <div className="flex flex-col lg:flex-row items-center min-h-[520px] sm:min-h-[580px] lg:min-h-[85vh] lg:max-h-[720px]">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 px-6 sm:px-10 lg:px-14 xl:px-20 py-12 sm:py-14 lg:py-20 order-2 lg:order-1">
              <span
                className="inline-block text-blue font-medium text-sm sm:text-base tracking-wide uppercase mb-4 opacity-0"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.2s forwards' }}
              >
                Ghana's #1 Auto Parts Marketplace
              </span>

              <h1
                className="hero-title font-bold text-dark text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl leading-[1.1] mb-6 opacity-0"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.4s forwards' }}
              >
                Find the Right Part,{' '}
                <span className="text-blue">Every Time</span>
              </h1>

              <p
                className="text-dark-3 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-[520px] opacity-0"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.6s forwards' }}
              >
                From trusted workshops to bespoke restorations — SpePas brings transparency,
                trust, and convenience to every auto parts transaction.
              </p>

              <div
                className="flex flex-wrap gap-4 opacity-0"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.8s forwards' }}
              >
                <a
                  href="/95668339501103956045/shop"
                  className="
                    inline-flex items-center justify-center
                    font-semibold text-white text-sm sm:text-base
                    rounded-lg
                    h-12 sm:h-14
                    px-8 sm:px-10
                    bg-blue hover:bg-blue-dark
                    shadow-md hover:shadow-lg
                    transform hover:-translate-y-0.5
                    transition-all duration-300 ease-out
                  "
                >
                  Shop Now
                  <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="/95668339501103956045/about-us"
                  className="
                    inline-flex items-center justify-center
                    font-semibold text-blue text-sm sm:text-base
                    rounded-lg
                    h-12 sm:h-14
                    px-8 sm:px-10
                    bg-blue-light-5 hover:bg-blue-light-4
                    transform hover:-translate-y-0.5
                    transition-all duration-300 ease-out
                  "
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-12 order-1 lg:order-2">
              <img
                src="/images/hero/image1.png"
                alt="SpePas auto parts marketplace"
                className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain opacity-0"
                style={{
                  animation: 'fadeInRight 0.8s ease-out 0.4s forwards, float 4s ease-in-out 1.2s infinite',
                }}
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default HeroCarousel
