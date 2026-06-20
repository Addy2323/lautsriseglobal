'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown, Store, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/effect-fade'

/* ═══════════════════════════════════════════════════════
   SLIDE DATA
   ═══════════════════════════════════════════════════════ */

interface SlideData {
  badge: string
  headline: string[]
  description: string
  image: string
  position?: string
}

const slides: SlideData[] = [
  {
    badge: 'Business Ecosystem',
    headline: ['Dream Big.', 'Take Action.', 'Build Your Future.'],
    description:
      'LotusRise Global connects entrepreneurs, vendors, agents and businesses with opportunities designed for growth.',
    image: '/images/HERO/tz_office.jpg',
    position: 'center 10%',
  },
  {
    badge: 'Entrepreneurship',
    headline: ['Every Great Business', 'Started With', 'One Decision.'],
    description:
      'Your journey to success begins with taking the first step today.',
    image: '/images/HERO/tz_ecommerce.jpg',
    position: 'center 10%',
  },
  {
    badge: 'Logistics & Sourcing',
    headline: ['Move Products.', 'Move Markets.', 'Move Forward.'],
    description:
      'Connecting businesses and customers through reliable logistics and sourcing solutions.',
    image: '/images/HERO/tz_logistics.jpg',
    position: 'center 10%',
  },
  {
    badge: 'Marketplace',
    headline: ['Your Products', 'Deserve A', 'Bigger Market.'],
    description:
      'Reach more customers and grow your business through the LotusRise ecosystem.',
    image: '/images/HERO/product1.jpeg',
    position: 'center',
  },
  {
    badge: 'Agent Network',
    headline: ['Earn More.', 'Grow Faster.', 'Lead Locally.'],
    description:
      'Become a LotusRise Agent and build a sustainable business in your community.',
    image: '/images/HERO/tz_agent.jpg',
    position: 'center 10%',
  },
  {
    badge: 'Investment & Rewards',
    headline: ['Spend Smart.', 'Earn Rewards.', 'Build Wealth.'],
    description:
      'Transform everyday transactions into long-term financial opportunities.',
    image: '/images/HERO/product2.png',
    position: 'center',
  },
]

/* CTA buttons shown on every slide */
const ctas = [
  {
    label: 'Get Started',
    icon: ArrowRight,
    href: '/#services',
    style: 'primary' as const,
  },
  {
    label: 'Become a Vendor',
    icon: Store,
    href: '/vendors',
    style: 'secondary' as const,
  },
  {
    label: 'Become an Agent',
    icon: UserPlus,
    href: '/agents',
    style: 'tertiary' as const,
  },
]

const MotionLink = motion.create(Link)

/* ═══════════════════════════════════════════════════════
   GOLDEN PARTICLES
   ═══════════════════════════════════════════════════════ */

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
  drift: number
}

