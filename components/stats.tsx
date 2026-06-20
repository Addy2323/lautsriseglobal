'use client'

import { animate, motion, useInView } from 'framer-motion'
import { CreditCard, Globe, Store, Truck, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { stagger, viewportOnce } from '@/lib/motion'

function Counter({ to, format }: { to: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref}>{format(value)}</span>
}

const stats = [
  {
    icon: Users,
    to: 10000,
    label: 'Happy Customers',
    format: (n: number) => `${Math.round(n).toLocaleString()}+`,
  },
  {
    icon: Store,
    to: 500,
    label: 'Verified Vendors',
    format: (n: number) => `${Math.round(n)}+`,
  },
  {
    icon: Globe,
    to: 50,
    label: 'Countries Reached',
    format: (n: number) => `${Math.round(n)}+`,
  },
  {
    icon: Truck,
    to: 1000,
    label: 'Deliveries Completed',
    format: (n: number) => `${Math.round(n).toLocaleString()}+`,
  },
  {
    icon: CreditCard,
    to: 1,
    label: 'Transactions Processed',
    format: (n: number) => `TZS ${n.toFixed(0)}B+`,
  },
]

export function Stats() {
  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-6 rounded-2xl bg-ink px-4 py-6 sm:px-6 sm:py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          {stats.map(({ icon: Icon, to, label, format }) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="flex items-center gap-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-heading text-2xl font-extrabold text-gold">
                  <Counter to={to} format={format} />
                </p>
                <p className="text-xs text-background/70">{label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
