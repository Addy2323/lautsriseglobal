'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export function Preloader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    // 5 seconds automatic timeout to allow loader to play, unless skipped
    const t = setTimeout(() => setDone(true), 5000)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (done) document.body.style.overflow = ''
  }, [done])

  const letters = "LOTUSRISE".split("")

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.4
      }
    }
  }

  const letterVariants: any = {
    hidden: { opacity: 0.15, y: 15, filter: 'blur(3px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  }

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#f3d070] via-[#d4af37] to-[#aa831b] select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
        >
          {/* Skip Close Button */}
          <motion.button
            onClick={() => setDone(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="absolute top-6 right-6 sm:top-10 sm:right-10 h-10 w-10 flex items-center justify-center rounded-full bg-[#07080b] text-[#f3d070] hover:bg-neutral-900 transition-colors shadow-lg cursor-pointer"
            aria-label="Skip loading"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </motion.button>

          {/* Central Circular Progress Spinner */}
          <div className="relative h-36 w-36 flex items-center justify-center">
            {/* Spinning wrapper */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Track circle (semi-transparent) */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(7, 8, 11, 0.08)"
                  strokeWidth="1.8"
                />
                {/* Active progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#07080b"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0.1, strokeDasharray: "1 2" }}
                  animate={{ 
                    pathLength: [0.15, 0.85, 0.15],
                    strokeDashoffset: [0, -360]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  }}
                />
              </svg>
            </motion.div>

            {/* Subtle inner pulsing ring */}
            <motion.div
              className="h-24 w-24 rounded-full border border-black/5 bg-black/[0.01]"
              animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.15, 0.35, 0.15] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>

          {/* Logo Name Display (LOTUSRISE) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-10 flex items-center justify-center gap-2 sm:gap-3 text-[#07080b]"
          >
            {letters.map((letter, idx) => (
              <motion.span
                key={idx}
                variants={letterVariants}
                className="font-heading text-3xl sm:text-4xl font-extrabold tracking-[0.1em]"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          {/* Small subtitle indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-3 text-[10px] uppercase font-bold tracking-[0.4em] text-[#07080b]"
          >
            G l o b a l
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
