'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CloudUpload,
  FileText,
  Loader2,
  type LucideIcon,
  PartyPopper,
  Trash2,
  X,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type OnboardingField = {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'file' | 'number' | 'url' | 'info'
  placeholder?: string
  options?: string[]
  required?: boolean
  full?: boolean
  accept?: string          // for file inputs e.g. ".pdf,.jpg,.png"
  maxLength?: number       // for textarea char limit
  checkboxLabel?: string   // label text next to checkbox
  infoHtml?: string        // custom HTML to render for info types
  defaultValue?: string    // default initial value
}

export type OnboardingStep = {
  title: string
  description: string
  fields: OnboardingField[]
}

export type OnboardingConfig = {
  accentLabel: string
  benefits: { icon: LucideIcon; title: string; text: string }[]
  steps: OnboardingStep[]
  successTitle: string
  successText: string
}

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                 */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?\d[\d\s\-()]{8,}$/
const URL_RE = /^https?:\/\/.+\..+/i

function validateField(field: OnboardingField, value: string, files: File[]): string | null {
  if (field.type === 'info') return null
  if (field.type === 'checkbox') {
    if (field.required && value !== 'true') return 'You must agree to continue.'
    return null
  }
  if (field.type === 'file') {
    if (field.required && files.length === 0) return 'Please upload a file.'
    return null
  }
  if (field.required && !value.trim()) return 'This field is required.'
  if (value.trim()) {
    if (field.type === 'email' && !EMAIL_RE.test(value)) return 'Please enter a valid email address.'
    if (field.type === 'tel' && !PHONE_RE.test(value)) return 'Enter a valid phone number (e.g. +255 700 000 000).'
    if (field.type === 'url' && !URL_RE.test(value)) return 'Enter a valid URL starting with http:// or https://'
  }
  return null
}

/* ------------------------------------------------------------------ */
/*  localStorage helpers                                               */
/* ------------------------------------------------------------------ */

function storageKey(label: string) {
  return `lotusrise_onboarding_${label.replace(/\s+/g, '_').toLowerCase()}`
}

