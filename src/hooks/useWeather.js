import { useState, useCallback } from 'react'
import {
  getWeatherByCoords,
  getCoordsByCity,
  getForecastByCoords,
} from '../services/weatherApi'

const RECENT_CITIES_KEY = 'climaja_recent_cities'
const RECENT_CITIES_LIMIT = 5
const GEOLOCATION_TIMEOUT_MS = 15000
const MIN_GOOD_ACCURACY_METERS = 1500
const GEOLOCATION_PERMISSION_DENIED = 1
const GEOLOCATION_TIMEOUT = 3

const CITY_ALIASES = {
  'sao paulo': 'Sao Paulo',
  'são paulo': 'Sao Paulo',
  'belo horzonte': 'Belo Horizonte',
  'belohorizonte': 'Belo Horizonte',
  'rio janeiro': 'Rio de Janeiro',
}

function normalizeText(value) {
  return (value || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

function resolveCityName(input) {
  const normalized = normalizeText(input)
  return CITY_ALIASES[normalized] || input.trim().replace(/\s+/g, ' ')
}

function loadRecentCities() {
  try {
    const raw = localStorage.getItem(RECENT_CITIES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

function persistRecentCities(cities) {
  try {
    localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(cities))
  } catch {
    // Ignore persistence issues to keep weather search functional.
  }
}

function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentCities, setRecentCities] = useState(() => loadRecentCities())

  const updateRecentCities = useCallback((cityName) => {
    const candidate = (cityName || '').trim()
    if (!candidate) return

    setRecentCities((prev) => {
      const next = [candidate, ...prev.filter((city) => normalizeText(city) !== normalizeText(candidate))]
        .slice(0, RECENT_CITIES_LIMIT)
      persistRecentCities(next)
      return next
    })
  }, [])

  const searchByCity = useCallback(async (city) => {
    const trimmed = (city || '').trim()
    if (!trimmed) {
      setError('Por favor, digite o nome de uma cidade')
      return
    }

    const resolvedCity = resolveCityName(trimmed)
    setError(null)
    setLoading(true)

    try {
      const { lat, lon } = await getCoordsByCity(resolvedCity)
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCoords(lat, lon),
        getForecastByCoords(lat, lon),
      ])

      setWeather(weatherData)
      setForecast(forecastData?.list || [])
      updateRecentCities(weatherData?.name || resolvedCity)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [updateRecentCities])

  const searchByLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador')
      return
    }

    setError(null)
    setLoading(true)

    try {
      let position
      try {
        // First try network-based (fast, avoids "Failed to query location from network service")
        position = await getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000,
        })
      } catch {
        // Fallback to GPS if network location is unavailable
        position = await getCurrentPosition({
          enableHighAccuracy: true,
          timeout: GEOLOCATION_TIMEOUT_MS,
          maximumAge: 0,
        })
      }

      const { latitude, longitude } = position.coords

      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCoords(latitude, longitude),
        getForecastByCoords(latitude, longitude),
      ])

      setWeather(weatherData)
      setForecast(forecastData?.list || [])
      updateRecentCities(weatherData?.name)
    } catch (err) {
      if (err?.code === GEOLOCATION_PERMISSION_DENIED) {
        setError('Permissão de localização negada. Busque uma cidade manualmente.')
      } else if (err?.code === GEOLOCATION_TIMEOUT) {
        setError('Não foi possível obter sua localização a tempo. Tente novamente ou busque a cidade.')
      } else {
        setError(err?.message || 'Erro ao obter localização')
      }
    } finally {
      setLoading(false)
    }
  }, [updateRecentCities])

  return { weather, forecast, loading, error, recentCities, searchByCity, searchByLocation }
}
