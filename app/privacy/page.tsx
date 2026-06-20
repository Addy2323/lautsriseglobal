import type { Metadata } from 'next'
import { PageBanner } from '@/components/page-banner-v2'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Privacy Policy — LotusRise Global',
  description: 'LotusRise Global Privacy Policy. Learn how we collect, use, protect, and handle your data and privacy.',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pb-16">
        <PageBanner
          eyebrow="Legal & Trust"
          title="Privacy Policy"
          description="LotusRise Global is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your data."
          breadcrumb="Privacy Policy"
          backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80"
        />

        <article className="mx-auto max-w-4xl px-4 pt-16 sm:px-6">
          <div className="space-y-8 text-muted-foreground leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-xl font-bold text-ink mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us when registering as a vendor, joining our agent network, making purchases, or communicating with us. This includes your name, business name, contact information, region, and payment details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to operate, maintain, and improve the LotusRise Global marketplace, logistics coordination, and agent network. This includes processing transactions, arranging deliveries, managing payouts, and communicating platform updates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink mb-3">3. Sharing of Information</h2>
              <p>
                We do not sell or rent your personal data to third parties. We share information only with authorized service providers (such as integrated logistics partners and payment processors) who assist in executing core services, and as required by Tanzanian laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink mb-3">4. Security Measures</h2>
              <p>
                We implement robust security measures to protect your personal and business data. All transactions and platform interactions are encrypted to prevent unauthorized access, alteration, or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink mb-3">5. Your Choices & Contact</h2>
              <p>
                You have the right to access, update, or request the deletion of your account information at any time. For questions or concerns regarding this policy, please reach out to our team at <strong>info@lotusriseglobal.com</strong>.
              </p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
