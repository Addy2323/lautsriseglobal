import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageBanner } from '@/components/page-banner-v2'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { MapPin, ShieldCheck, Truck, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface CityData {
  slug: string
  name: string
  title: string
  description: string
  intro: string
  keywords: string
  address: string
  phone: string
  lat: number
  lng: number
  faqs: { q: string; a: string }[]
}

const cities: Record<string, CityData> = {
  'dar-es-salaam': {
    slug: 'dar-es-salaam',
    name: 'Dar es Salaam',
    title: 'Marketplace & Sourcing Services in Dar es Salaam',
    description: "Optimize your e-commerce logistics, Kariakoo product sourcing, and agent network delivery in Dar es Salaam, Tanzania's commercial capital.",
    intro: "As Tanzania's largest commercial hub and home to the busy Kariakoo market, Dar es Salaam is the center of our digital commerce and logistics ecosystem. We provide seamless cargo handling, wholesale sourcing, and local agent pickup nodes to make trading fast and reliable.",
    keywords: "Kariakoo sourcing, Dar es Salaam logistics, online shopping Dar es Salaam",
    address: "Kariakoo Area, Dar es Salaam, Tanzania",
    phone: "+255 711 788 830",
    lat: -6.8235,
    lng: 39.2695,
    faqs: [
      { q: "How does Kariakoo sourcing work in Dar es Salaam?", a: "LotusRise connects you directly with verified Kariakoo wholesalers and manages the logistics and shipping to your location." },
      { q: "Where is the main pickup point in Dar es Salaam?", a: "We have multiple agent pickup points across Dar es Salaam, with our central hub located in the Kariakoo commercial area." }
    ]
  },
  'dodoma': {
    slug: 'dodoma',
    name: 'Dodoma',
    title: 'Business Solutions & Delivery Logistics in Dodoma',
    description: 'Connecting government sectors, growing local enterprises, and expanding agent distribution services in Dodoma, the administrative capital of Tanzania.',
    intro: "In Tanzania's capital, Dodoma, we support government offices, public agencies, and growing local businesses with smart automation, secure document workflows, and last-mile cargo logistics from major commercial hubs.",
    keywords: "Dodoma business directory, Dodoma logistics, agent opportunities Dodoma",
    address: "Government City, Dodoma, Tanzania",
    phone: "+255 711 788 830",
    lat: -6.1722,
    lng: 35.7381,
    faqs: [
      { q: "Can I receive goods from Dar es Salaam in Dodoma?", a: "Yes! Our integrated logistics service provides regular shipping lines between Dar es Salaam and Dodoma for rapid delivery." },
      { q: "Are there agent opportunities in Dodoma?", a: "Yes, we are actively expanding our Dodoma agent network. Apply online to join and facilitate pickups." }
    ]
  },
  'arusha': {
    slug: 'arusha',
    name: 'Arusha',
    title: 'Tourism Sourcing & Delivery Logistics in Arusha',
    description: 'Enabling reliable tourism marketplace sourcing, agricultural exports, and last-mile agent network deliveries in Arusha and northern Tanzania.',
    intro: "Arusha is the gateway to East Africa's tourism and horticulture sectors. LotusRise supports northern zone businesses with direct supply chain sourcing, hotel logistics, and local agricultural trade distribution.",
    keywords: "Arusha logistics, agricultural sourcing Arusha, agent network Arusha",
    address: "Sekoine Road, Arusha, Tanzania",
    phone: "+255 711 788 830",
    lat: -3.3731,
    lng: 36.6853,
    faqs: [
      { q: "Do you handle specialized agricultural cargo in Arusha?", a: "Yes, we facilitate agricultural logistics and sourcing for cold-chain and dry goods trade throughout the Arusha region." },
      { q: "How do tourists and local shops benefit?", a: "Tourists can shop verified local crafts on our marketplace, and hotels use our logistics for reliable sourcing." }
    ]
  },
  'mwanza': {
    slug: 'mwanza',
    name: 'Mwanza',
    title: 'Lake Zone Logistics & Product Sourcing in Mwanza',
    description: 'Scale commerce and lake region distribution with integrated marketplace systems and reliable fish/goods logistics in Mwanza, the Rock City.',
    intro: "Mwanza, the Rock City, serves as the economic hub of the Lake Zone. We provide cargo shipping, lake region distribution networks, and vendor e-commerce solutions for Mwanza's thriving manufacturing and fishing sectors.",
    keywords: "Mwanza cargo shipping, Mwanza marketplace, agent opportunities Mwanza",
    address: "Nyamagana District, Mwanza, Tanzania",
    phone: "+255 711 788 830",
    lat: -2.5167,
    lng: 32.9000,
    faqs: [
      { q: "Does LotusRise support shipping across Lake Victoria?", a: "We coordinate with local lake transport networks to manage cargo logistics between Mwanza and surrounding islands." },
      { q: "Can I register as a vendor in Mwanza?", a: "Absolutely! Mwanza businesses can register on the LotusRise marketplace to reach customers nationwide." }
    ]
  },
  'mbeya': {
    slug: 'mbeya',
    name: 'Mbeya',
    title: 'Southern Highlands Sourcing & Cargo Logistics in Mbeya',
    description: 'Boosting southern highlands agriculture distribution and trade logistics with the LotusRise marketplace, vendor portals, and local agents.',
    intro: "Mbeya is the breadbasket and transit gate of southwest Tanzania. We assist local farmers and cross-border traders with efficient marketplace listings, crop shipping logistics, and cross-border agent assistance.",
    keywords: "Mbeya logistics, agricultural trade Mbeya, agent network Mbeya",
    address: "Mwanjelwa Area, Mbeya, Tanzania",
    phone: "+255 711 788 830",
    lat: -8.9000,
    lng: 33.4500,
    faqs: [
      { q: "Do you support agricultural distribution in Mbeya?", a: "Yes, we connect southern zone farms with buyers nationwide, offering crop transport coordination." },
      { q: "Are there agents near Mwanjelwa?", a: "Yes, we have central agent pickup points in the busy Mwanjelwa commercial area." }
    ]
  },
  'zanzibar': {
    slug: 'zanzibar',
    name: 'Zanzibar',
    title: 'Spice Trade & Island Delivery Logistics in Zanzibar',
    description: 'Empowering spice sourcing, tourism hospitality e-commerce, and fast boat cargo logistics in Zanzibar Archipelago with local agent hubs.',
    intro: "Zanzibar combines a rich history of spice trade with modern island tourism. LotusRise bridges the mainland-island gap with marine cargo logistics, hotel supply procurement, and tourist craft marketplaces.",
    keywords: "Zanzibar spice sourcing, cargo logistics Zanzibar, online shopping Zanzibar",
    address: "Stone Town, Zanzibar, Tanzania",
    phone: "+255 711 788 830",
    lat: -6.1659,
    lng: 39.1990,
    faqs: [
      { q: "How do you handle shipping from Dar es Salaam to Zanzibar?", a: "We coordinate with express sea ferry services and cargo boats to deliver shipments from Dar es Salaam to Stone Town quickly." },
      { q: "Can Zanzibar spice vendors sell globally?", a: "Yes, our marketplace vendor solutions assist local spice and artisan businesses to showcase their products." }
    ]
  }
}

export function generateStaticParams() {
  return Object.keys(cities).map((city) => ({
    city,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const cityData = cities[city]
  if (!cityData) return {}
  return {
    title: `${cityData.name} — ${cityData.title}`,
    description: cityData.description,
    alternates: {
      canonical: `/locations/${city}`,
    },
  }
}

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const cityData = cities[city]
  
  if (!cityData) {
    notFound()
  }

  const localSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': `LotusRise Global - ${cityData.name} Branch`,
    'image': 'https://lotusriseglobal.com/images/logo.png',
    'telephone': cityData.phone,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': cityData.address,
      'addressLocality': cityData.name,
      'addressCountry': 'TZ'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': cityData.lat,
      'longitude': cityData.lng
    },
    'url': `https://lotusriseglobal.com/locations/${cityData.slug}`
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': cityData.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader />
      <main className="min-h-screen bg-background pb-16">
        <PageBanner
          eyebrow={`LotusRise in ${cityData.name}`}
          title={cityData.title}
          description={cityData.description}
          breadcrumb={`Locations / ${cityData.name}`}
          backgroundImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80"
        />

        {/* Intro Section */}
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Local Overview</span>
              <h2 className="mt-2 font-heading text-3xl font-extrabold text-ink sm:text-4xl">
                Serving the business community of {cityData.name}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {cityData.intro}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/vendors"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-ink hover:bg-gold/90 transition-all"
                >
                  Register as Vendor <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/agents"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-accent/20 px-6 py-3 text-sm font-bold text-ink hover:bg-accent/45 transition-all"
                >
                  Join Agent Network
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-accent/10 p-8">
              <h3 className="font-heading text-xl font-bold text-ink mb-6">Contact & Branch Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-gold shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-ink">Branch Address</h4>
                    <p className="text-sm text-muted-foreground">{cityData.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Truck className="mt-1 h-5 w-5 text-gold shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-ink">Logistics Services</h4>
                    <p className="text-sm text-muted-foreground">Direct shipping, cargo tracking, and localized delivery handling.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="mt-1 h-5 w-5 text-gold shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-ink">Local Support Hotline</h4>
                    <p className="text-sm text-muted-foreground">{cityData.phone}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Local Services Section */}
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">What We Do in {cityData.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
              Connecting local merchants, service providers, and buyers to build a smarter economy.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-accent/10 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 text-gold mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-ink">Verified Local Vendors</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Shop with confidence. All products in the {cityData.name} marketplace are sourced from verified businesses.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-accent/10 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 text-gold mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-ink">Integrated Delivery Network</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                From Kariakoo sourcing toSouthern Highlands cargo lines, our logistics network guarantees swift transport.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-accent/10 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 text-gold mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-ink">Local Agent Pickup Nodes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Don't wait at home. Collect your packages from trusted neighborhood agent hubs at your convenience.
              </p>
            </div>
          </div>
        </section>

        {/* Local FAQ Section */}
        <section className="mx-auto max-w-4xl px-4 pt-20 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {cityData.faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-accent/5 p-6">
                <h3 className="font-heading text-base font-bold text-ink">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
