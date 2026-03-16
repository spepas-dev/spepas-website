// src/components/marketing/Home/AdvertSlider/index.tsx
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { getActiveSliders } from '@/lib/advertApis';
import type { SliderData } from '@/lib/advertZodValidation';

const AdvertSlider: React.FC = () => {
  const {
    data: response,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['advert-sliders'],
    queryFn: getActiveSliders,
    staleTime: 5 * 60 * 1000,
    retry: false
  });

  const slides: SliderData[] = response?.data ?? [];

  // Don't render the section at all if no adverts, not loading, or errored
  if ((!isLoading && slides.length === 0) || isError) {
    return null;
  }

  return (
    <section className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 mt-8 sm:mt-10 lg:mt-14">
      {isLoading ? (
        // Skeleton loader
        <div className="rounded-xl overflow-hidden bg-gray-100 animate-pulse h-[280px] sm:h-[320px] lg:h-[360px]" />
      ) : (
        <Swiper
          spaceBetween={0}
          centeredSlides
          loop={slides.length > 1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={slides.length > 1}
          modules={[Autoplay, Pagination, Navigation]}
          className="advert-slider rounded-xl overflow-hidden shadow-lg"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.slider_id}>
              <div className="relative w-full h-[280px] sm:h-[320px] lg:h-[360px] bg-gradient-to-r from-indigo-50 to-blue-50">
                {/* Background image */}
                <img src={slide.url} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                {/* Text content */}
                <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 lg:px-14 max-w-xl">
                  <h3 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3 drop-shadow-md">{slide.title}</h3>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed drop-shadow-sm line-clamp-3">
                    {slide.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Scoped styles for navigation arrows */}
      <style>
        {`
          .advert-slider .swiper-button-next,
          .advert-slider .swiper-button-prev {
            color: white;
            background: rgba(0, 0, 0, 0.3);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            backdrop-filter: blur(4px);
          }
          .advert-slider .swiper-button-next:after,
          .advert-slider .swiper-button-prev:after {
            font-size: 16px;
            font-weight: bold;
          }
          .advert-slider .swiper-button-next:hover,
          .advert-slider .swiper-button-prev:hover {
            background: rgba(0, 0, 0, 0.5);
          }
          .advert-slider .swiper-pagination-bullet {
            background: white;
            opacity: 0.6;
          }
          .advert-slider .swiper-pagination-bullet-active {
            opacity: 1;
            background: white;
          }
        `}
      </style>
    </section>
  );
};

export default AdvertSlider;
