'use server'

import { query, initDb, saveUploadedFile } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export interface ServiceRequest {
  id: number
  name: string
  company_name: string | null
  phone: string | null
  whatsapp: string | null
  email: string
  region: string | null
  category: string
  service: string
  package: string
  budget_range: string | null
  preferred_timeline: string | null
  description: string | null
  file_name: string | null
  contact_method: string | null
  status: string
  created_at: Date
}

export async function submitServiceRequest(formData: {
  name: string
  companyName: string
  phone: string
  whatsapp: string
  email: string
  region: string
  category: string
  service: string
  package: string
  budgetRange: string
  preferredTimeline: string
  description: string
  fileName?: string
  fileData?: string
  contactMethod: string
}) {
  await initDb()
  if (formData.fileName && formData.fileData) {
    await saveUploadedFile(formData.fileName, formData.fileData)
  }

  const insertQuery = `
    INSERT INTO service_requests (
      name, company_name, phone, whatsapp, email, region,
      category, service, package, budget_range, preferred_timeline,
      description, file_name, contact_method
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `

  const values = [
    formData.name,
    formData.companyName || null,
    formData.phone || null,
    formData.whatsapp || null,
    formData.email,
    formData.region || null,
    formData.category,
    formData.service,
    formData.package,
    formData.budgetRange || null,
    formData.preferredTimeline || null,
    formData.description || null,
    formData.fileName || null,
    formData.contactMethod || null,
  ]

  try {
    const res = await query(insertQuery, values)
    revalidatePath('/business-solutions')
    return { success: true, data: res.rows[0] as ServiceRequest }
  } catch (error) {
    console.error('Failed to submit service request:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function getServiceRequests() {
  await initDb()

  try {
    const res = await query('SELECT * FROM service_requests ORDER BY created_at DESC')
    return { success: true, data: res.rows as ServiceRequest[] }
  } catch (error) {
    console.error('Failed to get service requests:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateRequestStatus(id: number, status: string) {
  await initDb()

  try {
    await query('UPDATE service_requests SET status = $1 WHERE id = $2', [status, id])
    revalidatePath('/business-solutions')
    return { success: true }
  } catch (error) {
    console.error(`Failed to update status for request ${id}:`, error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteRequest(id: number) {
  await initDb()

  try {
    await query('DELETE FROM service_requests WHERE id = $1', [id])
    revalidatePath('/business-solutions')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete request ${id}:`, error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateServiceRequest(id: number, data: {
  name: string
  companyName: string
  phone: string
  whatsapp: string
  email: string
  region: string
  category: string
  service: string
  package: string
  budgetRange: string
  preferredTimeline: string
  description: string
  fileName?: string
  contactMethod: string
  status: string
}) {
  await initDb()

  const updateQuery = `
    UPDATE service_requests
    SET name = $1, company_name = $2, phone = $3, whatsapp = $4, email = $5, region = $6,
        category = $7, service = $8, package = $9, budget_range = $10, preferred_timeline = $11,
        description = $12, file_name = $13, contact_method = $14, status = $15
    WHERE id = $16
    RETURNING *;
  `

  const values = [
    data.name,
    data.companyName || null,
    data.phone || null,
    data.whatsapp || null,
    data.email,
    data.region || null,
    data.category,
    data.service,
    data.package,
    data.budgetRange || null,
    data.preferredTimeline || null,
    data.description || null,
    data.fileName || null,
    data.contactMethod || null,
    data.status,
    id
  ]

  try {
    const res = await query(updateQuery, values)
    revalidatePath('/business-solutions')
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as ServiceRequest }
  } catch (error) {
    console.error(`Failed to update service request ${id}:`, error)
    return { success: false, error: (error as Error).message }
  }
}

export interface ServicesCatalog {
  id: number
  catalog_key: string
  title: string
  icon: string
  description: string
  starting_price: string
  services: any
  status: string
  created_at: Date
}

export async function getServicesCatalog() {
  await initDb()
  try {
    const res = await query('SELECT * FROM services_catalog ORDER BY id ASC')
    return { success: true, data: res.rows as ServicesCatalog[] }
  } catch (error) {
    console.error('Failed to get services catalog:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function submitServicesCatalog(data: {
  title: string
  icon: string
  description: string
  starting_price: string
  services: any
  status?: string
}) {
  await initDb()
  const catalogKey = 'cat-' + Math.random().toString(36).substring(2, 11)
  const sql = `
    INSERT INTO services_catalog (catalog_key, title, icon, description, starting_price, services, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `
  try {
    const res = await query(sql, [
      catalogKey,
      data.title,
      data.icon,
      data.description,
      data.starting_price,
      typeof data.services === 'string' ? data.services : JSON.stringify(data.services),
      data.status || 'Active'
    ])
    revalidatePath('/business-solutions')
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as ServicesCatalog }
  } catch (error) {
    console.error('Failed to submit services catalog entry:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateServicesCatalog(id: number, data: {
  catalog_key: string
  title: string
  icon: string
  description: string
  starting_price: string
  services: any
  status: string
}) {
  await initDb()
  const sql = `
    UPDATE services_catalog
    SET catalog_key = $1, title = $2, icon = $3, description = $4, starting_price = $5, services = $6, status = $7
    WHERE id = $8
    RETURNING *;
  `
  try {
    const res = await query(sql, [
      data.catalog_key,
      data.title,
      data.icon,
      data.description,
      data.starting_price,
      typeof data.services === 'string' ? data.services : JSON.stringify(data.services),
      data.status,
      id
    ])
    revalidatePath('/business-solutions')
    revalidatePath('/admin')
    return { success: true, data: res.rows[0] as ServicesCatalog }
  } catch (error) {
    console.error(`Failed to update services catalog entry ${id}:`, error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteServicesCatalog(id: number) {
  await initDb()
  try {
    await query('DELETE FROM services_catalog WHERE id = $1', [id])
    revalidatePath('/business-solutions')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete services catalog entry ${id}:`, error)
    return { success: false, error: (error as Error).message }
  }
}

