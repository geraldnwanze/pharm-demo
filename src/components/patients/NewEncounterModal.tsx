import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import type { EncounterKind } from '../../types'
import { Button } from '../ui/Button'
import { FieldRow, Input, Label, Select, Textarea } from '../ui/Field'
import { Modal } from '../ui/Modal'

const kinds: EncounterKind[] = ['Consultation', 'New Consultation', 'Medication Review', 'Chronic Care Review']

export function NewEncounterModal({ open, onClose, patientId, patientName }: { open: boolean; onClose: () => void; patientId: string; patientName: string }) {
  const { addEncounter, currentUser } = useAppData()
  const [kind, setKind] = useState<EncounterKind>('Consultation')
  const [notes, setNotes] = useState('')
  const [bp, setBp] = useState('')
  const [temp, setTemp] = useState('')
  const [weight, setWeight] = useState('')

  function reset() {
    setKind('Consultation')
    setNotes('')
    setBp('')
    setTemp('')
    setWeight('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!notes.trim()) return
    addEncounter(patientId, {
      kind,
      date: new Date().toISOString().slice(0, 10),
      clinician: currentUser.name,
      notes: notes.trim(),
      vitals: bp || temp || weight ? { bp: bp || undefined, temp: temp || undefined, weight: weight || undefined } : undefined,
    })
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New Encounter" subtitle={`${patientName} · logged under today's date`} width="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label required>Encounter type</Label>
          <Select value={kind} onChange={(e) => setKind(e.target.value as EncounterKind)}>
            {kinds.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Blood pressure</Label>
            <Input value={bp} onChange={(e) => setBp(e.target.value)} placeholder="120/80" />
          </div>
          <div>
            <Label>Temperature</Label>
            <Input value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="36.6°C" />
          </div>
          <div>
            <Label>Weight</Label>
            <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70kg" />
          </div>
        </div>

        <div>
          <Label required>Clinical notes</Label>
          <Textarea required rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Document presenting complaint, assessment and plan…" />
        </div>

        <FieldRow>
          <div>
            <Label>Attending clinician</Label>
            <Input value={currentUser.name} disabled />
          </div>
          <div>
            <Label>Patient</Label>
            <Input value={patientId} disabled />
          </div>
        </FieldRow>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save encounter
          </Button>
        </div>
      </form>
    </Modal>
  )
}
