'use client'

import { Award, HandCoins, MapPin, Users } from 'lucide-react'
import { OnboardingFlow, type OnboardingConfig } from '@/components/onboarding-flow'

const agentConfig: OnboardingConfig = {
  accentLabel: 'Agent Onboarding',
  benefits: [
    {
      icon: HandCoins,
      title: 'Earn commissions',
      text: 'Get paid for every customer and vendor you onboard and serve in your area.',
    },
    {
      icon: Users,
      title: 'Serve your community',
      text: 'Become the trusted local face of LotusRise for shoppers and businesses near you.',
    },
    {
      icon: Award,
      title: 'Training & support',
      text: 'Access onboarding training, marketing materials and dedicated agent support.',
    },
    {
      icon: MapPin,
      title: 'Flexible & local',
      text: 'Work in regions you know best, on a schedule that fits your lifestyle.',
    },
  ],
  steps: [
    {
      title: 'Personal Information',
      description: 'Let us get to know you before you join the agent network.',
      fields: [
        { name: 'fullName', label: 'Full Name', required: true, placeholder: 'Jane Doe' },
        { name: 'idNumber', label: 'National ID Number', required: true, placeholder: 'e.g. 19900101-XXXXX-XXXX' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'you@email.com' },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '+255 700 000 000' },
        {
          name: 'idDocument',
          label: 'National ID Upload',
          type: 'file',
          required: true,
          accept: '.pdf,.jpg,.jpeg,.png',
        },
        {
          name: 'tinCertificate',
          label: 'TIN Certificate',
          type: 'file',
          required: false,
          accept: '.pdf,.jpg,.jpeg,.png',
        },
      ],
    },
    {
      title: 'Coverage & Experience',
      description: 'Tell us where and how you would like to work.',
      fields: [
        {
          name: 'region',
          label: 'Region You Want to Serve',
          type: 'select',
          required: true,
          options: ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya', 'Other'],
        },
        {
          name: 'experience',
          label: 'Sales / Agent Experience',
          type: 'select',
          options: ['No experience', 'Less than 1 year', '1 - 3 years', '3+ years'],
        },
        {
          name: 'languages',
          label: 'Languages Spoken',
          placeholder: 'e.g. Swahili, English, French',
        },
        {
          name: 'availability',
          label: 'Availability',
          type: 'select',
          options: ['Part-time', 'Full-time', 'Weekends only'],
        },
        {
          name: 'motivation',
          label: 'Why do you want to become an agent?',
          type: 'textarea',
          required: true,
          placeholder: 'Tell us a little about your motivation and community network.',
          maxLength: 500,
        },
      ],
    },
    {
      title: 'Payout Details',
      description: 'Where should we send your commissions?',
      fields: [
        {
          name: 'payoutMethod',
          label: 'Preferred Payout Method',
          type: 'select',
          required: true,
          options: ['Mobile Money', 'Bank Transfer'],
        },
        { name: 'payoutAccount', label: 'Account / Mobile Number', required: true, placeholder: '+255 700 000 000 or bank account no.' },
        { name: 'accountName', label: 'Account Holder Name', required: true, placeholder: 'As it appears on the account' },
      ],
    },
    {
      title: 'Consent & Declaration',
      description: 'Please review and accept the agent terms and conditions.',
      fields: [
        {
          name: 'consentHeading',
          label: 'Consent',
          type: 'info',
          infoHtml: `<h3 class="font-heading text-base font-bold text-ink border-b border-border pb-2">AGENT CONSENT AND ACCEPTANCE</h3><p class="text-xs text-muted-foreground mt-2">Please read the Terms and Conditions carefully before proceeding.</p>`
        },
        {
          name: 'consentTerms',
          label: 'LotusRise Agent Terms and Conditions Agreement',
          type: 'checkbox',
          required: true,
          checkboxLabel: 'I hereby confirm that I have read, understood, and agree to be bound by the LotusRise Agent Terms and Conditions, including all policies, guidelines, fees, responsibilities, and obligations applicable to Agents using the LotusRise Platform.'
        },
        {
          name: 'consentIndependent',
          label: 'Independent Service Provider Acknowledgment',
          type: 'checkbox',
          required: true,
          checkboxLabel: 'I acknowledge that I am an independent service provider and not an employee, partner, or representative of LotusRise Company Limited.'
        },
        {
          name: 'consentTechnology',
          label: 'Technology Platform Operation Acknowledgment',
          type: 'checkbox',
          required: true,
          checkboxLabel: 'I understand that LotusRise operates solely as a technology platform and does not hold customer funds, guarantee customer payments, or assume responsibility for transactions conducted directly between Customers and Agents.'
        },
        {
          name: 'consentLaws',
          label: 'Compliance with Applicable Laws Agreement',
          type: 'checkbox',
          required: true,
          checkboxLabel: 'I agree to comply with all applicable laws, regulations, and LotusRise platform requirements while providing services through the platform.'
        },
        {
          name: 'consentPrivacy',
          label: 'Collection & Storage Consent',
          type: 'checkbox',
          required: true,
          checkboxLabel: 'I consent to the collection, processing, storage, and use of my information for purposes related to platform operations, verification, compliance, and service delivery.'
        },
        {
          name: 'consentCompliance',
          label: 'Consequences of Non-Compliance Acknowledgment',
          type: 'checkbox',
          required: true,
          checkboxLabel: 'I understand that failure to comply with these Terms and Conditions may result in suspension, restriction, or termination of my account.'
        },
        {
          name: 'declarationHeading',
          label: 'Declaration info',
          type: 'info',
          infoHtml: `<div class="border-t border-border pt-6 mt-4"><h3 class="font-heading text-base font-bold text-ink border-b border-border pb-2">DECLARATION</h3><p class="text-xs text-muted-foreground mt-2">By selecting the acceptance checkbox and/or clicking the "Register", "Subscribe", "Accept", or "Continue" button on the LotusRise Platform, I acknowledge that I have read, understood, and voluntarily agreed to these Terms and Conditions.</p></div>`
        },
        {
          name: 'declarantName',
          label: 'Agent Full Name',
          required: true,
          full: true,
          placeholder: 'Type your full legal name'
        },
        {
          name: 'declarantId',
          label: 'National ID / Passport No.',
          required: true,
          placeholder: 'e.g. 19900101-XXXXX-XXXX'
        },
        {
          name: 'declarantPhone',
          label: 'Phone Number',
          required: true,
          type: 'tel',
          placeholder: '+255 700 000 000'
        },
        {
          name: 'declarantEmail',
          label: 'Email Address',
          required: true,
          type: 'email',
          placeholder: 'you@email.com'
        },
        {
          name: 'declarantSignature',
          label: 'Signature (if applicable)',
          placeholder: 'Type full name as signature'
        },
        {
          name: 'declarantDate',
          label: 'Date',
          required: true,
          defaultValue: new Date().toISOString().split('T')[0],
          placeholder: 'YYYY-MM-DD'
        },
        {
          name: 'finalConsentAccept',
          label: 'I HEREBY ACCEPT THE LOTUSRISE AGENT TERMS AND CONDITIONS',
          type: 'checkbox',
          required: true,
          checkboxLabel: 'I HEREBY ACCEPT THE LOTUSRISE AGENT TERMS AND CONDITIONS'
        }
      ]
    },
  ],
  successTitle: 'Welcome aboard!',
  successText:
    'Thanks for applying to the LotusRise agent network. We will verify your details and contact you within 2 business days to begin onboarding and training.',
}

