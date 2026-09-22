import type { ReactNode } from 'react'

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendTone = 'success',
}: {
  label: string
  value: ReactNode
  icon: ReactNode
  trend?: string
  trendTone?: 'success' | 'warning' | 'neutral'
}) {
  const trendColor = trendTone === 'success' ? 'text-emerald-600' : trendTone === 'warning' ? 'text-amber-600' : 'text-slate-500'
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      {trend && <div className={`mt-1 text-xs font-medium ${trendColor}`}>{trend}</div>}
    </div>
  )
}
