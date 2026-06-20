'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Coins, Globe, Home, Briefcase, MapPin, Clock, ArrowRight, X, Upload } from 'lucide-react'
import Link from 'next/link'
import { fadeUp, scaleIn, stagger, viewportOnce } from '@/lib/motion'
import { submitJobApplication, getJobPostings } from '@/app/admin/actions'

interface Job {
  id: string
  title: string
  department: 'Engineering' | 'Product' | 'Marketing' | 'Operations' | 'Finance'
  location: string
  type: string
  description: string
}

const departments = ['All', 'Engineering', 'Product', 'Marketing', 'Operations', 'Finance'] as const

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export function CareersPageContent() {
  const [dbJobs, setDbJobs] = useState<Job[]>([])
  const [activeDept, setActiveDept] = useState<typeof departments[number]>('All')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  
  // Application form states
  const [applied, setApplied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    async function loadJobs() {
      const res = await getJobPostings()
      if (res.success && res.data) {
        const mappedJobs = res.data
          .filter(j => j.status === 'Active')
          .map(j => ({
            id: j.job_key || String(j.id),
            title: j.title,
            department: j.department as any,
            location: j.location,
            type: j.type,
            description: j.description
          }))
        setDbJobs(mappedJobs)
      }
    }
    loadJobs()
  }, [])

  const filteredJobs = activeDept === 'All' 
    ? dbJobs 
    : dbJobs.filter(j => j.department === activeDept)

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return
    setLoading(true)

    const base64 = file ? await fileToBase64(file) : undefined
    
    const res = await submitJobApplication({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      name: formData.name,
      email: formData.email,
      resumeFileName: file ? file.name : undefined,
      resumeFileData: base64,
      coverLetter: formData.message,
    })

    setLoading(false)
    if (res.success) {
      setApplied(true)
      setFormData({ name: '', email: '', message: '' })
      setFile(null)
    } else {
      alert(`Failed to submit application: ${res.error}`)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
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
    <div className="py-16 lg:py-24">
      {/* Benefits section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl"
          >
            Why work with LotusRise?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-muted-foreground text-sm leading-relaxed"
          >
            We are creating a collaborative environment where top talents can thrive, innovate, and make a tangible difference in the region.
          </motion.p>
        </div>

        <motion.div 
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { icon: TrendingUp, title: 'Growth & Learning', desc: 'Continuous professional development budgets, training, and direct mentorship programs.' },
            { icon: Coins, title: 'Competitive Compensation', desc: 'Market-leading salaries, performance-based bonuses, and equity options.' },
            { icon: Globe, title: 'Impact at Scale', desc: 'Your work builds solutions that reach and empower thousands of vendors and consumers.' },
            { icon: Home, title: 'Flexible Work', desc: 'Modern hybrid work policies and workspaces designed for productivity and collaboration.' }
          ].map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={scaleIn}
              className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold mb-5">
                <benefit.icon className="h-5 w-5" />
              </span>
              <h3 className="font-heading text-lg font-bold text-foreground">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Positions Section */}
      <div className="mx-auto mt-16 sm:mt-24 max-w-7xl px-4 sm:px-6 lg:mt-32">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">
            Current Openings
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-sm">
            Find your department and explore the roles we are currently hiring for.
          </p>
        </div>

        {/* Filter pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeDept === dept
                  ? 'bg-gold text-ink shadow-lg shadow-gold/20'
                  : 'bg-foreground/5 text-foreground/75 hover:bg-foreground/10'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Job Listings Grid */}
        <motion.div 
          layout
          className="mt-12 grid gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-border bg-card hover:border-gold/20 transition-all duration-300"
              >
                <div className="max-w-2xl">
                  <span className="inline-flex rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                    {job.department}
                  </span>
                  <h3 className="mt-3 font-heading text-xl font-bold text-foreground">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {job.type}
                    </span>
                  </div>
                </div>

                <div className="mt-5 md:mt-0 flex shrink-0">
                  <button
                    onClick={() => {
                      setSelectedJob(job)
                      setApplied(false)
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink text-white dark:bg-white dark:text-ink hover:bg-gold hover:text-ink px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                  >
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Culture Section */}
      <div className="mx-auto mt-16 sm:mt-24 max-w-7xl px-4 sm:px-6 lg:mt-32">
        <div className="rounded-3xl bg-ink p-5 sm:p-8 md:p-14 text-background">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
                Our Culture
              </span>
              <h2 className="mt-5 font-heading text-2xl font-extrabold sm:text-3xl md:text-4xl text-white">
                Driven by mission, supported by team
              </h2>
              <p className="mt-4 text-sm text-background/70 leading-relaxed">
                LotusRise is a fast-paced environment where autonomy is encouraged, failure is viewed as a learning opportunity, and diversity of thought is celebrated.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 text-xs">
                <div className="p-4 rounded-xl bg-background/5 border border-background/10">
                  <h4 className="font-bold text-gold">Innovation-First</h4>
                  <p className="mt-1 text-background/60">We build software to solve complex problems simply.</p>
                </div>
                <div className="p-4 rounded-xl bg-background/5 border border-background/10">
                  <h4 className="font-bold text-gold">Team Spirit</h4>
                  <p className="mt-1 text-background/60">Collaboration is our default setting.</p>
                </div>
              </div>
            </div>
            
            {/* Culture Grid Graphic */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 h-48 sm:h-64 lg:h-80">
              <div
                className="relative overflow-hidden rounded-2xl h-full flex items-center justify-center text-white font-heading text-lg font-bold shadow-md group"
                style={{ backgroundImage: 'url(/images/tanzania_culture.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
                <span className="relative z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Tanzania</span>
              </div>
              <div
                className="relative overflow-hidden rounded-2xl h-full flex items-center justify-center text-white font-heading text-lg font-bold shadow-md group"
                style={{ backgroundImage: 'url(/images/impact_culture.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
                <span className="relative z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Impact</span>
              </div>
              <div
                className="relative overflow-hidden rounded-2xl h-full flex items-center justify-center text-white font-heading text-lg font-bold shadow-md group"
                style={{ backgroundImage: 'url(/images/growth_culture.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
                <span className="relative z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Growth</span>
              </div>
              <div
                className="relative overflow-hidden rounded-2xl h-full flex items-center justify-center text-white font-heading text-lg font-bold shadow-md group"
                style={{ backgroundImage: 'url(/images/speed_culture.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
                <span className="relative z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Speed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA open applications */}
      <div className="mx-auto mt-16 sm:mt-24 max-w-4xl px-4 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Don't see your role?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          We are always looking for stellar engineers, product visionaries, and operation heroes. Send us an open application.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-gold/15 hover:shadow-gold/25 transition-all duration-300 hover:scale-[1.02]"
        >
          Submit Open Application <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Job Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-ink/65 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              {!applied ? (
                <>
                  <span className="inline-flex rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold">
                    Applying for {selectedJob.department}
                  </span>
                  <h3 className="mt-2 font-heading text-lg font-bold text-foreground">
                    {selectedJob.title}
                  </h3>
                  
                  <form onSubmit={handleApplySubmit} className="mt-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(d => ({ ...d, name: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition"
                        placeholder="John Doe"
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
                        className="w-full rounded-md border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Resume Drag-and-drop */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Attach Resume (PDF) *
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
                          id="resume-file"
                          accept=".pdf"
                          required={!file}
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                        />
                        <label htmlFor="resume-file" className="cursor-pointer text-center">
                          <Upload className="h-7 w-7 text-gold mx-auto mb-2" />
                          {file ? (
                            <span className="text-sm font-semibold text-foreground">{file.name}</span>
                          ) : (
                            <>
                              <span className="text-sm font-semibold text-foreground">Click to upload</span>
                              <span className="block text-xs text-muted-foreground mt-0.5">or drag and drop PDF here</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Cover Note / Message
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData(d => ({ ...d, message: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition"
                        placeholder="Tell us briefly why you'd be a great fit..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center rounded-md bg-gold text-ink font-semibold py-2.5 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold/15"
                    >
                      {loading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mx-auto mb-4">
                    ✓
                  </span>
                  <h3 className="font-heading text-lg font-bold text-foreground">Application Received!</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                    Thanks for applying. Our hiring team will review your profile and reach out if there is a match.
                  </p>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="mt-6 rounded-md bg-foreground/5 hover:bg-foreground/10 px-5 py-2 text-sm font-semibold text-foreground transition-all duration-300"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
