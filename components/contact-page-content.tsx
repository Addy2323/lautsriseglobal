'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Mail, Phone, Clock, Link as LinkIcon, ChevronDown, CheckCircle2, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { fadeUp, scaleIn, stagger, viewportOnce } from '@/lib/motion'
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from './brand-icons'
import { submitContactInquiry } from '@/app/admin/actions'

const faqs = [
  {
    question: 'How do I become a vendor?',
    answer: 'You can sign up on our dedicated Vendors page. Complete the step-by-step onboarding flow by uploading your business license, verifying your address, and setting up your store details. Visit the /vendors page to get started.'
  },
  {
    question: 'How do I become an agent?',
    answer: 'On-the-ground agents can apply through our Agents page. You will need to complete the agent onboarding, upload a national ID, and provide bank or mobile money details for your weekly commission payouts. Visit the /agents page.'
  },
  {
    question: 'What payment methods do you support?',
    answer: 'We support all major East African mobile money wallets (M-Pesa, Tigo Pesa, Airtel Money, HaloPesa) as well as credit/debit card checkouts (Visa, Mastercard) through our secure payment gateway.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard deliveries within major metropolitan areas (like Dar es Salaam) take between 12 to 24 hours. For upcountry or cross-border shipping across East Africa, deliveries typically take 2 to 5 business days.'
  },
  {
    question: 'How do investment rewards work?',
    answer: 'When you purchase from verified vendors, a percentage of your cashback reward is automatically directed to licensed investment funds (like UTT AMIS in Tanzania) under your registered name, helping you save and grow your capital automatically.'
  },
  {
    question: 'Where does LotusRise operate?',
    answer: 'Our main headquarters are in Dar es Salaam, Tanzania. We operate logistics hubs and agent networks across Tanzania, and we are currently expanding operations into Kenya and Uganda.'
  }
]

export function ContactPageContent() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Full Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message content is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    
    const res = await submitContactInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    })

    setSubmitting(false)
    if (res.success) {
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
    } else {
      alert(`Failed to send message: ${res.error}`)
    }
  }

  return (
    <div className="py-16 lg:py-24">
      {/* Contact Cards Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            { icon: MapPin, title: 'Visit Us', details: 'LotusRise Global HQ', sub: 'Dar es Salaam, Tanzania', href: 'https://maps.google.com/?q=Dar+es+Salaam,+Tanzania' },
            { icon: Mail, title: 'Email Us', details: 'info@lotusriseglobal.com', sub: 'support@lotusriseglobal.com', href: 'mailto:info@lotusriseglobal.com' },
            { icon: Phone, title: 'Call Us', details: '+255 711 788 830', sub: 'WhatsApp chat available', href: 'tel:+255711788830' }
          ].map((info) => (
            <motion.div
              key={info.title}
              variants={scaleIn}
              className="flex flex-col items-center text-center p-5 sm:p-8 rounded-2xl border border-border bg-card hover:border-gold/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold mb-4 ring-8 ring-gold/5">
                <info.icon className="h-5 w-5" />
              </span>
              <h3 className="font-heading text-lg font-bold text-foreground">{info.title}</h3>
              {info.href ? (
                <a
                  href={info.href}
                  className="mt-3 text-sm font-semibold text-foreground hover:text-gold transition-colors"
                >
                  {info.details}
                </a>
              ) : (
                <p className="mt-3 text-sm font-semibold text-foreground">{info.details}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{info.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Form + Sidebar section */}
      <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:mt-28">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] items-start">
          {/* Contact Form Card */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
            {!submitted ? (
              <>
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  Send us a message
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out the form below and our team will get back to you within 24 business hours.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(d => ({ ...d, name: e.target.value }))}
                        className={`w-full rounded-md border bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition ${
                          errors.name ? 'border-destructive' : 'border-input'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(d => ({ ...d, email: e.target.value }))}
                        className={`w-full rounded-md border bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition ${
                          errors.email ? 'border-destructive' : 'border-input'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(d => ({ ...d, phone: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition"
                        placeholder="+255 711 788 830"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Subject *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData(d => ({ ...d, subject: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition"
                      >
                        <option>General Inquiry</option>
                        <option>Partnership</option>
                        <option>Vendor Support</option>
                        <option>Agent Support</option>
                        <option>Technical Support</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Message *
                      </label>
                      <span className="text-[10px] text-muted-foreground">
                        {formData.message.length} / 500 chars
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      maxLength={500}
                      value={formData.message}
                      onChange={(e) => setFormData(d => ({ ...d, message: e.target.value }))}
                      className={`w-full rounded-md border bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition ${
                        errors.message ? 'border-destructive' : 'border-input'
                      }`}
                      placeholder="Write your message here..."
                    />
                    {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center rounded-md bg-gold text-ink font-semibold py-3 text-sm hover:shadow-lg hover:shadow-gold/15 transition-all duration-300 disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mx-auto mb-5 ring-8 ring-emerald-500/5">
                  ✓
                </span>
                <h3 className="font-heading text-2xl font-extrabold text-foreground">Message Sent!</h3>
                <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. A LotusRise representative has received your request and will follow up with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 rounded-md bg-foreground/5 hover:bg-foreground/10 px-6 py-2.5 text-sm font-semibold text-foreground transition-all duration-300"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </div>

          {/* Contact Details Sidebar Card */}
          <div className="rounded-2xl bg-ink p-6 sm:p-8 text-background">
            <h4 className="font-heading text-lg font-bold text-white mb-6">
              Contact Details
            </h4>

            {/* Office Hours */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-white">Office Hours</h5>
                  <ul className="mt-2 space-y-1 text-xs text-background/70">
                    <li>Monday - Friday: 8:00 AM - 6:00 PM EAT</li>
                    <li>Saturday: 9:00 AM - 1:00 PM EAT</li>
                    <li>Sunday: Closed</li>
                  </ul>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex gap-3 border-t border-background/10 pt-4">
                <LinkIcon className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-white">Quick Links</h5>
                  <ul className="mt-2 space-y-2 text-xs text-background/70">
                    <li><Link href="/vendors" className="hover:text-gold transition">Become a Vendor</Link></li>
                    <li><Link href="/agents" className="hover:text-gold transition">Become an Agent</Link></li>
                    <li><a href="#" className="hover:text-gold transition">Help Center & FAQ</a></li>
                    <li><a href="#" className="hover:text-gold transition">Logistics Tracking</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Social icons */}
            <div className="mt-8 border-t border-background/10 pt-6">
              <h5 className="text-xs font-bold uppercase tracking-wider text-background/50 mb-3">
                Follow our socials
              </h5>
              <div className="flex gap-3">
                {[FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social Link"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/80 hover:bg-gold hover:text-ink transition-all duration-300"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <section className="mx-auto mt-16 sm:mt-24 max-w-4xl px-4 sm:px-6 lg:mt-32">
        <div className="text-center mb-12">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold mx-auto mb-4">
            <MessageSquare className="h-5 w-5" />
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Quick answers to some of our most common support inquiries.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-foreground hover:text-gold transition-colors"
                >
                  <span className={`text-sm ${isOpen ? 'text-gold' : 'text-foreground'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-gold' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-border px-5 pb-5 pt-4 text-xs leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
