import { BarChart3, CalendarClock, ClipboardList, Search, UserPlus, Users, UserRoundPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NewEncounterModal } from '../components/patients/NewEncounterModal'
import { NewFollowUpModal } from '../components/patients/NewFollowUpModal'
import { NewPatientModal } from '../components/patients/NewPatientModal'
import { Badge } from '../components/ui/Badge'
import { Card, CardHeader } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { StatCard } from '../components/ui/StatCard'
import { useAppData } from '../context/AppDataContext'
import { formatDate, initials, timeAgo } from '../lib/format'

const TODAY = '2026-09-22'
const MONTH_PREFIX = '2026-09'

export function DashboardPage() {
  const { patients, currentUser, organisation } = useAppData()
  const [newPatientOpen, setNewPatientOpen] = useState(false)
  const [encounterTarget, setEncounterTarget] = useState<string | null>(null)
  const [followUpTarget, setFollowUpTarget] = useState<string | null>(null)

  const stats = useMemo(() => {
    const totalPatients = patients.length
    const newThisMonth = patients.filter((p) => p.registeredAt.startsWith(MONTH_PREFIX)).length
    const todaysEncounters = patients.reduce((acc, p) => acc + p.encounters.filter((e) => e.date === TODAY).length, 0)
    const pendingFollowUps = patients.reduce((acc, p) => acc + p.followUps.filter((f) => f.status !== 'completed').length, 0)
    return { totalPatients, newThisMonth, todaysEncounters, pendingFollowUps }
  }, [patients])

  const activity = useMemo(() => {
    type Item = { id: string; patientId: string; patientName: string; label: string; date: string; tone: 'success' | 'info' | 'warning' }
    const items: Item[] = []
    for (const p of patients) {
      for (const e of p.encounters) {
        items.push({ id: e.id, patientId: p.id, patientName: p.fullName, label: `${e.kind} documented by ${e.clinician}`, date: e.date, tone: 'info' })
      }
      for (const f of p.followUps) {
        items.push({
          id: f.id,
          patientId: p.id,
          patientName: p.fullName,
          label: f.status === 'completed' ? 'Follow-up completed' : `Follow-up scheduled — ${f.reason}`,
          date: f.date,
          tone: f.status === 'overdue' ? 'warning' : 'success',
        })
      }
    }
    return items.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 7)
  }, [patients])

  const followUpsQueue = useMemo(
    () =>
      patients
        .flatMap((p) => p.followUps.filter((f) => f.status !== 'completed').map((f) => ({ ...f, patientName: p.fullName, patientId: p.id })))
        .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))
        .slice(0, 5),
    [patients],
  )

  const activePatient = encounterTarget ? patients.find((p) => p.id === encounterTarget) : undefined
  const followUpPatient = followUpTarget ? patients.find((p) => p.id === followUpTarget) : undefined

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Welcome back, {currentUser.name.split(' ')[0]}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {organisation.name} · {formatDate(TODAY)} overview
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setNewPatientOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3.5 py-2 text-sm font-medium text-white shadow-sm shadow-black/10 hover:brightness-90"
          >
            <UserRoundPlus size={16} />
            Register Patient
          </button>
          <Link
            to="/app/patients"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Search size={16} />
            Search Patient
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Patients" value={stats.totalPatients} icon={<Users size={16} />} trend={`+${stats.newThisMonth} this month`} />
        <StatCard label="New Patients" value={stats.newThisMonth} icon={<UserPlus size={16} />} trend="Sept 2026" trendTone="neutral" />
        <StatCard label="Today's Encounters" value={stats.todaysEncounters} icon={<ClipboardList size={16} />} trend="Logged today" trendTone="neutral" />
        <StatCard
          label="Pending Follow-ups"
          value={stats.pendingFollowUps}
          icon={<CalendarClock size={16} />}
          trend={stats.pendingFollowUps > 0 ? 'Needs attention' : 'All clear'}
          trendTone={stats.pendingFollowUps > 0 ? 'warning' : 'success'}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader title="Recent Patient Activity" subtitle="Encounters and follow-ups across your workspace" />
            {activity.length === 0 ? (
              <EmptyState icon={<ClipboardList size={20} />} title="No activity yet" description="Encounters and follow-ups will appear here." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {activity.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {initials(item.patientName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link to={`/app/patients/${item.patientId}`} className="truncate text-sm font-medium text-slate-800 hover:text-emerald-700">
                        {item.patientName}
                      </Link>
                      <p className="truncate text-xs text-slate-500">{item.label}</p>
                    </div>
                    <Badge tone={item.tone}>{formatDate(item.date)}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Quick Actions" subtitle="Common tasks for busy pharmacy staff" />
            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
              <QuickAction icon={<UserRoundPlus size={18} />} label="Register Patient" onClick={() => setNewPatientOpen(true)} />
              <QuickAction
                icon={<ClipboardList size={18} />}
                label="New Consultation"
                onClick={() => patients[0] && setEncounterTarget(patients[0].id)}
              />
              <QuickAction icon={<CalendarClock size={18} />} label="Follow-Up" onClick={() => patients[0] && setFollowUpTarget(patients[0].id)} />
              <Link to="/app/patients" className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 px-3 py-4 text-center hover:bg-slate-50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Search size={18} />
                </span>
                <span className="text-xs font-medium text-slate-700">Search Patient</span>
              </Link>
              {currentUser.role === 'Organisation Admin' && (
                <Link to="/app/reports" className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 px-3 py-4 text-center hover:bg-slate-50">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <BarChart3 size={18} />
                  </span>
                  <span className="text-xs font-medium text-slate-700">Reports</span>
                </Link>
              )}
            </div>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader title="Pending Follow-Ups" subtitle="Sorted by due date" />
          {followUpsQueue.length === 0 ? (
            <EmptyState icon={<CalendarClock size={20} />} title="Nothing due" description="All follow-ups are completed." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {followUpsQueue.map((f) => (
                <li key={f.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <Link to={`/app/patients/${f.patientId}`} className="text-sm font-medium text-slate-800 hover:text-emerald-700">
                      {f.patientName}
                    </Link>
                    <Badge tone={f.status === 'overdue' ? 'danger' : 'warning'}>{f.status === 'overdue' ? 'Overdue' : 'Due'}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{f.reason}</p>
                  <p className="mt-1 text-[11px] text-slate-400">Due {formatDate(f.dueDate)} · {timeAgo(f.date)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <NewPatientModal open={newPatientOpen} onClose={() => setNewPatientOpen(false)} />
      {activePatient && (
        <NewEncounterModal open onClose={() => setEncounterTarget(null)} patientId={activePatient.id} patientName={activePatient.fullName} />
      )}
      {followUpPatient && (
        <NewFollowUpModal open onClose={() => setFollowUpTarget(null)} patientId={followUpPatient.id} patientName={followUpPatient.fullName} />
      )}
    </div>
  )
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 px-3 py-4 text-center hover:bg-slate-50">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">{icon}</span>
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </button>
  )
}
