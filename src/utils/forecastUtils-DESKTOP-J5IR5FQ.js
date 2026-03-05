const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function getDayName(dt) {
  const date = new Date(dt * 1000)
  return DAY_NAMES[date.getDay()]
}

function getDateKey(dt) {
  const date = new Date(dt * 1000)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Agrupa o array daily da One Call 3.0 por dia e retorna resumo: min, max, média, pop, ícone.
 * @param {Array} daily - daily[] da resposta da API One Call
 * @returns {Array} { dateKey, dayName, min, max, avg, popMax, icon }
 */
export function groupForecastByDay(daily) {
  if (!daily || !daily.length) return []

  return daily.map((item) => {
    const temps = item.temp || {}
    const min = Math.round(temps.min ?? temps.day ?? temps.morn ?? 0)
    const max = Math.round(temps.max ?? temps.day ?? temps.eve ?? min)
    const avgSource =
      temps.day ?? (temps.min != null && temps.max != null ? (temps.min + temps.max) / 2 : min)
    const avg = Math.round(avgSource)
    const popMax = Math.round((item.pop ?? 0) * 100)
    const icon = item.weather && item.weather[0] ? item.weather[0].icon : '01d'

    return {
      dateKey: getDateKey(item.dt),
      dayName: getDayName(item.dt),
      min,
      max,
      avg,
      popMax,
      icon,
    }
  })
}

/**
 * Retorna os primeiros N horários da One Call (hourly[]) para \"temperatura por horário\".
 * @param {Array} hourly - hourly[] da resposta da API One Call
 * @param {number} count - quantidade de slots (ex.: 8 = próximas 8h)
 */
export function getHourlySlots(hourly, count = 8) {
  if (!hourly || !hourly.length) return []
  return hourly.slice(0, count).map((item) => {
    const date = new Date(item.dt * 1000)
    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    return {
      time,
      temp: Math.round(item.temp),
      dt: item.dt,
    }
  })
}
