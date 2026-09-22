import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { tenants } from '../data/seed'
import type { AuditEntry, Encounter, FollowUp, Organisation, Patient, StaffMember, StaffRole } from '../types'

export type CurrentUser = {
  name: string
  role: StaffRole
  email: string
}

const defaultTenant = tenants[0]

interface AppDataValue {
  currentTenantId: string
  organisation: Organisation
  patients: Patient[]
  staff: StaffMember[]
  auditLog: AuditEntry[]
  currentUser: CurrentUser
  switchTenant: (tenantId: string, asStaffId?: string) => void
  setCurrentUserRole: (role: StaffRole) => void
  getPatient: (id: string) => Patient | undefined
  addPatient: (input: Omit<Patient, 'id' | 'encounters' | 'followUps' | 'registeredAt' | 'status'>) => Patient
  addEncounter: (patientId: string, input: Omit<Encounter, 'id'>) => void
  addFollowUp: (patientId: string, input: Omit<FollowUp, 'id' | 'status'>) => void
  completeFollowUp: (patientId: string, followUpId: string) => void
  inviteStaff: (input: { name: string; email: string; role: StaffRole }) => void
  setStaffStatus: (staffId: string, status: StaffMember['status']) => void
  resetStaffAccess: (staffId: string) => void
  updateOrganisation: (updates: Partial<Organisation>) => void
  logAction: (action: string, target: string) => void
}

const AppDataContext = createContext<AppDataValue | null>(null)

function nextPatientId(existing: Patient[], prefix: string) {
  const max = existing.reduce((acc, p) => {
    const n = Number(p.id.split('-')[1])
    return Number.isFinite(n) ? Math.max(acc, n) : acc
  }, 0)
  return `${prefix}-${String(max + 1).padStart(6, '0')}`
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [currentTenantId, setCurrentTenantId] = useState(defaultTenant.id)
  const [org, setOrg] = useState<Organisation>(defaultTenant.organisation)
  const [patientList, setPatientList] = useState<Patient[]>(defaultTenant.patients)
  const [staffList, setStaffList] = useState<StaffMember[]>(defaultTenant.staff)
  const [audit, setAudit] = useState<AuditEntry[]>(defaultTenant.auditLog)
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: defaultTenant.staff[0].name,
    role: defaultTenant.staff[0].role,
    email: defaultTenant.staff[0].email,
  })

  const logAction = useCallback((action: string, target: string) => {
    setAudit((prev) => [
      { id: `aud-${prev.length + 1}-${Date.now()}`, actor: currentUser.name, action, target, timestamp: new Date().toISOString() },
      ...prev,
    ])
  }, [currentUser.name])

  const switchTenant: AppDataValue['switchTenant'] = useCallback((tenantId, asStaffId) => {
    const tenant = tenants.find((t) => t.id === tenantId) ?? defaultTenant
    setCurrentTenantId(tenant.id)
    setOrg(tenant.organisation)
    setPatientList(tenant.patients)
    setStaffList(tenant.staff)
    setAudit(tenant.auditLog)
    const staffMatch = tenant.staff.find((s) => s.id === asStaffId) ?? tenant.staff[0]
    setCurrentUser({ name: staffMatch.name, role: staffMatch.role, email: staffMatch.email })
  }, [])

  const setCurrentUserRole = useCallback((role: StaffRole) => {
    const match = staffList.find((s) => s.role === role)
    if (!match) return
    setCurrentUser({ name: match.name, role, email: match.email })
  }, [staffList])

  const getPatient = useCallback((id: string) => patientList.find((p) => p.id === id), [patientList])

  const addPatient: AppDataValue['addPatient'] = useCallback((input) => {
    let created!: Patient
    setPatientList((prev) => {
      const id = nextPatientId(prev, org.patientIdPrefix)
      created = {
        ...input,
        id,
        status: 'active',
        registeredAt: new Date().toISOString().slice(0, 10),
        encounters: [],
        followUps: [],
      }
      return [created, ...prev]
    })
    logAction('Registered new patient', `${input.fullName}`)
    return created
  }, [logAction, org.patientIdPrefix])

  const addEncounter: AppDataValue['addEncounter'] = useCallback((patientId, input) => {
    setPatientList((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, encounters: [{ ...input, id: `enc-${Date.now()}` }, ...p.encounters] }
          : p,
      ),
    )
    const patient = patientList.find((p) => p.id === patientId)
    logAction('Created encounter', `${patientId} · ${patient?.fullName ?? ''}`)
  }, [logAction, patientList])

  const addFollowUp: AppDataValue['addFollowUp'] = useCallback((patientId, input) => {
    setPatientList((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, followUps: [{ ...input, id: `fu-${Date.now()}`, status: 'pending' }, ...p.followUps] }
          : p,
      ),
    )
    const patient = patientList.find((p) => p.id === patientId)
    logAction('Scheduled follow-up', `${patientId} · ${patient?.fullName ?? ''}`)
  }, [logAction, patientList])

  const completeFollowUp: AppDataValue['completeFollowUp'] = useCallback((patientId, followUpId) => {
    setPatientList((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, followUps: p.followUps.map((f) => (f.id === followUpId ? { ...f, status: 'completed' } : f)) }
          : p,
      ),
    )
    logAction('Completed follow-up', patientId)
  }, [logAction])

  const inviteStaff: AppDataValue['inviteStaff'] = useCallback((input) => {
    setStaffList((prev) => [
      { id: `stf-${Date.now()}`, ...input, status: 'invited', lastActive: '—', joinedAt: new Date().toISOString().slice(0, 10) },
      ...prev,
    ])
    logAction('Invited staff member', `${input.name} (${input.role})`)
  }, [logAction])

  const setStaffStatus: AppDataValue['setStaffStatus'] = useCallback((staffId, status) => {
    const target = staffList.find((s) => s.id === staffId)
    setStaffList((prev) => prev.map((s) => (s.id === staffId ? { ...s, status } : s)))
    logAction(status === 'deactivated' ? 'Deactivated staff account' : 'Reactivated staff account', target?.name ?? staffId)
  }, [logAction, staffList])

  const resetStaffAccess: AppDataValue['resetStaffAccess'] = useCallback((staffId) => {
    const target = staffList.find((s) => s.id === staffId)
    logAction('Reset access for staff member', target?.name ?? staffId)
  }, [logAction, staffList])

  const updateOrganisation: AppDataValue['updateOrganisation'] = useCallback((updates) => {
    setOrg((prev) => ({ ...prev, ...updates }))
    logAction('Updated organisation settings', Object.keys(updates).join(', '))
  }, [logAction])

  const value = useMemo<AppDataValue>(() => ({
    currentTenantId,
    organisation: org,
    patients: patientList,
    staff: staffList,
    auditLog: audit,
    currentUser,
    switchTenant,
    setCurrentUserRole,
    getPatient,
    addPatient,
    addEncounter,
    addFollowUp,
    completeFollowUp,
    inviteStaff,
    setStaffStatus,
    resetStaffAccess,
    updateOrganisation,
    logAction,
  }), [currentTenantId, org, patientList, staffList, audit, currentUser, switchTenant, setCurrentUserRole, getPatient, addPatient, addEncounter, addFollowUp, completeFollowUp, inviteStaff, setStaffStatus, resetStaffAccess, updateOrganisation, logAction])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is tightly coupled to this provider's context instance
export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
