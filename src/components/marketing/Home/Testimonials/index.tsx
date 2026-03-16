// src/components/Testimonials.tsx
import React, { useState, useEffect, useCallback } from 'react'
import SingleItem from './SingleItem'
import testimonialsData from './testimonialsData'

const Testimonials: React.FC = () => {
  // current “page” (0-indexed)
  const [index, setIndex] = useState(0)
  // how many slides to show at once, based on window width
  const [visible, setVisible] = useState(3)

  // adjust visible count on resize
  useEffect(() => {
    const calcVisible = () => {
      const w = window.innerWidth
      if (w < 768) setVisible(1)
      else if (w < 1200) setVisible(2)
      else setVisible(3)
      // also clamp index so we never overshoot
      setIndex(i => Math.min(i, testimonialsData.length - visible))
    }
    window.addEventListener('resize', calcVisible)
    calcVisible()
    return () => window.removeEventListener('resize', calcVisible)
  }, [visible])

  const prev = useCallback(() => {
    setIndex(i =>
      i === 0
        ? testimonialsData.length - visible
        : Math.max(0, i - 1)
    )
  }, [visible])

  const next = useCallback(() => {
    setIndex(i =>
      i + visible >= testimonialsData.length
        ? 0
        : i + 1
    )
  }, [visible])

  // percentage offset per “page”
  const translateX = -(index * (100 / visible))

  return (
    <section className="overflow-hidden pb-16 pt-12">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* header */}
        <h2 className="text-2xl font-semibold mb-6">What Our Users Say</h2>

        {/* carousel with flanking arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="hidden sm:flex flex-shrink-0 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative overflow-hidden flex-1 py-2">
            <div
              className="flex items-stretch transition-transform duration-500"
              style={{ transform: `translateX(${translateX}%)` }}
            >
              {testimonialsData.map((t, i) => (
                <div
                  key={i}
                  className="px-2"
                  style={{ minWidth: `${100 / visible}%` }}
                >
                  <SingleItem testimonial={t} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={next}
            className="hidden sm:flex flex-shrink-0 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
