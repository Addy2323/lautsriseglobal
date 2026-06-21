import type { Metadata } from 'next'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { Portfolio } from '@/components/portfolio'
import { Preloader } from '@/components/preloader'
import { Services } from '@/components/services'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Stats } from '@/components/stats'

export const metadata: Metadata = {
  title: "Tanzania's Digital Commerce, Marketplace & Logistics Ecosystem",
  description:
    'LotusRise Global connects customers, vendors, agents, and logistics in Tanzania. Scale your retail store, access reliable cargo shipping, and earn micro-investment cashback.',
  alternates: {
    canonical: '/',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'What is LotusRise Global?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'LotusRise Global is a digital ecosystem in Tanzania integrating a marketplace, logistics network, and investment opportunities for businesses, agents, and customers.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How can I sell on LotusRise as a vendor?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'You can sign up as a vendor on our platform to list your products, manage local and global delivery logistics, and grow your business with digital solutions.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What is the LotusRise Agent Network?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'The Agent Network allows local entrepreneurs to earn commissions by acting as physical pickup nodes and sourcing liaisons for customers and shops in their communities.'
      }
    }
  ]
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Preloader />
      <SiteHeader />
      <main>
        <h1 className="sr-only">LotusRise Global — Marketplace, Logistics, and Investment Hub in Tanzania</h1>
        <Hero />
        <Services />
        <HowItWorks />
        <Portfolio />
        <Stats />
      </main>
      <SiteFooter />
    </>
  )
}