function loadDraft(label: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(storageKey(label))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveDraft(label: string, values: Record<string, string>) {
  try {
    localStorage.setItem(storageKey(label), JSON.stringify(values))
  } catch { /* ignore quota errors */ }
}

function clearDraft(label: string) {
  try {
    localStorage.removeItem(storageKey(label))
  } catch { /* ignore */ }
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function OnboardingFlow({ config, onSubmit }: { config: OnboardingConfig; onSubmit?: (values: Record<string, string>, fileValues: Record<string, File[]>) => Promise<any> }) {
  const { steps } = config
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [values, setValues] = useState<Record<string, string>>({})
  const [fileValues, setFileValues] = useState<Record<string, File[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [shakeFields, setShakeFields] = useState<Record<string, boolean>>({})
  const formRef = useRef<HTMLDivElement>(null)

  // NIDA Verification State
  const [nidaModalOpen, setNidaModalOpen] = useState(false)
  const [nidaStatus, setNidaStatus] = useState<
    | 'idle'
    | 'verifying_initial'
    | 'success_initial'
    | 'failed_initial'
    | 'reenter'
    | 'verifying_reenter'
    | 'questions'
    | 'verifying_questions'
    | 'success_final'
  >('idle')
  const [activeNidaField, setActiveNidaField] = useState<string | null>(null)
  const [reenteredNida, setReenteredNida] = useState('')
  const [reenterError, setReenterError] = useState('')
  const [questionsAnswers, setQuestionsAnswers] = useState({
    yob: '',
    motherName: '',
    pob: '',
  })
  const [questionsErrors, setQuestionsErrors] = useState({
    yob: '',
    motherName: '',
    pob: '',
  })

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = loadDraft(config.accentLabel)
    const updatedDraft = { ...draft }
    steps.forEach((step) => {
      step.fields.forEach((field) => {
        if (field.defaultValue && !updatedDraft[field.name]) {
          updatedDraft[field.name] = field.defaultValue
        }
      })
    })
    setValues(updatedDraft)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-save draft on value changes
  useEffect(() => {
    if (!submitted) saveDraft(config.accentLabel, values)
  }, [values, submitted, config.accentLabel])

  const progress = useMemo(
    () => ((current + (submitted ? 1 : 0)) / steps.length) * 100,
    [current, submitted, steps.length],
  )

  const triggerShake = useCallback((fieldNames: string[]) => {
    const shake: Record<string, boolean> = {}
    fieldNames.forEach((n) => (shake[n] = true))
    setShakeFields(shake)
    setTimeout(() => setShakeFields({}), 600)
  }, [])

  function validateStep() {
    const stepErrors: Record<string, string> = {}
    for (const field of steps[current].fields) {
      const err = validateField(field, values[field.name] ?? '', fileValues[field.name] ?? [])
      if (err) stepErrors[field.name] = err
    }
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length > 0) {
      triggerShake(Object.keys(stepErrors))
      return false
    }
    return true
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleQuestionsSuccess() {
    setNidaStatus('success_final')
    setTimeout(() => {
      setNidaStatus((currentStatus) => {
        if (currentStatus === 'success_final') {
          performStepTransitionWithNida(reenteredNida)
        }
        return currentStatus
      })
    }, 2000)
  }

  async function performStepTransitionWithNida(reenteredVal?: string) {
    let updatedValues = values
    if (activeNidaField && reenteredVal) {
      updatedValues = { ...values, [activeNidaField]: reenteredVal }
      setValues(updatedValues)
    }

    setNidaModalOpen(false)
    setNidaStatus('idle')
    setActiveNidaField(null)

    if (current === steps.length - 1) {
      setSubmitting(true)
      if (onSubmit) {
        try {
          await onSubmit(updatedValues, fileValues)
        } catch (err) {
          console.error(err)
          alert('Submission failed. Please try again.')
          setSubmitting(false)
          return
        }
      } else {
        // Simulate network request
        await new Promise((r) => setTimeout(r, 1500))
      }
      setSubmitting(false)
      setSubmitted(true)
      clearDraft(config.accentLabel)
      return
    }
    setDirection(1)
    setCurrent((c) => c + 1)
    setTimeout(scrollToForm, 80)
  }

  async function next() {
    if (!validateStep()) return

    const nidaFields = ['idNumber', 'declarantId']
    const nidaFieldObj = steps[current].fields.find((f) => nidaFields.includes(f.name))

    if (nidaFieldObj) {
      const rawVal = values[nidaFieldObj.name] ?? ''
      setActiveNidaField(nidaFieldObj.name)
      setNidaStatus('verifying_initial')
      setNidaModalOpen(true)
      setReenteredNida('')
      setReenterError('')
      setQuestionsAnswers({ yob: '', motherName: '', pob: '' })
      setQuestionsErrors({ yob: '', motherName: '', pob: '' })

      setTimeout(() => {
        const cleanVal = rawVal.trim()
        const is20Digits = /^\d{20}$/.test(cleanVal)
        if (is20Digits) {
          setNidaStatus('success_initial')
          setTimeout(() => {
            setNidaStatus((currentStatus) => {
              if (currentStatus === 'success_initial') {
                performStepTransitionWithNida()
              }
              return currentStatus
            })
          }, 2000)
        } else {
          setNidaStatus('failed_initial')
        }
      }, 5000)
      return
    }

    await performStepTransitionWithNida()
  }

  function back() {
    setErrors({})
    setDirection(-1)
    setCurrent((c) => Math.max(0, c - 1))
    setTimeout(scrollToForm, 80)
  }

  return (
    <section className="bg-background py-10 sm:py-16 lg:py-20" ref={formRef} style={{ scrollMarginTop: '6rem' }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Benefits panel */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <span className="inline-flex items-center rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            {config.accentLabel}
          </span>
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="mt-6 space-y-5"
          >
            {config.benefits.map(({ icon: Icon, title, text }) => (
              <motion.li
                key={title}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
                className="flex gap-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-heading font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </aside>

        {/* Form card */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-10 text-center"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-ink"
                >
                  <PartyPopper className="h-9 w-9" />
                </motion.span>
                <h2 className="mt-6 font-heading text-xl sm:text-2xl font-extrabold text-ink">
                  {config.successTitle}
                </h2>
                <p className="mt-3 max-w-md px-2 sm:px-0 text-sm sm:text-base leading-relaxed text-muted-foreground">
                  {config.successText}
                </p>
                <Link
                  href="/"
                  className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
                >
                  Back to Home <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <div key="form">
                {/* Stepper with labels */}
                <div className="mb-7">
                  <div className="flex items-start justify-between overflow-x-auto min-w-0">
                    {steps.map((step, i) => (
                      <div key={step.title} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={
                              'flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ' +
                              (i < current
                                ? 'bg-gold text-ink shadow-[0_0_12px_rgba(180,130,20,0.35)]'
                                : i === current
                                  ? 'bg-ink text-background shadow-[0_0_16px_rgba(0,0,0,0.15)]'
                                  : 'bg-muted text-muted-foreground')
                            }
                          >
                            {i < current ? <Check className="h-4 w-4" /> : i + 1}
                          </span>
                          <span
                            className={
                              'mt-1.5 hidden text-center text-[11px] font-medium leading-tight lg:block max-w-[80px] ' +
                              (i <= current ? 'text-ink' : 'text-muted-foreground')
                            }
                          >
                            {step.title}
                          </span>
                        </div>
                        {i < steps.length - 1 && (
                          <span className="mx-1 sm:mx-2 mt-0 h-0.5 flex-1 min-w-[12px] overflow-hidden rounded bg-muted lg:mt-[-12px]">
                            <motion.span
                              className="block h-full bg-gold"
                              initial={false}
                              animate={{ width: i < current ? '100%' : '0%' }}
                              transition={{ duration: 0.4 }}
                            />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-gold"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -40 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-sm font-semibold text-gold-deep">
                      Step {current + 1} of {steps.length}
                    </p>
                    <h2 className="mt-1 font-heading text-xl sm:text-2xl font-extrabold text-ink">
                      {steps[current].title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {steps[current].description}
                    </p>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      {steps[current].fields.map((field) => (
                        <Field
                          key={field.name}
                          field={field}
                          value={values[field.name] ?? ''}
                          files={fileValues[field.name] ?? []}
                          error={errors[field.name]}
                          shake={shakeFields[field.name]}
                          onChange={(v) => {
                            setValues((s) => ({ ...s, [field.name]: v }))
                            if (errors[field.name])
                              setErrors((e) => ({ ...e, [field.name]: '' }))
                          }}
                          onFilesChange={(files) => {
                            setFileValues((s) => ({ ...s, [field.name]: files }))
                            setValues((s) => ({ ...s, [field.name]: files[0]?.name ?? '' }))
                            if (errors[field.name])
                              setErrors((e) => ({ ...e, [field.name]: '' }))
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    onClick={back}
                    disabled={current === 0}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <motion.button
                    onClick={next}
                    disabled={submitting}
                    whileHover={submitting ? {} : { scale: 1.03 }}
                    whileTap={submitting ? {} : { scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-2.5 text-sm font-semibold text-ink disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : current === steps.length - 1 ? (
                      <>Submit Application <CheckCircle2 className="h-4 w-4" /></>
                    ) : (
                      <>Continue <ArrowRight className="h-4 w-4" /></>
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* NIDA Verification Modal Overlay */}
      <AnimatePresence>
        {nidaModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-gold/20 bg-zinc-950/95 p-4 sm:p-6 lg:p-8 text-neutral-100 shadow-[0_0_50px_rgba(180,130,20,0.2)] backdrop-blur-xl"
            >
              {/* Glow effects */}
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
              <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

              <div className="relative flex flex-col items-center text-center">
                {/* VERIFYING INITIAL STATE */}
                {nidaStatus === 'verifying_initial' && (
                  <div className="py-6 flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-gold animate-spin mb-4" />
                    <h3 className="text-xl font-heading font-bold text-white tracking-wide">
                      Verifying National ID
                    </h3>
                    <p className="mt-2 text-sm text-neutral-400 max-w-xs leading-relaxed">
                      Contacting National Identification Authority (NIDA) database...
                    </p>
                    <div className="mt-6 w-full max-w-[200px] h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gold"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                      />
                    </div>
                  </div>
                )}

                {/* SUCCESS INITIAL STATE */}
                {nidaStatus === 'success_initial' && (
                  <div className="py-6 flex flex-col items-center">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4 animate-pulse" />
                    <h3 className="text-xl font-heading font-bold text-white tracking-wide">
                      National ID Verification Completed
                    </h3>
                    <p className="mt-2 text-sm text-emerald-400/90 max-w-xs font-medium">
                      Identity verified successfully.
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Proceeding to the next step...
                    </p>
                  </div>
                )}

                {/* FAILED INITIAL STATE */}
                {nidaStatus === 'failed_initial' && (
                  <div className="py-4 flex flex-col items-center">
                    <AlertCircle className="h-12 w-12 text-rose-500 mb-4 animate-bounce" />
                    <h3 className="text-xl font-heading font-bold text-white tracking-wide">
                      Verification Failed
                    </h3>
                    <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                      The National ID verification failed. Please check your entry and try again.
                    </p>
                    <p className="mt-3 text-xs text-neutral-400 font-medium">
                      Would you like to try again or cancel?
                    </p>
                    <div className="mt-6 flex w-full gap-3">
                      <button
                        onClick={() => {
                          setNidaModalOpen(false)
                          setNidaStatus('idle')
                          setActiveNidaField(null)
                        }}
                        className="flex-1 rounded-md border border-zinc-700 bg-transparent py-2.5 text-sm font-semibold text-neutral-300 transition-colors hover:bg-zinc-800 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setNidaStatus('reenter')}
                        className="flex-1 rounded-md bg-gold py-2.5 text-sm font-semibold text-zinc-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                )}

                {/* RE-ENTER STATE */}
                {nidaStatus === 'reenter' && (
                  <div className="w-full py-4 text-left">
                    <h3 className="text-xl font-heading font-bold text-white tracking-wide text-center">
                      Re-enter National ID
                    </h3>
                    <p className="mt-1.5 text-sm text-neutral-400 text-center leading-relaxed mb-5">
                      Please input your National ID number again.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          National ID Number
                        </label>
                        <input
                          type="text"
                          value={reenteredNida}
                          onChange={(e) => {
                            setReenteredNida(e.target.value)
                            setReenterError('')
                          }}
                          placeholder="Enter National ID"
                          className="mt-1.5 w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-gold focus:ring-1 focus:ring-gold/30"
                        />
                        {reenterError && (
                          <p className="mt-1.5 text-xs text-rose-500 font-medium">
                            {reenterError}
                          </p>
                        )}
                      </div>
                      <div className="mt-6 flex w-full gap-3 pt-2">
                        <button
                          onClick={() => {
                            setNidaModalOpen(false)
                            setNidaStatus('idle')
                            setActiveNidaField(null)
                          }}
                          className="flex-1 rounded-md border border-zinc-700 bg-transparent py-2.5 text-sm font-semibold text-neutral-300 transition-colors hover:bg-zinc-800 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (!reenteredNida.trim()) {
                              setReenterError('National ID is required.')
                              return
                            }
                            setNidaStatus('verifying_reenter')
                            setTimeout(() => {
                              const cleanVal = reenteredNida.trim()
                              const is20Digits = /^\d{20}$/.test(cleanVal)
                              if (is20Digits) {
                                setNidaStatus('questions')
                              } else {
                                setReenterError('Verification failed. Check the ID and try again.')
                                setNidaStatus('reenter')
                              }
                            }, 5000)
                          }}
                          className="flex-1 rounded-md bg-gold py-2.5 text-sm font-semibold text-zinc-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* VERIFYING RE-ENTER STATE */}
                {nidaStatus === 'verifying_reenter' && (
                  <div className="py-6 flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-gold animate-spin mb-4" />
                    <h3 className="text-xl font-heading font-bold text-white tracking-wide">
                      Verifying New ID
                    </h3>
                    <p className="mt-2 text-sm text-neutral-400 max-w-xs leading-relaxed">
                      Re-checking NIDA registry...
                    </p>
                    <div className="mt-6 w-full max-w-[200px] h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gold"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                      />
                    </div>
                  </div>
                )}

                {/* SECURITY QUESTIONS STATE */}
                {nidaStatus === 'questions' && (
                  <div className="w-full py-4 text-left">
                    <h3 className="text-xl font-heading font-bold text-white tracking-wide text-center">
                      Security Verification
                    </h3>
                    <p className="mt-1.5 text-sm text-neutral-400 text-center leading-relaxed mb-5">
                      Answer these 3 security questions to verify ownership of the ID.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          1. What is your Year of Birth?
                        </label>
                        <input
                          type="text"
                          value={questionsAnswers.yob}
                          onChange={(e) => {
                            setQuestionsAnswers((prev) => ({ ...prev, yob: e.target.value }))
                            setQuestionsErrors((prev) => ({ ...prev, yob: '' }))
                          }}
                          placeholder="e.g. 1990"
                          className="mt-1.5 w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-gold"
                        />
                        {questionsErrors.yob && (
                          <p className="mt-1 text-xs text-rose-500 font-medium">{questionsErrors.yob}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          2. What is your Mother's Maiden Name?
                        </label>
                        <input
                          type="text"
                          value={questionsAnswers.motherName}
                          onChange={(e) => {
                            setQuestionsAnswers((prev) => ({ ...prev, motherName: e.target.value }))
                            setQuestionsErrors((prev) => ({ ...prev, motherName: '' }))
                          }}
                          placeholder="e.g. Jane Smith"
                          className="mt-1.5 w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-gold"
                        />
                        {questionsErrors.motherName && (
                          <p className="mt-1 text-xs text-rose-500 font-medium">{questionsErrors.motherName}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          3. What is your Place of Birth?
                        </label>
                        <input
                          type="text"
                          value={questionsAnswers.pob}
                          onChange={(e) => {
                            setQuestionsAnswers((prev) => ({ ...prev, pob: e.target.value }))
                            setQuestionsErrors((prev) => ({ ...prev, pob: '' }))
                          }}
                          placeholder="e.g. Dar es Salaam"
                          className="mt-1.5 w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-gold"
                        />
                        {questionsErrors.pob && (
                          <p className="mt-1 text-xs text-rose-500 font-medium">{questionsErrors.pob}</p>
                        )}
                      </div>
                      <div className="mt-6 flex w-full gap-3 pt-2">
                        <button
                          onClick={() => {
                            setNidaModalOpen(false)
                            setNidaStatus('idle')
                            setActiveNidaField(null)
                          }}
                          className="flex-1 rounded-md border border-zinc-700 bg-transparent py-2.5 text-sm font-semibold text-neutral-300 transition-colors hover:bg-zinc-800 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            const errs = { yob: '', motherName: '', pob: '' }
                            let hasErr = false
                            if (!questionsAnswers.yob.trim()) {
                              errs.yob = 'Required.'
                              hasErr = true
                            }
                            if (!questionsAnswers.motherName.trim()) {
                              errs.motherName = 'Required.'
                              hasErr = true
                            }
                            if (!questionsAnswers.pob.trim()) {
                              errs.pob = 'Required.'
                              hasErr = true
                            }
                            if (hasErr) {
                              setQuestionsErrors(errs)
                              return
                            }
                            setNidaStatus('verifying_questions')
                            setTimeout(() => {
                              handleQuestionsSuccess()
                            }, 5000)
                          }}
                          className="flex-1 rounded-md bg-gold py-2.5 text-sm font-semibold text-zinc-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Submit Answers
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* VERIFYING QUESTIONS STATE */}
                {nidaStatus === 'verifying_questions' && (
                  <div className="py-6 flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-gold animate-spin mb-4" />
                    <h3 className="text-xl font-heading font-bold text-white tracking-wide">
                      Verifying Answers
                    </h3>
                    <p className="mt-2 text-sm text-neutral-400 max-w-xs leading-relaxed">
                      Matching answers with security records...
                    </p>
                    <div className="mt-6 w-full max-w-[200px] h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gold"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                      />
                    </div>
                  </div>
                )}

                {/* SUCCESS FINAL STATE */}
                {nidaStatus === 'success_final' && (
                  <div className="py-6 flex flex-col items-center">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4 animate-pulse" />
                    <h3 className="text-xl font-heading font-bold text-white tracking-wide">
                      National ID Verification Completed
                    </h3>
                    <p className="mt-2 text-sm text-emerald-400/90 max-w-xs font-medium">
                      Identity confirmed successfully.
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Proceeding to the next step...
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Field component                                                    */
/* ------------------------------------------------------------------ */

const shakeAnimation = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.5 },
}

function Field({
  field,
  value,
  files,
  error,
  shake,
  onChange,
  onFilesChange,
}: {
  field: OnboardingField
  value: string
  files: File[]
  error?: string
  shake?: boolean
  onChange: (v: string) => void
  onFilesChange: (files: File[]) => void
}) {
  const base =
    'mt-2 w-full rounded-md border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:shadow-[0_0_0_4px_rgba(180,130,20,0.08)] ' +
    (error ? 'border-destructive' : 'border-border')

  const isFullWidth = field.full || field.type === 'textarea' || field.type === 'checkbox' || field.type === 'file' || field.type === 'info'

  /* ---------- Info / Text Block ---------- */
  if (field.type === 'info') {
    return (
      <div className="sm:col-span-2 text-left leading-relaxed text-foreground/80">
        {field.infoHtml ? (
          <div 
            className="text-sm space-y-3"
            dangerouslySetInnerHTML={{ __html: field.infoHtml }}
          />
        ) : (
          <p className="text-sm font-medium">
            {field.label}
          </p>
        )}
      </div>
    )
  }

  /* ---------- Checkbox ---------- */
  if (field.type === 'checkbox') {
    return (
      <motion.div
        className="sm:col-span-2"
        animate={shake ? shakeAnimation : {}}
      >
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background/50 p-4 transition-colors hover:border-gold/40">
          <input
            type="checkbox"
            checked={value === 'true'}
            onChange={(e) => onChange(e.target.checked ? 'true' : '')}
            className="mt-0.5 h-4 w-4 shrink-0 accent-gold"
          />
          <span className="text-sm leading-relaxed text-foreground/80">
            {field.checkboxLabel || field.label}
            {field.required && <span className="text-gold-deep"> *</span>}
          </span>
        </label>
        {error && (
          <p className="mt-1.5 text-xs text-destructive">{error}</p>
        )}
      </motion.div>
    )
  }

  /* ---------- File upload ---------- */
  if (field.type === 'file') {
    return (
      <motion.div
        className="sm:col-span-2"
        animate={shake ? shakeAnimation : {}}
      >
        <label className="text-sm font-medium text-ink">
          {field.label}
          {field.required && <span className="text-gold-deep"> *</span>}
        </label>
        <FileDropZone
          files={files}
          accept={field.accept}
          error={!!error}
          onFilesChange={onFilesChange}
        />
        {error && (
          <p className="mt-1.5 text-xs text-destructive">{error}</p>
        )}
      </motion.div>
    )
  }

  /* ---------- Textarea ---------- */
  if (field.type === 'textarea') {
    const maxLen = field.maxLength ?? 500
    return (
      <motion.div
        className="sm:col-span-2"
        animate={shake ? shakeAnimation : {}}
      >
        <label className="text-sm font-medium text-ink">
          {field.label}
          {field.required && <span className="text-gold-deep"> *</span>}
        </label>
        <textarea
          rows={4}
          value={value}
          maxLength={maxLen}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={base + ' resize-none'}
        />
        <div className="mt-1 flex items-center justify-between">
          {error ? (
            <p className="text-xs text-destructive">{error}</p>
          ) : (
            <span />
          )}
          <span className={`text-xs ${value.length >= maxLen ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
            {value.length} / {maxLen}
          </span>
        </div>
      </motion.div>
    )
  }

  /* ---------- Select ---------- */
  if (field.type === 'select') {
    return (
      <motion.div
        className={isFullWidth ? 'sm:col-span-2' : ''}
        animate={shake ? shakeAnimation : {}}
      >
        <label className="text-sm font-medium text-ink">
          {field.label}
          {field.required && <span className="text-gold-deep"> *</span>}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        >
          <option value="">Select an option</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </motion.div>
    )
  }

  /* ---------- Default text / email / tel / number / url ---------- */
  return (
    <motion.div
      className={isFullWidth ? 'sm:col-span-2' : ''}
      animate={shake ? shakeAnimation : {}}
    >
      <label className="text-sm font-medium text-ink">
        {field.label}
        {field.required && <span className="text-gold-deep"> *</span>}
      </label>
      <input
        type={field.type ?? 'text'}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={base}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  File drop zone                                                     */
/* ------------------------------------------------------------------ */

function FileDropZone({
  files,
  accept,
  error,
  onFilesChange,
}: {
  files: File[]
  accept?: string
  error?: boolean
  onFilesChange: (files: File[]) => void
}) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const arr = Array.from(incoming)
    onFilesChange([...files, ...arr])
  }

  const removeFile = (idx: number) => {
    onFilesChange(files.filter((_, i) => i !== idx))
  }

  return (
    <div className="mt-2 space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        className={
          'flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-3 py-6 sm:px-4 sm:py-8 text-center transition-all duration-200 ' +
          (dragging
            ? 'border-gold bg-gold/5 shadow-[0_0_0_4px_rgba(180,130,20,0.08)]'
            : error
              ? 'border-destructive bg-destructive/5'
              : 'border-border bg-background hover:border-gold/40 hover:bg-gold/[0.02]')
        }
      >
        <CloudUpload className={`h-8 w-8 ${dragging ? 'text-gold' : 'text-muted-foreground'}`} />
        <p className="text-sm font-medium text-foreground/70">
          {dragging ? 'Drop files here' : 'Drag & drop or click to browse'}
        </p>
        <p className="text-xs text-muted-foreground">
          {accept ? `Accepted: ${accept}` : 'PDF, JPG, PNG up to 5 MB'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept ?? '.pdf,.jpg,.jpeg,.png'}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Uploaded file list */}
      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((file, idx) => (
            <motion.li
              key={`${file.name}-${idx}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2"
            >
              <FileText className="h-4 w-4 shrink-0 text-gold-deep" />
              <span className="flex-1 truncate text-sm text-foreground">{file.name}</span>
              <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="rounded p-0.5 text-muted-foreground transition-colors hover:text-destructive"
                aria-label={`Remove ${file.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
