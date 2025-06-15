// src/components/marketing/Home/AltHome/index.tsx
import React, { useState, useEffect } from 'react'

const AltHome: React.FC = () => {
  // Countdown logic (same as before)
  const calculateTimeLeft = () => {
    const now = new Date()
    const thisYear = now.getFullYear()
    const target = new Date(
      `${now.getMonth() + 1}/${now.getDate()}/${thisYear + 1} 07:07:07`
    )
    const diff = target.getTime() - now.getTime()
    if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' }
    const sec = 1000,
      min = 60 * sec,
      hr = 60 * min,
      day = 24 * hr
    return {
      days: String(Math.floor(diff / day)).padStart(2, '0'),
      hours: String(Math.floor((diff % day) / hr)).padStart(2, '0'),
      minutes: String(Math.floor((diff % hr) / min)).padStart(2, '0'),
      seconds: String(Math.floor((diff % min) / sec)).padStart(2, '0'),
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full flex flex-col items-center bg-white">
      {/* 1) Top “hero” div with a fixed height and background */}
      <div
        className="w-full 
      h-[200px]       /* mobile */
      sm:h-[300px]    /* small+ */
      md:h-[400px]    /* medium+ */
      lg:h-[500px]    /* large+ */
      xl:h-[600px]    /* xl+ */
      bg-[url('/images/landing/gearsFall.jpg')]
      bg-center
      bg-cover
      bg-no-repeat"
      />

      {/* 2) Main content, pulled up over that background */}
      <div className="relative
      -mt-24           /* mobile */
      sm:-mt-32        /* small+ */
      md:-mt-40        /* medium+ */
      lg:-mt-48        /* large+ */
      xl:-mt-56        /* xl+ */
      px-4
      text-center
      max-w-screen-xl  /* expand your max width on desktop */
      w-full
      space-y-6
      mx-auto">
        {/* Logo */}
        <div className="mx-auto w-24 h-24 sm:w-80 sm:h-80 mt-6">
          <img src="/images/logo/Logos.png" alt="SpePas Logo" className="w-full h-full object-contain" />
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-blue-400">
          COMING SOON
        </h1>

        {/* Description */}
        <p className="text-gray-700 max-w-2xl mx-auto">
          SpePas is Ghana’s online marketplace for new and used car parts. We connect
          buyers, sellers, and mechanics—making it easy to find the right part and get it
          delivered fast.
        </p>

        {/* Countdown */}
        {/* <ul className="flex justify-center gap-8 text-blue-800 mt-8">
          {(['days','hours','minutes','seconds'] as const).map((unit, i) => (
            <li key={unit} className="flex flex-col items-center">
              <span className="text-3xl font-semibold">{timeLeft[unit]}</span>
              <span className="text-xs uppercase">{unit}</span>
              {i < 3 && <span className="text-3xl mx-2"></span>}
            </li>
          ))}
        </ul> */}
      </div>
    </section>
  )
}

export default AltHome
