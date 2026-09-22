import { useState } from 'react'
import { usePlatformData } from '../../context/PlatformContext'
import type { PricingPlan } from '../../types'
import { Button } from '../ui/Button'
import { FieldRow, Input, Label, Textarea } from '../ui/Field'
import { Modal } from '../ui/Modal'

export function EditPlanModal({ plan, onClose }: { plan: PricingPlan | null; onClose: () => void }) {
  return (
    <Modal open={plan !== null} onClose={onClose} title={plan ? `Edit ${plan.id} plan` : ''} subtitle="Changes apply immediately to the public pricing page" width="md">
      {plan && <EditPlanForm key={plan.id} plan={plan} onClose={onClose} />}
    </Modal>
  )
}

function EditPlanForm({ plan, onClose }: { plan: PricingPlan; onClose: () => void }) {
  const { updatePlan } = usePlatformData()
  const [price, setPrice] = useState(plan.price)
  const [period, setPeriod] = useState(plan.period)
  const [tagline, setTagline] = useState(plan.tagline)
  const [featuresText, setFeaturesText] = useState(plan.features.join('\n'))
  const [highlight, setHighlight] = useState(Boolean(plan.highlight))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updatePlan(plan.id, {
      price: price.trim(),
      period: period.trim(),
      tagline: tagline.trim(),
      features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
      highlight,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldRow>
        <div>
          <Label required>Price</Label>
          <Input required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. ₦25,000 or Custom" />
        </div>
        <div>
          <Label>Billing period</Label>
          <Input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="e.g. /month (leave blank for Custom)" />
        </div>
      </FieldRow>

      <div>
        <Label required>Tagline</Label>
        <Input required value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. For a single pharmacy getting started" />
      </div>

      <div>
        <Label required>Features</Label>
        <Textarea required rows={6} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={'One feature per line'} />
        <p className="mt-1 text-xs text-slate-400">One feature per line — each becomes a checklist item on the pricing card.</p>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
        Mark as "Most popular"
      </label>

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          Save changes
        </button>
      </div>
    </form>
  )
}
