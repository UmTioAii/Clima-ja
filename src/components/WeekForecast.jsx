import { memo } from 'react'
import { groupForecastByDay } from '../utils/forecastUtils'

function WeekForecast({ forecastList }) {
  const daily = groupForecastByDay(forecastList)
  if (!daily.length) return null

  return (
    <section className="forecast-section" aria-label="Previsão da semana">
      <h3 className="forecast-section-title">Clima e temperatura dos próximos dias</h3>
      <div className="week-forecast">
        {daily.map((day) => (
          <div key={day.dateKey} className="week-day-card">
            <span className="week-day-name">{day.dayName}</span>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt=""
              className="week-day-icon"
            />
            <div className="week-day-temps">
              <span className="week-day-max">{day.max}°</span>
              <span className="week-day-min">{day.min}°</span>
            </div>
            <span className="week-day-rain" title="Chance de chuva">
              {day.popMax}%
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default memo(WeekForecast)
