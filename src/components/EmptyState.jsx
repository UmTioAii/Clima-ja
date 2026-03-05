function EmptyState() {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
      <p>Busque uma cidade ou use sua localização para ver o clima</p>
    </div>
  )
}

export default EmptyState
