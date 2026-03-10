import React, { useState, useEffect, useCallback } from 'react';

const SLIDES = [
  { src: '/images/products/service image 1.jpg', alt: 'Auto parts workshop' },
  { src: '/images/products/service image 2.jpg', alt: 'Spare parts selection' },
  { src: '/images/products/brakepad.jpg', alt: 'Brake pad' },
  { src: '/images/products/spark-plug.jpg', alt: 'Spark plug' },
  { src: '/images/products/hyundai.jpg', alt: 'Hyundai parts' },
];

const INTERVAL = 3000;

export default function Services() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-16 sm:py-20 lg:py-24">
      <div className="bg-white rounded-2xl shadow-2 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
          {/* Text Content */}
          <div className="px-6 sm:px-10 lg:px-14 py-10 sm:py-12 lg:py-16 flex flex-col justify-center">
            <span className="inline-block text-blue font-medium text-sm tracking-wide uppercase mb-3">
              What We Do
            </span>
            <h2 className="text-dark font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-6">
              Your One-Stop Shop for{' '}
              <span className="text-blue">Auto Parts</span>
            </h2>
            <div className="space-y-4 text-dark-3 text-base sm:text-lg leading-relaxed">
              <p>
                SpePas is a streamlined online marketplace that connects anyone — car owners,
                mechanics, or sellers — to the auto parts they need. Our easy-to-use platform
                makes it simple to find or offer parts under one roof.
              </p>
              <p>
                By partnering with key industry players, we guarantee a reliable, well-connected
                network that improves part quality, availability, and access. With a broad
                selection at your fingertips, SpePas delivers choice, convenience, and confidence
                every time.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="/95668339501103956045/shop"
                className="
                  inline-flex items-center justify-center
                  font-semibold text-white text-sm sm:text-base
                  rounded-lg h-12 px-8
                  bg-blue hover:bg-blue-dark
                  shadow-md hover:shadow-lg
                  transform hover:-translate-y-0.5
                  transition-all duration-300
                "
              >
                Browse Parts
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Image Slider */}
          <div
            className="relative px-6 sm:px-10 lg:px-0 pb-10 lg:pb-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative h-[300px] sm:h-[380px] lg:h-full min-h-[300px] overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-6 right-6 bottom-6 left-6 lg:top-10 lg:right-10 lg:bottom-10 lg:left-10 bg-blue-light-5 rounded-2xl" />

              {/* Slides */}
              {SLIDES.map((slide, idx) => (
                <img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  className={`
                    absolute inset-8 lg:inset-12 w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] h-[calc(100%-4rem)] lg:h-[calc(100%-6rem)]
                    rounded-xl shadow-3 object-cover z-10
                    transition-all duration-700 ease-in-out
                    ${idx === current
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95'
                    }
                  `}
                />
              ))}

              {/* Dots indicator */}
              <div className="absolute bottom-3 lg:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`
                      rounded-full transition-all duration-300
                      ${idx === current
                        ? 'w-6 h-2 bg-blue'
                        : 'w-2 h-2 bg-dark/20 hover:bg-dark/40'
                      }
                    `}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