function GoldenParticles({ count = 28 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3.5 + 1.5,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 6,
        opacity: Math.random() * 0.4 + 0.1,
        drift: (Math.random() - 0.5) * 50,
      })),
    )
  }, [count])

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,160,58,${p.opacity + 0.2}), rgba(212,160,58,0))`,
            boxShadow: `0 0 ${p.size * 4}px rgba(212,160,58,${p.opacity * 0.6})`,
          }}
          animate={{
            y: [0, -(60 + Math.random() * 80)],
            x: [0, p.drift],
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [0.4, 1, 1, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SLIDE PROGRESS INDICATOR
   ═══════════════════════════════════════════════════════ */

function SlideIndicators({
  total,
  active,
  onGo,
}: {
  total: number
  active: number
  onGo: (i: number) => void
}) {
  return (
    <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5 sm:bottom-10">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onGo(i)}
          aria-label={`Go to slide ${i + 1}`}
          className="group relative h-2 cursor-pointer rounded-full transition-all duration-500"
          style={{ width: i === active ? 40 : 12 }}
        >
          {/* track */}
          <span className="absolute inset-0 rounded-full bg-white/20" />
          {/* fill */}
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #D4A03A, #b8860b)',
              transformOrigin: 'left',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: i === active ? 1 : 0 }}
            transition={
              i === active
                ? { duration: 10, ease: 'linear' }
                : { duration: 0.3 }
            }
          />
        </button>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SCROLL INDICATOR
   ═══════════════════════════════════════════════════════ */

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-24 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ delay: 3 }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-4 w-4 text-gold" />
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   HERO SLIDE CONTENT (animated per-slide)
   ═══════════════════════════════════════════════════════ */

function SlideContent({ slide, isActive }: { slide: SlideData; isActive: boolean }) {
  const lineDelay = 0.2
  const descDelay = lineDelay + slide.headline.length * 0.18 + 0.15
  const ctaDelay = descDelay + 0.3

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={slide.badge}
          className="relative z-20 mx-auto flex min-h-dvh max-w-7xl flex-col justify-center px-5 sm:px-8 lg:min-h-0 lg:max-w-none lg:flex-none lg:px-0 lg:mx-0"
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <div className="max-w-3xl pt-28 sm:pt-32 lg:pt-36 lg:max-w-xl xl:max-w-2xl">
            {/* Badge pill */}
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                },
                exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
              }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4A03A]/30 bg-[#D4A03A]/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D4A03A] backdrop-blur-sm sm:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4A03A] animate-pulse" />
              {slide.badge}
            </motion.span>

            {/* Headline — line by line reveal */}
            <h1 className="mb-6 font-heading leading-[1.05] tracking-tight">
              {slide.headline.map((line, i) => (
                <motion.span
                  key={line}
                  className="block text-[2.2rem] font-extrabold text-white sm:text-[3.2rem] md:text-[4.2rem] lg:text-[4.2rem] xl:text-[4.8rem]"
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 40,
                      clipPath: 'inset(0 0 100% 0)',
                    },
                    show: {
                      opacity: 1,
                      y: 0,
                      clipPath: 'inset(0 0 0% 0)',
                      transition: {
                        duration: 0.9,
                        delay: lineDelay + i * 0.18,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                    exit: {
                      opacity: 0,
                      y: -20,
                      transition: { duration: 0.25, delay: i * 0.05 },
                    },
                  }}
                >
                  {/* Highlight the last word in gold */}
                  {line.split(' ').map((word, wi, arr) => {
                    const isLast = wi === arr.length - 1
                    return (
                      <span
                        key={wi}
                        className={isLast ? 'text-[#D4A03A]' : ''}
                      >
                        {word}
                        {!isLast ? ' ' : ''}
                      </span>
                    )
                  })}
                </motion.span>
              ))}
            </h1>

            {/* Description */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: descDelay,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
                exit: { opacity: 0, transition: { duration: 0.2 } },
              }}
              className="mb-10 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg md:text-xl lg:text-[1.375rem]"
            >
              {slide.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.12, delayChildren: ctaDelay } },
                exit: { transition: { staggerChildren: 0.05 } },
              }}
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
            >
              {ctas.map(({ label, icon: Icon, href, style }) => (
                <MotionLink
                  key={label}
                  href={href}
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.95 },
                    show: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    },
                    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
                  }}
                  whileHover={{
                    y: -3,
                    boxShadow:
                      style === 'primary'
                        ? '0 16px 40px rgba(212,160,58,0.4)'
                        : '0 12px 30px rgba(0,0,0,0.3)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  className={
                    'flex w-full items-center justify-center gap-2.5 rounded-xl px-7 py-4 text-base font-bold transition-colors sm:w-auto sm:text-lg ' +
                    (style === 'primary'
                      ? 'bg-[#D4A03A] text-[#111111] hover:bg-[#c4922e]'
                      : style === 'secondary'
                        ? 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 border border-white/10'
                        : 'border border-white/20 text-white/80 hover:border-[#D4A03A]/50 hover:text-[#D4A03A]')
                  }
                >
                  <Icon className="h-[1.15em] w-[1.15em]" />
                  {label}
                </MotionLink>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN HERO EXPORT
   ═══════════════════════════════════════════════════════ */

export function Hero() {
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [kenBurnsKey, setKenBurnsKey] = useState(0)

  const goToSlide = useCallback((i: number) => {
    swiperRef.current?.slideTo(i)
  }, [])

  return (
    <section
      id="hero"
      className="relative h-dvh w-full overflow-hidden bg-[#111111]"
      aria-label="Hero banner"
    >
      {/* ── Golden Particles ── */}
      <GoldenParticles />

      {/* ── Swiper Slider ── */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1500}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        loop
        allowTouchMove
        onSwiper={(sw) => {
          swiperRef.current = sw
        }}
        onSlideChange={(sw) => {
          setActiveIndex(sw.realIndex)
          setKenBurnsKey((k) => k + 1)
        }}
        className="h-full w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.badge} className="relative">
            <div className="relative flex h-full w-full flex-col lg:grid lg:grid-cols-[1.15fr_0.85fr]">
              {/* ── Left Column: Text (solid dark bg on desktop) ── */}
              <div className="relative z-10 flex h-full w-full flex-col justify-center px-5 sm:px-8 lg:col-start-1 lg:bg-[#111111] lg:pl-16 xl:pl-24">
                {/* Slide Content */}
                <SlideContent slide={slide} isActive={activeIndex === i} />
              </div>

              {/* ── Right Column: Cinematic Visual ── */}
              <div className="absolute inset-0 z-0 lg:relative lg:col-start-2 lg:h-full lg:w-full lg:pt-36 lg:pb-12 lg:pr-12 xl:pr-16">
                <div className="relative h-full w-full overflow-hidden lg:rounded-2xl">
                  {/* Background Image with Ken Burns */}
                  <motion.div
                    key={`kb-${i}-${kenBurnsKey}`}
                    className="h-full w-full"
                    initial={{ scale: 1.06 }}
                    animate={{ scale: 1.0 }}
                    transition={{ duration: 12, ease: 'linear' }}
                  >
                    <div
                      className="h-full w-full bg-cover bg-no-repeat"
                      style={{
                        backgroundImage: `url('${slide.image}')`,
                        backgroundPosition: slide.position || 'center',
                      }}
                    />
                  </motion.div>

                  {/* Overlays */}
                  {/* Mobile-only dark overlay (covers whole image for text protection) */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111111] via-[#111111]/75 to-[#111111]/45 lg:hidden" />

                  {/* Desktop-only cinematic edge fade (blends visual into dark left panel) */}
                  <div
                    className="absolute inset-0 z-10 hidden lg:block"
                    style={{
                      background:
                        'linear-gradient(to right, #111111 0%, rgba(17,17,17,0) 15%, rgba(17,17,17,0) 85%, #111111 100%), linear-gradient(to top, rgba(17,17,17,0.4) 0%, transparent 20%)',
                    }}
                  />
                  
                  {/* Bottom vignette */}
                  <div
                    className="absolute inset-0 z-10 hidden lg:block"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(17,17,17,0.95) 0%, transparent 40%)',
                    }}
                  />

                  {/* Subtle gold accent glow on visual */}
                  <div
                    className="absolute inset-0 z-10 opacity-30"
                    style={{
                      background:
                        'radial-gradient(ellipse 40% 50% at 20% 50%, rgba(212,160,58,0.06), transparent)',
                    }}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Decorative vertical line (right side, desktop) ── */}
      <div className="pointer-events-none absolute right-12 top-0 z-20 hidden h-full w-px lg:block">
        <motion.div
          className="h-full w-full"
          style={{
            background:
              'linear-gradient(to bottom, transparent 10%, rgba(212,160,58,0.15) 40%, rgba(212,160,58,0.15) 60%, transparent 90%)',
          }}
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* ── Right side floating brand text (desktop) ── */}
      <motion.div
        className="pointer-events-none absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ delay: 2, duration: 1.5 }}
      >
        <span
          className="block font-heading text-[8rem] font-black leading-none tracking-tight"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            color: '#ffffff',
          }}
        >
          LR
        </span>
      </motion.div>

      {/* ── Slide Indicators ── */}
      <SlideIndicators
        total={slides.length}
        active={activeIndex}
        onGo={goToSlide}
      />

      {/* ── Scroll Indicator ── */}
      <ScrollIndicator />

      {/* ── Bottom gold accent line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 h-[2px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 5%, #D4A03A 30%, #D4A03A 70%, transparent 95%)',
        }}
      />
    </section>
  )
}
