import type { Metadata } from 'next'
import { PageBanner } from '@/components/page-banner-v2'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { BlogPageContent } from '@/components/blog-page-content'

export const metadata: Metadata = {
  title: 'Blog & Insights — E-Commerce, Logistics & Investing',
  description:
    'Stay updated with the latest trends, guides, and success stories in e-commerce, logistics, technology solutions, and micro-investing in Tanzania.',
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <PageBanner
          eyebrow="Blog & Insights"
          title="Stories, updates and insights from LotusRise"
          description="Read about our latest platform updates, strategic partnerships, tech breakthroughs, and market trends shaping East Africa's digital future."
          breadcrumb="Blog & Insights"
          backgroundImage="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80"
        />
        <BlogPageContent />
      </main>
      <SiteFooter />
    </>
  )
}
