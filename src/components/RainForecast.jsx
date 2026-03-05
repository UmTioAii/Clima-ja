import { memo } from 'react'
import { groupForecastByDay } from '../utils/forecastUtils'

function RainForecast({ forecastList }) {
  const daily = groupForecastByDay(forecastList)
  if (!daily.length) return null

  return (
    <section className="forecast-section rain-forecast" aria-label="Previsão de chuvas">
      <h3 className="forecast-section-title">Previsão de chuvas na região</h3>
      <div className="rain-list">
        {daily.map((day) => (
          <div key={day.dateKey} className="rain-day">
            <span className="rain-day-name">{day.dayName}</span>
            <div className="rain-bar-wrap">
              <div
                className="rain-bar"
                style={{ width: `${day.popMax}%` }}
                role="presentation"
              />
            </div>
            <span className="rain-day-pct">{day.popMax}%</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default memo(RainForecast)
