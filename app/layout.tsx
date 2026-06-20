import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
import { FloatingActions } from '@/components/floating-actions'

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
})
const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://lotusriseglobal.com'),
  title: {
    default: 'LotusRise Global — Shop Smart. Earn Smart. Grow Smart.',
    template: '%s | LotusRise Global',
  },
  description:
    'LotusRise connects customers, vendors, agents, logistics partners, and financial service providers through one digital commerce ecosystem in Tanzania.',
  alternates: {
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'LotusRise Global',
  'url': 'https://lotusriseglobal.com',
  'logo': 'https://lotusriseglobal.com/images/logo.png',
  'sameAs': [
    'https://instagram.com'
  ],
  'contactPoint': {
    '@type': 'ContactPoint',
    'telephone': '+255711788830',
    'contactType': 'customer service',
    'email': 'info@lotusriseglobal.com',
    'areaServed': 'TZ',
    'availableLanguage': ['English', 'Swahili']
  }
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'LotusRise Global',
  'url': 'https://lotusriseglobal.com'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light ${jakarta.variable} ${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
        <FloatingActions />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
