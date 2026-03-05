/**
 * OpenWeatherMap weather condition codes: https://openweathermap.org/weather-conditions
 * Returns: 'thunderstorm' | 'drizzle' | 'rain' | 'snow' | 'clouds' | 'clear'
 */
export function getWeatherTheme(weatherId) {
  if (!weatherId) return 'clear'
  const id = Number(weatherId)
  if (id >= 200 && id < 300) return 'thunderstorm'
  if (id >= 300 && id < 400) return 'drizzle'
  if (id >= 500 && id < 600) return 'rain'
  if (id >= 600 && id < 700) return 'snow'
  if (id >= 700 && id < 800) return 'clouds' // atmosphere
  if (id === 800) return 'clear'
  if (id >= 801 && id <= 804) return 'clouds'
  return 'clear'
}
