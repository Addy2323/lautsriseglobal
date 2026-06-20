import type { Metadata } from 'next'
import { PageBanner } from '@/components/page-banner-v2'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { VendorOnboarding } from '@/components/vendor-onboarding'

export const metadata: Metadata = {
  title: 'Become a Vendor | LotusRise Global',
  description:
    'Join LotusRise Global as a verified vendor. Reach more customers, access logistics and grow your business across the marketplace.',
}

export default function VendorsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageBanner
          eyebrow="Sell on LotusRise"
          title="Become a Vendor and grow your business"
          description="Join a network of 500+ verified vendors selling smarter with integrated marketplace, logistics and investment rewards — all on one platform."
          breadcrumb="Vendors"
          backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
        />
        <VendorOnboarding />
      </main>
      <SiteFooter />
    </>
  )
}
