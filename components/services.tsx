'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Gift,
  ShoppingBag,
  Truck,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { scaleIn, stagger, viewportOnce } from '@/lib/motion'

const services = [
  {
    icon: ShoppingBag,
    title: 'LotusRise Marketplace',
    desc: 'Buy products from verified vendors across multiple categories.',
    cta: 'Shop Now',
    href: '/#services',
  },
  {
    icon: Truck,
    title: 'LotusRise Logistics',
    desc: 'Source, ship and deliver products locally and internationally.',
    cta: 'Learn More',
    href: '/#services',
  },
  {
    icon: Gift,
    title: 'Investment Rewards',
    desc: 'Earn cashback and rewards that can be directed to licensed investment providers.',
    cta: 'Explore Rewards',
    href: '/#services',
  },
  {
    icon: Briefcase,
    title: 'Business Solutions',
    desc: 'Powerful tools for vendors, agents and businesses to manage operations efficiently.',
    cta: 'Discover Solutions',
    href: '/business-solutions',
  },
  {
    icon: Users,
    title: 'Agent Network',
    desc: 'Join our agent network and earn income by serving customers and vendors.',
    cta: 'Join Now',
    href: '/agents',
  },
]

export function Services() {
  return (
    <section id="services" className="bg-background py-10 sm:py-12 lg:py-16">
      <motion.div
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      >
        {services.map(({ icon: Icon, title, desc, cta, href }) => (
          <motion.article
            key={title}
            variants={scaleIn}
            whileHover={{ y: -6 }}
            className="group rounded-xl border border-border bg-accent/30 p-5 transition-colors hover:border-gold/50 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
          >
            <motion.div
              whileHover={{ rotate: 8 }}
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/15 text-gold"
            >
              <Icon className="h-5 w-5" />
            </motion.div>
            <h3 className="mt-4 font-heading text-base font-bold text-ink">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {desc}
            </p>
            <Link
              href={href}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-all group-hover:gap-2.5"
            >
              {cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
