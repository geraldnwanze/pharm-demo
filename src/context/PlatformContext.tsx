import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { pricingPlans as seedPricingPlans, tenants as seedTenants } from '../data/seed'
import type { AuditEntry, Organisation, PlanId, PricingPlan, Tenant } from '../types'

export interface NewOrganisationInput {
  name: string
  shortName: string
  subdomain: string
  patientIdPrefix: string
  plan: Organisation['plan']
  brandColor: string
  address: string
  phone: string
  email: string
  adminName: string
  adminEmail: string
  source?: 'platform-admin' | 'self-serve'
}

interface PlatformDataValue {
  tenants: Tenant[]
  plans: PricingPlan[]
  platformAuditLog: AuditEntry[]
  createOrganisation: (input: NewOrganisationInput) => Tenant
  setOrganisationStatus: (tenantId: string, status: Organisation['status']) => void
  updatePlan: (planId: PlanId, updates: Partial<Omit<PricingPlan, 'id'>>) => void
  logPlatformAction: (action: string, target: string, actor?: string) => void
}

const PlatformContext = createContext<PlatformDataValue | null>(null)

const seedPlatformAudit: AuditEntry[] = [
  { id: 'plat-aud-1', actor: 'Earlybird Platform', action: 'Organisation onboarded', target: 'GreenBands Pharmacy', timestamp: '2026-01-14T09:00:00' },
  { id: 'plat-aud-2', actor: 'Earlybird Platform', action: 'Organisation onboarded', target: 'Doveforte Pharmacy', timestamp: '2026-06-01T09:00:00' },
]

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>(seedTenants)
  const [plans, setPlans] = useState<PricingPlan[]>(seedPricingPlans)
  const [platformAuditLog, setPlatformAuditLog] = useState<AuditEntry[]>(seedPlatformAudit)

  const logPlatformAction = useCallback((action: string, target: string, actor = 'Earlybird Platform Admin') => {
    setPlatformAuditLog((prev) => [
      { id: `plat-aud-${prev.length + 1}-${Date.now()}`, actor, action, target, timestamp: new Date().toISOString() },
      ...prev,
    ])
  }, [])

  const createOrganisation = useCallback((input: NewOrganisationInput): Tenant => {
    const id = input.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '') || `org-${Date.now()}`
    const tenant: Tenant = {
      id,
      organisation: {
        name: input.name,
        shortName: input.shortName,
        subdomain: `${id}.care.earlybirdalphaforge.com`,
        patientIdPrefix: input.patientIdPrefix.toUpperCase(),
        plan: input.plan,
        status: 'active',
        brandColor: input.brandColor,
        address: input.address,
        phone: input.phone,
        email: input.email,
      },
      staff: [
        {
          id: `${id}-stf-1`,
          name: input.adminName,
          email: input.adminEmail,
          role: 'Organisation Admin',
          status: 'active',
          lastActive: '—',
          joinedAt: new Date().toISOString().slice(0, 10),
        },
      ],
      patients: [],
      auditLog: [
        {
          id: `${id}-aud-1`,
          actor: input.source === 'self-serve' ? input.adminName : 'Earlybird Platform',
          action: input.source === 'self-serve' ? 'Workspace created (self-serve signup)' : 'Workspace created',
          target: input.name,
          timestamp: new Date().toISOString(),
        },
      ],
    }
    setTenants((prev) => [tenant, ...prev])
    logPlatformAction(
      input.source === 'self-serve' ? 'Organisation self-registered' : 'Created organisation',
      `${input.name} (${tenant.organisation.subdomain})`,
      input.source === 'self-serve' ? `${input.adminName} · ${input.name}` : undefined,
    )
    return tenant
  }, [logPlatformAction])

  const setOrganisationStatus: PlatformDataValue['setOrganisationStatus'] = useCallback((tenantId, status) => {
    const target = tenants.find((t) => t.id === tenantId)
    setTenants((prev) => prev.map((t) => (t.id === tenantId ? { ...t, organisation: { ...t.organisation, status } } : t)))
    logPlatformAction(status === 'suspended' ? 'Suspended organisation' : 'Reactivated organisation', target?.organisation.name ?? tenantId)
  }, [logPlatformAction, tenants])

  const updatePlan: PlatformDataValue['updatePlan'] = useCallback((planId, updates) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, ...updates } : p)))
    logPlatformAction('Updated plan pricing', planId)
  }, [logPlatformAction])

  const value = useMemo<PlatformDataValue>(() => ({
    tenants,
    plans,
    platformAuditLog,
    createOrganisation,
    setOrganisationStatus,
    updatePlan,
    logPlatformAction,
  }), [tenants, plans, platformAuditLog, createOrganisation, setOrganisationStatus, updatePlan, logPlatformAction])

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is tightly coupled to this provider's context instance
export function usePlatformData() {
  const ctx = useContext(PlatformContext)
  if (!ctx) throw new Error('usePlatformData must be used within PlatformProvider')
  return ctx
}
