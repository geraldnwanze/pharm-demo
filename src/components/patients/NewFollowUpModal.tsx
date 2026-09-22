import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { Button } from '../ui/Button'
import { FieldRow, Input, Label, Textarea } from '../ui/Field'
import { Modal } from '../ui/Modal'

export function NewFollowUpModal({ open, onClose, patientId, patientName }: { open: boolean; onClose: () => void; patientId: string; patientName: string }) {
  const { addFollowUp, currentUser } = useAppData()
  const [dueDate, setDueDate] = useState('')
  const [reason, setReason] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dueDate || !reason.trim()) return
    addFollowUp(patientId, {
      date: new Date().toISOString().slice(0, 10),
      dueDate,
      reason: reason.trim(),
      assignedTo: currentUser.name,
    })
    setDueDate('')
    setReason('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule Follow-Up" subtitle={patientName} width="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label required>Due date</Label>
          <Input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div>
          <Label required>Reason</Label>
          <Textarea required rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. BP recheck after medication change" />
        </div>
        <FieldRow>
          <div>
            <Label>Assigned to</Label>
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
            Schedule follow-up
          </Button>
        </div>
      </form>
    </Modal>
  )
}
