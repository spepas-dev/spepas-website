import React, { useState, useEffect, useCallback } from 'react'
import SingleItem from './SingleItem'
import testimonialsData from './testimonialsData'

const Testimonials: React.FC = () => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(3)

  useEffect(() => {
    const calcVisible = () => {
      const w = window.innerWidth
      if (w < 640) setVisible(1)
      else if (w < 1024) setVisible(2)
      else setVisible(3)
      setIndex((i) => Math.min(i, Math.max(0, testimonialsData.length - visible)))
    }
    window.addEventListener('resize', calcVisible)
    calcVisible()
    return () => window.removeEventListener('resize', calcVisible)
  }, [visible])

  const prev = useCallback(() => {
    setIndex((i) =>
      i === 0 ? Math.max(0, testimonialsData.length - visible) : Math.max(0, i - 1)
    )
  }, [visible])

  const next = useCallback(() => {
    setIndex((i) =>
      i + visible >= testimonialsData.length ? 0 : i + 1
    )
  }, [visible])

  const translateX = -(index * (100 / visible))

  return (
    <section className="overflow-hidden bg-gray-1 py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span className="inline-block text-blue font-medium text-sm tracking-wide uppercase mb-2">
              Testimonials
            </span>
            <h2 className="text-dark font-bold text-2xl sm:text-3xl lg:text-4xl">
              What Our Customers Say
            </h2>
            <p className="text-dark-3 text-base sm:text-lg mt-2 max-w-lg">
              Real stories from people who trust SpePas for their auto parts needs.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex items-center justify-center w-11 h-11 rounded-full bg-white border border-gray-3 hover:bg-blue hover:text-white hover:border-blue shadow-1 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex items-center justify-center w-11 h-11 rounded-full bg-blue text-white border border-blue hover:bg-blue-dark shadow-1 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${translateX}%)` }}
          >
            {testimonialsData.map((t, i) => (
              <div
                key={i}
                className="px-2 sm:px-3"
                style={{ minWidth: `${100 / visible}%` }}
              >
                <SingleItem testimonial={t} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.max(1, testimonialsData.length - visible + 1) }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-blue' : 'w-2 bg-gray-4'
                }`}
              />
            )
          )}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
