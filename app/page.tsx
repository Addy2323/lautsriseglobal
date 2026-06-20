import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { Portfolio } from '@/components/portfolio'
import { Preloader } from '@/components/preloader'
import { Services } from '@/components/services'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Stats } from '@/components/stats'

export default function Page() {
  return (
    <>
      <Preloader />
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Portfolio />
        <Stats />
      </main>
      <SiteFooter />
    </>
  )
}
