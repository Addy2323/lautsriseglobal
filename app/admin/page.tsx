import type { Metadata } from 'next'
import { AdminConsole } from '@/components/admin-console'

export const metadata: Metadata = {
  title: 'Unified Admin Panel | LotusRise Global',
  description: 'LotusRise Global Unified Administration Console. Manage service requests, vendor/agent onboarding, inquiries, careers applications, and newsletter lists.',
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <AdminConsole />
    </main>
  )
}
