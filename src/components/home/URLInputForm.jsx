import { useState } from 'react'
import { Globe, Loader2 } from 'lucide-react'

export default function URLInputForm({ onSubmit, isPending }) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Globe
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#64748B' }}
        />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g. https://example.com)"
          required
          disabled={isPending}
          className="w-full h-12 pl-10 pr-4 rounded-lg border text-sm outline-none transition-all
            focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]
            disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: '#E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#1E2B4A',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isPending || !url.trim()}
        className="h-12 px-6 rounded-lg text-sm font-semibold text-white flex items-center
          justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed
          hover:opacity-90 active:scale-95 shrink-0"
        style={{ backgroundColor: '#2563EB' }}
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Scanning…
          </>
        ) : (
          'Scan URL'
        )}
      </button>
    </form>
  )
}
