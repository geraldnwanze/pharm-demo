import { Check, Pencil } from 'lucide-react'
import { useState } from 'react'
import { EditPlanModal } from '../../components/platform/EditPlanModal'
import { Badge } from '../../components/ui/Badge'
import { usePlatformData } from '../../context/PlatformContext'
import type { PricingPlan } from '../../types'

export function PlatformPricingPage() {
  const { plans, tenants } = usePlatformData()
  const [editing, setEditing] = useState<PricingPlan | null>(null)

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Pricing</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Manage the plans shown on the public pricing page — changes apply immediately, including for organisations already on that plan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {plans.map((plan) => {
          const subscriberCount = tenants.filter((t) => t.organisation.plan === plan.id).length
          return (
            <div key={plan.id} className={`flex flex-col rounded-2xl border bg-white p-6 ${plan.highlight ? 'border-indigo-400 shadow-lg shadow-indigo-500/10' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  {plan.highlight && (
                    <span className="mb-2 inline-flex items-center rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-medium text-white">
                      Most popular
                    </span>
                  )}
                  <p className="text-sm font-semibold text-slate-900">{plan.id}</p>
                  <p className="mt-1 text-xs text-slate-500">{plan.tagline}</p>
                </div>
                <Badge tone="neutral">{subscriberCount} subscriber{subscriberCount === 1 ? '' : 's'}</Badge>
              </div>

              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-slate-900">{plan.price}</span>
                <span className="text-sm text-slate-400">{plan.period}</span>
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check size={15} className="mt-0.5 shrink-0 text-indigo-600" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setEditing(plan)}
                className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={14} />
                Edit plan
              </button>
            </div>
          )
        })}
      </div>

      <EditPlanModal plan={editing} onClose={() => setEditing(null)} />
    </div>
  )
}
