'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView, animate } from 'framer-motion'
import { Store, Truck, Wallet, Briefcase, Award, Globe, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { fadeUp, scaleIn, stagger, viewportOnce } from '@/lib/motion'

interface Project {
  id: string
  title: string
  category: 'Marketplace' | 'Logistics' | 'Fintech' | 'Business Solutions'
  description: string
  tech: string[]
  gradient: string
}

const projects: Project[] = [
  {
    id: 'marketplace-platform',
    title: 'LotusRise Marketplace Platform',
    category: 'Marketplace',
    description: 'A multi-vendor e-commerce marketplace empowering 500+ verified Tanzanian sellers to reach local and global buyers.',
    tech: ['React', 'Next.js', 'TailwindCSS', 'Node.js'],
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
  },
  {
    id: 'smart-delivery',
    title: 'Smart Delivery Network',
    category: 'Logistics',
    description: 'Real-time routing, SMS notifications, and live GPS tracking system for last-mile delivery services.',
    tech: ['TypeScript', 'Go', 'Redis', 'WebSockets'],
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
  },
  {
    id: 'rewards-engine',
    title: 'Cashback & Rewards Engine',
    category: 'Fintech',
    description: 'An automated customer loyalty reward platform that directs cashback percentages to licensed investment providers.',
    tech: ['Python', 'Django', 'PostgreSQL', 'Secure APIs'],
    gradient: 'from-indigo-600 via-purple-500 to-pink-500',
  },
  {
    id: 'vendor-dashboard',
    title: 'Vendor Dashboard Pro',
    category: 'Business Solutions',
    description: 'Real-time sales analytics, inventory trackers, and automatic invoice generator for LotusRise vendors.',
    tech: ['Next.js', 'Chart.js', 'Prisma', 'PostgreSQL'],
    gradient: 'from-rose-500 via-red-500 to-amber-500',
  },
  {
    id: 'agent-app',
    title: 'Agent Mobile App',
    category: 'Marketplace',
    description: 'On-the-ground agents app facilitating onboarding, local collections, and instant commission payouts.',
    tech: ['React Native', 'TypeScript', 'TailwindCSS'],
    gradient: 'from-blue-600 via-indigo-500 to-cyan-500',
  },
  {
    id: 'cross-border-hub',
    title: 'Cross-Border Trade Hub',
    category: 'Logistics',
    description: 'Customs documentation tracking and cargo consolidation framework for trade across East African borders.',
    tech: ['Node.js', 'Express', 'MongoDB', 'Docker'],
    gradient: 'from-purple-600 via-pink-600 to-rose-500',
  },
  {
    id: 'lotus-pay',
    title: 'Lotus Pay Gateway',
    category: 'Fintech',
    description: 'Unified checkout platform integrating local mobile money (M-Pesa, Tigo Pesa) with international cards.',
    tech: ['Next.js', 'NestJS', 'Stripe API', 'RabbitMQ'],
    gradient: 'from-cyan-500 via-teal-500 to-emerald-500',
  },
  {
    id: 'warehousing-system',
    title: 'Smart Warehousing & Fulfillment',
    category: 'Business Solutions',
    description: 'RFID-enabled stock management and order dispatching optimization for metropolitan fulfillment centers.',
    tech: ['Rust', 'GraphQL', 'React', 'SQLite'],
    gradient: 'from-amber-600 via-red-600 to-purple-600',
  },
]

const categories = ['All', 'Marketplace', 'Logistics', 'Fintech', 'Business Solutions'] as const

function Counter({ to, format }: { to: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref}>{format(value)}</span>
}

export function PortfolioPageContent() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All')

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  return (
    <div className="py-16 lg:py-24">
      {/* Category Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gold text-ink shadow-lg shadow-gold/20'
                  : 'bg-foreground/5 text-foreground/75 hover:bg-foreground/10 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <motion.div 
          layout
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                variants={scaleIn}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.9, y: 15, transition: { duration: 0.25 } }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-black/5"
              >
                {/* Image Placeholder cover */}
                <div className={`relative h-48 w-full bg-gradient-to-tr ${project.gradient} p-6 flex flex-col justify-end overflow-hidden`}>
                  <div className="absolute inset-0 bg-ink/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative z-10 w-fit rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-semibold text-white">
                    {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-gold transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  
                  {/* Tech stack */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="rounded-md bg-foreground/5 px-2 py-0.5 text-xs text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stats Section */}
      <section className="mt-14 sm:mt-20 lg:mt-28 bg-ink py-16 text-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center lg:text-left"
          >
            {[
              { icon: Briefcase, to: 8, label: 'Projects Active', format: (n: number) => `${Math.round(n)}+` },
              { icon: Users, to: 500, label: 'Vendors Served', format: (n: number) => `${Math.round(n)}+` },
              { icon: Globe, to: 15, label: 'Countries Supported', format: (n: number) => `${Math.round(n)}+` },
              { icon: Award, to: 99.9, label: 'System Uptime', format: (n: number) => `${n.toFixed(1)}%` },
            ].map(({ icon: Icon, to, label, format }) => (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className="flex flex-col lg:flex-row items-center gap-4"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-heading text-2xl sm:text-3xl font-extrabold text-gold leading-none">
                    <Counter to={to} format={format} />
                  </p>
                  <p className="mt-1 text-sm text-background/70 font-medium">{label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="mx-auto mt-14 max-w-4xl px-4 text-center sm:px-6 sm:mt-20 lg:mt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-gold/20 bg-gold/5 p-5 sm:p-8 md:p-12"
        >
          <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            Partner with us to deploy digital solutions, scale your business, or leverage our agent networks.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-gold/15 hover:shadow-gold/25 transition-all duration-300 hover:scale-[1.02]"
          >
            Get In Touch <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
