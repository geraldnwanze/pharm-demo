import { Activity, LogOut, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import { navItems } from './navItems'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { organisation, currentUser } = useAppData()

  useEffect(() => {
    document.documentElement.style.setProperty('--brand', organisation.brandColor)
  }, [organisation.brandColor])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-72 bg-white p-3">
            <div className="mb-2 flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
                  <Activity size={16} />
                </div>
                <span className="text-sm font-semibold text-slate-900">{organisation.shortName}</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-0.5">
              {navItems
                .filter((item) => item.roles.includes(currentUser.role))
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive ? 'bg-[color-mix(in_srgb,var(--brand)_12%,white)] text-[var(--brand)]' : 'text-slate-600'
                      }`
                    }
                  >
                    <item.icon size={17} />
                    {item.label}
                  </NavLink>
                ))}
            </nav>
            <NavLink
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              <LogOut size={17} />
              Switch organisation
            </NavLink>
          </div>
          <div className="flex-1 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex min-h-screen w-full flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
