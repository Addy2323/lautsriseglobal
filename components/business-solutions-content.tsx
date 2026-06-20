'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Smartphone,
  Laptop,
  ShoppingBag,
  CreditCard,
  Cpu,
  Cloud,
  Shield,
  Activity,
  BrainCircuit,
  TrendingUp,
  Paintbrush,
  Clock,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  Upload,
  HelpCircle
} from 'lucide-react'
import { scaleIn } from '@/lib/motion'
import { submitServiceRequest, getServicesCatalog } from '../app/business-solutions/actions'
import { useEffect } from 'react'

// --- SUGGESTED PRICE RANGE DATABASE ---
interface PackageDetail {
  name: string
  priceRange: string
  inclusions: string[]
}

interface ServiceDetail {
  name: string
  description: string
  timeline: string
  priceRange: string
  features: string[]
  packages: PackageDetail[]
}

interface CategoryDetail {
  id: string
  title: string
  icon: any
  description: string
  startingPrice: string
  services: ServiceDetail[]
}

const serviceDatabase: CategoryDetail[] = [
  {
    id: 'web-dev',
    title: 'Website Development',
    icon: Globe,
    description: 'Beautiful, modern, SEO-optimized websites that convert visitors into customers.',
    startingPrice: 'TZS 500,000',
    services: [
      {
        name: 'Business Website',
        description: 'Professional website representing your brand, services, and corporate identity.',
        timeline: '10 - 15 Days',
        priceRange: 'TZS 500,000 – 4,000,000',
        features: ['Mobile Responsive', 'Contact Form', 'WhatsApp Chat Button', 'Basic SEO Setup'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 500,000 – 1,500,000', inclusions: ['5 Pages', 'Contact Form', 'WhatsApp Button', 'Basic SEO', 'Mobile Responsive Design'] },
          { name: 'Professional Package', priceRange: 'TZS 1,500,000 – 4,000,000', inclusions: ['10 Pages', 'Blog Section', 'Admin Control Panel', 'SEO Setup', 'Google Maps Integration', 'Analytics'] },
          { name: 'Premium Package', priceRange: 'TZS 4,000,000 – 10,000,000+', inclusions: ['Custom Design', 'Advanced Admin Panel', 'Payment Gateway Integration', 'Booking System', 'Multi-language Support', 'Advanced SEO'] }
        ]
      },
      {
        name: 'Corporate Website',
        description: 'Large scale informational site tailored for corporate groups, institutions, and departments.',
        timeline: '20 - 35 Days',
        priceRange: 'TZS 1,500,000 – 10,000,000',
        features: ['Department Sub-sections', 'Resource Library', 'Investor Relations Hub', 'Granular Security'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 1,500,000 – 3,500,000', inclusions: ['10-15 Pages', 'Standard Branding', 'Basic Content Management', 'Contact & Location Maps'] },
          { name: 'Professional Package', priceRange: 'TZS 3,500,000 – 7,000,000', inclusions: ['20-40 Pages', 'Custom UI/UX Theme', 'News & Careers Portals', 'Advanced SEO & Analytics'] },
          { name: 'Premium Package', priceRange: 'TZS 7,000,000 – 10,000,000+', inclusions: ['Unlimited Pages', 'Active Directory Sync', 'Multi-country Localization', 'High Availability SLA'] }
        ]
      },
      {
        name: 'E-Commerce Website',
        description: 'Full-featured online store to list products, manage inventory, and process payments online.',
        timeline: '15 - 30 Days',
        priceRange: 'TZS 3,000,000 – 25,000,000',
        features: ['Product Catalog', 'Shopping Cart', 'Mobile Checkout', 'Order Tracking'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 3,000,000 – 7,000,000', inclusions: ['Up to 100 Products', 'Standard Payment integration', 'Basic Inventory Sync', 'Basic Shipping Rules'] },
          { name: 'Professional Package', priceRange: 'TZS 7,000,000 – 15,000,000', inclusions: ['Up to 1,000 Products', 'Multi-gateway Mobile Money/Cards', 'Customer Accounts', 'Abandoned Cart Recovery'] },
          { name: 'Premium Package', priceRange: 'TZS 15,000,000 – 25,000,000+', inclusions: ['Unlimited Products', 'ERP / Accounting Integration', 'Custom CRM sync', 'Automated Vendor Payouts'] }
        ]
      },
      {
        name: 'NGO Website',
        description: 'Engaging portals for non-profits featuring donation drives, campaigns, and volunteer registries.',
        timeline: '12 - 20 Days',
        priceRange: 'TZS 1,500,000 – 8,000,000',
        features: ['Donation Gateway Integration', 'Campaign/Project Tracker', 'Newsletter Registration', 'Impact Photo Gallery'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 1,500,000 – 3,000,000', inclusions: ['8 Pages', 'Basic Donation Button', 'Volunteer Contact Form', 'Responsive Template'] },
          { name: 'Professional Package', priceRange: 'TZS 3,000,000 – 6,000,000', inclusions: ['15 Pages', 'Recurring Donations (UTT / Bank)', 'Interactive Project Maps', 'Blog & Press Center'] },
          { name: 'Premium Package', priceRange: 'TZS 6,000,000 – 8,000,000+', inclusions: ['Custom Engagement Suite', 'Investor & Donor Transparency Portal', 'Sponsor-a-Child System', 'Event Management'] }
        ]
      }
    ]
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Development',
    icon: Smartphone,
    description: 'High-performing native and cross-platform mobile apps for iOS and Android devices.',
    startingPrice: 'TZS 8,000,000',
    services: [
      {
        name: 'Simple Utility App',
        description: 'Lightweight applications with standard UI elements, local offline storage, and simple notifications.',
        timeline: '30 - 45 Days',
        priceRange: 'TZS 8,000,000 – 20,000,000',
        features: ['Offline Mode support', 'Local Database', 'Social Media Login', 'Push Notifications'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 8,000,000 – 12,000,000', inclusions: ['Static Content', 'Local Push Alerts', 'Standard iOS/Android layout', 'Contact support Form'] },
          { name: 'Professional Package', priceRange: 'TZS 12,000,000 – 16,000,000', inclusions: ['Dynamic Feeds via API', 'Basic User Accounts', 'Analytics dashboard', 'Play Store/App Store submission'] },
          { name: 'Premium Package', priceRange: 'TZS 16,000,000 – 20,000,000+', inclusions: ['Full-stack syncing', 'Interactive Maps integration', 'Multilingual support', 'Premium Easing Transitions'] }
        ]
      },
      {
        name: 'E-Commerce App',
        description: 'Robust shopping application featuring real-time catalogs, cart synchronization, and payments.',
        timeline: '45 - 75 Days',
        priceRange: 'TZS 25,000,000 – 80,000,000',
        features: ['Secure Native Checkout', 'Live Order Tracking', 'Product Search & Filters', 'In-App Live Chat Support'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 25,000,000 – 40,000,000', inclusions: ['Standard Storefront catalog', 'SMS OTP verification', 'Mobile Money payment methods', 'Order History page'] },
          { name: 'Professional Package', priceRange: 'TZS 40,000,000 – 60,000,000', inclusions: ['Advanced search matching', 'Multi-vendor dashboard feeds', 'Coupons & Loyalty points engine', 'Real-time logistics status API'] },
          { name: 'Premium Package', priceRange: 'TZS 60,000,000 – 80,000,000+', inclusions: ['AI Recommended products', 'Integrated warehouse scanner app', 'Automated merchant payouts', 'Offline-first queue syncing'] }
        ]
      }
    ]
  },
  {
    id: 'web-app-dev',
    title: 'Web Application Development',
    icon: Laptop,
    description: 'Bespoke web portals, business intelligence dashboards, and administrative software portals.',
    startingPrice: 'TZS 5,000,000',
    services: [
      {
        name: 'Customer Portal',
        description: 'Self-service client platforms featuring profiles, statements, ticket generation, and custom workflows.',
        timeline: '25 - 40 Days',
        priceRange: 'TZS 5,000,000 – 25,000,000',
        features: ['Secure Auth (2FA)', 'Activity Log tracking', 'PDF Statement Generation', 'Customer Chat / Ticket Support'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 5,000,000 – 10,000,000', inclusions: ['Basic profiles', 'Document uploads', 'Standard ticketing queue', 'Email notifications'] },
          { name: 'Professional Package', priceRange: 'TZS 10,000,000 – 18,000,000', inclusions: ['Complex account hierarchies', 'Custom billing integration', 'SMS & Email dispatch triggers', 'FAQ Auto-assistant'] },
          { name: 'Premium Package', priceRange: 'TZS 18,000,000 – 25,000,000+', inclusions: ['Granular role authorizations', 'Full REST API key generation', 'White-labeled domains support', 'Automated PDF invoicing'] }
        ]
      }
    ]
  },
  {
    id: 'e-commerce-sol',
    title: 'E-Commerce Solutions',
    icon: ShoppingBag,
    description: 'Multi-vendor marketplaces, delivery routing solutions, and custom checkout flows.',
    startingPrice: 'TZS 3,000,000',
    services: [
      {
        name: 'Multi-Vendor Marketplace',
        description: 'Complete digital ecosystem for vendors to upload products and clients to buy from multiple sellers.',
        timeline: '60 - 90 Days',
        priceRange: 'TZS 20,000,000 – 150,000,000',
        features: ['Vendor Registration flows', 'Commission Splits logic', 'Vendor Payout dashboards', 'Ecosystem Delivery tracking'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 20,000,000 – 45,000,000', inclusions: ['Max 20 verified vendors', 'Standard commission percentages', 'Admin approvals dashboard', 'Standard checkout flow'] },
          { name: 'Professional Package', priceRange: 'TZS 45,000,000 – 90,000,000', inclusions: ['Unlimited vendors', 'Dynamic tier commissions', 'Automated M-Pesa payouts API', 'Vendor inventory warning alerts'] },
          { name: 'Premium Package', priceRange: 'TZS 90,000,000 – 150,000,000+', inclusions: ['Integrated customer loyalty engine', 'Agent network cash collection', 'Warehousing API support', 'Global analytics insights'] }
        ]
      }
    ]
  },
  {
    id: 'payment-int',
    title: 'Payment Integration',
    icon: CreditCard,
    description: 'Integrations with local mobile money (M-Pesa, Tigo Pesa, Airtel Money) and global card payment gateways.',
    startingPrice: 'TZS 3,000,000',
    services: [
      {
        name: 'Mobile Money Integration',
        description: 'Direct API integrations for push-USSD collections, automatic callbacks, and disbursement automation.',
        timeline: '10 - 18 Days',
        priceRange: 'TZS 3,000,000 – 15,000,000',
        features: ['Push USSD collections', 'Automatic Callback receiver', 'Automated transaction lookup', 'Transaction reconcile console'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 3,000,000 – 6,000,000', inclusions: ['Single Mobile operator link', 'Static callbacks logging', 'Checkout widget buttons', 'Transaction history report'] },
          { name: 'Professional Package', priceRange: 'TZS 6,000,000 – 10,000,000', inclusions: ['Multi-operator link (Tigo/M-Pesa)', 'Disbursement (Payouts) support', 'Transaction status lookup cron', 'Automated reconciliation reports'] },
          { name: 'Premium Package', priceRange: 'TZS 10,000,000 – 15,000,000+', inclusions: ['All regional mobile operators', 'Bulk disbursements processing', 'Direct accounting systems API link', 'SLA Failover routing'] }
        ]
      }
    ]
  },
  {
    id: 'business-auto',
    title: 'Business Automation',
    icon: Cpu,
    description: 'Custom approval workflows, automated document processing, and system reconciliation solutions.',
    startingPrice: 'TZS 5,000,000',
    services: [
      {
        name: 'Document Management',
        description: 'Centralized document libraries with auto-tagging, OCR digitization, and custom sharing approvals.',
        timeline: '20 - 30 Days',
        priceRange: 'TZS 8,000,000 – 50,000,000',
        features: ['OCR Text scanning', 'Approval Sign-off routing', 'Watermarking engines', 'Granular access hierarchies'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 8,000,000 – 15,000,000', inclusions: ['Standard document folders', 'PDF search indexing', 'Role-based folder locking', 'Email notifications'] },
          { name: 'Professional Package', priceRange: 'TZS 15,000,000 – 30,000,000', inclusions: ['Basic OCR metadata parsing', 'Custom multi-step approval workflow', 'Digital signature uploads', 'Audit log trackers'] },
          { name: 'Premium Package', priceRange: 'TZS 30,000,000 – 50,000,000+', inclusions: ['AI metadata categorizations', 'Encrypted cloud storage sync', 'Microsoft Active Directory linking', 'Automated data retention pruning'] }
        ]
      }
    ]
  },
  {
    id: 'cloud-host',
    title: 'Cloud & Hosting',
    icon: Cloud,
    description: 'Secure, high-availability server setup, backup systems, and corporate email hosting.',
    startingPrice: 'TZS 300,000',
    services: [
      {
        name: 'Cloud Server Setup',
        description: 'Custom configuration of virtual servers (AWS, DigitalOcean, Azure) with load balancing and firewalls.',
        timeline: '5 - 10 Days',
        priceRange: 'TZS 1,000,000 – 10,000,000',
        features: ['Firewall & Port security', 'Automatic backup schedulers', 'Load balancing setups', 'System uptime metrics panel'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 1,000,000 – 3,000,000', inclusions: ['Single VM server setup', 'Standard firewalls', 'Weekly automatic backup scripts', 'Free SSL setup'] },
          { name: 'Professional Package', priceRange: 'TZS 3,000,000 – 6,000,000', inclusions: ['Multi-node setup', 'Load balancer clustering', 'Daily hot backup setups', 'CPU/RAM alerts channel (Slack/Email)'] },
          { name: 'Premium Package', priceRange: 'TZS 6,000,000 – 10,000,000+', inclusions: ['High Availability Auto-scale', 'Kubernetes Docker orchestration', 'Geographically redundant backups', '24/7 dedicated sysops SLA'] }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Services',
    icon: Shield,
    description: 'Vulnerability assessments, code reviews, database audits, and penetration testing.',
    startingPrice: 'TZS 1,000,000',
    services: [
      {
        name: 'Vulnerability Testing',
        description: 'Simulated cyber-attacks and scans to identify potential security holes in your website or server.',
        timeline: '7 - 15 Days',
        priceRange: 'TZS 5,000,000 – 40,000,000',
        features: ['SQL Injection checks', 'XSS scripting filters audits', 'Port scanners logs', 'Detailed security report summary'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 5,000,000 – 12,000,000', inclusions: ['Automated security scanning', 'Standard code reports', 'Basic network vulnerability checks', 'Remediation advice lists'] },
          { name: 'Professional Package', priceRange: 'TZS 12,000,000 – 25,000,000', inclusions: ['Manual penetration testing', 'Custom threat scenarios audits', 'API validation loops auditing', 'Code review security highlights'] },
          { name: 'Premium Package', priceRange: 'TZS 25,000,000 – 40,000,000+', inclusions: ['Continuous SOC vulnerability alerts', 'Post-exploit analytics reviews', 'Tanzanian cybersecurity compliance audits', 'Urgent critical patch deployments'] }
        ]
      }
    ]
  },
  {
    id: 'it-support',
    title: 'IT Support',
    icon: Activity,
    description: 'Managed IT support, network administration, and hardware troubleshooting for offices.',
    startingPrice: 'TZS 100,000',
    services: [
      {
        name: 'Monthly IT Support',
        description: 'On-demand corporate technical support covering local workstation maintenance and network configuration.',
        timeline: 'Ongoing / Monthly',
        priceRange: 'TZS 500,000 – 10,000,000 per month',
        features: ['Remote Desktop login help', 'On-site engineer visits', 'Network firewall resets', 'Antivirus management licenses'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 500,000 – 2,000,000 / mo', inclusions: ['Up to 15 workstations', 'Remote support ticket panel', 'Monthly systems cleaning visit', 'Antivirus checks'] },
          { name: 'Professional Package', priceRange: 'TZS 2,000,000 – 5,000,000 / mo', inclusions: ['Up to 50 workstations', 'Office server monitoring support', 'Bi-weekly on-site engineer visit', 'Urgent response SLA (under 4 hours)'] },
          { name: 'Premium Package', priceRange: 'TZS 5,000,000 – 10,000,000 / mo', inclusions: ['Unlimited workstations', 'Dedicated resident IT engineer', 'VOIP & Network administration', 'Immediate support response (under 1 hour)'] }
        ]
      }
    ]
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    icon: BrainCircuit,
    description: 'Intelligent AI chatbots, natural language document processing, and custom AI tools.',
    startingPrice: 'TZS 3,000,000',
    services: [
      {
        name: 'AI Customer Chatbot',
        description: 'Automated response bots using LLMs trained on your business profile to answer user queries on WhatsApp/Web.',
        timeline: '15 - 25 Days',
        priceRange: 'TZS 3,000,000 – 25,000,000',
        features: ['WhatsApp Business integration', 'Custom LLM fine-tuning', 'Human handoff systems', 'User logs analysis dashboard'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 3,000,000 – 8,000,000', inclusions: ['Rule-based conversational trees', 'Standard Web widget layout', 'Basic analytics reports', 'Up to 1,000 replies/month'] },
          { name: 'Professional Package', priceRange: 'TZS 8,000,000 – 15,000,000', inclusions: ['ChatGPT/LLM model training', 'WhatsApp Business link', 'CRM contact saving logic', 'Up to 10,000 replies/month'] },
          { name: 'Premium Package', priceRange: 'TZS 15,000,000 – 25,000,000+', inclusions: ['Hybrid Agent-AI handoff screen', 'Database query chatbot links', 'Continuous learning triggers', 'Unlimited monthly replies'] }
        ]
      }
    ]
  },
  {
    id: 'digital-mkt',
    title: 'Digital Marketing',
    icon: TrendingUp,
    description: 'SEO ranking optimization, social media campaigns, and Google Ads management.',
    startingPrice: 'TZS 500,000',
    services: [
      {
        name: 'SEO Setup & Rankings',
        description: 'Audit and optimization of website keywords, meta descriptions, and link layouts to rank higher on Google.',
        timeline: '15 - 30 Days',
        priceRange: 'TZS 500,000 – 5,000,000',
        features: ['Keyword Competitor research', 'On-page meta tags rewrites', 'Google Search Console setup', 'Monthly traffic rankings report'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 500,000 – 1,500,000', inclusions: ['Keyword audit', 'On-page basic optimizations', 'Google Sitemap indexing', 'One-time setup report'] },
          { name: 'Professional Package', priceRange: 'TZS 1,500,000 – 3,000,000', inclusions: ['Competitor analysis', '3 standard blog articles targeting keywords', 'Backlink building scripts', 'Monthly ranking logs'] },
          { name: 'Premium Package', priceRange: 'TZS 3,000,000 – 5,000,000+', inclusions: ['Full technical site structure overhaul', 'Content plan (10 articles)', 'Local Map search listings sync', 'Real-time rankings tracking panel'] }
        ]
      }
    ]
  },
  {
    id: 'branding-creative',
    title: 'Branding & Creative Services',
    icon: Paintbrush,
    description: 'Premium logo design, company profile packages, and video/motion graphics.',
    startingPrice: 'TZS 150,000',
    services: [
      {
        name: 'Corporate Identity Kit',
        description: 'Professional visual branding bundles including logos, typographies, and color guidelines.',
        timeline: '7 - 15 Days',
        priceRange: 'TZS 300,000 – 2,000,000',
        features: ['High-res Vector formats', 'Comprehensive Brand guidelines PDF', 'Corporate letterhead layouts', 'Social media card assets templates'],
        packages: [
          { name: 'Starter Package', priceRange: 'TZS 300,000 – 700,000', inclusions: ['3 custom logo design concepts', 'Brand colors and font guide', 'Business card templates', 'High-res file pack'] },
          { name: 'Professional Package', priceRange: 'TZS 700,000 – 1,300,000', inclusions: ['5 custom logo design concepts', 'Branded social templates', 'Corporate letterhead & envelopes', 'Brand book guidelines'] },
          { name: 'Premium Package', priceRange: 'TZS 1,300,000 – 2,000,000+', inclusions: ['Unlimited revisions', 'Full company profiles PDF design', 'Motion graphic animated logo', 'Copyright assignment certificates'] }
        ]
      }
    ]
  }
]

const categories = ['All', 'Website Development', 'Mobile App Development', 'Web Application Development', 'E-Commerce Solutions', 'Payment Integration', 'Business Automation', 'Cloud & Hosting', 'Cybersecurity', 'IT Support', 'AI & Automation', 'Digital Marketing', 'Branding & Creative Services']

function getIconComponent(name: string) {
  switch (name) {
    case 'Globe': return Globe
    case 'Smartphone': return Smartphone
    case 'Laptop': return Laptop
    case 'ShoppingBag': return ShoppingBag
    case 'CreditCard': return CreditCard
    case 'Cpu': return Cpu
    case 'Cloud': return Cloud
    case 'Shield': return Shield
    case 'Activity': return Activity
    case 'BrainCircuit': return BrainCircuit
    case 'TrendingUp': return TrendingUp
    case 'Paintbrush': return Paintbrush
    default: return HelpCircle
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export function BusinessSolutionsContent() {
  const [dbServices, setDbServices] = useState<CategoryDetail[]>([])

  useEffect(() => {
    async function loadCatalog() {
      const res = await getServicesCatalog()
      if (res.success && res.data && res.data.length > 0) {
        const mapped = res.data
          .filter(c => c.status === 'Active')
          .map(c => ({
            id: c.catalog_key,
            title: c.title,
            icon: getIconComponent(c.icon),
            description: c.description,
            startingPrice: c.starting_price,
            services: Array.isArray(c.services) ? c.services : JSON.parse(c.services)
          }))
        setDbServices(mapped)
      } else {
        const fallback = serviceDatabase.map(c => ({
          ...c,
          icon: typeof c.icon === 'string' ? getIconComponent(c.icon) : c.icon
        }))
        setDbServices(fallback)
      }
    }
    loadCatalog()
  }, [])

  // Client Wizard States
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<CategoryDetail | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<PackageDetail | null>(null)

  // Form Submission States
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    whatsapp: '',
    email: '',
    region: 'Dar es Salaam',
    budgetRange: '',
    preferredTimeline: '',
    description: '',
    contactMethod: 'Email',
  })
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submittedRequest, setSubmittedRequest] = useState<any>(null)

  // --- CLIENT EXPLORER WIZARD HANDLERS ---
  const handleSelectCategory = (cat: CategoryDetail) => {
    setSelectedCategory(cat)
    setSelectedService(null)
    setSelectedPackage(null)
    setStep(2)
  }

  const handleSelectService = (service: ServiceDetail) => {
    setSelectedService(service)
    setSelectedPackage(null)
    setStep(3)
  }

  const handleSelectPackage = (pkg: PackageDetail) => {
    setSelectedPackage(pkg)
    setFormData(prev => ({
      ...prev,
      budgetRange: pkg.priceRange,
      preferredTimeline: selectedService?.timeline || ''
    }))
    setStep(4)
  }

  const validateForm = () => {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = 'Full Name is required'
    if (!formData.email.trim()) {
      errs.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required'
    if (!formData.description.trim()) errs.description = 'Project description is required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !selectedCategory || !selectedService || !selectedPackage) return
    setSubmitting(true)

    const base64 = file ? await fileToBase64(file) : undefined

    const payload = {
      name: formData.name,
      companyName: formData.companyName,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      region: formData.region,
      category: selectedCategory.title,
      service: selectedService.name,
      package: selectedPackage.name,
      budgetRange: formData.budgetRange,
      preferredTimeline: formData.preferredTimeline,
      description: formData.description,
      fileName: file ? file.name : undefined,
      fileData: base64,
      contactMethod: formData.contactMethod,
    }

    const res = await submitServiceRequest(payload)
    setSubmitting(false)
    if (res.success && res.data) {
      setSubmittedRequest(res.data)
      setStep(5)
    } else {
      alert(`Submission failed: ${res.error}`)
    }
  }

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Step Wizard Progress Bar */}
        {step < 5 && (
          <div className="max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 right-0 top-1/2 -z-10 h-0.5 -translate-y-1/2 bg-border" />
              <motion.div
                className="absolute left-0 top-1/2 -z-10 h-0.5 -translate-y-1/2 bg-gold"
                initial={{ width: '0%' }}
                animate={{ width: `${((step - 1) / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
              {[
                { s: 1, label: 'Category' },
                { s: 2, label: 'Service' },
                { s: 3, label: 'Package' },
                { s: 4, label: 'Submit' }
              ].map(({ s, label }) => (
                <div key={s} className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      if (s === 1 && selectedCategory) setStep(1)
                      if (s === 2 && selectedService) setStep(2)
                      if (s === 3 && selectedPackage) setStep(3)
                    }}
                    disabled={s > step}
                    className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border font-bold text-xs sm:text-sm transition-all duration-300 ${
                      step >= s
                        ? 'bg-gold border-gold text-ink shadow-lg shadow-gold/25'
                        : 'bg-background border-border text-muted-foreground'
                    }`}
                  >
                    {s}
                  </button>
                  <span className={`mt-1 sm:mt-2 text-[10px] sm:text-xs font-semibold text-center ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: SELECT CATEGORY */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10"
            >
              <div className="text-center">
                <h2 className="font-heading text-3xl font-extrabold text-foreground">
                  Explore Our IT Services
                </h2>
                <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
                  Select a service category below to view our capabilities, sample deliverables, and estimated pricing.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {dbServices.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover={{ y: -5 }}
                      className="group flex flex-col justify-between p-6 rounded-2xl border border-border bg-card hover:border-gold/30 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
                    >
                      <div>
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold mb-5 group-hover:scale-110 transition-transform">
                          <Icon className="h-5.5 w-5.5" />
                        </span>
                        <h3 className="font-heading text-lg font-bold text-foreground">
                          {cat.title}
                        </h3>
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                          {cat.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-border pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Starts From</p>
                          <p className="text-sm font-bold text-gold">{cat.startingPrice}</p>
                        </div>
                        <button
                          onClick={() => handleSelectCategory(cat)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-ink bg-gold rounded-lg px-3 py-2 transition-all hover:bg-yellow-500"
                        >
                          Explore Services <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT SAMPLE SERVICE */}
          {step === 2 && selectedCategory && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Categories
              </button>

              <div>
                <span className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                  {selectedCategory.title}
                </span>
                <h2 className="mt-3 font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                  Select Your Preferred Service
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pick the service that matches your requirements to review detailed configurations and pricing.
                </p>
              </div>

              <div className="grid gap-6">
                {selectedCategory.services.map((service) => (
                  <div
                    key={service.name}
                    className="p-6 rounded-2xl border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold/25 transition-all"
                  >
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-foreground">{service.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{service.description}</p>
                      </div>
                      
                      <div className="grid gap-3 sm:grid-cols-2 text-xs">
                        <div>
                          <span className="font-semibold text-foreground">Timeline:</span>
                          <span className="ml-1.5 inline-flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 text-gold" /> {service.timeline}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Est. Range:</span>
                          <span className="ml-1.5 text-gold font-bold">{service.priceRange}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {service.features.map(f => (
                          <span key={f} className="rounded-md bg-foreground/5 px-2.5 py-1 text-[10px] text-muted-foreground font-medium">
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectService(service)}
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink text-white dark:bg-white dark:text-ink hover:bg-gold hover:text-ink px-5 py-3 text-sm font-semibold transition"
                    >
                      Select Service <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: SELECT PACKAGE */}
          {step === 3 && selectedService && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Services
              </button>

              <div className="text-center">
                <span className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                  {selectedService.name}
                </span>
                <h2 className="mt-3 font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                  Choose Your Pricing Package
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
                  Select a pricing package below. You can customize the requirements and request a precise quotation in the next step.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto mt-8">
                {selectedService.packages.map((pkg, idx) => {
                  const isPopular = idx === 1 // Middle tier
                  return (
                    <div
                      key={pkg.name}
                      className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 ${
                        isPopular
                          ? 'border-gold bg-gold/5 shadow-xl shadow-gold/5 scale-100 md:scale-105'
                          : 'border-border bg-card hover:border-gold/30'
                      }`}
                    >
                      {isPopular && (
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                          Recommended
                        </span>
                      )}

                      <div className="space-y-5">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-foreground">{pkg.name}</h3>
                          <p className="mt-3 text-xl font-extrabold text-gold leading-none">{pkg.priceRange}</p>
                        </div>

                        <ul className="space-y-2.5 border-t border-border pt-4 text-xs text-muted-foreground">
                          {pkg.inclusions.map((inc) => (
                            <li key={inc} className="flex items-start gap-2">
                              <span className="text-gold font-bold select-none">•</span>
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSelectPackage(pkg)}
                        className={`mt-8 w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                          isPopular
                            ? 'bg-gold text-ink hover:bg-yellow-500'
                            : 'bg-foreground/5 hover:bg-foreground/10 text-foreground'
                        }`}
                      >
                        Choose Package
                      </button>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUBMIT REQUEST FORM */}
          {step === 4 && selectedCategory && selectedService && selectedPackage && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-3xl mx-auto"
            >
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Packages
              </button>

              <div>
                <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                  Submit Consultation Request
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Confirm the selected options below, provide your details, and submit your project request to receive a quotation.
                </p>
              </div>

              {/* Summary Details Badge */}
              <div className="p-4 rounded-xl bg-ink text-background grid gap-4 grid-cols-1 sm:grid-cols-3 text-xs border border-white/5">
                <div>
                  <p className="text-background/55">Category</p>
                  <p className="font-bold text-gold mt-0.5">{selectedCategory.title}</p>
                </div>
                <div>
                  <p className="text-background/55">Service</p>
                  <p className="font-bold text-gold mt-0.5">{selectedService.name}</p>
                </div>
                <div>
                  <p className="text-background/55">Package / Budget</p>
                  <p className="font-bold text-gold mt-0.5">{selectedPackage.name}</p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5 bg-card p-6 sm:p-8 rounded-2xl border border-border">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(d => ({ ...d, name: e.target.value }))}
                      className={`w-full rounded-md border bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition ${
                        formErrors.name ? 'border-destructive' : 'border-input'
                      }`}
                      placeholder="Sarah John"
                    />
                    {formErrors.name && <p className="mt-1 text-xs text-destructive">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData(d => ({ ...d, companyName: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition"
                      placeholder="LotusRise Retail Ltd"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(d => ({ ...d, phone: e.target.value }))}
                      className={`w-full rounded-md border bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition ${
                        formErrors.phone ? 'border-destructive' : 'border-input'
                      }`}
                      placeholder="+255 711 788 830"
                    />
                    {formErrors.phone && <p className="mt-1 text-xs text-destructive">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData(d => ({ ...d, whatsapp: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition"
                      placeholder="+255 711 788 830"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(d => ({ ...d, email: e.target.value }))}
                      className={`w-full rounded-md border bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition ${
                        formErrors.email ? 'border-destructive' : 'border-input'
                      }`}
                      placeholder="sarah@example.com"
                    />
                    {formErrors.email && <p className="mt-1 text-xs text-destructive">{formErrors.email}</p>}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Region
                    </label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData(d => ({ ...d, region: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition"
                      placeholder="Dar es Salaam"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Budget Range
                    </label>
                    <input
                      type="text"
                      value={formData.budgetRange}
                      onChange={(e) => setFormData(d => ({ ...d, budgetRange: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition"
                      placeholder="e.g. TZS 1.5M - 3M"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Preferred Timeline
                    </label>
                    <input
                      type="text"
                      value={formData.preferredTimeline}
                      onChange={(e) => setFormData(d => ({ ...d, preferredTimeline: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition"
                      placeholder="e.g. 15 Days"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Project Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(d => ({ ...d, description: e.target.value }))}
                    className={`w-full rounded-md border bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition ${
                      formErrors.description ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="Provide details about your project goals, scope, and specific integration preferences..."
                  />
                  {formErrors.description && <p className="mt-1 text-xs text-destructive">{formErrors.description}</p>}
                </div>

                {/* Drag and Drop Reference file */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Reference Document (PDF / Image)
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-5 transition ${
                      dragActive ? 'border-gold bg-gold/5' : 'border-input hover:border-gold/50'
                    }`}
                  >
                    <input
                      type="file"
                      id="ref-file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                    />
                    <label htmlFor="ref-file" className="cursor-pointer text-center">
                      <Upload className="h-7 w-7 text-gold mx-auto mb-2" />
                      {file ? (
                        <span className="text-sm font-semibold text-foreground">{file.name}</span>
                      ) : (
                        <>
                          <span className="text-sm font-semibold text-foreground">Click to upload</span>
                          <span className="block text-xs text-muted-foreground mt-0.5">or drag and drop files here</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Preferred Contact Method
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    {['Email', 'Phone Call', 'WhatsApp'].map(m => (
                      <label key={m} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="contactMethod"
                          value={m}
                          checked={formData.contactMethod === m}
                          onChange={(e) => setFormData(d => ({ ...d, contactMethod: e.target.value }))}
                          className="text-gold focus:ring-gold"
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center rounded-md bg-gold text-ink font-semibold py-3.5 text-sm transition-all hover:bg-yellow-500 hover:shadow-lg hover:shadow-gold/15"
                >
                  {submitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 5: SUCCESS CONFIRMATION */}
          {step === 5 && submittedRequest && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center py-10 space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mx-auto"
              >
                <CheckCircle className="h-10 w-10" />
              </motion.div>

              <div className="space-y-2">
                <h3 className="font-heading text-2xl font-extrabold text-foreground">
                  Request Submitted Successfully!
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Thank you for submitting your request. Our LotusRise Technology Services team will review your request and contact you shortly.
                </p>
              </div>

              {/* Submission Summary */}
              <div className="rounded-2xl border border-border bg-card p-5 text-left text-xs space-y-3">
                <h4 className="font-bold text-foreground border-b border-border pb-2 uppercase tracking-wider text-[10px]">
                  Ticket Details (ID: #{submittedRequest.id})
                </h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-muted-foreground [&>span]:break-words [&>span]:min-w-0">
                  <span>Service Category:</span>
                  <span className="font-semibold text-foreground text-right">{submittedRequest.category}</span>
                  <span>Requested Service:</span>
                  <span className="font-semibold text-foreground text-right">{submittedRequest.service}</span>
                  <span>Package Selected:</span>
                  <span className="font-semibold text-foreground text-right">{submittedRequest.package}</span>
                  <span>Preferred Contact:</span>
                  <span className="font-semibold text-foreground text-right">{submittedRequest.contact_method}</span>
                </div>
              </div>

              {/* Notifications Badge */}
              <div className="grid gap-2 text-left text-[11px] text-muted-foreground bg-foreground/5 p-4 rounded-xl border border-border">
                <p className="font-semibold text-foreground mb-1 text-center">System Integration Logs:</p>
                <div className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Email notification sent to admin</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> WhatsApp notification sent to admin</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Auto-confirmation email sent to customer</div>
              </div>

              <button
                onClick={() => {
                  setStep(1)
                  setSubmittedRequest(null)
                }}
                className="rounded-md bg-gold hover:bg-yellow-500 px-6 py-2.5 text-sm font-semibold text-ink transition"
              >
                Start New Request
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
