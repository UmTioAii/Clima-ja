/**
 * Determines the time of day based on current time relative to sunrise/sunset.
 * @param {number} dtMs - current timestamp in milliseconds
 * @param {number|null} sunriseMs - sunrise timestamp in milliseconds
 * @param {number|null} sunsetMs - sunset timestamp in milliseconds
 * @returns {'dawn'|'morning'|'afternoon'|'dusk'|'night'}
 */
export function getTimeOfDay(dtMs, sunriseMs, sunsetMs) {
    if (!sunriseMs || !sunsetMs) {
        const hour = new Date(dtMs).getHours()
        if (hour >= 5 && hour < 7) return 'dawn'
        if (hour >= 7 && hour < 12) return 'morning'
        if (hour >= 12 && hour < 17) return 'afternoon'
        if (hour >= 17 && hour < 19) return 'dusk'
        return 'night'
    }

    const HOUR = 3600000
    const dawnStart = sunriseMs - HOUR
    const dawnEnd = sunriseMs + HOUR * 0.5
    const duskStart = sunsetMs - HOUR * 0.5
    const duskEnd = sunsetMs + HOUR

    if (dtMs >= dawnStart && dtMs < dawnEnd) return 'dawn'
    if (dtMs >= dawnEnd && dtMs < 12 * HOUR + new Date(dtMs).setHours(0, 0, 0, 0)) return 'morning'
    if (dtMs >= duskStart && dtMs <= duskEnd) return 'dusk'
    if (dtMs > sunsetMs) return 'night'
    if (dtMs < sunriseMs) return 'night'
    return 'afternoon'
}

/**
 * Determines the time-of-day label in Portuguese for display.
 */
export function getTimeOfDayLabel(timeOfDay) {
    const labels = {
        dawn: 'Amanhecer',
        morning: 'Manhã',
        afternoon: 'Tarde',
        dusk: 'Fim de tarde',
        night: 'Noite',
    }
    return labels[timeOfDay] || 'Dia'
}

/**
 * Determines the current season based on hemisphere and month.
 * @param {number} lat - latitude (negative = southern hemisphere)
 * @param {number} month - 0-based month (0=Jan, 11=Dec)
 * @returns {'spring'|'summer'|'autumn'|'winter'}
 */
export function getSeason(lat, month) {
    // Southern hemisphere seasons are inverted
    const isSouth = lat < 0
    // Meteorological seasons by month
    if (month >= 2 && month <= 4) return isSouth ? 'autumn' : 'spring'
    if (month >= 5 && month <= 7) return isSouth ? 'winter' : 'summer'
    if (month >= 8 && month <= 10) return isSouth ? 'spring' : 'autumn'
    return isSouth ? 'summer' : 'winter' // Dec, Jan, Feb
}

/**
 * Returns the background gradient colors based on time of day + weather theme.
 */
