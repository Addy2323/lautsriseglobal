'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, ArrowRight, User, CheckCircle2 } from 'lucide-react'
import { fadeUp, scaleIn, stagger, viewportOnce } from '@/lib/motion'
import { submitNewsletterSubscriber } from '@/app/admin/actions'

interface Post {
  id: string
  title: string
  category: 'Commerce' | 'Logistics' | 'Technology' | 'Community' | 'Company News'
  date: string
  readTime: string
  excerpt: string
  author: {
    name: string
    role: string
  }
  gradient: string
}

const featuredPost: Post = {
  id: 'featured-1',
  title: 'Unlocking Digital Opportunities: Our Roadmap for Last-Mile Commerce',
  category: 'Commerce',
  date: 'June 18, 2026',
  readTime: '10 min read',
  excerpt: 'An in-depth look at how we connect small-scale retailers, independent agents, and verified distributors on a unified digital network, lowering overhead and improving delivery efficiency.',
  author: {
    name: 'Sarah Mkemwa',
    role: 'Chief Product Officer'
  },
  gradient: 'from-amber-500 via-orange-600 to-rose-600',
}

const posts: Post[] = [
  {
    id: 'post-1',
    title: 'The Rise of Digital Commerce in East Africa',
    category: 'Commerce',
    date: 'June 15, 2026',
    readTime: '8 min read',
    excerpt: 'Mobile money wallets and hybrid logistics networks are driving a retail boom across secondary cities in Tanzania and Kenya.',
    author: { name: 'Emanuel John', role: 'Commerce Lead' },
    gradient: 'from-gold via-amber-500 to-yellow-600',
  },
  {
    id: 'post-2',
    title: 'How Last-Mile Delivery Is Changing Tanzania',
    category: 'Logistics',
    date: 'June 10, 2026',
    readTime: '5 min read',
    excerpt: 'Smart routing algorithms and localized agent collection centers are cutting logistics costs for rural vendors by up to 30%.',
    author: { name: 'Mariam Ali', role: 'Head of Operations' },
    gradient: 'from-slate-800 via-ink to-gray-700',
  },
  {
    id: 'post-3',
    title: 'Building Scalable Platforms with Next.js',
    category: 'Technology',
    date: 'June 05, 2026',
    readTime: '6 min read',
    excerpt: 'A technical retrospective on how we migrated our vendor dashboards to an incremental static regeneration framework for extreme performance.',
    author: { name: 'David Kim', role: 'Lead Architect' },
    gradient: 'from-teal-500 via-emerald-600 to-cyan-600',
  },
  {
    id: 'post-4',
    title: 'Empowering Communities Through Agent Networks',
    category: 'Community',
    date: 'May 28, 2026',
    readTime: '7 min read',
    excerpt: 'On-the-ground agents provide vital digital accessibility in areas with low internet penetration, facilitating orders and cashouts.',
    author: { name: 'Lucas Peter', role: 'Agent Network Director' },
    gradient: 'from-purple-600 via-pink-600 to-indigo-700',
  },
  {
    id: 'post-5',
    title: 'LotusRise Expands to Kenya and Uganda',
    category: 'Company News',
    date: 'May 20, 2026',
    readTime: '4 min read',
    excerpt: 'Announcing our new strategic partnerships with regional logistics hubs to enable cross-border commerce for East African merchants.',
    author: { name: 'Sarah Mkemwa', role: 'CPO' },
    gradient: 'from-rose-500 via-red-500 to-pink-600',
  },
  {
    id: 'post-6',
    title: 'Understanding Cashback & Investment Rewards',
    category: 'Commerce',
    date: 'May 15, 2026',
    readTime: '6 min read',
    excerpt: 'How our automatic digital reward engine works to automatically transfer cashback amounts to secure government treasury portfolios.',
    author: { name: 'Frank K.', role: 'Fintech Specialist' },
    gradient: 'from-blue-600 via-cyan-500 to-indigo-600',
  },
]

