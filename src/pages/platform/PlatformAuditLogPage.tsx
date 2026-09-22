import { FileClock } from 'lucide-react'
import { Card, CardHeader } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { usePlatformData } from '../../context/PlatformContext'
import { formatDateTime, initials } from '../../lib/format'

export function PlatformAuditLogPage() {
  const { platformAuditLog } = usePlatformData()

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Platform Audit Log</h1>
        <p className="mt-0.5 text-sm text-slate-500">Organisation onboarding and platform-level actions — not any organisation's clinical activity</p>
      </div>

      <Card>
        <CardHeader title="Recent Activity" subtitle={`${platformAuditLog.length} logged actions`} />
        {platformAuditLog.length === 0 ? (
          <EmptyState icon={<FileClock size={20} />} title="No activity logged yet" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {platformAuditLog.map((entry) => (
              <li key={entry.id} className="flex items-start gap-3 px-5 py-3.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
                  {initials(entry.actor)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-800">
                    <span className="font-medium">{entry.actor}</span> · {entry.action}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{entry.target}</p>
                </div>
                <span className="shrink-0 whitespace-nowrap text-xs text-slate-400">{formatDateTime(entry.timestamp)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
