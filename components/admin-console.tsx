'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Store,
  Users,
  MessageSquare,
  Briefcase,
  Mail,
  Filter,
  Trash2,
  CheckCircle,
  Settings,
  RefreshCw,
  Search,
  Eye,
  X,
  Plus,
  Pencil,
  Save,
  AlertCircle,
  TrendingUp,
  Activity,
  Layers,
  Database,
  Download,
  Menu
} from 'lucide-react'
import Link from 'next/link'

// Import all actions (both standard and new update/submit)
import {
  getServiceRequests,
  updateRequestStatus,
  deleteRequest,
  updateServiceRequest,
  submitServiceRequest,
  getServicesCatalog,
  submitServicesCatalog,
  updateServicesCatalog,
  deleteServicesCatalog,
  type ServiceRequest,
  type ServicesCatalog
} from '../app/business-solutions/actions'
import {
  getVendorSubmissions,
  getAgentSubmissions,
  getContactInquiries,
  getJobApplications,
  getNewsletterSubscribers,
  updateVendorStatus,
  updateAgentStatus,
  updateContactStatus,
  updateJobStatus,
  updateSubscriberStatus,
  deleteVendorSubmission,
  deleteAgentSubmission,
  deleteContactInquiry,
  deleteJobApplication,
  deleteNewsletterSubscriber,
  updateVendorSubmission,
  updateAgentSubmission,
  updateContactInquiry,
  updateJobApplication,
  updateNewsletterSubscriber,
  submitVendorSubmission,
  submitAgentSubmission,
  submitContactInquiry,
  submitJobApplication,
  submitNewsletterSubscriber,
  getJobPostings,
  submitJobPosting,
  updateJobPosting,
  deleteJobPosting,
  type VendorSubmission,
  type AgentSubmission,
  type ContactInquiry,
  type JobApplication,
  type NewsletterSubscriber,
  type JobPosting
} from '../app/admin/actions'

type TabType = 'overview' | 'services' | 'vendors' | 'agents' | 'jobs' | 'contacts' | 'newsletters' | 'postings' | 'catalog'

