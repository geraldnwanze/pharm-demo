import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 'md',
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  width?: 'sm' | 'md' | 'lg'
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const widthClass = width === 'sm' ? 'max-w-md' : width === 'lg' ? 'max-w-2xl' : 'max-w-lg'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-12 backdrop-blur-sm sm:pt-20">
      <div className={`w-full ${widthClass} rounded-2xl border border-slate-200 bg-white shadow-xl`}>
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
