import { memo } from 'react'
import { getWeatherTheme } from '../utils/weatherTheme'

const RAIN_COUNT = 50
const SNOW_COUNT = 40

function RainDrops() {
  return (
    <div className="ambience-layer ambience-rain" aria-hidden="true">
      {Array.from({ length: RAIN_COUNT }, (_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${(i * 7) % 100}%`,
            animationDelay: `${(i * 0.02) % 1}s`,
            animationDuration: `${0.6 + (i % 3) * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

function SnowFlakes() {
  return (
    <div className="ambience-layer ambience-snow" aria-hidden="true">
      {Array.from({ length: SNOW_COUNT }, (_, i) => (
        <div
          key={i}
          className="snow-flake"
          style={{
            left: `${(i * 11) % 100}%`,
            animationDelay: `${(i * 0.05) % 2}s`,
            animationDuration: `${3 + (i % 4)}s`,
            width: `${4 + (i % 4)}px`,
            height: `${4 + (i % 4)}px`,
          }}
        />
      ))}
    </div>
  )
}

function SunRays() {
  return (
    <div className="ambience-layer ambience-sun" aria-hidden="true">
      <div className="sun-ray sun-ray-1" />
      <div className="sun-ray sun-ray-2" />
      <div className="sun-ray sun-ray-3" />
    </div>
  )
}

function MoonLayer() {
  return (
    <div className="ambience-layer ambience-moon" aria-hidden="true">
      <div className="moon-core" />
      <div className="moon-crater crater-1" />
      <div className="moon-crater crater-2" />
      <div className="moon-crater crater-3" />
    </div>
  )
}

function CloudLayer() {
  return (
    <div className="ambience-layer ambience-clouds" aria-hidden="true">
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
    </div>
  )
}

function WeatherAmbience({ weather }) {
  if (!weather?.weather?.[0]) return null
  const theme = getWeatherTheme(weather.weather[0].id)
  const main = weather.main || {}
  const temp = typeof main.temp === 'number' ? main.temp : null
  const now = weather.dt ? weather.dt * 1000 : Date.now()
  const sunrise = weather.sys?.sunrise ? weather.sys.sunrise * 1000 : null
  const sunset = weather.sys?.sunset ? weather.sys.sunset * 1000 : null

  const isNight = sunrise && sunset ? now < sunrise || now > sunset : false

  let tempBand = 'mild'
  if (temp != null) {
    if (temp <= 15) tempBand = 'cold'
    else if (temp >= 28) tempBand = 'hot'
  }

  return (
    <div
      className={`weather-ambience weather-ambience--${theme} weather-ambience--${
        isNight ? 'night' : 'day'
      } weather-ambience--temp-${tempBand}`}
    >
      {/* elementos de fundo por condição */}
      {theme === 'rain' && <RainDrops />}
      {theme === 'drizzle' && <RainDrops />}
      {theme === 'thunderstorm' && <RainDrops />}
      {theme === 'snow' && <SnowFlakes />}
      {theme === 'clouds' && <CloudLayer />}
      {!isNight && theme === 'clear' && <SunRays />}
      {isNight && <MoonLayer />}
    </div>
  )
}

export default memo(WeatherAmbience)
