import { memo, useMemo } from 'react'
import { getHourlySlots } from '../utils/forecastUtils'

const CHART_HEIGHT = 120
const TEMP_PADDING = 2

function HourlyTemperatures({ forecastList }) {
  const slots = getHourlySlots(forecastList, 8)
  const slotsWithHeight = useMemo(() => {
    if (!slots.length) return []
    const temps = slots.map((s) => s.temp)
    const min = Math.min(...temps)
    const max = Math.max(...temps)
    const range = max - min || 1
    const padding = TEMP_PADDING
    return slots.map((slot) => ({
      ...slot,
      heightPct: Math.max(8, ((slot.temp - min + padding) / (range + padding * 2)) * 100),
    }))
  }, [slots])

  if (!slotsWithHeight.length) return null

  return (
    <section className="forecast-section hourly-chart-section" aria-label="Temperatura por horário">
      <h3 className="forecast-section-title">Temperatura por horário</h3>
      <div className="hourly-chart" style={{ height: CHART_HEIGHT }}>
        <div className="hourly-chart-bars">
          {slotsWithHeight.map((slot) => (
            <div key={slot.dt} className="hourly-chart-bar-wrap">
              <div
                className="hourly-chart-bar"
                style={{ height: `${slot.heightPct}%` }}
                title={`${slot.time}: ${slot.temp}°C`}
              />
              <span className="hourly-chart-temp">{slot.temp}°</span>
            </div>
          ))}
        </div>
      </div>
      <div className="hourly-chart-labels">
        {slotsWithHeight.map((slot) => (
          <span key={slot.dt} className="hourly-chart-label">
            {slot.time}
          </span>
        ))}
      </div>
    </section>
  )
}

export default memo(HourlyTemperatures)
