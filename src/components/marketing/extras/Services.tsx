import React from 'react';

export default function Services() {
  return (
    <section className="max-w-[1170px] w-full mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 xl:px-0 bg-gray-50 shadow-xl rounded-xl mt-12">
      <div className="mx-auto">
        {/* Our Services Section */}
        <div className="mb-12 px-10">
          <h2 className="text-[#4a36ec] text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-center md:text-left">OUR SERVICES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Content */}
            <div className="text-gray-600 space-y-4 text-base sm:text-lg md:text-xl text-center md:text-justify">
              <p>
                SpePas is a streamlined online marketplace that connects anyone—car owners, mechanics, or sellers—to the auto parts they
                need. Our easy-to-use platform makes it simple to find or offer parts under one roof.
              </p>
              <p>
                By partnering with key industry players, we guarantee a reliable, well–connected network that improves part quality,
                availability, and access. With a broad selection at your fingertips, SpePas delivers choice, convenience, and confidence
                every time.
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
