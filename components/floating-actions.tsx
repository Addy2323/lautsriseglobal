'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.459 3.475 1.332 4.992L2 22l5.161-1.354c1.477.805 3.141 1.229 4.843 1.229h.005c5.505 0 9.988-4.483 9.988-9.988C22 4.482 17.518 2 12.012 2zm5.792 14.195c-.247.697-1.2 1.286-1.652 1.341-.453.056-.913.076-1.517-.118-.358-.115-.811-.274-1.393-.524-2.474-1.06-4.072-3.578-4.195-3.743-.122-.165-.988-1.314-.988-2.508 0-1.194.61-1.782.827-2.023.218-.241.477-.302.637-.302.16 0 .32.001.458.007.143.006.335-.054.524.398.195.467.669 1.631.727 1.751.059.12.098.261.018.421-.079.16-.12.261-.24.4-.12.14-.251.312-.358.421-.12.12-.244.251-.105.489.138.237.616 1.017 1.323 1.647.912.812 1.681 1.063 1.919 1.182.238.119.377.1.516-.06.139-.16.601-.703.761-.943.16-.24.32-.2.538-.12.218.08 1.385.653 1.624.772.239.119.398.179.458.281.06.1.06.581-.187 1.278z" />
    </svg>
  )
}

export function FloatingActions() {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100
        setScrollPercentage(scrolled)
      } else {
        setScrollPercentage(0)
      }
      setVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Radius = 18px, Circumference = 2 * PI * r ≈ 113.1
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (scrollPercentage / 100) * circumference

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-4 sm:bottom-6 sm:right-6">
      {/* WhatsApp Button */}
      <motion.a
        href="whatsapp://send?phone=255711788830"
        aria-label="Chat on WhatsApp"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20 transition-colors hover:bg-[#20ba5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/35 sm:h-14 sm:w-14"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </motion.a>

      {/* Back to Top Indicator Button */}
      <AnimatePresence>
        {visible && (
          <motion.button
            key="back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-lg border border-border text-primary transition-colors focus:outline-none focus:ring-4 focus:ring-gold/30 hover:border-gold/30 sm:h-14 sm:w-14"
          >
            {/* Scroll Indicator Circle */}
            <svg className="absolute inset-0 -rotate-90 h-full w-full pointer-events-none" viewBox="0 0 44 44">
              {/* Background circle */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-muted-foreground/15"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-gold"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <ArrowUp className="h-5 w-5 text-foreground hover:text-gold transition-colors duration-200" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
