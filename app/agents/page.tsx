import type { Metadata } from 'next'
import { PageBanner } from '@/components/page-banner-v2'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { AgentOnboarding } from '@/components/agent-onboarding'

export const metadata: Metadata = {
  title: 'Become a LotusRise Agent — Earn Commission Locally',
  description:
    'Join the LotusRise Agent Network in Tanzania. Facilitate local distribution, serve as a pickup node, and build a sustainable local business.',
  alternates: {
    canonical: '/agents',
  },
}

export default function AgentsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageBanner
          eyebrow="Join the network"
          title="Become an Agent and earn with LotusRise"
          description="Earn income by connecting customers and vendors in your community to Tanzania's growing digital commerce ecosystem."
          breadcrumb="Agents"
          backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
        />
        <AgentOnboarding />
      </main>
      <SiteFooter />
    </>
  )
}
