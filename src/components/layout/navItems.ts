import { BarChart3, FileClock, LayoutDashboard, Settings, Users, UsersRound, type LucideIcon } from 'lucide-react'
import type { StaffRole } from '../../types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  roles: StaffRole[]
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['Organisation Admin', 'Pharmacist', 'Support Staff'] },
  { to: '/patients', label: 'Patients', icon: Users, roles: ['Organisation Admin', 'Pharmacist', 'Support Staff'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['Organisation Admin'] },
  { to: '/staff', label: 'Staff', icon: UsersRound, roles: ['Organisation Admin'] },
  { to: '/audit-log', label: 'Audit Log', icon: FileClock, roles: ['Organisation Admin'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['Organisation Admin'] },
]
