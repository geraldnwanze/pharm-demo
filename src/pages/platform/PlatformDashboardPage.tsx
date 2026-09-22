import { Building2, FileClock, Plus, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NewOrganisationModal } from '../../components/platform/NewOrganisationModal'
import { Badge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { StatCard } from '../../components/ui/StatCard'
import { usePlatformData } from '../../context/PlatformContext'
import { formatDateTime } from '../../lib/format'

export function PlatformDashboardPage() {
  const { tenants, platformAuditLog } = usePlatformData()
  const [createOpen, setCreateOpen] = useState(false)

  const stats = useMemo(() => {
    const totalPatients = tenants.reduce((acc, t) => acc + t.patients.length, 0)
    const totalStaff = tenants.reduce((acc, t) => acc + t.staff.length, 0)
    const planCounts = tenants.reduce<Record<string, number>>((acc, t) => {
      acc[t.organisation.plan] = (acc[t.organisation.plan] ?? 0) + 1
      return acc
    }, {})
    return { totalPatients, totalStaff, planCounts }
  }, [tenants])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Platform Overview</h1>
          <p className="mt-0.5 text-sm text-slate-500">Earlybird AlphaForge · Healthcare Digital Solutions</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <Plus size={16} />
          New Organisation
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Organisations" value={tenants.length} icon={<Building2 size={16} />} trend="On platform" trendTone="neutral" />
        <StatCard label="Total Patients" value={stats.totalPatients} icon={<UsersRound size={16} />} trend="Across all orgs" trendTone="neutral" />
        <StatCard label="Total Staff" value={stats.totalStaff} icon={<UsersRound size={16} />} trend="Across all orgs" trendTone="neutral" />
        <StatCard
          label="Plan mix"
          value={Object.entries(stats.planCounts).map(([plan, count]) => `${count} ${plan}`).join(' · ') || '—'}
          icon={<FileClock size={16} />}
          trend="Subscription tiers"
          trendTone="neutral"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader
            title="Organisations"
            subtitle="Every workspace on the platform"
            action={
              <Link to="/platform/organisations" className="text-xs font-medium text-indigo-600 hover:underline">
                View all
              </Link>
            }
          />
          <ul className="divide-y divide-slate-100">
            {tenants.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: t.organisation.brandColor }}>
                  <Building2 size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{t.organisation.name}</p>
                  <p className="truncate font-mono text-xs text-slate-400">{t.organisation.subdomain}</p>
                </div>
                <Badge tone="neutral">{t.patients.length} patients</Badge>
                <Badge tone="neutral">{t.staff.length} staff</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Platform Activity" subtitle="Onboarding & platform-level actions" />
          <ul className="divide-y divide-slate-100">
            {platformAuditLog.slice(0, 6).map((entry) => (
              <li key={entry.id} className="px-5 py-3">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">{entry.action}</span>
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">{entry.target}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{formatDateTime(entry.timestamp)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <NewOrganisationModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => {}} />
    </div>
  )
}
