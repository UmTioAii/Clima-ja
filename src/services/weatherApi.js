const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

function getApiKey() {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!key) {
    throw new Error('Chave da API não configurada. Defina VITE_OPENWEATHER_API_KEY no arquivo .env')
  }
  return key
}

export async function getWeatherByCity(city) {
  const key = getApiKey()
  const response = await fetch(
    `${WEATHER_URL}?q=${encodeURIComponent(city)}&appid=${key}&units=metric&lang=pt_br`
  )
  if (!response.ok) {
    let message = 'Erro ao buscar dados do clima'
    if (response.status === 404) {
      message = 'Cidade não encontrada'
    } else if (response.status === 401) {
      try {
        const err = await response.json()
        const apiMsg = typeof err?.message === 'string' ? err.message.toLowerCase() : ''
        if (apiMsg.includes('invalid api key')) {
          message = 'Chave da API inválida. Confira VITE_OPENWEATHER_API_KEY no arquivo .env.'
        } else {
          message = 'Erro de autenticação na API. Verifique sua chave da OpenWeather.'
        }
      } catch {
        message = 'Chave da API inválida ou problema de autenticação na OpenWeather.'
      }
    }
    throw new Error(message)
  }
  return response.json()
}

export async function getWeatherByCoords(lat, lon) {
  const key = getApiKey()
  const response = await fetch(
    `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=pt_br`
  )
  if (!response.ok) {
    let message = 'Erro ao buscar dados do clima'
    if (response.status === 401) {
      try {
        const err = await response.json()
        const apiMsg = typeof err?.message === 'string' ? err.message.toLowerCase() : ''
        if (apiMsg.includes('invalid api key')) {
          message = 'Chave da API inválida. Confira VITE_OPENWEATHER_API_KEY no arquivo .env.'
        } else {
          message = 'Erro de autenticação na API. Verifique sua chave da OpenWeather.'
        }
      } catch {
        message = 'Chave da API inválida ou problema de autenticação na OpenWeather.'
      }
    }
    throw new Error(message)
  }
  return response.json()
}

export async function getCoordsByCity(city) {
  const key = getApiKey()
  const response = await fetch(
    `${GEO_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${key}`
  )
  if (!response.ok) {
    let message = 'Erro ao buscar coordenadas da cidade'
    if (response.status === 401) {
      try {
        const err = await response.json()
        const apiMsg = typeof err?.message === 'string' ? err.message.toLowerCase() : ''
        if (apiMsg.includes('invalid api key')) {
          message = 'Chave da API inválida. Confira VITE_OPENWEATHER_API_KEY no arquivo .env.'
        } else {
          message = 'Erro de autenticação na API de geocodificação. Verifique sua chave da OpenWeather.'
        }
      } catch {
        message = 'Chave da API inválida ou problema de autenticação na OpenWeather (geocoding).'
      }
    }
    throw new Error(message)
  }
  const data = await response.json()
  if (!data || !data.length) {
    throw new Error('Cidade não encontrada')
  }
  const { lat, lon } = data[0]
  return { lat, lon }
}

export async function getForecastByCity(city) {
  const key = getApiKey()
  const response = await fetch(
    `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${key}&units=metric&lang=pt_br`
  )
  if (!response.ok) {
    let message = 'Erro ao buscar previsão'
    if (response.status === 404) {
      message = 'Cidade não encontrada'
    } else if (response.status === 401) {
      try {
        const err = await response.json()
        const apiMsg = typeof err?.message === 'string' ? err.message.toLowerCase() : ''
        if (apiMsg.includes('invalid api key')) {
          message = 'Chave da API inválida. Confira VITE_OPENWEATHER_API_KEY no arquivo .env.'
        } else {
          message = 'Erro de autenticação na API de previsão. Verifique sua chave da OpenWeather.'
        }
      } catch {
        message = 'Chave da API inválida ou problema de autenticação na OpenWeather (previsão).'
      }
    }
    throw new Error(message)
  }
  return response.json()
}

export async function getForecastByCoords(lat, lon) {
  const key = getApiKey()
  const response = await fetch(
    `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=pt_br`
  )
  if (!response.ok) {
    let message = 'Erro ao buscar previsão'
    if (response.status === 401) {
      try {
        const err = await response.json()
        const apiMsg = typeof err?.message === 'string' ? err.message.toLowerCase() : ''
        if (apiMsg.includes('invalid api key')) {
          message = 'Chave da API inválida. Confira VITE_OPENWEATHER_API_KEY no arquivo .env.'
        } else {
          message = 'Erro de autenticação na API de previsão. Verifique sua chave da OpenWeather.'
        }
      } catch {
        message = 'Chave da API inválida ou problema de autenticação na OpenWeather (previsão).'
      }
    }
    throw new Error(message)
  }
  return response.json()
}