export function AdminConsole() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Databases states
  const [services, setServices] = useState<ServiceRequest[]>([])
  const [vendors, setVendors] = useState<VendorSubmission[]>([])
  const [agents, setAgents] = useState<AgentSubmission[]>([])
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [contacts, setContacts] = useState<ContactInquiry[]>([])
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [postings, setPostings] = useState<JobPosting[]>([])
  const [catalog, setCatalog] = useState<ServicesCatalog[]>([])

  // Modal / details viewer states
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [recordType, setRecordType] = useState<string>('')

  // CRUD Modal States
  const [crudModal, setCrudModal] = useState<{
    isOpen: boolean
    mode: 'create' | 'edit'
    type: TabType
    record?: any
  }>({ isOpen: false, mode: 'create', type: 'services' })

  const [formData, setFormData] = useState<any>({})
  const [modalLoading, setModalLoading] = useState(false)

  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Filter States
  const [statusFilter, setStatusFilter] = useState('All')

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('lotusrise_admin_auth')
    if (sessionAuth === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      loadAllData()
    }
  }, [isLoggedIn])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [resServices, resVendors, resAgents, resJobs, resContacts, resSubscribers, resPostings, resCatalog] = await Promise.all([
        getServiceRequests(),
        getVendorSubmissions(),
        getAgentSubmissions(),
        getJobApplications(),
        getContactInquiries(),
        getNewsletterSubscribers(),
        getJobPostings(),
        getServicesCatalog()
      ])

      if (resServices.success && resServices.data) setServices(resServices.data)
      if (resVendors.success && resVendors.data) setVendors(resVendors.data)
      if (resAgents.success && resAgents.data) setAgents(resAgents.data)
      if (resJobs.success && resJobs.data) setJobs(resJobs.data)
      if (resContacts.success && resContacts.data) setContacts(resContacts.data)
      if (resSubscribers.success && resSubscribers.data) setSubscribers(resSubscribers.data)
      if (resPostings.success && resPostings.data) setPostings(resPostings.data)
      if (resCatalog.success && resCatalog.data) setCatalog(resCatalog.data)
      
      showToast('Database records synchronized successfully.', 'info')
    } catch (error) {
      console.error('Error loading admin databases:', error)
      showToast('Failed to load database logs.', 'error')
    }
    setLoading(false)
  }

  // --- ACTIONS HANDLERS ---
  const handleUpdateStatus = async (type: TabType, id: number, newStatus: string) => {
    let res: { success: boolean; error?: string } = { success: false }
    if (type === 'services') res = await updateRequestStatus(id, newStatus)
    else if (type === 'vendors') res = await updateVendorStatus(id, newStatus)
    else if (type === 'agents') res = await updateAgentStatus(id, newStatus)
    else if (type === 'jobs') res = await updateJobStatus(id, newStatus)
    else if (type === 'contacts') res = await updateContactStatus(id, newStatus)
    else if (type === 'newsletters') res = await updateSubscriberStatus(id, newStatus)
    else if (type === 'postings') {
      const p = postings.find(r => r.id === id)
      if (p) res = await updateJobPosting(id, { title: p.title, department: p.department, location: p.location, type: p.type, description: p.description, status: newStatus })
    }
    else if (type === 'catalog') {
      const c = catalog.find(r => r.id === id)
      if (c) res = await updateServicesCatalog(id, { catalog_key: c.catalog_key, title: c.title, icon: c.icon, description: c.description, starting_price: c.starting_price, services: c.services, status: newStatus })
    }

    if (res.success) {
      showToast('Status updated successfully.', 'success')
      if (type === 'services') setServices(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
      else if (type === 'vendors') setVendors(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
      else if (type === 'agents') setAgents(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
      else if (type === 'jobs') setJobs(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
      else if (type === 'contacts') setContacts(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
      else if (type === 'newsletters') setSubscribers(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
      else if (type === 'postings') setPostings(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
      else if (type === 'catalog') setCatalog(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
    } else {
      showToast(res.error || 'Failed to update status.', 'error')
    }
  }

  const handleDeleteRecord = async (type: TabType, id: number) => {
    if (!confirm('Are you sure you want to delete this record permanently?')) return
    let res: { success: boolean; error?: string } = { success: false }
    if (type === 'services') res = await deleteRequest(id)
    else if (type === 'vendors') res = await deleteVendorSubmission(id)
    else if (type === 'agents') res = await deleteAgentSubmission(id)
    else if (type === 'jobs') res = await deleteJobApplication(id)
    else if (type === 'contacts') res = await deleteContactInquiry(id)
    else if (type === 'newsletters') res = await deleteNewsletterSubscriber(id)
    else if (type === 'postings') res = await deleteJobPosting(id)
    else if (type === 'catalog') res = await deleteServicesCatalog(id)

    if (res.success) {
      showToast('Record deleted permanently.', 'success')
      if (type === 'services') setServices(prev => prev.filter(r => r.id !== id))
      else if (type === 'vendors') setVendors(prev => prev.filter(r => r.id !== id))
      else if (type === 'agents') setAgents(prev => prev.filter(r => r.id !== id))
      else if (type === 'jobs') setJobs(prev => prev.filter(r => r.id !== id))
      else if (type === 'contacts') setContacts(prev => prev.filter(r => r.id !== id))
      else if (type === 'newsletters') setSubscribers(prev => prev.filter(r => r.id !== id))
      else if (type === 'postings') setPostings(prev => prev.filter(r => r.id !== id))
      else if (type === 'catalog') setCatalog(prev => prev.filter(r => r.id !== id))
      if (selectedRecord?.id === id) setSelectedRecord(null)
    } else {
      showToast(res.error || 'Failed to delete record.', 'error')
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'lotusrise2026') {
      setIsLoggedIn(true)
      sessionStorage.setItem('lotusrise_admin_auth', 'true')
      setLoginError('')
      showToast('Welcome back, Administrator.', 'success')
    } else {
      setLoginError('Invalid username or password.')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem('lotusrise_admin_auth')
    setUsername('')
    setPassword('')
    showToast('Signed out of administration console.', 'info')
  }

  // --- FORM STATE AND CRUD PREP ---
  const mapRecordToForm = (record: any, type: TabType) => {
    if (!record) {
      // Return defaults for creating
      if (type === 'services') {
        return {
          name: '',
          companyName: '',
          phone: '',
          whatsapp: '',
          email: '',
          region: '',
          category: 'Website Development',
          service: '',
          package: 'Standard',
          budgetRange: '$1,500 - $3,000',
          preferredTimeline: '3-4 Weeks',
          description: '',
          fileName: '',
          contactMethod: 'Email',
          status: 'New'
        }
      }
      if (type === 'vendors') {
        return {
          businessName: '',
          email: '',
          phone: '',
          businessType: 'Retail',
          address: '',
          licenseFileName: '',
          taxId: '',
          incorporationNumber: '',
          tinFileName: '',
          status: 'New'
        }
      }
      if (type === 'agents') {
        return {
          fullName: '',
          email: '',
          phone: '',
          address: '',
          idFileName: '',
          tinFileName: '',
          payoutMethod: 'Mobile Money',
          payoutDetails: '',
          status: 'New'
        }
      }
      if (type === 'jobs') {
        return {
          jobId: 'LRG-DEV-09',
          jobTitle: 'Frontend React Developer',
          name: '',
          email: '',
          resumeFileName: '',
          coverLetter: '',
          status: 'New'
        }
      }
      if (type === 'contacts') {
        return {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          status: 'New'
        }
      }
      if (type === 'newsletters') {
        return {
          email: '',
          status: 'Subscribed'
        }
      }
      if (type === 'postings') {
        return {
          title: '',
          department: 'Engineering',
          location: 'Dar es Salaam, Tanzania',
          type: 'Full-time / Hybrid',
          description: '',
          status: 'Active'
        }
      }
      if (type === 'catalog') {
        return {
          title: '',
          catalog_key: '',
          icon: 'Globe',
          description: '',
          starting_price: 'TZS 500,000',
          services: JSON.stringify([
            {
              name: 'Sample Service',
              description: 'Detailed description of the service.',
              timeline: '5 - 10 Days',
              priceRange: 'TZS 500,000 - 1,000,000',
              features: ['Feature 1', 'Feature 2'],
              packages: [
                { name: 'Starter Package', priceRange: 'TZS 500,000', inclusions: ['Inclusion 1', 'Inclusion 2'] }
              ]
            }
          ], null, 2),
          status: 'Active'
        }
      }
      return {}
    }

    // Return mapped fields for editing
    if (type === 'services') {
      return {
        name: record.name || '',
        companyName: record.company_name || '',
        phone: record.phone || '',
        whatsapp: record.whatsapp || '',
        email: record.email || '',
        region: record.region || '',
        category: record.category || '',
        service: record.service || '',
        package: record.package || '',
        budgetRange: record.budget_range || '',
        preferredTimeline: record.preferred_timeline || '',
        description: record.description || '',
        fileName: record.file_name || '',
        contactMethod: record.contact_method || '',
        status: record.status || 'New'
      }
    }
    if (type === 'vendors') {
      return {
        businessName: record.business_name || '',
        email: record.email || '',
        phone: record.phone || '',
        businessType: record.business_type || '',
        address: record.address || '',
        licenseFileName: record.license_file_name || '',
        taxId: record.tax_id || '',
        incorporationNumber: record.incorporation_number || '',
        tinFileName: record.tin_file_name || '',
        status: record.status || 'New'
      }
    }
    if (type === 'agents') {
      return {
        fullName: record.full_name || '',
        email: record.email || '',
        phone: record.phone || '',
        address: record.address || '',
        idFileName: record.id_file_name || '',
        tinFileName: record.tin_file_name || '',
        payoutMethod: record.payout_method || '',
        payoutDetails: record.payout_details || '',
        status: record.status || 'New'
      }
    }
    if (type === 'jobs') {
      return {
        jobId: record.job_id || '',
        jobTitle: record.job_title || '',
        name: record.name || '',
        email: record.email || '',
        resumeFileName: record.resume_file_name || '',
        coverLetter: record.cover_letter || '',
        status: record.status || 'New'
      }
    }
    if (type === 'contacts') {
      return {
        name: record.name || '',
        email: record.email || '',
        phone: record.phone || '',
        subject: record.subject || '',
        message: record.message || '',
        status: record.status || 'New'
      }
    }
    if (type === 'newsletters') {
      return {
        email: record.email || '',
        status: record.status || 'Subscribed'
      }
    }
    if (type === 'postings') {
      return {
        title: record.title || '',
        department: record.department || '',
        location: record.location || '',
        type: record.type || '',
        description: record.description || '',
        status: record.status || 'Active'
      }
    }
    if (type === 'catalog') {
      return {
        title: record.title || '',
        catalog_key: record.catalog_key || '',
        icon: record.icon || 'Globe',
        description: record.description || '',
        starting_price: record.starting_price || '',
        services: typeof record.services === 'string' ? record.services : JSON.stringify(record.services, null, 2),
        status: record.status || 'Active'
      }
    }
    return {}
  }

  const openCreateModal = (type: TabType) => {
    const defaults = mapRecordToForm(null, type)
    setFormData(defaults)
    setCrudModal({
      isOpen: true,
      mode: 'create',
      type,
      record: null
    })
  }

  const openEditModal = (type: TabType, record: any) => {
    const mapped = mapRecordToForm(record, type)
    setFormData(mapped)
    setCrudModal({
      isOpen: true,
      mode: 'edit',
      type,
      record
    })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalLoading(true)
    let res: { success: boolean; data?: any; error?: string } = { success: false }

    try {
      if (crudModal.mode === 'create') {
        if (crudModal.type === 'services') {
          res = await submitServiceRequest(formData)
        } else if (crudModal.type === 'vendors') {
          res = await submitVendorSubmission(formData)
        } else if (crudModal.type === 'agents') {
          res = await submitAgentSubmission(formData)
        } else if (crudModal.type === 'jobs') {
          res = await submitJobApplication(formData)
        } else if (crudModal.type === 'contacts') {
          res = await submitContactInquiry(formData)
        } else if (crudModal.type === 'newsletters') {
          res = await submitNewsletterSubscriber(formData.email)
        } else if (crudModal.type === 'postings') {
          res = await submitJobPosting(formData)
        } else if (crudModal.type === 'catalog') {
          let parsedServices;
          try {
            parsedServices = typeof formData.services === 'string' ? JSON.parse(formData.services) : formData.services;
          } catch (e) {
            throw new Error('Invalid JSON format for Services Catalog Details. Please correct the formatting.');
          }
          res = await submitServicesCatalog({ ...formData, services: parsedServices })
        }
      } else {
        // Edit mode
        const id = crudModal.record.id
        if (crudModal.type === 'services') {
          res = await updateServiceRequest(id, formData)
        } else if (crudModal.type === 'vendors') {
          res = await updateVendorSubmission(id, formData)
        } else if (crudModal.type === 'agents') {
          res = await updateAgentSubmission(id, formData)
        } else if (crudModal.type === 'jobs') {
          res = await updateJobApplication(id, formData)
        } else if (crudModal.type === 'contacts') {
          res = await updateContactInquiry(id, formData)
        } else if (crudModal.type === 'newsletters') {
          res = await updateNewsletterSubscriber(id, formData.email, formData.status)
        } else if (crudModal.type === 'postings') {
          res = await updateJobPosting(id, formData)
        } else if (crudModal.type === 'catalog') {
          let parsedServices;
          try {
            parsedServices = typeof formData.services === 'string' ? JSON.parse(formData.services) : formData.services;
          } catch (e) {
            throw new Error('Invalid JSON format for Services Catalog Details. Please correct the formatting.');
          }
          res = await updateServicesCatalog(id, { ...formData, services: parsedServices })
        }
      }

      if (res.success && res.data) {
        showToast(
          `Record ${crudModal.mode === 'create' ? 'created' : 'updated'} successfully!`,
          'success'
        )
        
        // Update local states
        const updatedRecord = res.data
        if (crudModal.type === 'services') {
          setServices(prev => crudModal.mode === 'create' 
            ? [updatedRecord, ...prev] 
            : prev.map(r => r.id === updatedRecord.id ? updatedRecord : r)
          )
        } else if (crudModal.type === 'vendors') {
          setVendors(prev => crudModal.mode === 'create' 
            ? [updatedRecord, ...prev] 
            : prev.map(r => r.id === updatedRecord.id ? updatedRecord : r)
          )
        } else if (crudModal.type === 'agents') {
          setAgents(prev => crudModal.mode === 'create' 
            ? [updatedRecord, ...prev] 
            : prev.map(r => r.id === updatedRecord.id ? updatedRecord : r)
          )
        } else if (crudModal.type === 'jobs') {
          setJobs(prev => crudModal.mode === 'create' 
            ? [updatedRecord, ...prev] 
            : prev.map(r => r.id === updatedRecord.id ? updatedRecord : r)
          )
        } else if (crudModal.type === 'contacts') {
          setContacts(prev => crudModal.mode === 'create' 
            ? [updatedRecord, ...prev] 
            : prev.map(r => r.id === updatedRecord.id ? updatedRecord : r)
          )
        } else if (crudModal.type === 'newsletters') {
          setSubscribers(prev => crudModal.mode === 'create' 
            ? [updatedRecord, ...prev] 
            : prev.map(r => r.id === updatedRecord.id ? updatedRecord : r)
          )
        } else if (crudModal.type === 'postings') {
          setPostings(prev => crudModal.mode === 'create' 
            ? [updatedRecord, ...prev] 
            : prev.map(r => r.id === updatedRecord.id ? updatedRecord : r)
          )
        } else if (crudModal.type === 'catalog') {
          setCatalog(prev => crudModal.mode === 'create' 
            ? [updatedRecord, ...prev] 
            : prev.map(r => r.id === updatedRecord.id ? updatedRecord : r)
          )
        }
        
        setCrudModal(prev => ({ ...prev, isOpen: false }))
      } else {
        showToast(res.error || 'Operation failed. Verify input details.', 'error')
      }
    } catch (error) {
      showToast((error as Error).message, 'error')
    } finally {
      setModalLoading(false)
    }
  }

  // --- FILTERING ---
  const applySearchAndFilters = <T extends { name?: string; business_name?: string; full_name?: string; email?: string; status: string; title?: string; department?: string }>(list: T[]) => {
    return list.filter(item => {
      const matchStatus = statusFilter === 'All' || item.status === statusFilter
      const text = `${item.name || ''} ${item.business_name || ''} ${item.full_name || ''} ${item.email || ''} ${item.title || ''} ${item.department || ''}`.toLowerCase()
      const matchSearch = text.includes(searchQuery.toLowerCase())
      return matchStatus && matchSearch
    })
  }

  // --- DYNAMIC SVG CHART GENERATOR ---
  const getChartData = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse()

    const allSubmissions = [
      ...services.map(s => s.created_at),
      ...vendors.map(v => v.created_at),
      ...agents.map(a => a.created_at),
      ...jobs.map(j => j.created_at),
      ...contacts.map(c => c.created_at),
      ...subscribers.map(s => s.created_at)
    ]

    const counts = days.map(day => {
      return allSubmissions.filter(d => {
        if (!d) return false
        const itemDate = new Date(d).toISOString().split('T')[0]
        return itemDate === day
      }).length
    })

    return { days, counts }
  }

  const chartData = getChartData()
  const maxCount = Math.max(...chartData.counts, 1)
  const svgWidth = 600
  const svgHeight = 160
  const paddingX = 40
  const paddingY = 25

  const points = chartData.counts.map((count, index) => {
    const x = paddingX + (index / (chartData.counts.length - 1)) * (svgWidth - paddingX * 2)
    const y = svgHeight - paddingY - (count / maxCount) * (svgHeight - paddingY * 2)
    return { x, y }
  })

  let linePath = ''
  let areaPath = ''
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y} `
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpX = (prev.x + curr.x) / 2
      linePath += `Q ${prev.x} ${prev.y}, ${cpX} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y} `
    }
    areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#07080b] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Decorative Neon Orbs */}
        <motion.div
          className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-32 -bottom-20 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 shadow-2xl space-y-6"
        >
          {/* Logo Brand Header */}
          <div className="text-center space-y-3">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-extrabold font-heading text-2xl shadow-xl shadow-amber-500/10">L</span>
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-black tracking-tight text-white">LotusRise Console</h2>
              <p className="text-xs text-neutral-400 font-medium">Verify credentials to manage the workspace databases.</p>
            </div>
          </div>

          {loginError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-semibold flex items-center justify-center gap-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {loginError}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="block text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition duration-300 font-medium"
                placeholder="admin"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition duration-300 font-medium"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-extrabold py-3.5 rounded-xl transition duration-300 shadow-xl shadow-amber-500/10 transform active:scale-[0.99] text-xs uppercase tracking-wider"
            >
              Access System Database
            </button>
          </form>

          <div className="border-t border-white/5 pt-5 flex flex-col items-center gap-3 text-[10px]">
            <p className="text-neutral-500 text-center leading-relaxed font-medium">
              Console credentials helper:<br />
              Username: <span className="text-amber-400 font-bold">admin</span> | Password: <span className="text-amber-400 font-bold">lotusrise2026</span>
            </p>
            <Link
              href="/"
              className="text-amber-400 hover:text-white transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-1 mt-1"
            >
              ← Return to Site
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07080b] text-neutral-200 font-sans pb-20 relative overflow-hidden">
      {/* Decorative Globs for logged in view */}
      <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 h-[500px] w-[500px] rounded-full bg-blue-600/[0.03] blur-[150px] pointer-events-none" />

      {/* Admin header console top-bar */}
      <header className="border-b border-white/5 bg-[#090a0f]/80 backdrop-blur-md sticky top-0 z-40 py-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition focus:outline-none cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-black font-black font-heading text-lg shadow-lg shadow-amber-500/5">L</span>
            <div>
              <span className="font-heading text-sm font-black text-white leading-tight block">LotusRise Global</span>
              <span className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest leading-none mt-0.5">Administration Workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/5 rounded-full py-1.5 px-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-neutral-400 font-semibold text-[10px]">DB Engine Connected</span>
            </div>
            <span className="text-neutral-400 hidden sm:inline font-semibold">Logged in as <strong className="text-white font-bold">admin</strong></span>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-white/10 hover:border-red-500/30 text-neutral-300 hover:text-red-400 px-4 py-2 font-bold transition duration-300 text-[11px] uppercase tracking-wider"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#090a0f] border-r border-white/10 p-6 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 text-black font-black font-heading text-sm">L</span>
                    <span className="font-heading text-xs font-black text-white tracking-wider">LotusRise Console</span>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
                    aria-label="Close sidebar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-1.5 pt-4">
                  <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest px-3 mb-2">System Modules</p>
                  {[
                    { id: 'overview', label: 'Console Dashboard', icon: Settings },
                    { id: 'services', label: 'IT Explorer Requests', icon: FileText, badge: services.filter(r => r.status === 'New').length },
                    { id: 'vendors', label: 'Vendors Submissions', icon: Store, badge: vendors.filter(r => r.status === 'New').length },
                    { id: 'agents', label: 'Agents Applications', icon: Users, badge: agents.filter(r => r.status === 'New').length },
                    { id: 'jobs', label: 'Careers Applications', icon: Briefcase, badge: jobs.filter(r => r.status === 'New').length },
                    { id: 'contacts', label: 'Contact Inquiries', icon: MessageSquare, badge: contacts.filter(r => r.status === 'New').length },
                    { id: 'newsletters', label: 'Newsletter List', icon: Mail },
                    { id: 'postings', label: 'Manage Job Postings', icon: Layers },
                    { id: 'catalog', label: 'Manage Services Catalog', icon: Database }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as TabType)
                        setStatusFilter('All')
                        setSearchQuery('')
                        setIsMobileSidebarOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-bold rounded-xl transition duration-300 cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/10'
                          : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </span>
                      {!!tab.badge && tab.badge > 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${activeTab === tab.id ? 'bg-black text-amber-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">DB Engine Status</span>
                  <span className="text-[10px] text-neutral-400 font-semibold block leading-tight">PostgreSQL Localhost</span>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Connected</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          
          {/* SIDEBAR TABS (Desktop) */}
          <aside className="hidden lg:block space-y-1.5 shrink-0">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-3 mb-2.5">System Modules</p>
            {[
              { id: 'overview', label: 'Console Dashboard', icon: Settings },
              { id: 'services', label: 'IT Explorer Requests', icon: FileText, badge: services.filter(r => r.status === 'New').length },
              { id: 'vendors', label: 'Vendors Submissions', icon: Store, badge: vendors.filter(r => r.status === 'New').length },
              { id: 'agents', label: 'Agents Applications', icon: Users, badge: agents.filter(r => r.status === 'New').length },
              { id: 'jobs', label: 'Careers Applications', icon: Briefcase, badge: jobs.filter(r => r.status === 'New').length },
              { id: 'contacts', label: 'Contact Inquiries', icon: MessageSquare, badge: contacts.filter(r => r.status === 'New').length },
              { id: 'newsletters', label: 'Newsletter List', icon: Mail },
              { id: 'postings', label: 'Manage Job Postings', icon: Layers },
              { id: 'catalog', label: 'Manage Services Catalog', icon: Database }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType)
                  setStatusFilter('All')
                  setSearchQuery('')
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-bold rounded-xl transition duration-300 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/10'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </span>
                {!!tab.badge && tab.badge > 0 && (
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${activeTab === tab.id ? 'bg-black text-amber-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
            
            <div className="pt-6 border-t border-white/5 mt-6 px-3">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">DB Engine Status</span>
                <span className="text-[10px] text-neutral-400 font-semibold block leading-tight">PostgreSQL Localhost</span>
                <span className="text-[9px] text-amber-500 font-bold block">Tables: 6 Operational</span>
              </div>
            </div>
          </aside>

          {/* MAIN DATAGRID */}
          <main className="space-y-6 min-w-0">
            
            {/* Header Control row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <h2 className="font-heading text-2xl font-black tracking-tight text-white capitalize flex items-center gap-3">
                  <span>{activeTab === 'overview' ? 'Administration Dashboard' : `${activeTab} database log`}</span>
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="lg:hidden text-[10px] font-bold bg-white/5 border border-white/10 hover:border-amber-500/30 text-amber-500 hover:text-white px-2.5 py-1 rounded-xl transition cursor-pointer"
                  >
                    Change Tab
                  </button>
                </h2>
                <p className="text-xs text-neutral-400 mt-1 font-medium">
                  Review registrations, client requests, and communication records in real-time.
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {activeTab !== 'overview' && (
                  <button
                    onClick={() => openCreateModal(activeTab)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black rounded-xl px-4 py-2.5 transition duration-300 shadow-lg shadow-amber-500/5 transform active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    Add Record
                  </button>
                )}
                <button
                  onClick={loadAllData}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 text-xs font-bold border border-white/10 hover:border-amber-500/30 hover:text-amber-400 rounded-xl px-3.5 py-2.5 bg-white/5 transition disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Sync
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-32 text-center text-neutral-400 font-medium text-xs">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mx-auto mb-4 shadow" />
                Querying PostgreSQL engine database logs...
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* ========================================================================= */}
                {/* TAB: OVERVIEW DASHBOARD                                                   */}
                {/* ========================================================================= */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Database Stat Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        { title: 'IT Service Requests', icon: FileText, count: services.length, color: 'from-amber-400/10 to-amber-600/5 text-amber-400 border-amber-500/10' },
                        { title: 'Registered Vendors', icon: Store, count: vendors.length, color: 'from-emerald-400/10 to-emerald-600/5 text-emerald-400 border-emerald-500/10' },
                        { title: 'Registered Agents', icon: Users, count: agents.length, color: 'from-blue-400/10 to-blue-600/5 text-blue-400 border-blue-500/10' },
                        { title: 'Job Candidates', icon: Briefcase, count: jobs.length, color: 'from-purple-400/10 to-purple-600/5 text-purple-400 border-purple-500/10' },
                        { title: 'General Inquiries', icon: MessageSquare, count: contacts.length, color: 'from-cyan-400/10 to-cyan-600/5 text-cyan-400 border-cyan-500/10' },
                        { title: 'Newsletter Subscribers', icon: Mail, count: subscribers.length, color: 'from-rose-400/10 to-rose-600/5 text-rose-400 border-rose-500/10' }
                      ].map((card) => (
                        <div key={card.title} className={`p-5 rounded-2xl border bg-gradient-to-br ${card.color} flex items-center gap-4 hover:scale-[1.01] transition-all duration-300`}>
                          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/5 shadow-md shrink-0">
                            <card.icon className="h-5.5 w-5.5" />
                          </span>
                          <div>
                            <p className="text-2xl font-black text-white leading-none">{card.count}</p>
                            <p className="text-[11px] text-neutral-400 font-bold mt-1.5 tracking-wide">{card.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chart & Trend Panel */}
                    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
                      
                      {/* Interactive Trend Chart */}
                      <div className="p-6 rounded-2xl border border-white/5 bg-[#090a0f]/60 backdrop-blur-md space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4.5 w-4.5 text-amber-400" />
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Submission Analytics</h3>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-bold bg-white/5 border border-white/5 rounded-full px-2.5 py-1">Last 7 Days</span>
                        </div>

                        {/* Custom area curve path */}
                        <div className="w-full relative pt-2">
                          <svg className="w-full h-40 overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                            {/* Gridlines */}
                            <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                            <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
                            <line x1={paddingX} y1={(paddingY + svgHeight - paddingY) / 2} x2={svgWidth - paddingX} y2={(paddingY + svgHeight - paddingY) / 2} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                            
                            {/* Gradient definition */}
                            <defs>
                              <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
                              </linearGradient>
                            </defs>

                            {/* Chart Area */}
                            {areaPath && <path d={areaPath} fill="url(#chart-area-grad)" />}
                            {/* Chart line */}
                            {linePath && <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />}
                            
                            {/* Point circles */}
                            {points.map((pt, i) => (
                              <g key={i}>
                                <circle cx={pt.x} cy={pt.y} r={4} fill="#f59e0b" className="transition-all hover:r-6" />
                                <circle cx={pt.x} cy={pt.y} r={8} fill="#f59e0b" fillOpacity={0.15} />
                              </g>
                            ))}

                            {/* X-axis labels */}
                            {chartData.days.map((day, idx) => {
                              const x = paddingX + (idx / (chartData.days.length - 1)) * (svgWidth - paddingX * 2)
                              const label = day.split('-').slice(1).join('/')
                              return (
                                <text key={idx} x={x} y={svgHeight - 5} fill="rgba(255,255,255,0.4)" fontSize={9} fontWeight="bold" textAnchor="middle">
                                  {label}
                                </text>
                              )
                            })}
                          </svg>
                        </div>
                      </div>

                      {/* DB Health Summary */}
                      <div className="p-6 rounded-2xl border border-white/5 bg-[#090a0f]/60 backdrop-blur-md space-y-4">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4.5 w-4.5 text-amber-400" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Workspace Health</h3>
                        </div>
                        
                        <div className="space-y-3 pt-2 text-[11px] font-semibold text-neutral-400">
                          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2.5 rounded-xl">
                            <span>Connection Pool</span>
                            <span className="text-emerald-400">Active</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2.5 rounded-xl">
                            <span>API latency</span>
                            <span className="text-white">12ms</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2.5 rounded-xl">
                            <span>Total logs size</span>
                            <span className="text-white">~48 KB</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2.5 rounded-xl">
                            <span>Schema revision</span>
                            <span className="text-amber-500">v1.2</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick activity logs table */}
                    <div className="p-6 rounded-2xl border border-white/5 bg-[#090a0f]/60 backdrop-blur-md">
                      <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="h-4 w-4 text-amber-400" />
                        Recent System Activity (All Collections)
                      </h3>

                      <div className="divide-y divide-white/5 text-xs">
                        {[
                          ...services.map(r => ({ type: 'IT Request', title: `${r.service} (${r.package})`, name: r.name, date: r.created_at, status: r.status, color: 'text-amber-400 bg-amber-500/10' })),
                          ...vendors.map(v => ({ type: 'Vendor', title: v.business_name, name: v.email, date: v.created_at, status: v.status, color: 'text-emerald-400 bg-emerald-500/10' })),
                          ...agents.map(a => ({ type: 'Agent', title: 'Agent application', name: a.full_name, date: a.created_at, status: a.status, color: 'text-blue-400 bg-blue-500/10' })),
                          ...jobs.map(j => ({ type: 'Careers', title: j.job_title, name: j.name, date: j.created_at, status: j.status, color: 'text-purple-400 bg-purple-500/10' })),
                          ...contacts.map(c => ({ type: 'Contact', title: c.subject, name: c.name, date: c.created_at, status: c.status, color: 'text-cyan-400 bg-cyan-500/10' })),
                        ]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 6)
                          .map((item, idx) => (
                            <div key={idx} className="py-3.5 flex justify-between gap-4 items-center">
                              <div>
                                <span className={`inline-flex rounded-lg px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider mr-2.5 ${item.color}`}>
                                  {item.type}
                                </span>
                                <span className="font-semibold text-white">{item.title}</span>
                                <span className="text-neutral-400 text-[10px] ml-2">by {item.name}</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[10px] text-neutral-500 mr-4 font-bold">{new Date(item.date).toLocaleDateString()}</span>
                                <span className="font-extrabold text-[9px] uppercase tracking-wider text-amber-500">{item.status}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ========================================================================= */}
                {/* GENERIC DATA TABLES                                                       */}
                {/* ========================================================================= */}
                {activeTab !== 'overview' && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Search and filter controls row */}
                    <div className="flex flex-col sm:flex-row gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/5 text-xs">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search database records by name, email, or company name..."
                          className="w-full rounded-xl border border-white/10 bg-[#090a0f]/60 pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-semibold"
                        />
                      </div>

                      {/* Status select filter */}
                      {activeTab !== 'newsletters' && (
                        <div className="flex items-center gap-2">
                          <Filter className="h-4.5 w-4.5 text-amber-400 shrink-0" />
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border border-white/10 bg-[#090a0f]/60 px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-semibold"
                          >
                            <option value="All" className="bg-[#090a0f] text-white">All Statuses</option>
                            {activeTab === 'services' && ['New', 'Under Review', 'Quotation Sent', 'Negotiation', 'Approved', 'In Progress', 'Completed', 'Cancelled'].map(s => (
                              <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                            ))}
                            {activeTab === 'vendors' && ['New', 'Approved', 'Suspended', 'Rejected'].map(s => (
                              <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                            ))}
                            {activeTab === 'agents' && ['New', 'Approved', 'Active', 'Suspended', 'Rejected'].map(s => (
                              <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                            ))}
                            {activeTab === 'jobs' && ['New', 'Screened', 'Interview', 'Offered', 'Rejected'].map(s => (
                              <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                            ))}
                            {activeTab === 'contacts' && ['New', 'Replied', 'Closed'].map(s => (
                              <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#090a0f]/60 backdrop-blur-md">
                      <table className="min-w-full divide-y divide-white/5 text-xs text-left">
                        <thead className="bg-white/[0.02] font-extrabold text-neutral-400 uppercase tracking-widest text-[9px]">
                          {/* --- HEADERS FOR SERVICES --- */}
                          {activeTab === 'services' && (
                            <tr>
                              <th className="px-6 py-4">ID</th>
                              <th className="px-6 py-4">Client / Company</th>
                              <th className="px-6 py-4">Service Details</th>
                              <th className="px-6 py-4">Budget Range</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                          )}

                          {/* --- HEADERS FOR VENDORS --- */}
                          {activeTab === 'vendors' && (
                            <tr>
                              <th className="px-6 py-4">ID</th>
                              <th className="px-6 py-4">Business Name / Email</th>
                              <th className="px-6 py-4">Business Type</th>
                              <th className="px-6 py-4">Tax ID / License</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                          )}

                          {/* --- HEADERS FOR AGENTS --- */}
                          {activeTab === 'agents' && (
                            <tr>
                              <th className="px-6 py-4">ID</th>
                              <th className="px-6 py-4">Full Name / Email</th>
                              <th className="px-6 py-4">Payout Method</th>
                              <th className="px-6 py-4">Address</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                          )}

                          {/* --- HEADERS FOR JOBS --- */}
                          {activeTab === 'jobs' && (
                            <tr>
                              <th className="px-6 py-4">ID</th>
                              <th className="px-6 py-4">Candidate / Email</th>
                              <th className="px-6 py-4">Applied Role</th>
                              <th className="px-6 py-4">Resume File</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                          )}

                          {/* --- HEADERS FOR CONTACTS --- */}
                          {activeTab === 'contacts' && (
                            <tr>
                              <th className="px-6 py-4">ID</th>
                              <th className="px-6 py-4">Sender Info</th>
                              <th className="px-6 py-4">Subject</th>
                              <th className="px-6 py-4">Message Excerpt</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                          )}

                          {/* --- HEADERS FOR NEWSLETTERS --- */}
                          {activeTab === 'newsletters' && (
                            <tr>
                              <th className="px-6 py-4">ID</th>
                              <th className="px-6 py-4">Email Address</th>
                              <th className="px-6 py-4">Date Subscribed</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                          )}

                          {/* --- HEADERS FOR JOB POSTINGS --- */}
                          {activeTab === 'postings' && (
                            <tr>
                              <th className="px-6 py-4">ID</th>
                              <th className="px-6 py-4">Job Title</th>
                              <th className="px-6 py-4">Department & Type</th>
                              <th className="px-6 py-4">Location</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                          )}

                          {/* --- HEADERS FOR SERVICES CATALOG --- */}
                          {activeTab === 'catalog' && (
                            <tr>
                              <th className="px-6 py-4">ID</th>
                              <th className="px-6 py-4">Category Title</th>
                              <th className="px-6 py-4">Icon & Key</th>
                              <th className="px-6 py-4">Starting Price</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                          )}
                        </thead>
                        <tbody className="divide-y divide-white/5 text-neutral-300 font-semibold">
                          {/* ========================================================================= */}
                          {/* ROWS: SERVICE REQUESTS                                                    */}
                          {/* ========================================================================= */}
                          {activeTab === 'services' && applySearchAndFilters(services).map((req) => (
                            <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-bold text-amber-500">#{req.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-white">{req.name}</p>
                                <p className="text-[10px] text-neutral-400">{req.company_name || 'Individual'}</p>
                                <p className="text-[9px] text-neutral-500 font-semibold">{req.email} | {req.phone}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-white">{req.service}</p>
                                <p className="text-[10px] text-neutral-400">{req.category} ({req.package})</p>
                              </td>
                              <td className="px-6 py-4 font-bold text-white">{req.budget_range || 'N/A'}</td>
                              <td className="px-6 py-4 text-neutral-400 font-bold">{new Date(req.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={req.status}
                                  onChange={(e) => handleUpdateStatus('services', req.id, e.target.value)}
                                  className="rounded-lg border border-white/10 bg-[#090a0f] px-2 py-1 font-bold text-[10px] uppercase outline-none text-amber-500 focus:border-amber-500"
                                >
                                  {['New', 'Under Review', 'Quotation Sent', 'Negotiation', 'Approved', 'In Progress', 'Completed', 'Cancelled'].map(s => (
                                    <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => { setSelectedRecord(req); setRecordType('services'); }} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Inspect Record"><Eye className="h-4 w-4" /></button>
                                  {req.file_name && (
                                    <a href={`/uploads/${req.file_name}`} download={req.file_name} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Download Spec Document"><Download className="h-4 w-4" /></a>
                                  )}
                                  <button onClick={() => openEditModal('services', req)} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Edit Record"><Pencil className="h-4 w-4" /></button>
                                  <button onClick={() => handleDeleteRecord('services', req.id)} className="text-neutral-400 hover:text-red-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Delete Record"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {/* ========================================================================= */}
                          {/* ROWS: VENDORS ONBOARDING                                                  */}
                          {/* ========================================================================= */}
                          {activeTab === 'vendors' && applySearchAndFilters(vendors).map((ven) => (
                            <tr key={ven.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-bold text-amber-500">#{ven.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-white">{ven.business_name}</p>
                                <p className="text-[10px] text-neutral-400 font-semibold">{ven.email} | {ven.phone || 'N/A'}</p>
                              </td>
                              <td className="px-6 py-4 text-neutral-400">{ven.business_type || 'Retailer'}</td>
                              <td className="px-6 py-4 text-neutral-400">
                                <p className="font-bold text-white">Tax ID: {ven.tax_id || 'N/A'}</p>
                                <p className="text-[10px] text-neutral-500 font-semibold">{ven.license_file_name || 'No file'}</p>
                              </td>
                              <td className="px-6 py-4 text-neutral-400 font-bold">{new Date(ven.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={ven.status}
                                  onChange={(e) => handleUpdateStatus('vendors', ven.id, e.target.value)}
                                  className="rounded-lg border border-white/10 bg-[#090a0f] px-2 py-1 font-bold text-[10px] uppercase outline-none text-emerald-400 focus:border-amber-500"
                                >
                                  {['New', 'Approved', 'Suspended', 'Rejected'].map(s => (
                                    <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => { setSelectedRecord(ven); setRecordType('vendors'); }} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Inspect Record"><Eye className="h-4 w-4" /></button>
                                  {ven.license_file_name && (
                                    <a href={`/uploads/${ven.license_file_name}`} download={ven.license_file_name} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Download License"><Download className="h-4 w-4" /></a>
                                  )}
                                  <button onClick={() => openEditModal('vendors', ven)} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Edit Record"><Pencil className="h-4 w-4" /></button>
                                  <button onClick={() => handleDeleteRecord('vendors', ven.id)} className="text-neutral-400 hover:text-red-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Delete Record"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {/* ========================================================================= */}
                          {/* ROWS: AGENTS APPLICATIONS                                                 */}
                          {/* ========================================================================= */}
                          {activeTab === 'agents' && applySearchAndFilters(agents).map((age) => (
                            <tr key={age.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-bold text-amber-500">#{age.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-white">{age.full_name}</p>
                                <p className="text-[10px] text-neutral-400 font-semibold">{age.email} | {age.phone || 'N/A'}</p>
                              </td>
                              <td className="px-6 py-4 text-neutral-400 font-bold uppercase">{age.payout_method || 'Mobile Money'}</td>
                              <td className="px-6 py-4 text-neutral-400 truncate max-w-[150px]">{age.address || 'N/A'}</td>
                              <td className="px-6 py-4 text-neutral-400 font-bold">{new Date(age.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={age.status}
                                  onChange={(e) => handleUpdateStatus('agents', age.id, e.target.value)}
                                  className="rounded-lg border border-white/10 bg-[#090a0f] px-2 py-1 font-bold text-[10px] uppercase outline-none text-blue-400 focus:border-amber-500"
                                >
                                  {['New', 'Approved', 'Active', 'Suspended', 'Rejected'].map(s => (
                                    <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => { setSelectedRecord(age); setRecordType('agents'); }} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Inspect Record"><Eye className="h-4 w-4" /></button>
                                  {age.id_file_name && (
                                    <a href={`/uploads/${age.id_file_name}`} download={age.id_file_name} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Download ID Document"><Download className="h-4 w-4" /></a>
                                  )}
                                  {age.tin_file_name && (
                                    <a href={`/uploads/${age.tin_file_name}`} download={age.tin_file_name} className="text-neutral-400 hover:text-emerald-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Download TIN Certificate"><Download className="h-4 w-4" /></a>
                                  )}
                                  <button onClick={() => openEditModal('agents', age)} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Edit Record"><Pencil className="h-4 w-4" /></button>
                                  <button onClick={() => handleDeleteRecord('agents', age.id)} className="text-neutral-400 hover:text-red-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Delete Record"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {/* ========================================================================= */}
                          {/* ROWS: CAREERS APPLICATIONS                                                */}
                          {/* ========================================================================= */}
                          {activeTab === 'jobs' && applySearchAndFilters(jobs).map((job) => (
                            <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-bold text-amber-500">#{job.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-white">{job.name}</p>
                                <p className="text-[10px] text-neutral-400 font-semibold">{job.email}</p>
                              </td>
                              <td className="px-6 py-4 text-neutral-400 font-bold">{job.job_title}</td>
                              <td className="px-6 py-4 text-neutral-400 truncate max-w-[150px]">{job.resume_file_name || 'N/A'}</td>
                              <td className="px-6 py-4 text-neutral-400 font-bold">{new Date(job.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={job.status}
                                  onChange={(e) => handleUpdateStatus('jobs', job.id, e.target.value)}
                                  className="rounded-lg border border-white/10 bg-[#090a0f] px-2 py-1 font-bold text-[10px] uppercase outline-none text-purple-400 focus:border-amber-500"
                                >
                                  {['New', 'Screened', 'Interview', 'Offered', 'Rejected'].map(s => (
                                    <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => { setSelectedRecord(job); setRecordType('jobs'); }} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Inspect Record"><Eye className="h-4 w-4" /></button>
                                  {job.resume_file_name && (
                                    <a href={`/uploads/${job.resume_file_name}`} download={job.resume_file_name} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Download Resume"><Download className="h-4 w-4" /></a>
                                  )}
                                  <button onClick={() => openEditModal('jobs', job)} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Edit Record"><Pencil className="h-4 w-4" /></button>
                                  <button onClick={() => handleDeleteRecord('jobs', job.id)} className="text-neutral-400 hover:text-red-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Delete Record"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {/* ========================================================================= */}
                          {/* ROWS: CONTACT INQUIRIES                                                   */}
                          {/* ========================================================================= */}
                          {activeTab === 'contacts' && applySearchAndFilters(contacts).map((con) => (
                            <tr key={con.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-bold text-amber-500">#{con.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-white">{con.name}</p>
                                <p className="text-[10px] text-neutral-400 font-semibold">{con.email} | {con.phone || 'N/A'}</p>
                              </td>
                              <td className="px-6 py-4 text-neutral-400 font-bold">{con.subject || 'Inquiry'}</td>
                              <td className="px-6 py-4 text-neutral-400 truncate max-w-[200px]">{con.message}</td>
                              <td className="px-6 py-4 text-neutral-400 font-bold">{new Date(con.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={con.status}
                                  onChange={(e) => handleUpdateStatus('contacts', con.id, e.target.value)}
                                  className="rounded-lg border border-white/10 bg-[#090a0f] px-2 py-1 font-bold text-[10px] uppercase outline-none text-cyan-400 focus:border-amber-500"
                                >
                                  {['New', 'Replied', 'Closed'].map(s => (
                                    <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => { setSelectedRecord(con); setRecordType('contacts'); }} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Inspect Record"><Eye className="h-4 w-4" /></button>
                                  <button onClick={() => openEditModal('contacts', con)} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Edit Record"><Pencil className="h-4 w-4" /></button>
                                  <button onClick={() => handleDeleteRecord('contacts', con.id)} className="text-neutral-400 hover:text-red-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Delete Record"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {/* ========================================================================= */}
                          {/* ROWS: NEWSLETTER LIST                                                     */}
                          {/* ========================================================================= */}
                          {activeTab === 'newsletters' && applySearchAndFilters(subscribers).map((sub) => (
                            <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-bold text-amber-500">#{sub.id}</td>
                              <td className="px-6 py-4 font-bold text-white">{sub.email}</td>
                              <td className="px-6 py-4 text-neutral-400 font-bold">{new Date(sub.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={sub.status}
                                  onChange={(e) => handleUpdateStatus('newsletters', sub.id, e.target.value)}
                                  className="rounded-lg border border-white/10 bg-[#090a0f] px-2 py-1 font-bold text-[10px] uppercase outline-none text-rose-400 focus:border-amber-500"
                                >
                                  {['Subscribed', 'Unsubscribed'].map(s => (
                                    <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => openEditModal('newsletters', sub)} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Edit Subscriber"><Pencil className="h-4 w-4" /></button>
                                  <button onClick={() => handleDeleteRecord('newsletters', sub.id)} className="text-neutral-400 hover:text-red-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Delete Subscriber"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {/* ========================================================================= */}
                          {/* ROWS: JOB POSTINGS LIST                                                   */}
                          {/* ========================================================================= */}
                          {activeTab === 'postings' && applySearchAndFilters(postings).map((post) => (
                            <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-bold text-amber-500">#{post.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-white">{post.title}</p>
                                <p className="text-[9px] text-neutral-500 font-semibold">{post.job_key}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-white">{post.department}</p>
                                <p className="text-[10px] text-neutral-400">{post.type}</p>
                              </td>
                              <td className="px-6 py-4 font-bold text-neutral-400">{post.location}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={post.status}
                                  onChange={(e) => handleUpdateStatus('postings', post.id, e.target.value)}
                                  className="rounded-lg border border-white/10 bg-[#090a0f] px-2 py-1 font-bold text-[10px] uppercase outline-none text-emerald-400 focus:border-amber-500"
                                >
                                  {['Active', 'Draft', 'Closed'].map(s => (
                                    <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => openEditModal('postings', post)} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Edit Job Posting"><Pencil className="h-4 w-4" /></button>
                                  <button onClick={() => handleDeleteRecord('postings', post.id)} className="text-neutral-400 hover:text-red-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Delete Job Posting"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {/* ========================================================================= */}
                          {/* ROWS: SERVICES CATALOG                                                     */}
                          {/* ========================================================================= */}
                          {activeTab === 'catalog' && applySearchAndFilters(catalog).map((cat) => (
                            <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-bold text-amber-500">#{cat.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-white">{cat.title}</p>
                                <p className="text-[10px] text-neutral-400 max-w-[220px] truncate">{cat.description}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-white">{cat.icon}</p>
                                <p className="text-[9px] text-neutral-500 font-semibold">{cat.catalog_key}</p>
                              </td>
                              <td className="px-6 py-4 font-bold text-neutral-400">{cat.starting_price}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={cat.status}
                                  onChange={(e) => handleUpdateStatus('catalog', cat.id, e.target.value)}
                                  className="rounded-lg border border-white/10 bg-[#090a0f] px-2 py-1 font-bold text-[10px] uppercase outline-none text-emerald-400 focus:border-amber-500"
                                >
                                  {['Active', 'Draft', 'Closed'].map(s => (
                                    <option key={s} value={s} className="bg-[#090a0f] text-white">{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => openEditModal('catalog', cat)} className="text-neutral-400 hover:text-amber-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Edit Catalog Entry"><Pencil className="h-4 w-4" /></button>
                                  <button onClick={() => handleDeleteRecord('catalog', cat.id)} className="text-neutral-400 hover:text-red-500 p-1.5 hover:bg-white/5 rounded-lg transition duration-200" title="Delete Catalog Entry"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>

      {/* DETAIL MODAL VIEWER */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d12] p-6 shadow-2xl text-xs space-y-4 z-10"
            >
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-white transition duration-200"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Database className="h-4.5 w-4.5 text-amber-400 shrink-0" />
                <h3 className="font-heading text-xs font-black uppercase tracking-wider text-amber-500 leading-none">
                  {recordType} Record Inspection (ID: #{selectedRecord.id})
                </h3>
              </div>

              <div className="space-y-3 pt-2 max-h-[70vh] overflow-y-auto pr-1">
                {/* --- DETAILS RENDER FOR SERVICES --- */}
                {recordType === 'services' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Category</span><span className="col-span-2 font-bold text-white">{selectedRecord.category}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Service</span><span className="col-span-2 font-bold text-white">{selectedRecord.service}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Package</span><span className="col-span-2 font-bold text-white">{selectedRecord.package}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Client Name</span><span className="col-span-2 font-bold text-white">{selectedRecord.name}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Company</span><span className="col-span-2 font-bold text-white">{selectedRecord.company_name || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Email</span><span className="col-span-2 font-bold text-white">{selectedRecord.email}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Phone</span><span className="col-span-2 font-bold text-white">{selectedRecord.phone || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">WhatsApp</span><span className="col-span-2 font-bold text-white">{selectedRecord.whatsapp || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Region</span><span className="col-span-2 font-bold text-white">{selectedRecord.region || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Budget Range</span><span className="col-span-2 font-bold text-amber-500">{selectedRecord.budget_range}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Timeline</span><span className="col-span-2 font-bold text-white">{selectedRecord.preferred_timeline}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Contact Method</span><span className="col-span-2 font-bold text-white">{selectedRecord.contact_method}</span></div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Attached File</span>
                      <span className="col-span-2 font-bold text-white">
                        {selectedRecord.file_name ? (
                          <a href={`/uploads/${selectedRecord.file_name}`} download={selectedRecord.file_name} className="text-amber-500 hover:underline inline-flex items-center gap-1 font-bold">
                            <Download className="h-3.5 w-3.5" />
                            {selectedRecord.file_name}
                          </a>
                        ) : (
                          'None'
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/5"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px] block mb-1">Project Description</span><p className="p-3 bg-white/5 rounded-xl text-neutral-300 leading-relaxed font-semibold">{selectedRecord.description || 'No description'}</p></div>
                  </div>
                )}

                {/* --- DETAILS RENDER FOR VENDORS --- */}
                {recordType === 'vendors' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Business Name</span><span className="col-span-2 font-bold text-white">{selectedRecord.business_name}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Email</span><span className="col-span-2 font-bold text-white">{selectedRecord.email}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Phone</span><span className="col-span-2 font-bold text-white">{selectedRecord.phone || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Business Type</span><span className="col-span-2 font-bold text-white">{selectedRecord.business_type || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Inc. Number</span><span className="col-span-2 font-bold text-white">{selectedRecord.incorporation_number || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Tax ID / TIN</span><span className="col-span-2 font-bold text-white">{selectedRecord.tax_id || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Cert. of Inc.</span><span className="col-span-2 font-bold text-white">{selectedRecord.license_file_name ? <a href={`/uploads/${selectedRecord.license_file_name}`} download={selectedRecord.license_file_name} className="text-amber-500 hover:underline inline-flex items-center gap-1 font-bold"><Download className="h-3.5 w-3.5" />{selectedRecord.license_file_name}</a> : 'No document uploaded'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Cert. of TIN</span><span className="col-span-2 font-bold text-white">{selectedRecord.tin_file_name ? <a href={`/uploads/${selectedRecord.tin_file_name}`} download={selectedRecord.tin_file_name} className="text-amber-500 hover:underline inline-flex items-center gap-1 font-bold"><Download className="h-3.5 w-3.5" />{selectedRecord.tin_file_name}</a> : 'No document uploaded'}</span></div>
                    <div className="pt-2 border-t border-white/5"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px] block mb-1">Store Address</span><p className="p-3 bg-white/5 rounded-xl text-neutral-300 font-semibold">{selectedRecord.address || 'N/A'}</p></div>
                  </div>
                )}

                {/* --- DETAILS RENDER FOR AGENTS --- */}
                {recordType === 'agents' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Full Name</span><span className="col-span-2 font-bold text-white">{selectedRecord.full_name}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Email</span><span className="col-span-2 font-bold text-white">{selectedRecord.email}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Phone</span><span className="col-span-2 font-bold text-white">{selectedRecord.phone || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">National ID Doc</span><span className="col-span-2 font-bold text-white">{selectedRecord.id_file_name ? <a href={`/uploads/${selectedRecord.id_file_name}`} download={selectedRecord.id_file_name} className="text-amber-500 hover:underline inline-flex items-center gap-1 font-bold"><Download className="h-3.5 w-3.5" />{selectedRecord.id_file_name}</a> : 'No document uploaded'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">TIN Certificate</span><span className="col-span-2 font-bold text-white">{selectedRecord.tin_file_name ? <a href={`/uploads/${selectedRecord.tin_file_name}`} download={selectedRecord.tin_file_name} className="text-amber-500 hover:underline inline-flex items-center gap-1 font-bold"><Download className="h-3.5 w-3.5" />{selectedRecord.tin_file_name}</a> : 'No document uploaded'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Payout Method</span><span className="col-span-2 font-bold text-white uppercase">{selectedRecord.payout_method || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Payout Details</span><span className="col-span-2 font-bold text-white">{selectedRecord.payout_details || 'N/A'}</span></div>
                    <div className="pt-2 border-t border-white/5"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px] block mb-1">Residence Address</span><p className="p-3 bg-white/5 rounded-xl text-neutral-300 font-semibold">{selectedRecord.address || 'N/A'}</p></div>
                  </div>
                )}

                {/* --- DETAILS RENDER FOR JOBS --- */}
                {recordType === 'jobs' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Candidate Name</span><span className="col-span-2 font-bold text-white">{selectedRecord.name}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Email</span><span className="col-span-2 font-bold text-white">{selectedRecord.email}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Job Title</span><span className="col-span-2 font-bold text-white">{selectedRecord.job_title}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Resume File</span><span className="col-span-2 font-bold text-white">{selectedRecord.resume_file_name ? <a href={`/uploads/${selectedRecord.resume_file_name}`} download={selectedRecord.resume_file_name} className="text-amber-500 hover:underline inline-flex items-center gap-1 font-bold"><Download className="h-3.5 w-3.5" />{selectedRecord.resume_file_name}</a> : 'N/A'}</span></div>
                    <div className="pt-2 border-t border-white/5"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px] block mb-1">Cover Note</span><p className="p-3 bg-white/5 rounded-xl text-neutral-300 leading-relaxed font-semibold">{selectedRecord.cover_letter || 'No cover letter provided.'}</p></div>
                  </div>
                )}

                {/* --- DETAILS RENDER FOR CONTACTS --- */}
                {recordType === 'contacts' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Sender Name</span><span className="col-span-2 font-bold text-white">{selectedRecord.name}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Email</span><span className="col-span-2 font-bold text-white">{selectedRecord.email}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Phone</span><span className="col-span-2 font-bold text-white">{selectedRecord.phone || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Subject</span><span className="col-span-2 font-bold text-white">{selectedRecord.subject || 'Inquiry'}</span></div>
                    <div className="pt-2 border-t border-white/5"><span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px] block mb-1">Message Content</span><p className="p-3 bg-white/5 rounded-xl text-neutral-300 leading-relaxed font-semibold">{selectedRecord.message}</p></div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="rounded-xl bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition duration-300"
                >
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE & EDIT FORM MODAL */}
      <AnimatePresence>
        {crudModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCrudModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d12] p-6 shadow-2xl text-xs space-y-4 z-10"
            >
              <button
                onClick={() => setCrudModal(prev => ({ ...prev, isOpen: false }))}
                className="absolute right-4 top-4 text-neutral-400 hover:text-white transition duration-200"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Pencil className="h-4.5 w-4.5 text-amber-400 shrink-0" />
                <h3 className="font-heading text-xs font-black uppercase tracking-wider text-amber-500 leading-none">
                  {crudModal.mode === 'create' ? 'Create New' : 'Edit Existing'} {crudModal.type} record
                </h3>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                
                {/* --- RENDER FIELDS: SERVICES --- */}
                {crudModal.type === 'services' && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Client Name *</label>
                        <input type="text" required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Company Name</label>
                        <input type="text" value={formData.companyName || ''} onChange={e => setFormData({ ...formData, companyName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address *</label>
                        <input type="email" required value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Phone Number</label>
                        <input type="text" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">WhatsApp Number</label>
                        <input type="text" value={formData.whatsapp || ''} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Region / City</label>
                        <input type="text" value={formData.region || ''} onChange={e => setFormData({ ...formData, region: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Category *</label>
                        <select value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          {['Website Development', 'Mobile App Development', 'Web Application Development', 'E-Commerce Solutions', 'Payment Integration', 'Business Automation', 'Cloud & Hosting', 'Cybersecurity', 'IT Support', 'AI & Automation', 'Digital Marketing', 'Branding & Creative Services'].map(c => (
                            <option key={c} value={c} className="text-white bg-[#0c0d12]">{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Service Title *</label>
                        <input type="text" required value={formData.service || ''} onChange={e => setFormData({ ...formData, service: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Package Level *</label>
                        <select value={formData.package || ''} onChange={e => setFormData({ ...formData, package: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          {['Basic', 'Standard', 'Premium'].map(p => (
                            <option key={p} value={p} className="text-white bg-[#0c0d12]">{p}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Budget Range</label>
                        <select value={formData.budgetRange || ''} onChange={e => setFormData({ ...formData, budgetRange: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          {['$500 - $1,500', '$1,500 - $3,000', '$3,000 - $5,000', '$5,000+', 'Custom Budget'].map(b => (
                            <option key={b} value={b} className="text-white bg-[#0c0d12]">{b}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Timeline</label>
                        <select value={formData.preferredTimeline || ''} onChange={e => setFormData({ ...formData, preferredTimeline: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          {['1-2 Weeks', '3-4 Weeks', '1-2 Months', '3+ Months'].map(t => (
                            <option key={t} value={t} className="text-white bg-[#0c0d12]">{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Contact Method</label>
                        <select value={formData.contactMethod || ''} onChange={e => setFormData({ ...formData, contactMethod: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          {['Email', 'WhatsApp', 'Phone Call'].map(m => (
                            <option key={m} value={m} className="text-white bg-[#0c0d12]">{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Description</label>
                      <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Attached File Name</label>
                        <input type="text" value={formData.fileName || ''} onChange={e => setFormData({ ...formData, fileName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" placeholder="project_specs.pdf" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Request Status</label>
                        <select value={formData.status || 'New'} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          {['New', 'Under Review', 'Quotation Sent', 'Negotiation', 'Approved', 'In Progress', 'Completed', 'Cancelled'].map(s => (
                            <option key={s} value={s} className="text-white bg-[#0c0d12]">{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- RENDER FIELDS: VENDORS --- */}
                {crudModal.type === 'vendors' && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Business Name *</label>
                        <input type="text" required value={formData.businessName || ''} onChange={e => setFormData({ ...formData, businessName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Business Type</label>
                        <select value={formData.businessType || ''} onChange={e => setFormData({ ...formData, businessType: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          {['Retail', 'Wholesale', 'Services', 'Manufacturer', 'Tech Startup', 'Other'].map(t => (
                            <option key={t} value={t} className="text-white bg-[#0c0d12]">{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Contact Email *</label>
                        <input type="email" required value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Contact Phone</label>
                        <input type="text" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Incorporation Number *</label>
                        <input type="text" required minLength={8} maxLength={15} value={formData.incorporationNumber || ''} onChange={e => setFormData({ ...formData, incorporationNumber: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">License File Name (Cert. of Inc.)</label>
                        <input type="text" value={formData.licenseFileName || ''} onChange={e => setFormData({ ...formData, licenseFileName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" placeholder="certificate_of_incorporation.pdf" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tax ID / TIN *</label>
                        <input type="text" required minLength={8} maxLength={15} value={formData.taxId || ''} onChange={e => setFormData({ ...formData, taxId: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">TIN Certificate File Name</label>
                        <input type="text" value={formData.tinFileName || ''} onChange={e => setFormData({ ...formData, tinFileName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" placeholder="certificate_of_tin.pdf" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Store Address</label>
                      <textarea rows={2.5} value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Onboarding Status</label>
                      <select value={formData.status || 'New'} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                        {['New', 'Approved', 'Suspended', 'Rejected'].map(s => (
                          <option key={s} value={s} className="text-white bg-[#0c0d12]">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* --- RENDER FIELDS: AGENTS --- */}
                {crudModal.type === 'agents' && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Agent Full Name *</label>
                        <input type="text" required value={formData.fullName || ''} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Payout Method</label>
                        <select value={formData.payoutMethod || ''} onChange={e => setFormData({ ...formData, payoutMethod: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          {['Mobile Money', 'Bank Transfer', 'PayPal', 'Cash pickup'].map(m => (
                            <option key={m} value={m} className="text-white bg-[#0c0d12]">{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address *</label>
                        <input type="email" required value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Phone Number</label>
                        <input type="text" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">ID Document Name</label>
                        <input type="text" value={formData.idFileName || ''} onChange={e => setFormData({ ...formData, idFileName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" placeholder="national_id_scan.jpg" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">TIN Certificate Name</label>
                        <input type="text" value={formData.tinFileName || ''} onChange={e => setFormData({ ...formData, tinFileName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" placeholder="tin_cert_doc.pdf" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Status</label>
                        <select value={formData.status || 'New'} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          {['New', 'Approved', 'Active', 'Suspended', 'Rejected'].map(s => (
                            <option key={s} value={s} className="text-white bg-[#0c0d12]">{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Payout Details / Accounts</label>
                      <input type="text" value={formData.payoutDetails || ''} onChange={e => setFormData({ ...formData, payoutDetails: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" placeholder="Mobile money number / Bank account number" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Residence Address</label>
                      <textarea rows={2.5} value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                    </div>
                  </div>
                )}

                {/* --- RENDER FIELDS: JOBS --- */}
                {crudModal.type === 'jobs' && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Candidate Name *</label>
                        <input type="text" required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address *</label>
                        <input type="email" required value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Job Code/ID *</label>
                        <input type="text" required value={formData.jobId || ''} onChange={e => setFormData({ ...formData, jobId: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Job Title *</label>
                        <input type="text" required value={formData.jobTitle || ''} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Resume File Name</label>
                        <input type="text" value={formData.resumeFileName || ''} onChange={e => setFormData({ ...formData, resumeFileName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" placeholder="cv_candidate.pdf" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Status</label>
                        <select value={formData.status || 'New'} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          {['New', 'Screened', 'Interview', 'Offered', 'Rejected'].map(s => (
                            <option key={s} value={s} className="text-white bg-[#0c0d12]">{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Cover Letter Note</label>
                      <textarea rows={3} value={formData.coverLetter || ''} onChange={e => setFormData({ ...formData, coverLetter: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                    </div>
                  </div>
                )}

                {/* --- RENDER FIELDS: CONTACTS --- */}
                {crudModal.type === 'contacts' && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Sender Name *</label>
                        <input type="text" required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address *</label>
                        <input type="email" required value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Phone Number</label>
                        <input type="text" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Subject *</label>
                        <input type="text" required value={formData.subject || ''} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Status</label>
                      <select value={formData.status || 'New'} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                        {['New', 'Replied', 'Closed'].map(s => (
                          <option key={s} value={s} className="text-white bg-[#0c0d12]">{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Message Content *</label>
                      <textarea rows={3.5} required value={formData.message || ''} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                    </div>
                  </div>
                )}

                {/* --- RENDER FIELDS: NEWSLETTERS --- */}
                {crudModal.type === 'newsletters' && (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address *</label>
                      <input type="email" required value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Subscription Status</label>
                      <select value={formData.status || 'Subscribed'} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                        {['Subscribed', 'Unsubscribed'].map(s => (
                          <option key={s} value={s} className="text-white bg-[#0c0d12]">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* --- RENDER FIELDS: JOB POSTINGS --- */}
                {crudModal.type === 'postings' && (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Job Title *</label>
                      <input type="text" required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Department *</label>
                        <select required value={formData.department || ''} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          <option value="">Select Department</option>
                          {['Engineering', 'Product', 'Marketing', 'Operations', 'Finance'].map(d => (
                            <option key={d} value={d} className="text-white bg-[#0c0d12]">{d}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Type *</label>
                        <input type="text" required value={formData.type || 'Full-time / Hybrid'} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Location *</label>
                      <input type="text" required value={formData.location || 'Dar es Salaam, Tanzania'} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Description *</label>
                      <textarea required rows={5} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none resize-none" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Status</label>
                      <select value={formData.status || 'Active'} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                        {['Active', 'Draft', 'Closed'].map(s => (
                          <option key={s} value={s} className="text-white bg-[#0c0d12]">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* --- RENDER FIELDS: SERVICES CATALOG --- */}
                {crudModal.type === 'catalog' && (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Category Title *</label>
                      <input type="text" required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Catalog Key / Slug *</label>
                        <input type="text" required placeholder="e.g. web-dev" value={formData.catalog_key || ''} onChange={e => setFormData({ ...formData, catalog_key: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Icon Name *</label>
                        <select required value={formData.icon || 'Globe'} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                          {['Globe', 'Smartphone', 'Laptop', 'ShoppingBag', 'CreditCard', 'Cpu', 'Cloud', 'Shield', 'Activity', 'BrainCircuit', 'TrendingUp', 'Paintbrush'].map(i => (
                            <option key={i} value={i} className="text-white bg-[#0c0d12]">{i}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Starting Price *</label>
                      <input type="text" required placeholder="e.g. TZS 500,000" value={formData.starting_price || ''} onChange={e => setFormData({ ...formData, starting_price: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Description *</label>
                      <textarea required rows={3} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/20 focus:border-amber-500 focus:outline-none resize-none" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Services List (JSON format) *</label>
                        <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider font-sans">Array of Services & Timelines</span>
                      </div>
                      <textarea required rows={8} value={formData.services || ''} onChange={e => setFormData({ ...formData, services: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-emerald-400 placeholder-white/20 focus:border-amber-500 focus:outline-none" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Status</label>
                      <select value={formData.status || 'Active'} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3 py-2 text-white focus:border-amber-500">
                        {['Active', 'Draft', 'Closed'].map(s => (
                          <option key={s} value={s} className="text-white bg-[#0c0d12]">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/5 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setCrudModal(prev => ({ ...prev, isOpen: false }))}
                    className="rounded-xl bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black px-5 py-2.5 text-xs font-black transition duration-300 shadow shadow-amber-500/5 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {modalLoading ? 'Saving...' : 'Save Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST ALERTS SCREEN FLOATER */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl text-xs max-w-sm ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}
          >
            <CheckCircle className="h-5 w-5 shrink-0" />
            <p className="font-semibold leading-normal">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
