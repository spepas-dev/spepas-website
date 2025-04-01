'use client';
// Import Swiper styles
import 'swiper/css/pagination';
import 'swiper/css';

import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 30000,
        disableOnInteraction: false
      }}
      pagination={{
        clickable: true
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel w-full"
    >
      <SwiperSlide className="w-full">
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[500px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">Welcome To SpePas</span>
              {/* <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                Sale
                <br />
                Off
              </span> */}
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
              href="/shop-with-sidebar"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Shop Now
            </a>
            {/* <a
              href="/#"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Shop Soon
            </a> */}
          </div>

          <div className="py-10 pr-4 mr-4">
            <img src="/images/hero/image1.png" alt="image" width={351 * 2} height={358 * 2} />
          </div>
        </div>
      </SwiperSlide>
      {/* <SwiperSlide>
        {" "}
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-26 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                SPEPAS
              </span>
              
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <a href="#">A nice catchy slogan</a>
            </h1>

            <p>
              Lorem ipsum dolor sit, consectetur elit nunc suscipit non ipsum
              nec suscipit.
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
            >
              Shop Now
            </a>
          </div>

          <div>
            <Image
              src="/images/hero/image2.png"
              alt="headphone"
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide> */}
    </Swiper>
  );
};

export default HeroCarousal;
