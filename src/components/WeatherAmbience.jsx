import { memo } from 'react'
import { motion } from 'framer-motion'
import { getWeatherTheme } from '../utils/weatherTheme'
import { getTimeOfDay, getSeason, getBackgroundGradient } from '../utils/timeOfDay'
import WeatherCanvas from './WeatherCanvas'

function WeatherAmbience({ weather }) {
  if (!weather?.weather?.[0]) return null

  const theme = getWeatherTheme(weather.weather[0].id)
  const main = weather.main || {}
  const temp = typeof main.temp === 'number' ? main.temp : null
  const windSpeed = typeof weather.wind?.speed === 'number' ? weather.wind.speed : 0
  const nowMs = weather.dt ? weather.dt * 1000 : Date.now()
  const sunriseMs = weather.sys?.sunrise ? weather.sys.sunrise * 1000 : null
  const sunsetMs = weather.sys?.sunset ? weather.sys.sunset * 1000 : null
  const lat = weather.coord?.lat || 0
  const month = new Date(nowMs).getMonth()

  const timeOfDay = getTimeOfDay(nowMs, sunriseMs, sunsetMs)
  const season = getSeason(lat, month)
  const gradient = getBackgroundGradient(timeOfDay, theme)

  let tempBand = 'mild'
  if (temp != null) {
    if (temp <= 10) tempBand = 'cold'
    else if (temp <= 18) tempBand = 'cool'
    else if (temp >= 32) tempBand = 'hot'
    else if (temp >= 25) tempBand = 'warm'
  }

  const isWindy = windSpeed >= 8

  return (
    <motion.div
      className={`weather-ambience weather-ambience--${theme} weather-ambience--${timeOfDay} weather-ambience--temp-${tempBand} weather-ambience--${season}`}
      style={{ background: gradient }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      <WeatherCanvas
        theme={theme}
        timeOfDay={timeOfDay}
        tempBand={tempBand}
        isWindy={isWindy}
      />
      <div className="ambience-vignette" />
    </motion.div>
  )
}

export default memo(WeatherAmbience)
