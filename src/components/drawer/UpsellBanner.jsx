export default function UpsellBanner() {
  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{ backgroundColor: '#FEF3E2', border: '1px solid #FED7AA' }}
    >
      <h3 className="text-lg font-bold mb-2" style={{ color: '#F97316' }}>
        Just a few steps from full accessibility
      </h3>
      <p className="text-sm leading-relaxed mb-6 max-w-lg mx-auto" style={{ color: '#92400E' }}>
        Your page is in good shape based on automated checks. Refine a few areas, then run a full scan
        with manual checks to ensure full compliance. We'll guide you through it.
      </p>
      <button
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#2563EB' }}
      >
        Ensure full compliance ↗
      </button>
    </div>
  )
}
