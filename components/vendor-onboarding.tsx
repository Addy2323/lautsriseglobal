'use client'

import { Store, TrendingUp, Truck, Wallet } from 'lucide-react'
import { OnboardingFlow, type OnboardingConfig } from '@/components/onboarding-flow'

const vendorConfig: OnboardingConfig = {
  accentLabel: 'Vendor Onboarding',
  benefits: [
    {
      icon: Store,
      title: 'Reach more customers',
      text: 'List your products to thousands of verified buyers across multiple categories and regions.',
    },
    {
      icon: Truck,
      title: 'Integrated logistics',
      text: 'Source, ship and deliver locally and internationally with LotusRise Logistics.',
    },
    {
      icon: TrendingUp,
      title: 'Grow with data',
      text: 'Powerful dashboards and tools to manage orders, inventory and sales efficiently.',
    },
    {
      icon: Wallet,
      title: 'Fast, secure payouts',
      text: 'Get paid reliably with transparent fees and flexible payout options.',
    },
  ],
  steps: [
    {
      title: 'Business Details',
      description: 'Tell us about the business you want to list on LotusRise.',
      fields: [
        { name: 'businessName', label: 'Business Name', required: true, placeholder: 'e.g. Lotus Electronics Ltd' },
        {
          name: 'category',
          label: 'Primary Category',
          type: 'select',
          required: true,
          options: ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Groceries', 'Other'],
        },
        {
          name: 'country',
          label: 'Country',
          type: 'select',
          required: true,
          options: ['Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Other'],
        },
        { name: 'city', label: 'City', placeholder: 'e.g. Dar es Salaam' },
        {
          name: 'description',
          label: 'Business Description',
          type: 'textarea',
          required: true,
          placeholder: 'Describe what your business sells and what makes it stand out.',
          maxLength: 500,
        },
      ],
    },
    {
      title: 'Contact Person',
      description: 'Who should we reach out to about this application?',
      fields: [
        { name: 'fullName', label: 'Full Name', required: true, placeholder: 'Jane Doe' },
        { name: 'role', label: 'Role / Position', placeholder: 'e.g. Owner, Manager' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'you@business.com' },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '+255 700 000 000' },
      ],
    },
    {
      title: 'Verification',
      description: 'Provide details so we can verify and approve your store.',
      fields: [
        { name: 'regNumber', label: 'Business Registration No.', required: true, placeholder: 'e.g. 1234567' },
        { name: 'taxId', label: 'Tax Identification (TIN)', placeholder: 'Optional' },
        {
          name: 'monthlyVolume',
          label: 'Expected Monthly Orders',
          type: 'select',
          options: ['Under 50', '50 - 250', '250 - 1,000', '1,000+'],
        },
        {
          name: 'website',
          label: 'Website or Social Page',
          type: 'url',
          placeholder: 'https://yourbusiness.com (optional)',
        },
        {
          name: 'businessLicense',
          label: 'Business License / Registration Document',
          type: 'file',
          required: true,
          accept: '.pdf,.jpg,.jpeg,.png',
        },
        {
          name: 'agreeTerms',
          label: 'Terms & Conditions',
          type: 'checkbox',
          required: true,
          checkboxLabel: 'I confirm that all information provided is accurate and I agree to the LotusRise Vendor Terms of Service and Privacy Policy.',
        },
      ],
    },
  ],
  successTitle: 'Application received!',
  successText:
    'Thanks for applying to become a LotusRise vendor. Our team will review your details and reach out within 2 business days with next steps.',
}

import { submitVendorSubmission } from '@/app/admin/actions'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export function VendorOnboarding() {
  const handleSubmit = async (values: Record<string, string>, fileValues?: Record<string, File[]>) => {
    const file = fileValues?.['businessLicense']?.[0]
    const base64 = file ? await fileToBase64(file) : undefined

    const payload = {
      businessName: values.businessName,
      email: values.email,
      phone: values.phone,
      businessType: values.category,
      address: values.city ? `${values.city}, ${values.country}` : values.country,
      licenseFileName: file ? file.name : undefined,
      licenseFileData: base64,
      taxId: values.taxId || undefined,
    }
    const res = await submitVendorSubmission(payload)
    if (!res.success) throw new Error(res.error)
    return res
  }

  return <OnboardingFlow config={vendorConfig} onSubmit={handleSubmit} />
}
