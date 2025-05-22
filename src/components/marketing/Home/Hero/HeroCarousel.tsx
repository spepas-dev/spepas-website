// src/components/HeroCarousel.tsx
import React from 'react';
// import 'swiper/css';
// import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const HeroCarousel: React.FC = () => {
  return (
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
          <div className="w-full lg:w-1/2 max-w-[500px] py-10 pl-4 lg:pl-12">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-3xl sm:text-heading-1 text-blue">
                <h1>Welcome to SpePas</h1>
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <p>Investor Opportunities</p>
            </h1>

            <p>
              For investors, SpePas presents a unique opportunity to be part of the transformation of the auto parts industry in Ghana and
              West Africa. By getting in early, investors can support an innovative platform poised for growth in an underserved market,
              with strong industry partnerships and a scalable business model driving long-term success.
            </p>

            <a
              href="/shop"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Shop Now
            </a>
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
            <img
              src="/images/hero/image1.png"
              alt="Investor opportunities"
              className="
              w-full          
              max-w-md      
              h-auto
              object-contain
              lg:max-w-none  
              "
            />
          </div>
        </div>
      </SwiperSlide>

      {/*
        // You can duplicate <SwiperSlide> here for more slides…
      */}
    </Swiper>
  );
};

export default HeroCarousel;