export function getBackgroundGradient(timeOfDay, theme) {
    const gradients = {
        // Dawn gradients
        'dawn-clear': 'linear-gradient(160deg, #0d1b2a 0%, #1b2838 15%, #e07946 45%, #f4a261 65%, #fcd5a0 100%)',
        'dawn-clouds': 'linear-gradient(160deg, #1a1a2e 0%, #3d405b 25%, #b07156 50%, #d4956b 75%, #e8c99b 100%)',
        'dawn-rain': 'linear-gradient(160deg, #0f1923 0%, #1e3a50 30%, #8b6c5c 55%, #a68b76 80%, #c4a882 100%)',
        'dawn-snow': 'linear-gradient(160deg, #2d3047 0%, #4a5568 30%, #b8a9c9 55%, #d4c5e0 80%, #eee5f5 100%)',
        'dawn-thunderstorm': 'linear-gradient(160deg, #0a0e17 0%, #1a1f3a 25%, #6b4c3b 50%, #8a6f5e 75%, #a89080 100%)',
        'dawn-drizzle': 'linear-gradient(160deg, #0f1923 0%, #1e3a50 30%, #8b6c5c 55%, #a68b76 80%, #c4a882 100%)',
        'dawn-mist': 'linear-gradient(160deg, #2c3e50 0%, #5d6d7e 30%, #c4a882 55%, #dbc4a0 80%, #f0e6d2 100%)',

        // Morning gradients
        'morning-clear': 'linear-gradient(160deg, #4facfe 0%, #48b1f7 30%, #77d4fc 60%, #f0f8ff 100%)',
        'morning-clouds': 'linear-gradient(160deg, #6b8cae 0%, #8faec4 35%, #b5cfe0 65%, #dde9f0 100%)',
        'morning-rain': 'linear-gradient(160deg, #2c3e50 0%, #3b5d78 35%, #5a8aa5 65%, #7ab0c7 100%)',
        'morning-snow': 'linear-gradient(160deg, #a8c0d8 0%, #c5d5e8 35%, #e2e8f0 65%, #f8fbff 100%)',
        'morning-thunderstorm': 'linear-gradient(160deg, #1a2332 0%, #2b3a50 35%, #3e5670 85%, #53708f 100%)',
        'morning-drizzle': 'linear-gradient(160deg, #3c5a72 0%, #5a8296 35%, #7ba8bc 65%, #a0c8dc 100%)',
        'morning-mist': 'linear-gradient(160deg, #8b9eb0 0%, #a8b8c8 35%, #c5d0dc 65%, #e0e8ef 100%)',

        // Afternoon gradients
        'afternoon-clear': 'linear-gradient(160deg, #2196f3 0%, #64b5f6 25%, #90caf9 50%, #e3f2fd 100%)',
        'afternoon-clouds': 'linear-gradient(160deg, #78909c 0%, #90a4ae 30%, #b0bec5 60%, #cfd8dc 100%)',
        'afternoon-rain': 'linear-gradient(160deg, #1e3a5f 0%, #2d5a87 40%, #3d7ab5 100%)',
        'afternoon-snow': 'linear-gradient(160deg, #b0c4de 0%, #c9d6e8 50%, #e8eef4 100%)',
        'afternoon-thunderstorm': 'linear-gradient(160deg, #0d1117 0%, #1a2332 30%, #2b3a50 60%, #3e5670 100%)',
        'afternoon-drizzle': 'linear-gradient(160deg, #2c5272 0%, #3e7896 40%, #5a9ab5 100%)',
        'afternoon-mist': 'linear-gradient(160deg, #8899aa 0%, #a0b1c0 40%, #b8c8d6 100%)',

        // Dusk (fim de tarde) gradients — the most dramatic
        'dusk-clear': 'linear-gradient(160deg, #0c1445 0%, #3b1854 15%, #7b2d53 30%, #c4523d 50%, #e8834a 65%, #f4b860 80%, #fce38a 100%)',
        'dusk-clouds': 'linear-gradient(160deg, #1a1a2e 0%, #3d2050 20%, #7a3b5e 40%, #b55a50 60%, #d4845a 80%, #e8b87a 100%)',
        'dusk-rain': 'linear-gradient(160deg, #0f1523 0%, #1c2a45 20%, #3b3252 40%, #6b4060 60%, #8b5a5a 80%, #a07050 100%)',
        'dusk-snow': 'linear-gradient(160deg, #2c2040 0%, #4a3060 25%, #6d5080 50%, #a080a0 75%, #d0b0c0 100%)',
        'dusk-thunderstorm': 'linear-gradient(160deg, #050510 0%, #0f0f25 20%, #1a153a 40%, #3b1854 60%, #5a2044 80%, #7a3040 100%)',
        'dusk-drizzle': 'linear-gradient(160deg, #0f1523 0%, #1c2a45 20%, #3b3252 40%, #6b4060 60%, #8b5a5a 80%, #a07050 100%)',
        'dusk-mist': 'linear-gradient(160deg, #3d3552 0%, #5a4a6a 25%, #806878 50%, #b08888 75%, #d0a8a0 100%)',

        // Night gradients
        'night-clear': 'linear-gradient(160deg, #020111 0%, #0a0e27 20%, #141852 45%, #1a1f5c 65%, #232a6e 85%, #2b3280 100%)',
        'night-clouds': 'linear-gradient(160deg, #0a0e17 0%, #111827 25%, #1e293b 50%, #2d3a4d 75%, #384456 100%)',
        'night-rain': 'linear-gradient(160deg, #060a10 0%, #0d1520 25%, #152030 50%, #1e2e45 100%)',
        'night-snow': 'linear-gradient(160deg, #1a1a2e 0%, #262640 25%, #353560 50%, #454580 75%, #5a5a9a 100%)',
        'night-thunderstorm': 'linear-gradient(160deg, #020208 0%, #08081a 25%, #0f0f2a 50%, #18183a 100%)',
        'night-drizzle': 'linear-gradient(160deg, #060a10 0%, #0d1520 25%, #152030 50%, #1e2e45 100%)',
        'night-mist': 'linear-gradient(160deg, #151520 0%, #1e2030 30%, #2a3040 60%, #364050 100%)',
    }

    const key = `${timeOfDay}-${theme}`
    return gradients[key] || gradients[`${timeOfDay}-clear`] || gradients['afternoon-clear']
}
