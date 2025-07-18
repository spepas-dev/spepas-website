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
    <section className="overflow-hidden pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">User Feedbacks</h2>
          <div className="flex gap-4">
            <button
              onClick={prev}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            >
              ›
            </button>
          </div>
        </div>

        {/* carousel track */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500"
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
      </div>
    </section>
  )
}

export default Testimonials
