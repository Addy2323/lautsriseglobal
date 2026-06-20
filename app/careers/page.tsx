import type { Metadata } from 'next'
import { PageBanner } from '@/components/page-banner-v2'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { CareersPageContent } from '@/components/careers-page-content'

export const metadata: Metadata = {
  title: 'Careers — Join the LotusRise Team',
  description:
    'Explore job openings and career opportunities at LotusRise Global. Grow with a team transforming commerce, logistics, and fintech in Tanzania.',
  alternates: {
    canonical: '/careers',
  },
}

export default function CareersPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <PageBanner
          eyebrow="Join Our Team"
          title="Build the future of digital commerce in Africa"
          description="We are a team of thinkers, builders, and doers working together to unlock economic opportunities for millions in East Africa."
          breadcrumb="Careers"
          backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
        />
        <CareersPageContent />
      </main>
      <SiteFooter />
    </>
  )
}
