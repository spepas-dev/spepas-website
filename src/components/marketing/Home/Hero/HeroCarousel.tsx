// src/components/HeroCarousel.tsx
import React from 'react'
// import 'swiper/css'
// import 'swiper/css/pagination'

import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const HeroCarousel: React.FC = () => {
  return (
    <>
      {/* Inline keyframes and neon-pulse CSS */}
      <style>
        {`
          /* === Fade-in and Slow Bounce (existing) === */
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes bounceSlow {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-8px); }
          }

          /* === Neon Pulse Keyframes (pulseOut) === */
          @keyframes pulseOut {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }

          /* === Shine Keyframes ===
             - Total duration: 2s
             - 0%–60%: keep the “shine” element off to the left
             - 65%: slide it fully to the right
             - 100%: keep it off to the right until the 8s cycle repeats
          */
          @keyframes shine {
            0%, 60% {
              left: -100%;
            }
            65% {
              left: 100%;
            }
            100% {
              left: 100%;
            }
          }

          /* === .shine-text styling ===
             - position:relative & overflow:hidden so the ::before gradient can move across
             - display:inline-block so width matches the text content
          */
          .shine-text {
            position: relative;
            display: inline-block;
            overflow: hidden;
          }
          .shine-text::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              120deg,
              transparent 0%,
              rgba(255, 255, 255, 0.8) 50%,
              transparent 100%
            );
            transform: skewX(-20deg);
            animation: shine 8s ease-in-out infinite;
          }

          /* === Neon-Pulse Button Styles === */
          .neon-pulse {
            position: relative;
           
            border: 2px solid #0000FF;
            box-shadow: 0 0 10px rgba(42, 18, 255, 0.3);
            overflow: visible;
          }

          .neon-pulse::before,
          .neon-pulse::after {
            content: "";
            position: absolute;
            inset: -2px; /* expand 4px beyond the button’s bounding box */
            border: 2px solid rgba(65, 65, 255, 0.33);
            border-radius: inherit;
            animation: pulseOut 3s ease-out infinite;
            opacity: 0;
          }

          /* Stagger the second pulse for continuous effect */
          
        `}
      </style>

      <Swiper
        spaceBetween={30}
        centeredSlides
        autoplay={{ delay: 30000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="hero-carousel w-full"
      >
        <SwiperSlide className="w-full">
          <div className="flex flex-col-reverse lg:flex-row items-center pt-6 lg:pt-0">
            {/* TEXT + NEON BUTTON */}
            <div className="w-full lg:w-1/2 max-w-[500px] py-10 pl-4 lg:pl-12">
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                <h1
                  className="shine-text font-semibold text-3xl sm:text-5xl text-blue opacity-0"
                  style={{ animation: 'fadeIn 1s ease-in-out forwards' }}
                >
                  Welcome to SpePas
                </h1>
              </div>

              <p
                className="text-base text-gray-600 opacity-0"
                style={{ animation: 'fadeIn 1s ease-in-out 0.5s forwards' }}
              >
                SpePas is the marketplace for unique and reliable auto parts. From trusted workshops to bespoke restorations,
                we bring transparency, trust, and a human touch to every transaction.
              </p>

              <div className="flex justify-center mt-10">
                <a
                  href="/95668339501103956045/shop"
                  className="
                    neon-pulse
                    inline-flex items-center justify-center
                    font-medium text-white text-custom-sm
                    rounded-full
                    py-3 px-9
                    bg-gradient-to-r from-blue-400 to-indigo-700
                    shadow-lg hover:shadow-2xl
                    transform hover:scale-105
                    transition duration-300 ease-out
                  "
                  style={{
                    opacity: 0,
                    animation:
                      'fadeIn 1s ease-in-out 1s forwards, bounceSlow 2s ease-in-out 2s infinite',
                  }}
                >
                  Shop Now
                </a>
              </div>
            </div>


            {/* HERO IMAGE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
              <img
                src="/images/hero/image1.png"
                alt="image1"
                className="
                  w-full
                  max-w-md
                  h-auto
                  object-contain
                  lg:max-w-none
                  opacity-0
                "
                style={{
                  animation: 'fadeIn 1s ease-in-out 1s forwards',
                }}
              />
            </div>
          </div>
        </SwiperSlide>

        {/* Add more <SwiperSlide> blocks for additional slides if needed */}
      </Swiper>
    </>
  )
}

export default HeroCarousel
