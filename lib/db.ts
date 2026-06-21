import { Pool } from 'pg'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const globalForDb = global as unknown as { pool: Pool }

export const pool =
  globalForDb.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // Local DB doesn't require SSL usually. If needed, can configure via env
  })

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool

export async function query(text: string, params?: any[]) {
  return pool.query(text, params)
}

export async function initDb() {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS service_requests (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      company_name VARCHAR(255),
      phone VARCHAR(50),
      whatsapp VARCHAR(50),
      email VARCHAR(255) NOT NULL,
      region VARCHAR(100),
      category VARCHAR(100) NOT NULL,
      service VARCHAR(100) NOT NULL,
      package VARCHAR(100) NOT NULL,
      budget_range VARCHAR(100),
      preferred_timeline VARCHAR(100),
      description TEXT,
      file_name VARCHAR(255),
      contact_method VARCHAR(50),
      status VARCHAR(50) DEFAULT 'New',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vendor_submissions (
      id SERIAL PRIMARY KEY,
      business_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      business_type VARCHAR(100),
      address TEXT,
      license_file_name VARCHAR(255),
      tax_id VARCHAR(100),
      incorporation_number VARCHAR(100),
      tin_file_name VARCHAR(255),
      status VARCHAR(50) DEFAULT 'New',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS agent_submissions (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      address TEXT,
      id_file_name VARCHAR(255),
      tin_file_name VARCHAR(255),
      payout_method VARCHAR(50),
      payout_details TEXT,
      status VARCHAR(50) DEFAULT 'New',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      subject VARCHAR(100),
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'New',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS job_applications (
      id SERIAL PRIMARY KEY,
      job_id VARCHAR(100) NOT NULL,
      job_title VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      resume_file_name VARCHAR(255),
      cover_letter TEXT,
      status VARCHAR(50) DEFAULT 'New',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      status VARCHAR(50) DEFAULT 'Subscribed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS job_postings (
      id SERIAL PRIMARY KEY,
      job_key VARCHAR(100) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      department VARCHAR(100) NOT NULL,
      location VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services_catalog (
      id SERIAL PRIMARY KEY,
      catalog_key VARCHAR(100) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      icon VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      starting_price VARCHAR(100) NOT NULL,
      services JSONB NOT NULL,
      status VARCHAR(50) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
  const seedJobsQuery = `
    INSERT INTO job_postings (job_key, title, department, location, type, description)
    VALUES 
      ('sr-fullstack', 'Senior Full-Stack Developer', 'Engineering', 'Dar es Salaam, Tanzania', 'Full-time / Hybrid', 'Lead the development of our marketplace platforms and core APIs. Requires 5+ years of experience with Next.js, Node.js, and PostgreSQL.'),
      ('prod-designer', 'Product Designer', 'Product', 'Dar es Salaam, Tanzania', 'Full-time / Remote', 'Design intuitive, localized mobile and web applications for our vendors and agents. Requires 3+ years experience in UI/UX and Figma.'),
      ('mkt-manager', 'Digital Marketing Manager', 'Marketing', 'Dar es Salaam, Tanzania', 'Full-time', 'Drive growth, acquisition campaigns, and brand awareness across digital channels. Knowledge of the Tanzanian e-commerce landscape is a big plus.'),
      ('logistics-lead', 'Logistics Operations Lead', 'Operations', 'Dar es Salaam, Tanzania', 'Full-time', 'Coordinate last-mile operations and manage our smart delivery fleet to ensure optimal delivery speeds and customer satisfaction.'),
      ('mobile-dev', 'Mobile App Developer', 'Engineering', 'Dar es Salaam, Tanzania', 'Full-time / Hybrid', 'Build and polish our React Native apps for agents and vendors. Experience with offline-first design and mobile money API integrations is ideal.'),
      ('fin-analyst', 'Financial Analyst', 'Finance', 'Dar es Salaam, Tanzania', 'Full-time', 'Manage budgeting, forecasting, and commercial financial modeling for our logistics and investment reward initiatives.'),
      ('devops-eng', 'DevOps Engineer', 'Engineering', 'Dar es Salaam, Tanzania', 'Full-time / Remote', 'Maintain and scale our AWS infrastructure, CI/CD pipelines, and server monitoring configurations. Strong Docker and Kubernetes experience required.')
    ON CONFLICT (job_key) DO NOTHING;
  `
  try {
    await query(createTablesQuery)
    await query('ALTER TABLE agent_submissions ADD COLUMN IF NOT EXISTS tin_file_name VARCHAR(255);')
    await query('ALTER TABLE vendor_submissions ADD COLUMN IF NOT EXISTS incorporation_number VARCHAR(100);')
    await query('ALTER TABLE vendor_submissions ADD COLUMN IF NOT EXISTS tin_file_name VARCHAR(255);')
    await query(seedJobsQuery)

    // Seed services catalog if empty
    const checkCatalog = await query('SELECT COUNT(*) FROM services_catalog')
    if (parseInt(checkCatalog.rows[0].count, 10) === 0) {
      const defaultCatalog = [
        {
          id: 'web-dev',
          title: 'Website Development',
          icon: 'Globe',
          description: 'Beautiful, modern, SEO-optimized websites that convert visitors into customers.',
          starting_price: 'TZS 500,000',
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
          icon: 'Smartphone',
          description: 'High-performing native and cross-platform mobile apps for iOS and Android devices.',
          starting_price: 'TZS 8,000,000',
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
          icon: 'Laptop',
          description: 'Bespoke web portals, business intelligence dashboards, and administrative software portals.',
          starting_price: 'TZS 5,000,000',
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
          icon: 'ShoppingBag',
          description: 'Multi-vendor marketplaces, delivery routing solutions, and custom checkout flows.',
          starting_price: 'TZS 3,000,000',
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
          icon: 'CreditCard',
          description: 'Integrations with local mobile money (M-Pesa, Tigo Pesa, Airtel Money) and global card payment gateways.',
          starting_price: 'TZS 3,000,000',
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
          icon: 'Cpu',
          description: 'Custom approval workflows, automated document processing, and system reconciliation solutions.',
          starting_price: 'TZS 5,000,000',
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
          icon: 'Cloud',
          description: 'Secure, high-availability server setup, backup systems, and corporate email hosting.',
          starting_price: 'TZS 300,000',
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
          icon: 'Shield',
          description: 'Vulnerability assessments, code reviews, database audits, and penetration testing.',
          starting_price: 'TZS 1,000,000',
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
          icon: 'Activity',
          description: 'Managed IT support, network administration, and hardware troubleshooting for offices.',
          starting_price: 'TZS 100,000',
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
          icon: 'BrainCircuit',
          description: 'Intelligent AI chatbots, natural language document processing, and custom AI tools.',
          starting_price: 'TZS 3,000,000',
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
          icon: 'TrendingUp',
          description: 'SEO ranking optimization, social media campaigns, and Google Ads management.',
          starting_price: 'TZS 500,000',
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
          icon: 'Paintbrush',
          description: 'Premium logo design, company profile packages, and video/motion graphics.',
          starting_price: 'TZS 150,000',
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

      for (const cat of defaultCatalog) {
        await query(
          'INSERT INTO services_catalog (catalog_key, title, icon, description, starting_price, services) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (catalog_key) DO NOTHING',
          [cat.id, cat.title, cat.icon, cat.description, cat.starting_price, JSON.stringify(cat.services)]
        )
      }
      console.log('Seeded 12 default IT service categories in services_catalog.')
    }

    console.log('Database initialized successfully: checked all seven tables and seeded jobs.')
  } catch (err) {
    console.error('Error initializing database:', err)
  }
}

export async function saveUploadedFile(fileName: string, base64Data?: string) {
  if (!base64Data) return
  try {
    const base64Content = base64Data.split(';base64,').pop()
    if (!base64Content) return
    const buffer = Buffer.from(base64Content, 'base64')
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)
    console.log(`Saved uploaded document locally: ${filePath}`)
  } catch (error) {
    console.error(`Failed to save uploaded document ${fileName}:`, error)
  }
}

