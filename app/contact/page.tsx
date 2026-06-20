import type { Metadata } from 'next'
import { PageBanner } from '@/components/page-banner-v2'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { ContactPageContent } from '@/components/contact-page-content'

export const metadata: Metadata = {
  title: 'Contact Us | LotusRise Global',
  description: 'Reach out to LotusRise Global for partnerships, support, inquiries, or feedback. We are here to help.',
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <PageBanner
          eyebrow="Get in Touch"
          title="We'd love to hear from you"
          description="Have questions about our platform, partnerships, logistics services, or agent opportunities? Contact our team today."
          breadcrumb="Contact Us"
          backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
        />
        <ContactPageContent />
      </main>
      <SiteFooter />
    </>
  )
}
