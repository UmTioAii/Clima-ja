import { memo } from 'react'

function WeatherCard({ data, timeLabel }) {
  if (!data) return null
  const w = data.weather[0]
  const main = data.main
  const wind = data.wind

  return (
    <div className="weather-card" role="article" aria-label={`Clima em ${data.name}`}>
      <div className="weather-header">
        <div className="location">
          <h2>{data.name}, {data.sys.country}</h2>
          {timeLabel && <span className="location-time-label">{timeLabel}</span>}
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`}
          alt={w.description}
          className="weather-icon-large"
        />
      </div>
      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">{Math.round(main.temp)}</span>
          <span className="temp-unit">°C</span>
        </div>
        <p className="weather-description">{w.description}</p>
        <p className="feels-like">Sensação térmica: {Math.round(main.feels_like)}°C</p>
      </div>
      <div className="weather-details">
        <div className="detail-item">
          <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <div className="detail-info">
            <span className="detail-label">Umidade</span>
            <span className="detail-value">{main.humidity}%</span>
          </div>
        </div>
        <div className="detail-item">
          <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
          </svg>
          <div className="detail-info">
            <span className="detail-label">Vento</span>
            <span className="detail-value">{wind.speed} m/s</span>
          </div>
        </div>
        <div className="detail-item">
          <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          </svg>
          <div className="detail-info">
            <span className="detail-label">Pressão</span>
            <span className="detail-value">{main.pressure} hPa</span>
          </div>
        </div>
        <div className="detail-item">
          <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <div className="detail-info">
            <span className="detail-label">Visibilidade</span>
            <span className="detail-value">{(data.visibility / 1000).toFixed(1)} km</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(WeatherCard)
