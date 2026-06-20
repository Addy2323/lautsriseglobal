'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeUp, stagger } from '@/lib/motion'

export function PageBanner({
  eyebrow,
  title,
  description,
  breadcrumb,
  backgroundImage,
}: {
  eyebrow: string
  title: string
  description: string
  breadcrumb: string
  backgroundImage?: string
}) {
  const defaultBg = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80";
  const bgUrl = backgroundImage || defaultBg;

  return (
    <section className="relative overflow-hidden bg-ink pt-28 text-white lg:pt-36">
      {/* Premium background image texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.35] pointer-events-none"
        style={{ backgroundImage: `url('${bgUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent pointer-events-none" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-10 h-96 w-96 rounded-full bg-gold/15 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        variants={stagger(0.12)}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:pb-20"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="mt-5 max-w-3xl text-balance font-heading text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
          style={{ color: '#ffffff' }}
        >
          {title}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-2xl text-pretty leading-relaxed"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          {description}
        </motion.p>
        <motion.nav
          variants={fadeUp}
          className="mt-6 flex items-center gap-2 text-sm"
          aria-label="Breadcrumb"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          <Link href="/" className="transition-colors hover:text-gold" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-gold">{breadcrumb}</span>
        </motion.nav>
      </motion.div>
    </section>
  )
}
