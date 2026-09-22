import { Activity, CalendarClock, Lock, Stethoscope, Thermometer, User, Weight } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { formatDate } from '../../lib/format'
import type { Encounter, FollowUp } from '../../types'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'

export type TimelineEntry =
  | { kind: 'encounter'; data: Encounter }
  | { kind: 'followup'; data: FollowUp }

export function TimelineEntryModal({
  entry,
  onClose,
  patientId,
  patientName,
  canViewClinical,
}: {
  entry: TimelineEntry | null
  onClose: () => void
  patientId: string
  patientName: string
  canViewClinical: boolean
}) {
  const { completeFollowUp } = useAppData()

  if (!entry) return null

  if (entry.kind === 'encounter') {
    const e = entry.data
    return (
      <Modal open onClose={onClose} title={e.kind} subtitle={`${patientName} · ${formatDate(e.date)}`} width="md">
        {!canViewClinical ? (
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-6 text-sm text-slate-500">
            <Lock size={15} /> Clinical notes are restricted to Pharmacist / Admin roles.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User size={14} className="text-slate-400" />
              Attended by <span className="font-medium text-slate-800">{e.clinician}</span>
            </div>

            {e.vitals && (e.vitals.bp || e.vitals.temp || e.vitals.weight) && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Vitals</p>
                <div className="grid grid-cols-3 gap-3">
                  {e.vitals.bp && <VitalChip icon={<Activity size={14} />} label="Blood pressure" value={e.vitals.bp} />}
                  {e.vitals.temp && <VitalChip icon={<Thermometer size={14} />} label="Temperature" value={e.vitals.temp} />}
                  {e.vitals.weight && <VitalChip icon={<Weight size={14} />} label="Weight" value={e.vitals.weight} />}
                </div>
              </div>
            )}

            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">Clinical notes</p>
              <p className="whitespace-pre-line rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{e.notes}</p>
            </div>
          </div>
        )}
      </Modal>
    )
  }

  const f = entry.data
  const toneTone = f.status === 'completed' ? 'success' : f.status === 'overdue' ? 'danger' : 'warning'
  return (
    <Modal open onClose={onClose} title="Follow-Up" subtitle={`${patientName} · scheduled ${formatDate(f.date)}`} width="sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge tone={toneTone} dot>
            {f.status}
          </Badge>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarClock size={13} /> Due {formatDate(f.dueDate)}
          </span>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">Reason</p>
          <p className="rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{f.reason}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User size={14} className="text-slate-400" />
          Assigned to <span className="font-medium text-slate-800">{f.assignedTo}</span>
        </div>

        {f.status !== 'completed' && (
          <button
            onClick={() => {
              completeFollowUp(patientId, f.id)
              onClose()
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3.5 py-2 text-sm font-medium text-white hover:brightness-90"
          >
            <Stethoscope size={14} /> Mark as completed
          </button>
        )}
      </div>
    </Modal>
  )
}

function VitalChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}
