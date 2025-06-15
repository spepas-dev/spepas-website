// src/components/PromoBanner.tsx
import React from 'react';

const PromoBanner: React.FC = () => {
  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* ——— Large Promo ——— */}
        <div className="relative z-10 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-dark mb-3">Apple iPhone 14 Plus</span>
            <h2 className="font-bold text-xl lg:text-4xl xl:text-5xl text-dark mb-5">UP TO 30% OFF</h2>
            <p className="text-base mb-7.5">
              iPhone 14 has the same superspeedy chip that’s in iPhone 13 Pro— A15 Bionic with a 5-core GPU powering all the latest
              features.
            </p>
            <a
              href="#"
              className="inline-flex font-medium text-sm text-white bg-blue py-[11px] px-9.5 rounded-md hover:bg-blue-dark transition mt-7.5"
            >
              Buy Now
            </a>
          </div>
          <img
            src="/images/promo/promo-01.png"
            alt="iPhone 14 Plus"
            className="absolute bottom-0 right-4 lg:right-26 -z-10 w-auto h-[350px]"
          />
        </div>

        {/* ——— Small Promos ——— */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7.5">
          {/* Promo 2 */}
          <div className="relative z-10 overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <img
              src="/images/promo/promo-02.png"
              alt="Treadmill"
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-10 w-[241px] h-[241px]"
            />
            <div className="text-right">
              <span className="block text-lg text-dark mb-1.5">Foldable Motorised Treadmill</span>
              <h2 className="font-bold text-xl lg:text-4xl text-dark mb-2.5">Workout At Home</h2>
              <p className="font-semibold text-sm text-teal mb-9">Flat 20% off</p>
              <a
                href="#"
                className="inline-flex font-medium text-sm text-white bg-teal py-2.5 px-8.5 rounded-md hover:bg-teal-dark transition"
              >
                Grab Now
              </a>
            </div>
          </div>

          {/* Promo 3 */}
          <div className="relative z-10 overflow-hidden rounded-lg bg-[#FFECE1] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <img
              src="/images/promo/promo-03.png"
              alt="Apple Watch Ultra"
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-10 w-[200px] h-[200px]"
            />
            <div>
              <span className="block text-lg text-dark mb-1.5">Apple Watch Ultra</span>
              <h2 className="font-bold text-xl lg:text-4xl text-dark mb-2.5">
                Up to <span className="text-orange">40%</span> off
              </h2>
              <p className="max-w-[285px] text-sm mb-7.5">The aerospace-grade titanium case strikes the perfect balance of everything.</p>
              <a
                href="#"
                className="inline-flex font-medium text-sm text-white bg-orange py-2.5 px-8.5 rounded-md hover:bg-orange-dark transition"
              >
                Buy Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
