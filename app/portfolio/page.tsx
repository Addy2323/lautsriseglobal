import type { Metadata } from 'next'
import { PageBanner } from '@/components/page-banner-v2'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { PortfolioPageContent } from '@/components/portfolio-page-content'

export const metadata: Metadata = {
  title: 'Our Portfolio — Projects Powering Digital Economy',
  description:
    'Explore the LotusRise Global portfolio. We build digital commerce infrastructure, micro-investments, and last-mile logistics across East Africa.',
  alternates: {
    canonical: '/portfolio',
  },
}

export default function PortfolioPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <PageBanner
          eyebrow="Our Work"
          title="Projects that power Africa's digital economy"
          description="We are building the infrastructure for seamless commerce, smart investments, last-mile logistics, and local agent networks across East Africa."
          breadcrumb="Portfolio"
          backgroundImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80"
        />
        <PortfolioPageContent />
      </main>
      <SiteFooter />
    </>
  )
}
