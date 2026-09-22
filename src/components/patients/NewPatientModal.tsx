import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import { Button } from '../ui/Button'
import { FieldRow, Input, Label, Select, Textarea } from '../ui/Field'
import { Modal } from '../ui/Modal'

const emptyForm = {
  fullName: '',
  dob: '',
  sex: 'Female' as 'Female' | 'Male',
  phone: '',
  email: '',
  address: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  allergies: '',
  conditions: '',
}

export function NewPatientModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addPatient } = useAppData()
  const [form, setForm] = useState(emptyForm)
  const navigate = useNavigate()

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.fullName.trim() || !form.dob || !form.phone.trim()) return
    const created = addPatient({
      fullName: form.fullName.trim(),
      dob: form.dob,
      sex: form.sex,
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      address: form.address.trim() || undefined,
      emergencyContact: form.emergencyContactName.trim() && form.emergencyContactPhone.trim()
        ? {
            name: form.emergencyContactName.trim(),
            phone: form.emergencyContactPhone.trim(),
            relationship: form.emergencyContactRelationship.trim() || undefined,
          }
        : undefined,
      allergies: form.allergies ? form.allergies.split(',').map((s) => s.trim()).filter(Boolean) : [],
      conditions: form.conditions ? form.conditions.split(',').map((s) => s.trim()).filter(Boolean) : [],
      medications: [],
    })
    setForm(emptyForm)
    onClose()
    navigate(`/app/patients/${created.id}`)
  }

  return (
    <Modal open={open} onClose={onClose} title="Register New Patient" subtitle="A unique Patient ID is generated automatically on save." width="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldRow>
          <div>
            <Label required>Full name</Label>
            <Input required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="e.g. John Doe" />
          </div>
          <div>
            <Label required>Date of birth</Label>
            <Input required type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} />
          </div>
        </FieldRow>

        <FieldRow>
          <div>
            <Label required>Sex</Label>
            <Select value={form.sex} onChange={(e) => update('sex', e.target.value as 'Female' | 'Male')}>
              <option>Female</option>
              <option>Male</option>
            </Select>
          </div>
          <div>
            <Label required>Phone number</Label>
            <Input required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="0803 000 0000" />
          </div>
        </FieldRow>

        <FieldRow>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="optional" />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="optional" />
          </div>
        </FieldRow>

        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="mb-3 text-xs font-medium text-slate-500">Emergency contact (optional)</p>
          <FieldRow>
            <div>
              <Label>Contact name</Label>
              <Input value={form.emergencyContactName} onChange={(e) => update('emergencyContactName', e.target.value)} placeholder="e.g. Jane Doe" />
            </div>
            <div>
              <Label>Contact phone</Label>
              <Input value={form.emergencyContactPhone} onChange={(e) => update('emergencyContactPhone', e.target.value)} placeholder="0803 000 0000" />
            </div>
          </FieldRow>
          <div className="mt-4">
            <Label>Relationship to patient</Label>
            <Input
              value={form.emergencyContactRelationship}
              onChange={(e) => update('emergencyContactRelationship', e.target.value)}
              placeholder="e.g. Spouse, Parent, Sibling"
            />
          </div>
        </div>

        <div>
          <Label>Known allergies</Label>
          <Input value={form.allergies} onChange={(e) => update('allergies', e.target.value)} placeholder="comma-separated, e.g. Penicillin, Sulfa" />
        </div>
        <div>
          <Label>Existing conditions</Label>
          <Textarea rows={2} value={form.conditions} onChange={(e) => update('conditions', e.target.value)} placeholder="comma-separated, e.g. Hypertension" />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Register &amp; open profile
          </Button>
        </div>
      </form>
    </Modal>
  )
}
