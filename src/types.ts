export type StaffRole = 'Organisation Admin' | 'Pharmacist' | 'Support Staff'

export interface StaffMember {
  id: string
  name: string
  email: string
  role: StaffRole
  status: 'active' | 'invited' | 'deactivated'
  lastActive: string
  joinedAt: string
}

export type EncounterKind = 'Consultation' | 'Medication Review' | 'New Consultation' | 'Chronic Care Review'

export interface Encounter {
  id: string
  kind: EncounterKind
  date: string
  clinician: string
  notes: string
  vitals?: {
    bp?: string
    temp?: string
    weight?: string
  }
}

export interface FollowUp {
  id: string
  date: string
  dueDate: string
  reason: string
  status: 'pending' | 'completed' | 'overdue'
  assignedTo: string
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship?: string
}

export interface Patient {
  id: string
  fullName: string
  dob: string
  sex: 'Female' | 'Male'
  phone: string
  email?: string
  address?: string
  emergencyContact?: EmergencyContact
  allergies: string[]
  conditions: string[]
  medications: string[]
  status: 'active' | 'inactive'
  registeredAt: string
  encounters: Encounter[]
  followUps: FollowUp[]
}

export interface AuditEntry {
  id: string
  actor: string
  action: string
  target: string
  timestamp: string
}

export type PlanId = 'Starter' | 'Growth' | 'Enterprise'

export interface Organisation {
  name: string
  shortName: string
  subdomain: string
  patientIdPrefix: string
  plan: PlanId
  status: 'active' | 'suspended'
  brandColor: string
  address: string
  phone: string
  email: string
}

export interface Tenant {
  id: string
  organisation: Organisation
  staff: StaffMember[]
  patients: Patient[]
  auditLog: AuditEntry[]
}

export interface PricingPlan {
  id: PlanId
  price: string
  period: string
  tagline: string
  features: string[]
  highlight?: boolean
}
