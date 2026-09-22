import { ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAppData } from '../../context/AppDataContext'
import type { StaffRole } from '../../types'
import { EmptyState } from '../ui/EmptyState'

export function RoleGuard({ allow, children }: { allow: StaffRole[]; children: ReactNode }) {
  const { currentUser } = useAppData()
  if (!allow.includes(currentUser.role)) {
    return (
      <div className="mx-auto max-w-lg pt-16">
        <EmptyState
          icon={<ShieldAlert size={22} />}
          title="Restricted"
          description={`This section requires the ${allow.join(' or ')} role. You're currently signed in as ${currentUser.role}.`}
        />
      </div>
    )
  }
  return <>{children}</>
}
