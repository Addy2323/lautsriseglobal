'use client'

import { motion } from 'framer-motion'
import { FileText, Gift, Store, Truck, Wallet } from 'lucide-react'
import { fadeUp, stagger, viewportOnce } from '@/lib/motion'

const steps = [
  { icon: FileText, label: 'Step 1', text: 'Customer submits request or places order.' },
  { icon: Store, label: 'Step 2', text: 'Vendor confirms availability.' },
  { icon: Wallet, label: 'Step 3', text: 'Payment is completed.' },
  { icon: Truck, label: 'Step 4', text: 'Logistics partner delivers.' },
  { icon: Gift, label: 'Step 5', text: 'Customer receives order and earns rewards.' },
]

export function HowItWorks() {
  return (
    <section id="about" className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="text-center font-heading text-2xl font-extrabold text-ink sm:text-3xl"
        >
          How LotusRise Works
        </motion.h2>

        <div className="relative mt-12">
          {/* animated connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-9 hidden h-0.5 bg-border lg:block">
            <motion.div
              className="h-full origin-left bg-gold"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />
          </div>

          <motion.ol
            variants={stagger(0.2)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5"
          >
            {steps.map(({ icon: Icon, label, text }) => (
              <motion.li key={label} variants={fadeUp} className="text-center">
                <motion.div
                  className="mx-auto flex h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem] items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity }}
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </motion.div>
                <h3 className="mt-4 font-heading text-base font-bold text-ink">
                  {label}
                </h3>
                <p className="mx-auto mt-1 max-w-[14rem] text-sm leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
