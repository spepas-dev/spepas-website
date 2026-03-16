import { motion } from 'framer-motion';

import Logo from '@/assets/logo.svg';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative">
        {/* Background Circle Animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#4A36EC]/10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 1.2, 1],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Logo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: 'easeOut'
          }}
          className="relative"
        >
          {/* Logo SVG with Gear Animation */}
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="w-24 h-24"
          >
            <img src={Logo} alt="Logo" className="w-full h-full" />
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.5
            }}
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#4A36EC] font-medium">Loading</span>
              <motion.div
                className="flex gap-1"
                initial="start"
                animate="end"
                variants={{
                  start: {
                    transition: {
                      staggerChildren: 0.2
                    }
                  },
                  end: {
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
              >
                {[0, 1, 2].map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#4A36EC]"
                    variants={{
                      start: {
                        y: 0
                      },
                      end: {
                        y: [0, -5, 0]
                      }
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#4A36EC]"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 1.5],
            opacity: [1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      </div>
    </div>
  );
}

// Optional: Export a hook to manage the loader state
export const usePageLoader = () => {
  return {
    PageLoader
    // Add any additional loader state management here
  };
};
