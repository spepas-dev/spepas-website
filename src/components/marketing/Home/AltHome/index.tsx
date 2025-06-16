// src/components/marketing/Home/AltHome/index.tsx
import React from 'react'

const AltHome: React.FC = () => {
  return (
    <section className="relative w-full lg:h-screen">
      {/* Neon's inline styles for pulse effect */}
      <style>
        {`
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
          .neon-pulse {
            position: relative;
            border: 2px solid #0000FF;
            box-shadow: 0 0 10px rgba(42, 18, 255, 0.3);
            overflow: visible;
            border-radius: 2rem; /* match rounded-md */
          }
          .neon-pulse::before,
          .neon-pulse::after {
            content: "";
            position: absolute;
            inset: -2px;
            border: 2px solid rgba(65, 65, 255, 0.33);
            border-radius: inherit;
            animation: pulseOut 3s ease-out infinite;
            opacity: 0;
          }
          .neon-pulse::after {
            animation-delay: 1.5s;
          }
        `}
      </style>

      {/* 1) Hero image container */}
      <div
        className="
          relative w-full
          min-h-[200px]
          sm:min-h-[300px]
          md:min-h-[480px]
          lg:h-screen
        "
      >
        <img
          src="/images/landing/gearsFall.jpg"
          alt="Gears background"
          className="w-full h-full object-cover opacity-50"
        />
        {/* 2) Overlayed content */}
        <div
          className="
            absolute inset-0
            flex flex-col items-center
            justify-start
            pt-8 sm:pt-12 md:pt-16 lg:pt-0
            px-4 space-y-6 text-center
            max-w-screen-xl mx-auto w-full
          "
        >
          {/* Logo */}
          <div className="w-24 h-24 sm:w-48 sm:h-48 lg:w-56 lg:h-56">
            <img
              src="/images/logo/Logos.png"
              alt="SpePas Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-400">
            COMING SOON
          </h1>

          {/* Description */}
          <p className="text-gray-700 max-w-2xl mx-auto">
            SpePas is Ghana’s online marketplace for new and used car parts. We connect
            buyers, sellers, and mechanics—making it easy to find the right part and get it
            delivered fast.
          </p>

          {/* Early Access Neon Button */}
          <div className="mt-2 text-center">
              <a
                href="https://forms.office.com/r/M4akU0t8US"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  neon-pulse
                  inline-block items-center justify-center
                  font-medium text-white text-custom-sm
                  py-3 px-8
                  bg-gradient-to-r from-blue-400 to-indigo-700
                  shadow-lg hover:shadow-2xl
                  transform hover:scale-105
                  transition duration-300 ease-out
                "
                style={{
                  opacity: 75,
                    animation:
                      'fadeIn 1s ease-in-out 1s forwards, bounceSlow 2s ease-in-out 2s infinite',
                }}
              >
                Get Early Access
              </a>
            </div>

          {/* What You Can Do Section */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-8 pb-10">
            <h2 className="text-xl sm:text-2xl lg:text-lg font-semibold text-blue-400">
              What You Can Do on SpePas:
            </h2>
            <ul className="list-disc list-inside marker:text-blue-500 space-y-1 text-gray-700 text-sm sm:text-base lg:text-sm">
              <li>Search for new and used auto parts</li>
              <li>Post a request if you can’t find what you need</li>
              <li>List parts for sale</li>
              <li>Get reliable delivery through our trusted riders</li>
              <li>Shop confidently with verified listings</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base lg:text-sm">
              SpePas brings the parts to you—quick, simple, and hassle-free.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AltHome;
