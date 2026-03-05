import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeather } from './hooks/useWeather'
import { getWeatherTheme } from './utils/weatherTheme'
import { getTimeOfDay, getTimeOfDayLabel } from './utils/timeOfDay'
import Header from './components/Header'
import SearchCard from './components/SearchCard'
import WeatherCard from './components/WeatherCard'
import WeekForecast from './components/WeekForecast'
import TemperatureSummary from './components/TemperatureSummary'
import HourlyTemperatures from './components/HourlyTemperatures'
import WeatherAmbience from './components/WeatherAmbience'
import EmptyState from './components/EmptyState'
import Loading from './components/Loading'
import Toast from './components/Toast'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

function App() {
  const { weather, forecast, loading, error, recentCities, searchByCity, searchByLocation } = useWeather()
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' })

  useEffect(() => {
    if (error) {
      setToast({ show: true, message: error, type: 'error' })
      const t = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
      return () => clearTimeout(t)
    }
  }, [error])

  useEffect(() => {
    const theme = weather?.weather?.[0] ? getWeatherTheme(weather.weather[0].id) : ''
    document.body.dataset.weatherTheme = theme || ''
  }, [weather])

  // Compute time of day label for display
  const timeOfDayLabel = weather ? (() => {
    const now = weather.dt ? weather.dt * 1000 : Date.now()
    const sunrise = weather.sys?.sunrise ? weather.sys.sunrise * 1000 : null
    const sunset = weather.sys?.sunset ? weather.sys.sunset * 1000 : null
    return getTimeOfDayLabel(getTimeOfDay(now, sunrise, sunset))
  })() : null

  const showContent = !loading && !weather
  const showWeather = !loading && weather
  const forecastList = Array.isArray(forecast) ? forecast : []
  const hasHourly = forecastList.length > 0
  const hasDaily = forecastList.length > 0
  const hasForecast = hasHourly || hasDaily

  return (
    <>
      <AnimatePresence>{showWeather && <WeatherAmbience weather={weather} />}</AnimatePresence>
      <div className="container">
        <Header />
        <SearchCard
          onSearch={searchByCity}
          onLocation={searchByLocation}
          recentCities={recentCities}
        />
        {loading && <Loading />}
        {showWeather && (
          <motion.div
            className="weather-content"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* City card + time label — full width */}
            <motion.div variants={itemVariants}>
              <WeatherCard data={weather} timeLabel={timeOfDayLabel} />
            </motion.div>

            {/* Grid 2×2 with forecast sections */}
            {hasForecast && (
              <motion.div className="weather-grid" variants={containerVariants}>
                {hasDaily && (
                  <motion.div variants={itemVariants}>
                    <TemperatureSummary forecastList={forecastList} />
                  </motion.div>
                )}
                {hasHourly && (
                  <motion.div variants={itemVariants}>
                    <HourlyTemperatures forecastList={forecastList} />
                  </motion.div>
                )}
                {hasDaily && (
                  <motion.div className="weather-grid-full" variants={itemVariants}>
                    <WeekForecast forecastList={forecastList} />
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
        {showContent && <EmptyState />}
        {toast.show && <Toast message={toast.message} type={toast.type} />}
      </div>
    </>
  )
}

export default App
