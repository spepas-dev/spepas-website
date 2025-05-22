import React from 'react';

export default function Services() {
  return (
    <section className="max-w-[1170px] w-full mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 xl:px-0 bg-gray-50 shadow-xl rounded-xl mt-12">
      <div className="mx-auto">
        {/* Our Services Section */}
        <div className="mb-12">
          <h2 className="text-[#4a36ec] text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-center md:text-left">OUR SERVICES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Content */}
            <div className="text-gray-600 space-y-4 text-base sm:text-lg md:text-xl text-center md:text-justify">
              <p>
                SpePas is an online marketplace designed to bridge the gap between buyers and sellers of auto parts. Whether you’re a car
                owner or mechanic looking for a specific part, a seller seeking a broader customer base, or an industry partner aiming to
                enhance accessibility, our platform offers a simple and efficient solution.
              </p>
              <p>
                We collaborate with key industry partners to ensure a reliable and well-connected ecosystem that benefits all stakeholders.
                By working together, we enhance the accessibility, quality, and availability of auto parts, making it easier for buyers to
                find what they need and for sellers to reach the right customers. With a wide range of parts available at your fingertips,
                SpePas brings choice, convenience, and confidence to the auto parts market.
              </p>
            </div>

            {/* Image Content */}
            <div className="relative flex flex-col items-center md:block">
              {/* Service Image 1 */}
              <img
                src="/images/products/service image 1.jpg"
                alt="Service Image 1"
                className="
                  rounded-lg shadow
                  w-2/3 sm:w-3/4 md:w-[300px]
                  transform
                  md:absolute md:top-0 md:left-0
                  md:-translate-x-[-10%] md:-translate-y-[5%]
                "
              />

              {/* Service Image 2 */}
              <img
                src="/images/products/service image 2.jpg"
                alt="Service Image 2"
                className="
                  rounded-lg shadow
                  w-1/2 sm:w-2/5 md:w-[250px]
                  mt-4 md:mt-0
                  transform translate-x-[5%] translate-y-[0]
                  md:absolute md:bottom-0 md:right-0 md:translate-y-[10%]
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
