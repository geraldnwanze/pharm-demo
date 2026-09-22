import { CalendarClock, Stethoscope, Users } from 'lucide-react'
import { useMemo } from 'react'
import { RoleGuard } from '../components/layout/RoleGuard'
import { Badge } from '../components/ui/Badge'
import { Card, CardHeader } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import { useAppData } from '../context/AppDataContext'
import { initials, timeAgo } from '../lib/format'
import type { EncounterKind } from '../types'

const MONTH_PREFIX = '2026-09'

export function ReportsPage() {
  return (
    <RoleGuard allow={['Organisation Admin']}>
      <ReportsPageContent />
    </RoleGuard>
  )
}

function ReportsPageContent() {
  const { patients, staff } = useAppData()

  const stats = useMemo(() => {
    const totalPatients = patients.length
    const activePatients = patients.filter((p) => p.status === 'active').length
    const newThisMonth = patients.filter((p) => p.registeredAt.startsWith(MONTH_PREFIX)).length
    const totalEncounters = patients.reduce((acc, p) => acc + p.encounters.length, 0)
    const allFollowUps = patients.flatMap((p) => p.followUps)
    const completed = allFollowUps.filter((f) => f.status === 'completed').length
    const overdue = allFollowUps.filter((f) => f.status === 'overdue').length
    const pending = allFollowUps.filter((f) => f.status === 'pending').length
    const completionRate = allFollowUps.length ? Math.round((completed / allFollowUps.length) * 100) : 0
    return { totalPatients, activePatients, newThisMonth, totalEncounters, completed, overdue, pending, completionRate, totalFollowUps: allFollowUps.length }
  }, [patients])

  const encountersByType = useMemo(() => {
    const counts = new Map<EncounterKind, number>()
    for (const p of patients) {
      for (const e of p.encounters) {
        counts.set(e.kind, (counts.get(e.kind) ?? 0) + 1)
      }
    }
    const max = Math.max(1, ...counts.values())
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([kind, count]) => ({ kind, count, pct: Math.round((count / max) * 100) }))
  }, [patients])

  const staffActivity = useMemo(() => {
    return staff.map((s) => {
      const encountersLogged = patients.reduce((acc, p) => acc + p.encounters.filter((e) => e.clinician === s.name).length, 0)
      const followUpsAssigned = patients.reduce((acc, p) => acc + p.followUps.filter((f) => f.assignedTo === s.name).length, 0)
      return { ...s, encountersLogged, followUpsAssigned }
    }).sort((a, b) => b.encountersLogged - a.encountersLogged)
  }, [patients, staff])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Reports</h1>
        <p className="mt-0.5 text-sm text-slate-500">Patient, encounter and staff activity across this workspace</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Patients" value={stats.totalPatients} icon={<Users size={16} />} trend={`${stats.activePatients} active`} trendTone="neutral" />
        <StatCard label="New Patients" value={stats.newThisMonth} icon={<Users size={16} />} trend="This month" trendTone="neutral" />
        <StatCard label="Total Encounters" value={stats.totalEncounters} icon={<Stethoscope size={16} />} trend="All time" trendTone="neutral" />
        <StatCard
          label="Follow-Up Completion"
          value={`${stats.completionRate}%`}
          icon={<CalendarClock size={16} />}
          trend={stats.overdue > 0 ? `${stats.overdue} overdue` : 'On track'}
          trendTone={stats.overdue > 0 ? 'warning' : 'success'}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader title="Encounters by Type" subtitle="All recorded encounters, grouped by kind" />
          <div className="space-y-4 p-5">
            {encountersByType.length === 0 ? (
              <p className="text-sm text-slate-400">No encounters recorded yet.</p>
            ) : (
              encountersByType.map((item) => (
                <div key={item.kind}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{item.kind}</span>
                    <span className="text-slate-400">{item.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Follow-Up Status" subtitle={`${stats.totalFollowUps} scheduled in total`} />
          <div className="space-y-3 p-5">
            <StatusRow label="Completed" count={stats.completed} total={stats.totalFollowUps} tone="success" />
            <StatusRow label="Pending" count={stats.pending} total={stats.totalFollowUps} tone="warning" />
            <StatusRow label="Overdue" count={stats.overdue} total={stats.totalFollowUps} tone="danger" />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Staff Activity" subtitle="Encounters documented and follow-ups assigned per staff member" />
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Staff</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Encounters Logged</th>
                <th className="px-5 py-3 font-medium">Follow-Ups Assigned</th>
                <th className="px-5 py-3 font-medium">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffActivity.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                        {initials(s.name)}
                      </span>
                      <span className="font-medium text-slate-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{s.role}</td>
                  <td className="px-5 py-3 text-slate-600">{s.encountersLogged}</td>
                  <td className="px-5 py-3 text-slate-600">{s.followUpsAssigned}</td>
                  <td className="px-5 py-3 text-slate-500">{s.lastActive === '—' ? '—' : timeAgo(s.lastActive)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function StatusRow({ label, count, total, tone }: { label: string; count: number; total: number; tone: 'success' | 'warning' | 'danger' }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center justify-between gap-3">
      <Badge tone={tone} dot>
        {label}
      </Badge>
      <div className="flex flex-1 items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${tone === 'success' ? 'bg-emerald-500' : tone === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="w-16 shrink-0 text-right text-xs text-slate-500">
          {count}/{total}
        </span>
      </div>
    </div>
  )
}
