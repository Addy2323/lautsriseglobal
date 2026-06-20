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
  title: 'LotusRise Global — Shop Smart. Earn Smart. Grow Smart.',
  description:
    'LotusRise connects customers, vendors, agents, logistics partners and financial service providers through one digital commerce ecosystem.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
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
        {children}
        <FloatingActions />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