import { submitAgentSubmission } from '@/app/admin/actions'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export function AgentOnboarding() {
  const handleSubmit = async (values: Record<string, string>, fileValues?: Record<string, File[]>) => {
    const fileId = fileValues?.['idDocument']?.[0]
    const fileTin = fileValues?.['tinCertificate']?.[0]
    const base64Id = fileId ? await fileToBase64(fileId) : undefined
    const base64Tin = fileTin ? await fileToBase64(fileTin) : undefined

    const payload = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      address: values.region,
      idFileName: fileId ? fileId.name : undefined,
      idFileData: base64Id,
      tinFileName: fileTin ? fileTin.name : undefined,
      tinFileData: base64Tin,
      payoutMethod: values.payoutMethod,
      payoutDetails: `Account: ${values.payoutAccount} | Name: ${values.accountName} | Consent Declarant: ${values.declarantName} (ID: ${values.declarantId}, Phone: ${values.declarantPhone}, Email: ${values.declarantEmail}, Sig: ${values.declarantSignature || 'N/A'}, Date: ${values.declarantDate})`,
    }
    const res = await submitAgentSubmission(payload)
    if (!res.success) throw new Error(res.error)
    return res
  }

  return <OnboardingFlow config={agentConfig} onSubmit={handleSubmit} />
}
