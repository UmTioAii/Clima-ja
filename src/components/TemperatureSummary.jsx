import { memo } from 'react'
import { groupForecastByDay } from '../utils/forecastUtils'

function TemperatureSummary({ forecastList }) {
  const daily = groupForecastByDay(forecastList)
  const today = daily[0]
  if (!today) return null

  return (
    <section className="forecast-section temp-summary" aria-label="Média do dia">
      <h3 className="forecast-section-title">Média do dia</h3>
      <div className="temp-summary-grid">
        <div className="temp-summary-item">
          <span className="temp-summary-label">Mínima</span>
          <span className="temp-summary-value">{today.min}°C</span>
        </div>
        <div className="temp-summary-item temp-summary-avg">
          <span className="temp-summary-label">Média</span>
          <span className="temp-summary-value">{today.avg}°C</span>
        </div>
        <div className="temp-summary-item">
          <span className="temp-summary-label">Máxima</span>
          <span className="temp-summary-value">{today.max}°C</span>
        </div>
      </div>
    </section>
  )
}

export default memo(TemperatureSummary)
