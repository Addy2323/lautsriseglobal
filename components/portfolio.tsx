'use client'

import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Briefcase, ShoppingCart, Truck } from 'lucide-react'
import Image from 'next/image'
import { fadeUp, scaleIn, stagger, viewportOnce } from '@/lib/motion'

const projects = [
  {
    icon: ShoppingCart,
    title: 'Retail & E-Commerce',
    desc: 'Empowering vendors and brands to reach more customers.',
    img: '/images/portfolio-retail.png',
  },
  {
    icon: Truck,
    title: 'Logistics & Delivery',
    desc: 'Reliable logistics solutions that connect people and businesses.',
    img: '/images/portfolio-logistics.png',
  },
  {
    icon: BarChart3,
    title: 'Investment & Finance',
    desc: 'Helping customers grow through smart investment opportunities.',
    img: '/images/portfolio-finance.png',
  },
  {
    icon: Briefcase,
    title: 'Business Solutions',
    desc: 'Digital tools and services that simplify and grow your business.',
    img: '/images/portfolio-business.png',
  },
]

export function Portfolio() {
  return (
    <section id="portfolio" className="bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">
            Our Portfolio
          </h2>
          <a
            href="#"
            className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            View All Projects <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {projects.map(({ icon: Icon, title, desc, img }) => (
            <motion.article
              key={title}
              variants={scaleIn}
              className="group relative h-48 sm:h-56 overflow-hidden rounded-xl"
            >
              <Image
                src={img || '/placeholder.svg'}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-start p-5 text-background">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gold/90 text-ink">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-heading text-sm font-bold">{title}</h3>
                </div>
                <p className="mt-2 max-w-[14rem] text-xs leading-relaxed text-background/85">
                  {desc}
                </p>
                <span className="mt-3 inline-flex translate-y-3 items-center gap-1.5 text-xs font-semibold text-gold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  View Project <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
