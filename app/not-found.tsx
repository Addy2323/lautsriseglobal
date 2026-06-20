'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Home, Search, Compass, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { LotusLogo } from '@/components/lotus-logo'

/* ─────── floating particle system ─────── */
interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

function useParticles(count: number): Particle[] {
  const [particles, setParticles] = useState<Particle[]>([])
  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.5 + 0.15,
      })),
    )
  }, [count])
  return particles
}

/* ─────── animated lotus SVG ─────── */
function AnimatedLotus() {
  const petalPaths = [
    // center petal
    'M50 25 C50 25, 42 42, 50 55 C58 42, 50 25, 50 25',
    // left petals
    'M50 30 C45 28, 28 35, 22 48 C30 50, 44 46, 50 42',
    'M50 35 C42 32, 18 40, 10 55 C20 58, 40 50, 50 45',
    // right petals
    'M50 30 C55 28, 72 35, 78 48 C70 50, 56 46, 50 42',
    'M50 35 C58 32, 82 40, 90 55 C80 58, 60 50, 50 45',
    // outer left
    'M50 38 C38 34, 8 45, 2 62 C14 66, 38 55, 50 48',
    // outer right
    'M50 38 C62 34, 92 45, 98 62 C86 66, 62 55, 50 48',
  ]

  return (
    <svg viewBox="0 0 100 80" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="lotus-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.82 0.14 75)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="oklch(0.72 0.13 75)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="petal-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.85 0.15 80)" />
          <stop offset="100%" stopColor="oklch(0.6 0.12 65)" />
        </linearGradient>
        <linearGradient id="petal-deep" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.75 0.13 75)" />
          <stop offset="50%" stopColor="oklch(0.6 0.12 65)" />
          <stop offset="100%" stopColor="oklch(0.5 0.1 60)" />
        </linearGradient>
        <filter id="petal-blur">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>

      {/* glow behind lotus */}
      <motion.circle
        cx="50"
        cy="45"
        r="30"
        fill="url(#lotus-glow)"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* petals */}
      {petalPaths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill={i < 3 ? 'url(#petal-gold)' : 'url(#petal-deep)'}
          stroke="oklch(0.82 0.14 75)"
          strokeWidth="0.3"
          opacity={0.85}
          filter="url(#petal-blur)"
          initial={{ opacity: 0, scale: 0.3, transformOrigin: '50px 50px' }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.8 + i * 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      {/* base water arc */}
      <motion.path
        d="M20 60 Q35 55, 50 58 Q65 55, 80 60"
        stroke="oklch(0.72 0.13 75)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 1.5, delay: 2, ease: 'easeOut' }}
      />
      <motion.path
        d="M25 63 Q37 58, 50 61 Q63 58, 75 63"
        stroke="oklch(0.72 0.13 75)"
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 2.3, ease: 'easeOut' }}
      />
    </svg>
  )
}

/* ─────── quick-link cards ─────── */
const quickLinks = [
  {
    icon: Home,
    label: 'Home',
    desc: 'Return to the homepage',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Services',
    desc: 'Explore our offerings',
    href: '/#services',
  },
  {
    icon: Search,
    label: 'Contact',
    desc: 'Get in touch with us',
    href: '/contact',
  },
]

/* ─────── main 404 page ─────── */
export default function NotFoundPage() {
  const particles = useParticles(30)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink flex flex-col items-center justify-center">
      {/* ── deep background gradient layers ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.22 0.03 75 / 0.5), transparent), radial-gradient(ellipse 60% 50% at 30% 70%, oklch(0.2 0.02 60 / 0.3), transparent), radial-gradient(ellipse 50% 40% at 80% 30%, oklch(0.18 0.04 80 / 0.25), transparent)',
        }}
      />

      {/* ── grid pattern overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(oklch(0.72 0.13 75) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.13 75) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── floating particles ── */}
      <AnimatePresence>
        {mounted &&
          particles.map((p) => (
            <motion.div
              key={p.id}
              className="pointer-events-none absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: `oklch(0.72 0.13 75 / ${p.opacity})`,
                boxShadow: `0 0 ${p.size * 3}px oklch(0.72 0.13 75 / ${p.opacity * 0.5})`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, p.opacity, 0],
                scale: [0, 1, 0],
                y: [0, -80 - Math.random() * 60],
                x: [0, (Math.random() - 0.5) * 40],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
      </AnimatePresence>

      {/* ── top logo ── */}
      <motion.div
        className="absolute left-4 top-4 sm:left-8 sm:top-8 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <LotusLogo textClass="!text-background" />
      </motion.div>

      {/* ── main content ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center px-4 sm:px-6 text-center max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* animated lotus */}
        <motion.div variants={itemVariants} className="w-32 h-28 sm:w-44 sm:h-36 mb-4">
          <AnimatedLotus />
        </motion.div>

        {/* 404 number */}
        <motion.div variants={itemVariants} className="relative mb-2">
          <h1
            className="font-heading text-[6rem] sm:text-[8rem] md:text-[10rem] font-black leading-none tracking-tighter"
            style={{
              background:
                'linear-gradient(135deg, oklch(0.85 0.15 80), oklch(0.72 0.13 75), oklch(0.55 0.1 60))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </h1>
          {/* glow behind 404 */}
          <div
            className="absolute inset-0 -z-10 blur-3xl opacity-20"
            style={{
              background: 'oklch(0.72 0.13 75)',
            }}
          />
        </motion.div>

        {/* heading */}
        <motion.h2
          variants={itemVariants}
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-background mb-3"
        >
          Page Not Found
        </motion.h2>

        {/* description */}
        <motion.p
          variants={itemVariants}
          className="text-background/55 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed mb-8"
        >
          The page you&apos;re looking for seems to have drifted away like a lotus petal on water.
          Let us guide you back.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-3 mb-12 w-full sm:w-auto"
        >
          <Link href="/" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: '0 12px 32px oklch(0.72 0.13 75 / 0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-ink cursor-pointer transition-shadow"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </motion.div>
          </Link>
          <button
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="w-full sm:w-auto cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.04, borderColor: 'oklch(0.72 0.13 75)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 rounded-xl border border-background/20 px-7 py-3.5 text-sm font-bold text-background/80 transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </motion.div>
          </button>
        </motion.div>

        {/* quick link cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl"
        >
          {quickLinks.map((link, i) => (
            <Link key={link.label} href={link.href}>
              <motion.div
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden rounded-2xl border border-background/10 bg-background/[0.04] backdrop-blur-sm p-5 cursor-pointer transition-colors hover:border-gold/30 hover:bg-background/[0.08]"
              >
                {/* shimmer on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-background/5 to-transparent" />
                <div className="relative z-10 flex flex-col items-center gap-2.5 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold transition-transform group-hover:scale-110">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-background group-hover:text-gold transition-colors">
                      {link.label}
                    </p>
                    <p className="text-[11px] text-background/40 mt-0.5">{link.desc}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* decorative sparkle line */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 mt-10 text-background/25 text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-gold/40" />
          <span>LotusRise Global — Shop Smart. Earn Smart. Grow Smart.</span>
          <Sparkles className="h-3.5 w-3.5 text-gold/40" />
        </motion.div>
      </motion.div>

      {/* ── bottom glow accent ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 15%, oklch(0.72 0.13 75 / 0.4), transparent 85%)',
        }}
      />
    </div>
  )
}
