import type { Metadata } from 'next'
import { PageBanner } from '@/components/page-banner-v2'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { BusinessSolutionsContent } from '@/components/business-solutions-content'

export const metadata: Metadata = {
  title: 'Business Solutions — Tech & Automation Services',
  description:
    'Accelerate business growth with LotusRise Technology Services. Estimate costs and request custom software, payment integrations, and automation in Tanzania.',
  alternates: {
    canonical: '/business-solutions',
  },
}

export default function BusinessSolutionsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <PageBanner
          eyebrow="Business Solutions"
          title="LotusRise Technology Services"
          description="Explore our IT services, estimate project costs, choose packages, and submit requests directly to our technology team."
          breadcrumb="Business Solutions"
          backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80"
        />
        <BusinessSolutionsContent />
      </main>
      <SiteFooter />
    </>
  )
}
