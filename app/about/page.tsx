'use client'

import { motion } from 'framer-motion'
import {
  Target,
  Compass,
  Lightbulb,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Award,
  Globe,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { InstagramIcon } from '@/components/brand-icons'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-background pt-24 pb-16 relative overflow-hidden font-sans text-foreground">
        
        {/* Soft Background Glow Effects */}
        <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 left-0 h-96 w-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

        {/* ================= HERO SECTION ================= */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-16 text-center space-y-6">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-deep"
          >
            <Sparkles className="h-3 w-3" />
            Our Story & Ecosystem
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="font-heading text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight"
          >
            Empowering Commerce.<br />
            <span className="text-gold">Transforming Communities.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            LotusRise Global is an integrated digital commerce ecosystem. We bridge the gap between shoppers, local vendors, agents, and logistics networks to build sustainable community wealth.
          </motion.p>
        </section>

        {/* ================= VISION & MISSION ================= */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid gap-8 md:grid-cols-2"
          >
            {/* Mission Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl border border-border bg-accent/10 hover:border-gold/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold-deep">
                  <Target className="h-6 w-6" />
                </span>
                <h2 className="font-heading text-2xl font-extrabold text-ink">Our Mission</h2>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                  To unify global and regional supply chains under a single, highly transparent digital commerce platform. We provide independent merchants, local logistics agents, and buyers the automated tools they need to trade efficiently, earn rewards, and grow together.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl border border-border bg-accent/10 hover:border-gold/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold-deep">
                  <Compass className="h-6 w-6" />
                </span>
                <h2 className="font-heading text-2xl font-extrabold text-ink">Our Vision</h2>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                  To establish Africa's premier collaborative trade network where next-generation digital tools foster financial inclusion, supply chain transparency, and sustainable community wealth creation across every node of transaction.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ================= CORE VALUES ================= */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Our Core Values
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto font-medium">
              The fundamental principles that guide our product designs, agent operations, and customer relationships.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { icon: Lightbulb, title: 'Innovation', desc: 'Designing cutting-edge, automated software solutions for trade, billing, and supply chains.' },
              { icon: Zap, title: 'Empowerment', desc: 'Giving independent shopkeepers and agents the tools to scale operations and boost income.' },
              { icon: ShieldCheck, title: 'Integrity', desc: 'Ensuring transparent transaction channels, secure checkouts, and fully audited logs.' },
              { icon: Award, title: 'Synergy', desc: 'Promoting collaborative ecosystem gains where every partner benefits from shared growth.' }
            ].map((val, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-border bg-background hover:border-gold/30 hover:shadow-lg transition-all duration-300 text-left space-y-4"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-deep shadow-sm">
                  <val.icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-lg font-bold text-ink">{val.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{val.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ================= OUR STORY / TIMELINE ================= */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-3xl font-extrabold text-ink">Our Journey</h2>
            <p className="text-sm text-muted-foreground font-medium">How we started and where we are heading.</p>
          </div>

          <div className="relative border-l border-border pl-6 ml-3 space-y-10">
            {[
              { year: '2024', title: 'Founding Idea', desc: 'LotusRise Global was conceptualized to solve the complex retail supply chain and logistics distribution bottleneck in East Africa.', icon: Lightbulb },
              { year: '2025', title: 'Vendor Portal & Rewards Launch', desc: 'Rolled out our core digital marketplace onboarding and structured cash-back reward programs, securing over 1,500 active partners.', icon: Globe },
              { year: '2026', title: 'Unified Operations & IT Explorer', desc: 'Deployed real-time automated quotation explorers, international cargo tracking links, and a dedicated admin workspace.', icon: TrendingUp }
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline dot icon indicator */}
                <span className="absolute -left-[37px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border text-gold group-hover:border-gold transition-colors duration-300">
                  <step.icon className="h-3 w-3" />
                </span>
                <div className="space-y-1.5 text-left">
                  <span className="text-xs font-bold text-gold-deep bg-gold/10 px-2 py-0.5 rounded-md">{step.year}</span>
                  <h3 className="font-heading text-lg font-extrabold text-ink leading-tight">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= MEET OUR TEAM ================= */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
              At LotusRise, our success is driven by a passionate team of leaders, innovators, and professionals committed to transforming businesses through technology, logistics, financial solutions, and strategic partnerships. Together, we are building solutions that create value, empower communities, and shape the future.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center"
          >
            {[
              {
                name: 'Given Mhema',
                role: 'Founder & Chief Executive Officer (CEO)',
                image: '/images/CEO.jpeg',
                desc: 'Given Mhema is the visionary founder of LotusRise and serves as the Chief Executive Officer. He provides strategic leadership and direction for the company, driving innovation, growth, and long-term sustainability. Through his leadership, LotusRise continues to develop solutions that connect people, businesses, and opportunities across multiple industries.',
                instagram: 'https://www.instagram.com/mhema_given?igsh=dmNpeXM4eW1jcW43',
                email: 'info@lotusriseglobal.com',
              },
              {
                name: 'Kelvin Aron',
                role: 'Co-Founder & Director of Operations',
                image: '/images/Co-Founder.png',
                desc: 'Kelvin Aron oversees the day-to-day operations of LotusRise and ensures that the company’s strategic objectives are effectively executed. He works closely with all departments to maintain operational excellence and support business growth.',
                instagram: 'https://instagram.com',
                email: 'info@lotusriseglobal.com',
              },
              {
                name: 'Schorastika Mwinuka',
                role: 'Manager, Finance, Compliance & Investment',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
                desc: 'Schorastika Mwinuka leads the company’s finance, compliance, and investment functions. She supports financial sustainability, regulatory compliance, and investment initiatives that contribute to the long-term success of LotusRise.',
                instagram: 'https://instagram.com',
                email: 'info@lotusriseglobal.com',
              },
              {
                name: 'Asia Mhema',
                role: 'Manager, Marketing & Operations',
                image: '/images/Manager marketing.jpeg',
                desc: 'Asia Mhema is responsible for marketing and operational activities across the organization. She focuses on strengthening the LotusRise brand, enhancing customer engagement, and ensuring efficient service delivery.',
                instagram: 'https://instagram.com',
                email: 'info@lotusriseglobal.com',
              },
              {
                name: 'Ado Myamba',
                role: 'Manager, Technology & Product Development',
                image: '/images/Manager, Technology.jpeg',
                desc: 'Ado Myamba leads technology and product development initiatives within LotusRise. He oversees the design, development, and continuous improvement of digital platforms while driving innovation and technology adoption across the company.',
                instagram: 'https://www.instagram.com/wixeman86?igsh=ZjZkaDIwdnlrazlp',
                email: 'info@lotusriseglobal.com',
              },
              {
                name: 'Joseph Mhema',
                role: 'Business Analyst',
                image: '/images/Business Analyst.jpeg',
                desc: 'Joseph serves as the Business Analyst within the Technology & Product Development team. He works closely with stakeholders and developers to ensure business requirements are effectively translated into practical and efficient technology solutions that support organizational objectives.',
                instagram: 'https://www.instagram.com/menardj23?igsh=MXFmcXp0emt1M21veA==',
                email: 'info@lotusriseglobal.com',
              },

            ].map((member, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="group p-6 rounded-3xl border border-border bg-accent/5 hover:border-gold/30 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-4"
              >
                {/* Profile Image Wrapper */}
                <div className="relative h-32 w-32 rounded-2xl overflow-hidden border border-border group-hover:border-gold/40 transition-colors duration-300">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Member Info */}
                <div className="space-y-1">
                  <h3 className="font-heading text-base font-bold text-ink group-hover:text-gold-deep transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-gold uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold flex-grow">
                  {member.desc}
                </p>

                {/* Social Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-accent/50 text-muted-foreground hover:bg-gold/10 hover:text-gold transition-all duration-300"
                    aria-label={`${member.name}'s Instagram`}
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 rounded-lg bg-accent/50 text-muted-foreground hover:bg-gold/10 hover:text-gold transition-all duration-300"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer signature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 max-w-3xl mx-auto p-8 rounded-3xl border border-border bg-ink text-white relative overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent pointer-events-none" />
            <h3 className="font-heading text-xl font-extrabold text-gold">
              Rising Together. Building Tomorrow.
            </h3>
            <p className="mt-3 text-sm text-white/80 leading-relaxed font-medium">
              Our team is united by a shared commitment to excellence, innovation, integrity, collaboration, and customer success. Together, we are building a stronger future and creating solutions that empower businesses and communities to grow.
            </p>
          </motion.div>
        </section>

        {/* ================= CALL TO ACTION ================= */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="rounded-3xl bg-ink p-8 sm:p-12 text-center text-background space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none" />
            
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Ready to Join the Ecosystem?
            </h2>
            <p className="text-sm text-background/70 max-w-xl mx-auto leading-relaxed font-medium">
              Whether you are a vendor looking to list products, an agent aiming to serve merchants, or a business looking for IT automation, we have a workspace for you.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/vendors"
                className="inline-flex items-center gap-2 rounded-xl bg-gold hover:bg-yellow-500 text-ink font-bold px-6 py-3 transition duration-300 shadow shadow-gold/10 text-xs uppercase tracking-wider"
              >
                Become a Vendor
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 hover:border-gold hover:text-gold text-white font-bold px-6 py-3 transition duration-300 text-xs uppercase tracking-wider"
              >
                Become an Agent
              </Link>
              <Link
                href="/business-solutions"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline py-2"
              >
                Explore Business Solutions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
