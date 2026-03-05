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
 * Agrupa a lista de previsão 3h (forecast.list) por dia e retorna resumo diário.
 * @param {Array} forecastList - list[] da API /forecast
 * @returns {Array} { dateKey, dayName, min, max, avg, popMax, icon }
 */
export function groupForecastByDay(forecastList) {
  if (!forecastList || !forecastList.length) return []

  const grouped = new Map()

  forecastList.forEach((item) => {
    if (!item?.dt || !item?.main) return

    const key = getDateKey(item.dt)
    const temp = Number(item.main.temp)
    const tempMin = Number.isFinite(item.main.temp_min) ? Number(item.main.temp_min) : temp
    const tempMax = Number.isFinite(item.main.temp_max) ? Number(item.main.temp_max) : temp
    const pop = Math.max(0, Math.min(1, Number(item.pop) || 0))
    const icon = item.weather?.[0]?.icon || '01d'

    if (!grouped.has(key)) {
      grouped.set(key, {
        dt: item.dt,
        dateKey: key,
        dayName: getDayName(item.dt),
        min: tempMin,
        max: tempMax,
        sum: Number.isFinite(temp) ? temp : tempMin,
        count: 1,
        popMax: pop,
        icon,
        iconByHourDistance: Math.abs((new Date(item.dt * 1000)).getHours() - 12),
      })
      return
    }

    const current = grouped.get(key)
    current.min = Math.min(current.min, tempMin)
    current.max = Math.max(current.max, tempMax)
    current.sum += Number.isFinite(temp) ? temp : tempMin
    current.count += 1
    current.popMax = Math.max(current.popMax, pop)

    const hourDistance = Math.abs((new Date(item.dt * 1000)).getHours() - 12)
    if (hourDistance < current.iconByHourDistance) {
      current.iconByHourDistance = hourDistance
      current.icon = icon
    }
  })

  return Array.from(grouped.values())
    .sort((a, b) => a.dt - b.dt)
    .slice(0, 5)
    .map((item) => ({
      dateKey: item.dateKey,
      dayName: item.dayName,
      min: Math.round(item.min),
      max: Math.round(item.max),
      avg: Math.round(item.sum / item.count),
      popMax: Math.round(item.popMax * 100),
      icon: item.icon,
    }))
}

/**
 * Retorna os primeiros N slots da previsão de 3h para "temperatura por horário".
 * @param {Array} forecastList - list[] da resposta /forecast
 * @param {number} count - quantidade de slots (ex.: 8 = próximas 8h)
 */
export function getHourlySlots(forecastList, count = 8) {
  if (!forecastList || !forecastList.length) return []

  return forecastList.slice(0, count).map((item) => {
    const date = new Date(item.dt * 1000)
    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    return {
      time,
      temp: Math.round(item.main?.temp ?? 0),
      dt: item.dt,
    }
  })
}
