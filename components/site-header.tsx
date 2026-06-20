'use client'

import { motion, useMotionValueEvent, useScroll, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ChevronDown,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  X,
  ShoppingBag,
  Truck,
  Gift,
  Briefcase,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from './brand-icons'
import { LotusLogo } from './lotus-logo'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/#services', dropdown: true },
  { label: 'Vendors', href: '/vendors' },
  { label: 'Agents', href: '/agents' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog & Insights', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
]

const servicesDropdownItems = [
  {
    icon: ShoppingBag,
    title: 'Marketplace',
    desc: 'Shop premium products from verified local and global vendors.',
    href: '/#services',
  },
  {
    icon: Truck,
    title: 'Logistics',
    desc: 'Reliable cargo shipping, local delivery, and global supply chains.',
    href: '/#services',
  },
  {
    icon: Gift,
    title: 'Rewards',
    desc: 'Earn cashback points on purchases redirected to licensed providers.',
    href: '/#services',
  },
  {
    icon: Briefcase,
    title: 'Business Solutions',
    desc: 'Manage billing, vendor stores, logistics and agent networks.',
    href: '/business-solutions',
  },
  {
    icon: Users,
    title: 'Agent Network',
    desc: 'Earn passive income by serving local buyers and shopkeepers.',
    href: '/agents',
  },
]

const socials = [FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [servicesHovered, setServicesHovered] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))

  return (
    <motion.header
      id="home"
      className="fixed inset-x-0 top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top contact bar */}
      <motion.div
        className="hidden items-center justify-between bg-ink px-6 text-xs text-background/80 lg:flex"
        animate={{ height: scrolled ? 0 : 40, opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        <div className="flex items-center gap-6">
          <a href="tel:+255711788830" className="flex items-center gap-2 transition-colors hover:text-gold">
            <Phone className="h-3.5 w-3.5 text-gold" /> +255 711 788 830
          </a>
          <a href="whatsapp://send?phone=255711788830" className="flex items-center gap-2 transition-colors hover:text-gold">
            <MessageCircle className="h-3.5 w-3.5 text-gold" /> WhatsApp Us
          </a>
          <a href="mailto:info@lotusriseglobal.com" className="flex items-center gap-2 transition-colors hover:text-gold">
            <Mail className="h-3.5 w-3.5 text-gold" /> info@lotusriseglobal.com
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span>Follow us:</span>
          {socials.map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="transition-colors hover:text-gold"
              aria-label="Social link"
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Main nav */}
      <motion.nav
        className="border-b border-border bg-background/95 backdrop-blur"
        animate={{ paddingTop: scrolled ? 10 : 16, paddingBottom: scrolled ? 10 : 16 }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: scrolled ? '0 8px 30px rgba(0,0,0,0.06)' : 'none' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <LotusLogo />

          <ul className="hidden items-center gap-6 xl:flex">
            {navItems.map((item) => {
              const isRoute = item.href.startsWith('/')
              const Comp = isRoute ? Link : 'a'

              if (item.label === 'Services') {
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setServicesHovered(true)}
                    onMouseLeave={() => setServicesHovered(false)}
                  >
                    <Comp
                      href={item.href}
                      className="group flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-gold py-3"
                    >
                      {item.label}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${servicesHovered ? 'rotate-180' : ''}`} />
                      <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 ${servicesHovered ? 'w-full' : 'w-0'}`} />
                    </Comp>

                    {/* Mega Dropdown Menu */}
                    <AnimatePresence>
                      {servicesHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full left-1/2 z-50 mt-1 w-[80vw] max-w-[90vw] md:w-[680px] lg:w-[840px] -translate-x-1/2 rounded-2xl border border-border bg-background p-4 shadow-2xl"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                            {servicesDropdownItems.map((srv) => (
                              <Link
                                key={srv.title}
                                href={srv.href}
                                onClick={() => setServicesHovered(false)}
                                className="group/item flex flex-col items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition duration-300"
                              >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold transition-all group-hover/item:scale-105 group-hover/item:bg-gold/20">
                                  <srv.icon className="h-4.5 w-4.5" />
                                </div>
                                <div className="text-left">
                                  <h4 className="font-bold text-foreground text-xs leading-tight group-hover/item:text-gold transition-colors duration-200">
                                    {srv.title}
                                  </h4>
                                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                                    {srv.desc}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              }

              return (
                <li key={item.label}>
                  <Comp
                    href={item.href}
                    className="group relative flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-gold py-3"
                  >
                    {item.label}
                    {item.dropdown && <ChevronDown className="h-3.5 w-3.5" />}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                  </Comp>
                </li>
              )
            })}
          </ul>

          <div className="hidden items-center gap-3 xl:flex">
            <a
              href="#login"
              className="rounded-md border border-border px-5 py-2 text-sm font-semibold text-foreground transition-all hover:border-gold hover:text-gold"
            >
              Login
            </a>
            <motion.a
              href="#get-started"
              whileHover={{ scale: 1.04, boxShadow: '0 10px 24px rgba(180,130,20,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-md bg-gold px-5 py-2 text-sm font-semibold text-ink"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </motion.a>
          </div>

          <button
            className="text-foreground xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-border px-6 py-3 xl:hidden"
            >
              {navItems.map((item) => {
                if (item.dropdown) {
                  return (
                    <li key={item.label} className="py-1">
                      <button
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground/80 hover:text-gold text-left cursor-pointer"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            mobileServicesOpen ? 'rotate-180 text-gold' : 'text-foreground/50'
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {mobileServicesOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden pl-4 border-l border-border mt-1 space-y-1"
                          >
                            {servicesDropdownItems.map((srv) => {
                              const isSrvRoute = srv.href.startsWith('/')
                              const SrvComp = isSrvRoute ? Link : 'a'
                              return (
                                <li key={srv.title}>
                                  <SrvComp
                                    href={srv.href}
                                    onClick={() => {
                                      setOpen(false)
                                      setMobileServicesOpen(false)
                                    }}
                                    className="flex items-center gap-2.5 py-2 text-xs font-medium text-foreground/75 hover:text-gold transition-colors"
                                  >
                                    <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded bg-gold/10 text-gold">
                                      <srv.icon className="h-3.5 w-3.5" />
                                    </span>
                                    <div>
                                      <span className="block font-bold text-foreground text-xs leading-none">
                                        {srv.title}
                                      </span>
                                    </div>
                                  </SrvComp>
                                </li>
                              )
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                }

                const isRoute = item.href.startsWith('/')
                const Comp = isRoute ? Link : 'a'
                return (
                  <li key={item.label}>
                    <Comp
                      href={item.href}
                      onClick={() => {
                        setOpen(false)
                        setMobileServicesOpen(false)
                      }}
                      className="block py-2 text-sm font-medium text-foreground/80 hover:text-gold"
                    >
                      {item.label}
                    </Comp>
                  </li>
                )
              })}
              <li className="mt-2">
                <a
                  href="#login"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-gold hover:text-gold"
                >
                  Login
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="#get-started"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-ink"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </a>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  )
}
