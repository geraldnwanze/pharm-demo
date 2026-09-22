import { KeyRound, Mail, ShieldCheck, UserPlus, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { RoleGuard } from '../components/layout/RoleGuard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Input, Label, Select } from '../components/ui/Field'
import { Modal } from '../components/ui/Modal'
import { useAppData } from '../context/AppDataContext'
import { formatDate, initials, timeAgo } from '../lib/format'
import type { StaffRole } from '../types'

const roleDescriptions: Record<StaffRole, string> = {
  'Organisation Admin': 'Full access — settings, staff, reports, system configuration',
  Pharmacist: 'Register patients, document encounters, manage follow-ups',
  'Support Staff': 'Front-desk access — patient registration & scheduling, no clinical notes',
}

export function StaffPage() {
  return (
    <RoleGuard allow={['Organisation Admin']}>
      <StaffPageContent />
    </RoleGuard>
  )
}

function StaffPageContent() {
  const { staff, currentUser, inviteStaff, setStaffStatus, resetStaffAccess } = useAppData()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<StaffRole>('Pharmacist')
  const [justReset, setJustReset] = useState<string | null>(null)

  function handleResetAccess(staffId: string) {
    resetStaffAccess(staffId)
    setJustReset(staffId)
    setTimeout(() => setJustReset((current) => (current === staffId ? null : current)), 2500)
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    inviteStaff({ name: name.trim(), email: email.trim(), role })
    setName('')
    setEmail('')
    setRole('Pharmacist')
    setInviteOpen(false)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Staff</h1>
          <p className="mt-0.5 text-sm text-slate-500">{staff.length} accounts in this workspace</p>
        </div>
        <Button variant="primary" icon={<UserPlus size={16} />} onClick={() => setInviteOpen(true)}>
          Invite Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(Object.keys(roleDescriptions) as StaffRole[]).map((r) => (
          <Card key={r} className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <ShieldCheck size={15} className="text-[var(--brand)]" /> {r}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{roleDescriptions[r]}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Staff Accounts" subtitle="Only organisation admins can add, edit or deactivate accounts" />
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Last Active</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                        {initials(s.name)}
                      </span>
                      <div>
                        <p className="font-medium text-slate-800">{s.name}</p>
                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          <Mail size={11} /> {s.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{s.role}</td>
                  <td className="px-5 py-3">
                    <Badge tone={s.status === 'active' ? 'success' : s.status === 'invited' ? 'info' : 'neutral'} dot>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{s.lastActive === '—' ? '—' : timeAgo(s.lastActive)}</td>
                  <td className="px-5 py-3 text-slate-500">{formatDate(s.joinedAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {s.status === 'deactivated' ? (
                        <button
                          onClick={() => setStaffStatus(s.id, 'active')}
                          className="text-xs font-medium text-emerald-700 hover:underline"
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => setStaffStatus(s.id, 'deactivated')}
                          disabled={s.email === currentUser.email}
                          title={s.email === currentUser.email ? "You can't deactivate your own account" : undefined}
                          className="text-xs font-medium text-rose-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline"
                        >
                          Deactivate
                        </button>
                      )}
                      <button
                        onClick={() => handleResetAccess(s.id)}
                        disabled={s.status === 'deactivated'}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline"
                      >
                        <KeyRound size={11} />
                        {justReset === s.id ? 'Reset sent' : 'Reset access'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Staff Member" subtitle="They'll receive an email to set up their account" width="sm">
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <Label required>Full name</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fatima Bello" />
          </div>
          <div>
            <Label required>Email address</Label>
            <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@greenbandspharmacy.ng" />
          </div>
          <div>
            <Label required>Role</Label>
            <Select value={role} onChange={(e) => setRole(e.target.value as StaffRole)}>
              <option>Organisation Admin</option>
              <option>Pharmacist</option>
              <option>Support Staff</option>
            </Select>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<UsersRound size={15} />}>
              Send invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
