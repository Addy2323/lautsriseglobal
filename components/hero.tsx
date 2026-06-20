'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Store, UserPlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { stagger } from '@/lib/motion'

const MotionLink = motion(Link)

const headline = [
  { gold: 'Shop', rest: 'Smart.' },
  { gold: 'Earn', rest: 'Smart.' },
  { gold: 'Grow', rest: 'Smart.' },
]

const ctas = [
  { label: 'Start Shopping', icon: ShoppingBag, variant: 'gold', href: '/#services' },
  { label: 'Become a Vendor', icon: Store, variant: 'dark', href: '/vendors' },
  { label: 'Become an Agent', icon: UserPlus, variant: 'outline', href: '/agents' },
] as const

const wordVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-accent/40 to-background pt-28 lg:pt-36">
      {/* Premium background image overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12] pointer-events-none"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80')",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)"
        }}
      />

      {/* soft animated background glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:pb-24">
        {/* Left copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold-deep"
          >
            One Platform. Endless Opportunities.
          </motion.span>

          <motion.h1
            variants={stagger(0.14, 0.15)}
            initial="hidden"
            animate="show"
            className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {headline.map((line) => (
              <motion.span key={line.gold} variants={wordVariant} className="block">
                <span className="text-gold">{line.gold}</span>{' '}
                <span>{line.rest}</span>
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground"
          >
            LotusRise connects customers, vendors, agents, logistics partners and
            financial service providers through one digital ecosystem.
          </motion.p>

          <motion.div
            variants={stagger(0.15, 0.9)}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap gap-3"
          >
            {ctas.map(({ label, icon: Icon, variant, href }) => (
              <MotionLink
                key={label}
                href={href}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{ y: -3, boxShadow: '0 12px 26px rgba(0,0,0,0.14)' }}
                whileTap={{ scale: 0.97 }}
                className={
                  'flex w-full sm:w-auto items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-colors ' +
                  (variant === 'gold'
                    ? 'bg-gold text-ink'
                    : variant === 'dark'
                      ? 'bg-ink text-background'
                      : 'border border-border bg-background text-foreground hover:border-gold hover:text-gold')
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </MotionLink>
            ))}
          </motion.div>
        </div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/images/hero-ecosystem.png"
              alt="LotusRise digital commerce ecosystem with marketplace, logistics and investment rewards"
              width={720}
              height={560}
              priority
              className="h-auto w-full"
            />
          </motion.div>

          <EcosystemNetwork />
        </motion.div>
      </div>
    </section>
  )
}

// Pulsing nodes + flowing connection lines overlaid on the hero visual
function EcosystemNetwork() {
  const nodes = [
    { x: '12%', y: '20%' },
    { x: '50%', y: '8%' },
    { x: '86%', y: '24%' },
    { x: '78%', y: '70%' },
    { x: '20%', y: '74%' },
  ]
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <motion.line
          x1="12%" y1="20%" x2="50%" y2="8%"
          stroke="var(--gold)" strokeWidth="1" strokeDasharray="4 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.6, delay: 1 }}
        />
        <motion.line
          x1="50%" y1="8%" x2="86%" y2="24%"
          stroke="var(--gold)" strokeWidth="1" strokeDasharray="4 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.6, delay: 1.3 }}
        />
        <motion.line
          x1="20%" y1="74%" x2="78%" y2="70%"
          stroke="var(--gold)" strokeWidth="1" strokeDasharray="4 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.6, delay: 1.5 }}
        />
      </svg>
      {nodes.map((n, i) => (
        <motion.span
          key={i}
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
          style={{ left: n.x, top: n.y }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </div>
  )
}
