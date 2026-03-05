import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeather } from './hooks/useWeather'
import { getWeatherTheme } from './utils/weatherTheme'
import Header from './components/Header'
import SearchCard from './components/SearchCard'
import WeatherCard from './components/WeatherCard'
import WeekForecast from './components/WeekForecast'
import TemperatureSummary from './components/TemperatureSummary'
import HourlyTemperatures from './components/HourlyTemperatures'
import RainForecast from './components/RainForecast'
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
  const { weather, forecast, loading, error, searchByCity, searchByLocation } = useWeather()
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

  const showContent = !loading && !weather
  const showWeather = !loading && weather
  const hourlyList = forecast?.hourly ?? []
  const dailyList = forecast?.daily ?? []
  const hasHourly = hourlyList.length > 0
  const hasDaily = dailyList.length > 0
  const hasForecast = hasHourly || hasDaily

  return (
    <>
      <AnimatePresence>{showWeather && <WeatherAmbience weather={weather} />}</AnimatePresence>
      <div className="container">
        <Header />
        <SearchCard onSearch={searchByCity} onLocation={searchByLocation} />
        {loading && <Loading />}
        {showWeather && (
          <motion.div
            className="weather-content"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className={`weather-main-row ${hasHourly ? 'weather-main-row--with-chart' : ''}`}>
              <motion.div variants={itemVariants}>
                <WeatherCard data={weather} />
              </motion.div>
              {hasHourly && (
                <motion.div variants={itemVariants}>
                  <HourlyTemperatures forecastList={hourlyList} />
                </motion.div>
              )}
            </div>
            {hasDaily && (
              <motion.div className="forecast-blocks" variants={containerVariants}>
                <motion.div variants={itemVariants}>
                  <TemperatureSummary forecastList={dailyList} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <WeekForecast forecastList={dailyList} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <RainForecast forecastList={dailyList} />
                </motion.div>
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
