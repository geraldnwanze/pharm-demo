import { ChevronDown, Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import type { StaffRole } from '../../types'

const roles: StaffRole[] = ['Organisation Admin', 'Pharmacist', 'Support Staff']

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { currentUser, setCurrentUserRole, patients } = useAppData()
  const [query, setQuery] = useState('')
  const [roleOpen, setRoleOpen] = useState(false)
  const navigate = useNavigate()

  const results = query.trim()
    ? patients.filter(
        (p) =>
          p.fullName.toLowerCase().includes(query.toLowerCase()) ||
          p.id.toLowerCase().includes(query.toLowerCase()) ||
          p.phone.includes(query),
      )
    : []

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
      <button onClick={onMenu} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden">
        <Menu size={20} />
      </button>

      <div className="relative w-full max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patient ID, name or phone…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        {results.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-40 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
            {results.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  navigate(`/patients/${p.id}`)
                  setQuery('')
                }}
                className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm hover:bg-slate-50"
              >
                <span className="font-medium text-slate-800">{p.fullName}</span>
                <span className="text-xs text-slate-400">{p.id}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setRoleOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 py-1.5 pl-1.5 pr-2.5 hover:bg-slate-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
              {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-medium leading-tight text-slate-800">{currentUser.name}</span>
              <span className="block text-[11px] leading-tight text-slate-400">{currentUser.role}</span>
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          {roleOpen && (
            <div className="absolute right-0 top-full z-40 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
              <p className="px-3.5 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Preview as role
              </p>
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentUserRole(role)
                    setRoleOpen(false)
                  }}
                  className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-sm hover:bg-slate-50 ${
                    role === currentUser.role ? 'text-emerald-700' : 'text-slate-700'
                  }`}
                >
                  {role}
                  {role === currentUser.role && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
