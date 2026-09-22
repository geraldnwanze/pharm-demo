import { Activity, ArrowRight, Lock, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { organisation } from '../data/seed'
import type { StaffRole } from '../types'

const roles: StaffRole[] = ['Organisation Admin', 'Pharmacist', 'Support Staff']

export function LoginPage() {
  const navigate = useNavigate()
  const { staff, setCurrentUserRole } = useAppData()
  const [role, setRole] = useState<StaffRole>('Organisation Admin')
  const matchedStaff = staff.find((s) => s.role === role)
  const [email, setEmail] = useState(matchedStaff?.email ?? '')
  const [password, setPassword] = useState('••••••••')
  const [loading, setLoading] = useState(false)

  function handleRoleChange(nextRole: StaffRole) {
    setRole(nextRole)
    const match = staff.find((s) => s.role === nextRole)
    if (match) setEmail(match.email)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setCurrentUserRole(role)
      navigate('/')
    }, 500)
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden w-1/2 flex-col justify-between bg-emerald-700 p-10 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
            <Activity size={18} />
          </div>
          <span className="text-sm font-medium text-emerald-100">Healthcare Digital Solutions</span>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-300">{organisation.shortName} workspace</p>
          <h1 className="mt-3 max-w-md text-3xl font-semibold leading-tight">One record. Every visit. Nothing overwritten.</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-emerald-100">
            A permanent Patient ID, a longitudinal history of every encounter and follow-up, and a workspace that belongs to {organisation.shortName} alone —
            isolated at the database level, not just hidden in the interface.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-200">
          <ShieldCheck size={14} />
          Powered by Earlybird AlphaForge · Organisation-level data isolation by design
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
              <Activity size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-900">{organisation.shortName}</span>
          </div>

          <h2 className="text-xl font-semibold text-slate-900">Organisation Login</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to the {organisation.shortName} workspace</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Sign in as</label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as StaffRole)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-400">Determines what this account can see and do after signing in.</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-black/10 hover:brightness-90 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            This is a scoped organisation login — not the Earlybird platform admin console.
          </p>
        </div>
      </div>
    </div>
  )
}
