import { FileClock, LayoutDashboard, LogOut, ShieldAlert, Sparkles, UsersRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/platform', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/platform/organisations', label: 'Organisations', icon: UsersRound },
  { to: '/platform/audit-log', label: 'Audit Log', icon: FileClock },
]

export function PlatformShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:flex">
        <div className="flex items-center gap-2.5 border-b border-slate-800 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-white">
            <Sparkles size={18} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Earlybird AlphaForge</p>
            <p className="truncate text-[11px] text-slate-400">Platform Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/platform'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-2 rounded-lg bg-slate-800/60 px-3 py-2.5">
            <ShieldAlert size={15} className="shrink-0 text-amber-400" />
            <p className="text-[11px] leading-snug text-slate-400">
              No patient clinical data is accessible from this console — only organisation-level metadata.
            </p>
          </div>
          <NavLink
            to="/login"
            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-300"
          >
            <LogOut size={13} />
            Exit to client login
          </NavLink>
        </div>
      </aside>

      <div className="flex h-screen w-full flex-1 flex-col overflow-y-auto">
        <header className="border-b border-slate-800 bg-slate-900 px-4 py-3 sm:px-6 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
              <Sparkles size={16} />
            </div>
            <span className="text-sm font-semibold text-white">Platform Admin</span>
          </div>
          <nav className="mt-3 flex gap-1.5 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/platform'}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
                    isActive ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-400 hover:bg-slate-800'
                  }`
                }
              >
                <item.icon size={14} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="flex-1 bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