const categories = ['All', 'Commerce', 'Logistics', 'Technology', 'Community', 'Company News'] as const

export function BlogPageContent() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    const res = await submitNewsletterSubscriber(email)
    setSubmitting(false)
    if (res.success) {
      setSubscribed(true)
      setEmail('')
    } else {
      alert(`Subscription failed: ${res.error}`)
    }
  }

  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Featured Post Card */}
        {activeCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg hover:shadow-xl transition-all duration-300 mb-12 sm:mb-16 lg:mb-20"
          >
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Graphic Cover */}
              <div className={`relative h-64 sm:h-80 lg:h-full min-h-[300px] bg-gradient-to-tr ${featuredPost.gradient} p-8 flex flex-col justify-between overflow-hidden`}>
                <span className="w-fit rounded-full bg-white/20 backdrop-blur px-3.5 py-1.5 text-xs font-semibold text-white uppercase tracking-wider">
                  Featured Article
                </span>
                <div>
                  <div className="flex items-center gap-3 text-xs text-white/80">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {featuredPost.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featuredPost.readTime}</span>
                  </div>
                </div>
              </div>
              
              {/* Text Info */}
              <div className="p-6 sm:p-10 flex flex-col justify-center">
                <span className="w-fit rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold uppercase tracking-wider">
                  {featuredPost.category}
                </span>
                <h2 className="mt-4 font-heading text-2xl font-extrabold text-foreground sm:text-3xl leading-tight group-hover:text-gold transition-colors duration-300">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-6 border-t border-border pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground">
                      <User className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-foreground">{featuredPost.author.name}</p>
                      <p className="text-[10px] text-muted-foreground">{featuredPost.author.role}</p>
                    </div>
                  </div>
                  
                  <button className="inline-flex items-center gap-1.5 text-sm font-bold text-gold hover:text-foreground transition-colors duration-200">
                    Read Article <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category filter pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gold text-ink shadow-lg shadow-gold/20'
                  : 'bg-foreground/5 text-foreground/75 hover:bg-foreground/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post Grid */}
        <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                layout
                variants={scaleIn}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
              >
                {/* Visual Cover */}
                <div className={`relative h-48 w-full bg-gradient-to-tr ${post.gradient} p-5 flex flex-col justify-end overflow-hidden`}>
                  <div className="absolute inset-0 bg-ink/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative z-10 w-fit rounded-full bg-white/25 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                  </div>
                  <h3 className="mt-3 font-heading text-lg font-bold text-foreground group-hover:text-gold transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Author row */}
                  <div className="mt-5 border-t border-border pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-[10px] font-bold text-foreground leading-none">{post.author.name}</p>
                        <p className="text-[8px] text-muted-foreground mt-0.5">{post.author.role}</p>
                      </div>
                    </div>
                    
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Newsletter Block */}
      <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 sm:mt-20 lg:mt-28">
        <div className="rounded-3xl bg-ink p-5 sm:p-8 md:p-14 text-background text-center relative overflow-hidden">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 7, repeat: Infinity }}
          />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
              Newsletter
            </span>
            <h2 className="mt-5 font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Stay in the loop
            </h2>
            <p className="mt-3 text-sm text-background/70 leading-relaxed">
              Subscribe to our newsletter to receive the latest stories, tech guides, product launches, and ecosystem announcements directly in your inbox.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 rounded-md border border-background/20 bg-background/10 px-4 py-3 text-sm text-white placeholder-background/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-gold hover:bg-yellow-500 px-6 py-3 text-sm font-semibold text-ink transition-all duration-300 disabled:opacity-50 min-w-[120px]"
                >
                  {submitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent mx-auto" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/20 px-6 py-3 text-gold text-sm font-medium"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                Thanks for subscribing! Check your inbox to confirm.
              </motion.div>
            )}
            
            <p className="mt-4 text-[10px] text-background/40">
              No spam. Unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
