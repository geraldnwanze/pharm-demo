import { Activity, ShieldCheck, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import { navItems } from './navItems'

export function Sidebar() {
  const { organisation, currentUser } = useAppData()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <Activity size={18} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{organisation.shortName}</p>
          <p className="truncate text-[11px] text-slate-400">Healthcare Digital Solutions</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems
          .filter((item) => item.roles.includes(currentUser.role))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
          <ShieldCheck size={15} className="shrink-0 text-emerald-600" />
          <p className="text-[11px] leading-snug text-slate-500">
            Data isolated to <span className="font-medium text-slate-700">{organisation.shortName}</span> workspace only
          </p>
        </div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-400 hover:bg-slate-50"
        >
          <Sparkles size={13} />
          Powered by Earlybird AlphaForge
        </a>
      </div>
    </aside>
  )
}
