import { Testimonial } from './testimonialsData'

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-testimonial border border-gray-3/30 h-full flex flex-col">
      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-dark-2 text-sm sm:text-base leading-relaxed flex-1 mb-6">
        "{testimonial.review}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-3/50">
        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-blue-light-5">
          <img
            src={testimonial.authorImg}
            alt={testimonial.authorName}
            className="w-full h-full object-cover"
            width={44}
            height={44}
          />
        </div>
        <div>
          <h3 className="font-semibold text-dark text-sm">{testimonial.authorName}</h3>
          <p className="text-dark-4 text-xs">{testimonial.authorRole}</p>
        </div>
      </div>
    </div>
  )
}

export default SingleItem
