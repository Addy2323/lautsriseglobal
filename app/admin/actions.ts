'use server'

import { query, initDb, saveUploadedFile } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// --- DB SCHEMAS INTERFACES ---
export interface VendorSubmission {
  id: number
  business_name: string
  email: string
  phone: string | null
  business_type: string | null
  address: string | null
  license_file_name: string | null
  tax_id: string | null
  incorporation_number: string | null
  tin_file_name: string | null
  status: string
  created_at: Date
}

export interface AgentSubmission {
  id: number
  full_name: string
  email: string
  phone: string | null
  address: string | null
  id_file_name: string | null
  tin_file_name: string | null
  payout_method: string | null
  payout_details: string | null
  status: string
  created_at: Date
}

export interface ContactInquiry {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  created_at: Date
}

export interface JobApplication {
  id: number
  job_id: string
  job_title: string
  name: string
  email: string
  resume_file_name: string | null
  cover_letter: string | null
  status: string
  created_at: Date
}

export interface NewsletterSubscriber {
  id: number
  email: string
  status: string
  created_at: Date
}

// --- SUBMISSION ACTIONS ---

export async function submitVendorSubmission(data: {
  businessName: string
  email: string
  phone: string
  businessType: string
  address: string
  licenseFileName?: string
  licenseFileData?: string
  taxId?: string
  incorporationNumber?: string
  tinFileName?: string
  tinFileData?: string
}) {
  await initDb()
  if (data.licenseFileName && data.licenseFileData) {
    await saveUploadedFile(data.licenseFileName, data.licenseFileData)
  }
  if (data.tinFileName && data.tinFileData) {
    await saveUploadedFile(data.tinFileName, data.tinFileData)
  }
  const sql = `
    INSERT INTO vendor_submissions (business_name, email, phone, business_type, address, license_file_name, tax_id, incorporation_number, tin_file_name)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
  `
  try {
    const res = await query(sql, [
      data.businessName,
      data.email,
      data.phone || null,
      data.businessType || null,
      data.address || null,
      data.licenseFileName || null,
      data.taxId || null,
      data.incorporationNumber || null,
      data.tinFileName || null,
    ])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as VendorSubmission }
  } catch (error) {
    console.error('Failed to submit vendor onboarding:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function submitAgentSubmission(data: {
  fullName: string
  email: string
  phone: string
  address: string
  idFileName?: string
  idFileData?: string
  tinFileName?: string
  tinFileData?: string
  payoutMethod: string
  payoutDetails: string
}) {
  await initDb()
  if (data.idFileName && data.idFileData) {
    await saveUploadedFile(data.idFileName, data.idFileData)
  }
  if (data.tinFileName && data.tinFileData) {
    await saveUploadedFile(data.tinFileName, data.tinFileData)
  }
  const sql = `
    INSERT INTO agent_submissions (full_name, email, phone, address, id_file_name, tin_file_name, payout_method, payout_details)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
  `
  try {
    const res = await query(sql, [
      data.fullName,
      data.email,
      data.phone || null,
      data.address || null,
      data.idFileName || null,
      data.tinFileName || null,
      data.payoutMethod || null,
      data.payoutDetails || null,
    ])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as AgentSubmission }
  } catch (error) {
    console.error('Failed to submit agent onboarding:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function submitContactInquiry(data: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  await initDb()
  const sql = `
    INSERT INTO contact_inquiries (name, email, phone, subject, message)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `
  try {
    const res = await query(sql, [
      data.name,
      data.email,
      data.phone || null,
      data.subject || null,
      data.message,
    ])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as ContactInquiry }
  } catch (error) {
    console.error('Failed to submit contact inquiry:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function submitJobApplication(data: {
  jobId: string
  jobTitle: string
  name: string
  email: string
  resumeFileName?: string
  resumeFileData?: string
  coverLetter?: string
}) {
  await initDb()
  if (data.resumeFileName && data.resumeFileData) {
    await saveUploadedFile(data.resumeFileName, data.resumeFileData)
  }
  const sql = `
    INSERT INTO job_applications (job_id, job_title, name, email, resume_file_name, cover_letter)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `
  try {
    const res = await query(sql, [
      data.jobId,
      data.jobTitle,
      data.name,
      data.email,
      data.resumeFileName || null,
      data.coverLetter || null,
    ])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as JobApplication }
  } catch (error) {
    console.error('Failed to submit job application:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function submitNewsletterSubscriber(email: string) {
  await initDb()
  const sql = `
    INSERT INTO newsletter_subscribers (email)
    VALUES ($1)
    ON CONFLICT (email) DO UPDATE SET status = 'Subscribed'
    RETURNING *;
  `
  try {
    const res = await query(sql, [email])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as NewsletterSubscriber }
  } catch (error) {
    console.error('Failed to subscribe to newsletter:', error)
    return { success: false, error: (error as Error).message }
  }
}

// --- FETCH ACTIONS ---

export async function getVendorSubmissions() {
  await initDb()
  try {
    const res = await query('SELECT * FROM vendor_submissions ORDER BY created_at DESC')
    return { success: true, data: res.rows as VendorSubmission[] }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function getAgentSubmissions() {
  await initDb()
  try {
    const res = await query('SELECT * FROM agent_submissions ORDER BY created_at DESC')
    return { success: true, data: res.rows as AgentSubmission[] }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function getContactInquiries() {
  await initDb()
  try {
    const res = await query('SELECT * FROM contact_inquiries ORDER BY created_at DESC')
    return { success: true, data: res.rows as ContactInquiry[] }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function getJobApplications() {
  await initDb()
  try {
    const res = await query('SELECT * FROM job_applications ORDER BY created_at DESC')
    return { success: true, data: res.rows as JobApplication[] }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function getNewsletterSubscribers() {
  await initDb()
  try {
    const res = await query('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC')
    return { success: true, data: res.rows as NewsletterSubscriber[] }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// --- UPDATE ACTIONS ---

export async function updateVendorStatus(id: number, status: string) {
  await initDb()
  try {
    await query('UPDATE vendor_submissions SET status = $1 WHERE id = $2', [status, id])
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateAgentStatus(id: number, status: string) {
  await initDb()
  try {
    await query('UPDATE agent_submissions SET status = $1 WHERE id = $2', [status, id])
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateContactStatus(id: number, status: string) {
  await initDb()
  try {
    await query('UPDATE contact_inquiries SET status = $1 WHERE id = $2', [status, id])
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateJobStatus(id: number, status: string) {
  await initDb()
  try {
    await query('UPDATE job_applications SET status = $1 WHERE id = $2', [status, id])
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateSubscriberStatus(id: number, status: string) {
  await initDb()
  try {
    await query('UPDATE newsletter_subscribers SET status = $1 WHERE id = $2', [status, id])
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// --- DELETE ACTIONS ---

export async function deleteVendorSubmission(id: number) {
  await initDb()
  try {
    await query('DELETE FROM vendor_submissions WHERE id = $1', [id])
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteAgentSubmission(id: number) {
  await initDb()
  try {
    await query('DELETE FROM agent_submissions WHERE id = $1', [id])
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteContactInquiry(id: number) {
  await initDb()
  try {
    await query('DELETE FROM contact_inquiries WHERE id = $1', [id])
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteJobApplication(id: number) {
  await initDb()
  try {
    await query('DELETE FROM job_applications WHERE id = $1', [id])
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteNewsletterSubscriber(id: number) {
  await initDb()
  try {
    await query('DELETE FROM newsletter_subscribers WHERE id = $1', [id])
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateVendorSubmission(id: number, data: {
  businessName: string
  email: string
  phone: string
  businessType: string
  address: string
  licenseFileName?: string
  taxId?: string
  incorporationNumber?: string
  tinFileName?: string
  status: string
}) {
  await initDb()
  const sql = `
    UPDATE vendor_submissions
    SET business_name = $1, email = $2, phone = $3, business_type = $4, address = $5, license_file_name = $6, tax_id = $7, incorporation_number = $8, tin_file_name = $9, status = $10
    WHERE id = $11
    RETURNING *;
  `
  try {
    const res = await query(sql, [
      data.businessName,
      data.email,
      data.phone || null,
      data.businessType || null,
      data.address || null,
      data.licenseFileName || null,
      data.taxId || null,
      data.incorporationNumber || null,
      data.tinFileName || null,
      data.status,
      id
    ])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as VendorSubmission }
  } catch (error) {
    console.error('Failed to update vendor onboarding:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateAgentSubmission(id: number, data: {
  fullName: string
  email: string
  phone: string
  address: string
  idFileName?: string
  tinFileName?: string
  payoutMethod: string
  payoutDetails: string
  status: string
}) {
  await initDb()
  const sql = `
    UPDATE agent_submissions
    SET full_name = $1, email = $2, phone = $3, address = $4, id_file_name = $5, tin_file_name = $6, payout_method = $7, payout_details = $8, status = $9
    WHERE id = $10
    RETURNING *;
  `
  try {
    const res = await query(sql, [
      data.fullName,
      data.email,
      data.phone || null,
      data.address || null,
      data.idFileName || null,
      data.tinFileName || null,
      data.payoutMethod || null,
      data.payoutDetails || null,
      data.status,
      id
    ])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as AgentSubmission }
  } catch (error) {
    console.error('Failed to update agent onboarding:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateContactInquiry(id: number, data: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
}) {
  await initDb()
  const sql = `
    UPDATE contact_inquiries
    SET name = $1, email = $2, phone = $3, subject = $4, message = $5, status = $6
    WHERE id = $7
    RETURNING *;
  `
  try {
    const res = await query(sql, [
      data.name,
      data.email,
      data.phone || null,
      data.subject || null,
      data.message,
      data.status,
      id
    ])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as ContactInquiry }
  } catch (error) {
    console.error('Failed to update contact inquiry:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateJobApplication(id: number, data: {
  jobId: string
  jobTitle: string
  name: string
  email: string
  resumeFileName?: string
  coverLetter?: string
  status: string
}) {
  await initDb()
  const sql = `
    UPDATE job_applications
    SET job_id = $1, job_title = $2, name = $3, email = $4, resume_file_name = $5, cover_letter = $6, status = $7
    WHERE id = $8
    RETURNING *;
  `
  try {
    const res = await query(sql, [
      data.jobId,
      data.jobTitle,
      data.name,
      data.email,
      data.resumeFileName || null,
      data.coverLetter || null,
      data.status,
      id
    ])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as JobApplication }
  } catch (error) {
    console.error('Failed to update job application:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateNewsletterSubscriber(id: number, email: string, status: string) {
  await initDb()
  const sql = `
    UPDATE newsletter_subscribers
    SET email = $1, status = $2
    WHERE id = $3
    RETURNING *;
  `
  try {
    const res = await query(sql, [email, status, id])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as NewsletterSubscriber }
  } catch (error) {
    console.error('Failed to update newsletter subscriber:', error)
    return { success: false, error: (error as Error).message }
  }
}

export interface JobPosting {
  id: number
  job_key: string
  title: string
  department: string
  location: string
  type: string
  description: string
  status: string
  created_at: Date
}

export async function getJobPostings() {
  await initDb()
  try {
    const res = await query('SELECT * FROM job_postings ORDER BY created_at DESC')
    return { success: true, data: res.rows as JobPosting[] }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function submitJobPosting(data: {
  title: string
  department: string
  location: string
  type: string
  description: string
  status?: string
}) {
  await initDb()
  const jobKey = 'job-' + Math.random().toString(36).substring(2, 11)
  const sql = `
    INSERT INTO job_postings (job_key, title, department, location, type, description, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `
  try {
    const res = await query(sql, [
      jobKey,
      data.title,
      data.department,
      data.location,
      data.type,
      data.description,
      data.status || 'Active'
    ])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as JobPosting }
  } catch (error) {
    console.error('Failed to submit job posting:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateJobPosting(id: number, data: {
  title: string
  department: string
  location: string
  type: string
  description: string
  status: string
}) {
  await initDb()
  const sql = `
    UPDATE job_postings
    SET title = $1, department = $2, location = $3, type = $4, description = $5, status = $6
    WHERE id = $7
    RETURNING *;
  `
  try {
    const res = await query(sql, [
      data.title,
      data.department,
      data.location,
      data.type,
      data.description,
      data.status,
      id
    ])
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as JobPosting }
  } catch (error) {
    console.error('Failed to update job posting:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteJobPosting(id: number) {
  await initDb()
  try {
    await query('DELETE FROM job_postings WHERE id = $1', [id])
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
