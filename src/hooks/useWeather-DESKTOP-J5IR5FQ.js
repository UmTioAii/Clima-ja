import { useState, useCallback } from 'react'
import {
  getWeatherByCoords,
  getCoordsByCity,
  getOneCall,
} from '../services/weatherApi'

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchByCity = useCallback(async (city) => {
    const trimmed = (city || '').trim()
    if (!trimmed) {
      setError('Por favor, digite o nome de uma cidade')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const { lat, lon } = await getCoordsByCity(trimmed)
      const [weatherData, oneCallData] = await Promise.all([
        getWeatherByCoords(lat, lon),
        getOneCall(lat, lon),
      ])
      setWeather(weatherData)
      setForecast(oneCallData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchByLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador')
      return
    }
    setError(null)
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const [weatherData, oneCallData] = await Promise.all([
            getWeatherByCoords(latitude, longitude),
            getOneCall(latitude, longitude),
          ])
          setWeather(weatherData)
          setForecast(oneCallData)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError('Permissão de localização negada')
        } else {
          setError('Erro ao obter localização')
        }
        setLoading(false)
      }
    )
  }, [])

  return { weather, forecast, loading, error, searchByCity, searchByLocation }
}
