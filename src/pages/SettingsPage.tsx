import { Check, Palette } from 'lucide-react'
import { useState } from 'react'
import { RoleGuard } from '../components/layout/RoleGuard'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { FieldRow, Input, Label } from '../components/ui/Field'
import { useAppData } from '../context/AppDataContext'

const brandOptions = ['#0f9d6a', '#0ea5e9', '#7c3aed', '#dc2626', '#ea580c']

export function SettingsPage() {
  return (
    <RoleGuard allow={['Organisation Admin']}>
      <SettingsPageContent />
    </RoleGuard>
  )
}

function SettingsPageContent() {
  const { organisation, updateOrganisation } = useAppData()
  const [form, setForm] = useState(organisation)
  const [saved, setSaved] = useState(false)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updateOrganisation(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-500">Organisation information and workspace branding</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader title="Company Information" subtitle="Shown across your workspace and on patient-facing documents" />
          <div className="space-y-4 p-5">
            <FieldRow>
              <div>
                <Label required>Pharmacy name</Label>
                <Input required value={form.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <div>
                <Label>Short name</Label>
                <Input value={form.shortName} onChange={(e) => update('shortName', e.target.value)} />
              </div>
            </FieldRow>
            <FieldRow>
              <div>
                <Label required>Phone</Label>
                <Input required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
              <div>
                <Label required>Email</Label>
                <Input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
            </FieldRow>
            <div>
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => update('address', e.target.value)} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Workspace Branding" subtitle="Your organisation keeps its own identity on the platform" />
          <div className="space-y-4 p-5">
            <div>
              <Label>Workspace subdomain</Label>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                {form.subdomain}
              </div>
            </div>
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
                <span className="ml-2 inline-flex items-center gap-1.5 text-xs text-slate-400">
                  <Palette size={13} /> Applied live to primary buttons, the active nav state &amp; the sidebar mark
                </span>
              </div>
            </div>
            <div>
              <Label>Plan</Label>
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                {form.plan} plan
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {saved && <span className="text-xs font-medium text-emerald-600">Saved</span>}
          <Button type="submit" variant="primary">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
