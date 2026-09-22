import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardPlus,
  Lock,
  Pill,
  Stethoscope,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { NewEncounterModal } from '../components/patients/NewEncounterModal'
import { NewFollowUpModal } from '../components/patients/NewFollowUpModal'
import { TimelineEntryModal, type TimelineEntry } from '../components/patients/TimelineEntryModal'
import { Badge } from '../components/ui/Badge'
import { Card, CardHeader } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { useAppData } from '../context/AppDataContext'
import { age, formatDate, truncate } from '../lib/format'

export function PatientProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { getPatient, currentUser, completeFollowUp } = useAppData()
  const [encounterOpen, setEncounterOpen] = useState(false)
  const [followUpOpen, setFollowUpOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null)

  const patient = id ? getPatient(id) : undefined
  const canViewClinical = currentUser.role !== 'Support Staff'

  const timeline = useMemo(() => {
    if (!patient) return []
    type Item = {
      id: string
      date: string
      kind: 'encounter' | 'followup'
      title: string
      body?: string
      meta?: string
      tone: 'success' | 'warning' | 'info' | 'neutral'
      entry: TimelineEntry
    }
    const items: Item[] = [
      ...patient.encounters.map((e) => ({
        id: e.id,
        date: e.date,
        kind: 'encounter' as const,
        title: e.kind,
        body: e.notes,
        meta: e.clinician,
        tone: 'info' as const,
        entry: { kind: 'encounter', data: e } as TimelineEntry,
      })),
      ...patient.followUps.map((f) => ({
        id: f.id,
        date: f.date,
        kind: 'followup' as const,
        title: f.status === 'completed' ? 'Follow-up completed' : 'Follow-up scheduled',
        body: f.reason,
        meta: `Due ${formatDate(f.dueDate)} · ${f.assignedTo}`,
        tone: f.status === 'overdue' ? 'warning' as const : f.status === 'completed' ? 'success' as const : 'neutral' as const,
        entry: { kind: 'followup', data: f } as TimelineEntry,
      })),
    ]
    return items.sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [patient])

  if (!id) return <Navigate to="/app/patients" replace />
  if (!patient) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState icon={<AlertTriangle size={20} />} title="Patient not found" description={`No record matches ${id} in this workspace.`} />
      </div>
    )
  }

  const pendingFollowUps = patient.followUps.filter((f) => f.status !== 'completed')

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link to="/app/patients" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft size={15} /> Back to Patients
      </Link>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand)] text-lg font-semibold text-white">
              {patient.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold text-slate-900">{patient.fullName}</h1>
                <Badge tone={patient.status === 'active' ? 'success' : 'neutral'} dot>
                  {patient.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="mt-0.5 font-mono text-xs text-slate-500">{patient.id}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>{age(patient.dob)} yrs · {patient.sex}</span>
                <span>{patient.phone}</span>
                {patient.email && <span>{patient.email}</span>}
                {patient.address && <span>{patient.address}</span>}
              </div>
              {patient.emergencyContact && (
                <p className="mt-1.5 text-xs text-slate-500">
                  <span className="font-medium text-slate-600">Emergency contact:</span> {patient.emergencyContact.name}
                  {patient.emergencyContact.relationship && ` (${patient.emergencyContact.relationship})`} · {patient.emergencyContact.phone}
                </p>
              )}
              {canViewClinical && patient.allergies.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                  <AlertTriangle size={13} />
                  Allergic to {patient.allergies.join(', ')}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setEncounterOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-medium text-white hover:brightness-90"
            >
              <Stethoscope size={14} /> New Encounter
            </button>
            <button
              onClick={() => setFollowUpOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <CalendarClock size={14} /> Follow-Up
            </button>
            <button
              disabled={!canViewClinical}
              title={canViewClinical ? undefined : 'Editing clinical records requires Pharmacist or Admin access'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ClipboardPlus size={14} /> Edit Profile
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader title="Patient Timeline" subtitle="Every encounter and follow-up, most recent first" />
            {timeline.length === 0 ? (
              <EmptyState icon={<Stethoscope size={20} />} title="No encounters yet" description="Start the record with this patient's first encounter." />
            ) : (
              <ol className="relative space-y-0 px-5 py-4">
                {timeline.map((item, idx) => {
                  const clickable = item.kind === 'followup' || canViewClinical
                  return (
                    <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {idx < timeline.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-slate-200" />}
                      <span
                        className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          item.kind === 'encounter' ? 'bg-sky-100 text-sky-700' : item.tone === 'success' ? 'bg-emerald-100 text-emerald-700' : item.tone === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.kind === 'encounter' ? <Stethoscope size={14} /> : item.tone === 'success' ? <CheckCircle2 size={14} /> : <CalendarClock size={14} />}
                      </span>
                      <button
                        type="button"
                        disabled={!clickable}
                        onClick={() => setSelectedEntry(item.entry)}
                        className="min-w-0 flex-1 rounded-lg text-left disabled:cursor-not-allowed"
                      >
                        <div className="group flex items-start justify-between gap-2 rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors hover:bg-slate-50">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-medium text-slate-800">{item.title}</p>
                              <span className="text-xs text-slate-400">{formatDate(item.date)}</span>
                            </div>
                            {item.meta && <p className="mt-0.5 text-xs text-slate-400">{item.meta}</p>}
                            {item.body && (
                              clickable ? (
                                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{truncate(item.body, 110)}</p>
                              ) : (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs italic text-slate-400">
                                  <Lock size={12} /> Clinical notes restricted to Pharmacist / Admin roles
                                </p>
                              )
                            )}
                          </div>
                          {clickable && (
                            <ChevronRight size={16} className="mt-0.5 shrink-0 text-slate-300 group-hover:text-slate-500" />
                          )}
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ol>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Clinical Summary" />
            {canViewClinical ? (
              <div className="space-y-4 p-5">
                <SummaryList label="Conditions" items={patient.conditions} empty="No known conditions" />
                <SummaryList label="Current Medications" items={patient.medications} empty="No active medications" icon={<Pill size={13} />} />
                <SummaryList label="Allergies" items={patient.allergies} empty="No known allergies" tone="danger" />
              </div>
            ) : (
              <div className="p-5">
                <EmptyState icon={<Lock size={18} />} title="Restricted" description="Clinical details are only visible to Pharmacist and Organisation Admin roles." />
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Follow-Ups" subtitle={`${pendingFollowUps.length} pending`} />
            {patient.followUps.length === 0 ? (
              <EmptyState icon={<CalendarClock size={18} />} title="None scheduled" />
            ) : (
              <ul className="divide-y divide-slate-100">
                {patient.followUps.map((f) => (
                  <li key={f.id} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone={f.status === 'completed' ? 'success' : f.status === 'overdue' ? 'danger' : 'warning'}>
                        {f.status}
                      </Badge>
                      <span className="text-xs text-slate-400">Due {formatDate(f.dueDate)}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-700">{f.reason}</p>
                    <p className="mt-0.5 text-xs text-slate-400">Assigned to {f.assignedTo}</p>
                    {f.status !== 'completed' && (
                      <button
                        onClick={() => completeFollowUp(patient.id, f.id)}
                        className="mt-2 text-xs font-medium text-emerald-700 hover:underline"
                      >
                        Mark as completed
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <NewEncounterModal open={encounterOpen} onClose={() => setEncounterOpen(false)} patientId={patient.id} patientName={patient.fullName} />
      <NewFollowUpModal open={followUpOpen} onClose={() => setFollowUpOpen(false)} patientId={patient.id} patientName={patient.fullName} />
      <TimelineEntryModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        patientId={patient.id}
        patientName={patient.fullName}
        canViewClinical={canViewClinical}
      />
    </div>
  )
}

function SummaryList({ label, items, empty, tone, icon }: { label: string; items: string[]; empty: string; tone?: 'danger'; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">{empty}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <Badge key={item} tone={tone ?? 'neutral'}>
              <span className="inline-flex items-center gap-1">
                {icon}
                {item}
              </span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
