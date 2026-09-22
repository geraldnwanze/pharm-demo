import { ArrowUpRight, Search, UserRoundPlus, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NewPatientModal } from '../components/patients/NewPatientModal'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { useAppData } from '../context/AppDataContext'
import { age, formatDate, initials } from '../lib/format'

type StatusFilter = 'all' | 'active' | 'inactive'

export function PatientsPage() {
  const { patients } = useAppData()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [newPatientOpen, setNewPatientOpen] = useState(false)

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesQuery =
        !query.trim() ||
        p.fullName.toLowerCase().includes(query.toLowerCase()) ||
        p.id.toLowerCase().includes(query.toLowerCase()) ||
        p.phone.includes(query)
      const matchesStatus = status === 'all' || p.status === status
      return matchesQuery && matchesStatus
    })
  }, [patients, query, status])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Patients</h1>
          <p className="mt-0.5 text-sm text-slate-500">{patients.length} patient records in this workspace</p>
        </div>
        <button
          onClick={() => setNewPatientOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700"
        >
          <UserRoundPlus size={16} />
          Register Patient
        </button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, name or phone…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'active', 'inactive'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${
                  status === s ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Users size={20} />}
            title="No patients found"
            description="Try a different search term, or register a new patient."
            action={
              <button onClick={() => setNewPatientOpen(true)} className="text-sm font-medium text-emerald-700 hover:underline">
                + Register a patient
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Patient ID</th>
                  <th className="px-5 py-3 font-medium">Age / Sex</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Registered</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="group hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                          {initials(p.fullName)}
                        </span>
                        <Link to={`/patients/${p.id}`} className="font-medium text-slate-800 group-hover:text-emerald-700">
                          {p.fullName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{p.id}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {age(p.dob)} yrs · {p.sex}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{p.phone}</td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(p.registeredAt)}</td>
                    <td className="px-5 py-3">
                      <Badge tone={p.status === 'active' ? 'success' : 'neutral'} dot>
                        {p.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/patients/${p.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-700 lg:opacity-0 lg:group-hover:opacity-100"
                      >
                        View <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <NewPatientModal open={newPatientOpen} onClose={() => setNewPatientOpen(false)} />
    </div>
  )
}
