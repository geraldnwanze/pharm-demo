import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ClipboardList,
  FileClock,
  Palette,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UsersRound,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { usePlatformData } from '../context/PlatformContext'
import { deriveOrgPrefix, slugify } from '../lib/format'
import type { Organisation } from '../types'

const brandOptions = ['#0f9d6a', '#0ea5e9', '#7c3aed', '#dc2626', '#ea580c']

const features = [
  { icon: UsersRound, title: 'Patient records', body: 'A permanent Patient ID per person, never overwritten, with every visit kept as its own encounter.' },
  { icon: Stethoscope, title: 'Encounters & follow-ups', body: 'Document consultations, medication reviews and chronic care visits, with follow-ups tracked to completion.' },
  { icon: ShieldCheck, title: 'Role-based access', body: 'Admin, Pharmacist and Support Staff roles — each sees and does only what their role requires.' },
  { icon: FileClock, title: 'Audit trail', body: 'Every registration, encounter and staff change is logged — who did what, and when.' },
  { icon: Palette, title: 'Your own branding', body: "Your organisation's name, colour and subdomain — a workspace that feels like yours, not a shared tool." },
  { icon: BarChart3, title: 'Reports', body: 'Encounter breakdowns, follow-up completion rates and staff activity, without spreadsheets.' },
]

const plans: { id: Organisation['plan']; price: string; period: string; tagline: string; features: string[]; highlight?: boolean }[] = [
  {
    id: 'Starter',
    price: '₦25,000',
    period: '/month',
    tagline: 'For a single pharmacy getting started',
    features: ['Up to 2 staff accounts', 'Up to 200 patient records', 'Patient registration & timeline', 'Encounters & follow-ups', 'Basic reports'],
  },
  {
    id: 'Growth',
    price: '₦65,000',
    period: '/month',
    tagline: 'For a busy pharmacy with a full team',
    features: ['Up to 10 staff accounts', 'Unlimited patient records', 'Role-based access control', 'Full reports & audit trail', 'Priority support'],
    highlight: true,
  },
  {
    id: 'Enterprise',
    price: 'Custom',
    period: '',
    tagline: 'For multi-branch pharmacy groups',
    features: ['Unlimited staff accounts', 'Multi-branch structure', 'Custom integrations', 'Dedicated account manager', 'SLA-backed support'],
  },
]

export function LandingPage() {
  const navigate = useNavigate()
  const { createOrganisation } = usePlatformData()
  const { switchTenant } = useAppData()

  const [form, setForm] = useState({
    orgName: '',
    adminName: '',
    adminEmail: '',
    password: '',
    plan: 'Growth' as Organisation['plan'],
    brandColor: brandOptions[0],
  })
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function scrollToSignup(plan?: Organisation['plan']) {
    if (plan) update('plan', plan)
    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const slug = slugify(form.orgName)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.orgName.trim() || !form.adminName.trim() || !form.adminEmail.trim() || !form.password) return
    setSubmitting(true)
    const tenant = createOrganisation({
      name: form.orgName.trim(),
      shortName: form.orgName.trim().split(' ')[0],
      subdomain: slug,
      patientIdPrefix: deriveOrgPrefix(form.orgName),
      plan: form.plan,
      brandColor: form.brandColor,
      address: '',
      phone: '',
      email: form.adminEmail.trim(),
      adminName: form.adminName.trim(),
      adminEmail: form.adminEmail.trim(),
      source: 'self-serve',
    })
    setTimeout(() => {
      switchTenant(tenant, tenant.staff[0].id)
      navigate('/app')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Activity size={16} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">Earlybird AlphaForge</p>
              <p className="hidden whitespace-nowrap text-[10px] text-slate-400 sm:block">Healthcare Digital Solutions</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
            <a href="#features" className="hover:text-slate-900">Product</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <Link to="/login" className="hover:text-slate-900">Client Login</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <Link to="/login" className="whitespace-nowrap text-sm font-medium text-slate-600 hover:text-slate-900 sm:hidden">
              Login
            </Link>
            <button
              onClick={() => scrollToSignup()}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
          <Sparkles size={12} /> One platform. Every pharmacy has its own workspace.
        </span>
        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Healthcare Digital Solutions,<br className="hidden sm:block" /> built for pharmacies like yours
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          A permanent Patient ID, a longitudinal history of every visit, and a branded workspace that belongs to your
          organisation alone — isolated at the database level, not just hidden in the interface.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => scrollToSignup()}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700"
          >
            Get Started <ArrowRight size={16} />
          </button>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Client Login
          </Link>
        </div>
      </section>

      <section id="features" className="border-t border-slate-100 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-slate-900">Everything a pharmacy workspace needs</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <f.icon size={17} />
                </span>
                <p className="mt-3 text-sm font-semibold text-slate-900">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-slate-900">Simple, organisation-wide pricing</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate-500">
            Every plan includes your own isolated workspace, branding and audit trail.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col rounded-2xl border p-6 ${
                  plan.highlight ? 'border-emerald-600 shadow-lg shadow-emerald-600/10' : 'border-slate-200'
                }`}
              >
                {plan.highlight && (
                  <span className="mb-3 inline-flex w-fit items-center rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-medium text-white">
                    Most popular
                  </span>
                )}
                <p className="text-sm font-semibold text-slate-900">{plan.id}</p>
                <p className="mt-1 text-xs text-slate-500">{plan.tagline}</p>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-400">{plan.period}</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollToSignup(plan.id)}
                  className={`mt-6 rounded-lg px-4 py-2.5 text-sm font-medium ${
                    plan.highlight ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Choose {plan.id}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="get-started" className="border-t border-slate-100 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-lg">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Register your organisation</h2>
            <p className="mt-2 text-sm text-slate-500">Your workspace is created instantly — no waiting on setup.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Organisation name <span className="text-rose-500">*</span>
              </label>
              <input
                required
                value={form.orgName}
                onChange={(e) => update('orgName', e.target.value)}
                placeholder="e.g. Sunrise Family Pharmacy"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {slug && (
                <p className="mt-1 text-xs text-slate-400">
                  Your workspace: <span className="font-mono">{slug}.care.earlybirdalphaforge.com</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Your name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  value={form.adminName}
                  onChange={(e) => update('adminName', e.target.value)}
                  placeholder="e.g. Chika Obi"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Work email <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  value={form.adminEmail}
                  onChange={(e) => update('adminEmail', e.target.value)}
                  placeholder="you@yourpharmacy.ng"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Plan</label>
                <select
                  value={form.plan}
                  onChange={(e) => update('plan', e.target.value as Organisation['plan'])}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.price}{p.period}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Brand colour</label>
                <div className="flex h-[42px] items-center gap-2">
                  {brandOptions.map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => update('brandColor', color)}
                      className="flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-offset-2"
                      style={{ backgroundColor: color, '--tw-ring-color': form.brandColor === color ? color : 'transparent' } as React.CSSProperties}
                    >
                      {form.brandColor === color && <Check size={12} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? 'Creating your workspace…' : 'Create your workspace'}
              {!submitting && <ArrowRight size={15} />}
            </button>
            <p className="text-center text-xs text-slate-400">
              By creating an account you agree to Earlybird AlphaForge's Terms of Service.
            </p>
          </form>
        </div>
      </section>

      <footer className="border-t border-slate-100 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <Building2 size={13} />
            Earlybird AlphaForge · Healthcare Digital Solutions
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-600">Client Login</Link>
            <Link to="/platform/login" className="hover:text-slate-600">Platform Staff</Link>
            <span className="flex items-center gap-1.5">
              <ClipboardList size={12} /> Organisation-level data isolation by design
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
