'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { fadeUp, stagger, viewportOnce } from '@/lib/motion'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from './brand-icons'
import { LotusMark } from './lotus-logo'

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Marketplace', href: '/#services' },
      { label: 'Logistics', href: 'https://logistics.lotusriseglobal.com/' },
      { label: 'Investment Rewards', href: '/#services' },
      { label: 'Agent Network', href: '/agents' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog & Insights', href: '/blog' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Admin Console', href: '/admin' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/contact' },
      { label: 'Vendor Support', href: '/vendors' },
      { label: 'Track Order', href: 'https://logistics.lotusriseglobal.com/' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
]

const socials = [FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon]

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-ink text-background">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]"
      >
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2.5">
            <LotusMark className="text-gold" />
            <div className="leading-none">
              <span className="font-heading text-xl font-extrabold">LotusRise</span>
              <span className="block text-[0.6rem] font-semibold tracking-[0.4em] text-gold">
                GLOBAL
              </span>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/70">
            Tanzania&apos;s next-generation digital commerce, logistics and
            investment ecosystem — connecting customers, vendors and agents.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm text-background/70">
            <a href="tel:+255711788830" className="flex items-center gap-2 transition-colors hover:text-gold">
              <Phone className="h-4 w-4 text-gold" /> +255 711 788 830
            </a>
            <a href="mailto:info@lotusriseglobal.com" className="flex items-center gap-2 transition-colors hover:text-gold">
              <Mail className="h-4 w-4 text-gold" /> info@lotusriseglobal.com
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" /> Dar es Salaam, Tanzania
            </span>
          </div>
        </motion.div>

        {columns.map((col) => (
          <motion.div key={col.title} variants={fadeUp}>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-background">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6">
          <p className="text-xs text-background/60">
            © {new Date().getFullYear()} LotusRise Global. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                aria-label="Social link"
                whileHover={{ scale: 1.2, rotate: 6 }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10 text-background/80 transition-colors hover:bg-gold hover:text-ink"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
