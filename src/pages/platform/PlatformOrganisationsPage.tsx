import { Building2, CheckCircle2, Plus } from 'lucide-react'
import { useState } from 'react'
import { NewOrganisationModal } from '../../components/platform/NewOrganisationModal'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { usePlatformData } from '../../context/PlatformContext'

const planTone: Record<string, 'neutral' | 'info' | 'brand'> = {
  Starter: 'neutral',
  Growth: 'info',
  Enterprise: 'brand',
}

export function PlatformOrganisationsPage() {
  const { tenants, setOrganisationStatus } = usePlatformData()
  const [createOpen, setCreateOpen] = useState(false)
  const [justCreated, setJustCreated] = useState<{ name: string; subdomain: string } | null>(null)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Organisations</h1>
          <p className="mt-0.5 text-sm text-slate-500">{tenants.length} organisation{tenants.length === 1 ? '' : 's'} on the platform</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <Plus size={16} />
          New Organisation
        </button>
      </div>

      {justCreated && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
          <p className="text-sm text-emerald-800">
            <span className="font-medium">{justCreated.name}</span> is live at{' '}
            <span className="font-mono text-xs">{justCreated.subdomain}</span>. Their admin can sign in from the client login screen now.
          </p>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Organisation</th>
                <th className="px-5 py-3 font-medium">Subdomain</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Staff</th>
                <th className="px-5 py-3 font-medium">Patients</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((t) => (
                <tr key={t.id} className={`hover:bg-slate-50 ${t.organisation.status === 'suspended' ? 'opacity-60' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: t.organisation.brandColor }}
                      >
                        <Building2 size={15} />
                      </span>
                      <div>
                        <p className="font-medium text-slate-800">{t.organisation.name}</p>
                        <p className="text-xs text-slate-400">{t.organisation.patientIdPrefix}-prefixed records</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{t.organisation.subdomain}</td>
                  <td className="px-5 py-3">
                    <Badge tone={planTone[t.organisation.plan] ?? 'neutral'}>{t.organisation.plan}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={t.organisation.status === 'suspended' ? 'danger' : 'success'} dot>
                      {t.organisation.status === 'suspended' ? 'Suspended' : 'Active'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{t.staff.length}</td>
                  <td className="px-5 py-3 text-slate-600">{t.patients.length}</td>
                  <td className="px-5 py-3">
                    {t.organisation.status === 'suspended' ? (
                      <button
                        onClick={() => setOrganisationStatus(t.id, 'active')}
                        className="text-xs font-medium text-emerald-700 hover:underline"
                      >
                        Reactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => setOrganisationStatus(t.id, 'suspended')}
                        className="text-xs font-medium text-rose-600 hover:underline"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <NewOrganisationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(name, subdomain) => setJustCreated({ name, subdomain })}
      />
    </div>
  )
}
