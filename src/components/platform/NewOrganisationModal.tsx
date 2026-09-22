import { Check } from 'lucide-react'
import { useState } from 'react'
import { usePlatformData } from '../../context/PlatformContext'
import { slugify } from '../../lib/format'
import type { Organisation } from '../../types'
import { Button } from '../ui/Button'
import { FieldRow, Input, Label, Select } from '../ui/Field'
import { Modal } from '../ui/Modal'

const brandOptions = ['#0f9d6a', '#0ea5e9', '#7c3aed', '#dc2626', '#ea580c']

const emptyForm = {
  name: '',
  shortName: '',
  subdomainSlug: '',
  patientIdPrefix: '',
  plan: 'Starter' as Organisation['plan'],
  brandColor: brandOptions[1],
  address: '',
  phone: '',
  email: '',
  adminName: '',
  adminEmail: '',
}

export function NewOrganisationModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (name: string, subdomain: string) => void }) {
  const { createOrganisation } = usePlatformData()
  const [form, setForm] = useState(emptyForm)
  const [touchedSlug, setTouchedSlug] = useState(false)
  const [touchedShortName, setTouchedShortName] = useState(false)

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      shortName: touchedShortName ? prev.shortName : name.split(' ')[0] || '',
      subdomainSlug: touchedSlug ? prev.subdomainSlug : slugify(name),
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.subdomainSlug.trim() || !form.patientIdPrefix.trim() || !form.adminName.trim() || !form.adminEmail.trim()) return
    const created = createOrganisation({
      name: form.name.trim(),
      shortName: form.shortName.trim() || form.name.trim(),
      subdomain: form.subdomainSlug.trim(),
      patientIdPrefix: form.patientIdPrefix.trim(),
      plan: form.plan,
      brandColor: form.brandColor,
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      adminName: form.adminName.trim(),
      adminEmail: form.adminEmail.trim(),
    })
    setForm(emptyForm)
    setTouchedSlug(false)
    setTouchedShortName(false)
    onClose()
    onCreated(created.organisation.name, created.organisation.subdomain)
  }

  return (
    <Modal open={open} onClose={onClose} title="New Organisation" subtitle="Create organisation → workspace → admin account, in one step" width="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldRow>
          <div>
            <Label required>Organisation name</Label>
            <Input required value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. XYZ Medical Centre" />
          </div>
          <div>
            <Label required>Short name</Label>
            <Input
              required
              value={form.shortName}
              onChange={(e) => {
                setTouchedShortName(true)
                update('shortName', e.target.value)
              }}
              placeholder="e.g. XYZ"
            />
          </div>
        </FieldRow>

        <div>
          <Label required>Workspace subdomain</Label>
          <div className="flex items-center gap-2">
            <Input
              required
              value={form.subdomainSlug}
              onChange={(e) => {
                setTouchedSlug(true)
                update('subdomainSlug', slugify(e.target.value))
              }}
              placeholder="xyz-medical"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Resolves to <span className="font-mono">{form.subdomainSlug || 'slug'}.care.earlybirdalphaforge.com</span>
          </p>
        </div>

        <FieldRow>
          <div>
            <Label required>Patient ID prefix</Label>
            <Input
              required
              value={form.patientIdPrefix}
              onChange={(e) => update('patientIdPrefix', e.target.value.toUpperCase().slice(0, 5))}
              placeholder="e.g. XYZ"
            />
            <p className="mt-1 text-xs text-slate-400">Patient IDs will read {form.patientIdPrefix || 'XYZ'}-000001, …</p>
          </div>
          <div>
            <Label required>Plan</Label>
            <Select value={form.plan} onChange={(e) => update('plan', e.target.value as Organisation['plan'])}>
              <option>Starter</option>
              <option>Growth</option>
              <option>Enterprise</option>
            </Select>
          </div>
        </FieldRow>

        <div>
          <Label>Brand colour</Label>
          <div className="mt-1 flex items-center gap-2">
            {brandOptions.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => update('brandColor', color)}
                className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-offset-2"
                style={{ backgroundColor: color, '--tw-ring-color': form.brandColor === color ? color : 'transparent' } as React.CSSProperties}
              >
                {form.brandColor === color && <Check size={14} className="text-white" />}
              </button>
            ))}
          </div>
        </div>

        <FieldRow>
          <div>
            <Label>Contact phone</Label>
            <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+234 800 000 0000" />
          </div>
          <div>
            <Label>Contact email</Label>
            <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="hello@example.ng" />
          </div>
        </FieldRow>
        <div>
          <Label>Address</Label>
          <Input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="optional" />
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="mb-3 text-xs font-medium text-slate-500">Initial Organisation Admin</p>
          <FieldRow>
            <div>
              <Label required>Admin name</Label>
              <Input required value={form.adminName} onChange={(e) => update('adminName', e.target.value)} placeholder="e.g. Chika Obi" />
            </div>
            <div>
              <Label required>Admin email</Label>
              <Input required type="email" value={form.adminEmail} onChange={(e) => update('adminEmail', e.target.value)} placeholder="admin@example.ng" />
            </div>
          </FieldRow>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Create organisation
          </button>
        </div>
      </form>
    </Modal>
  )
}
