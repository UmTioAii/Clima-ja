function Toast({ message, type = 'error' }) {
  return (
    <div className={`toast ${type}`} role="alert" aria-live="assertive">
      {message}
    </div>
  )
}

export default Toast
