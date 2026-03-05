import { useEffect, useRef, memo } from 'react'

// ─── Particle pools ───────────────────────────────────────────
function createRainDrops(w, h, count = 200) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * w * 1.2 - w * 0.1,
        y: Math.random() * h,
        len: 12 + Math.random() * 20,
        speed: 14 + Math.random() * 10,
        thickness: 1 + Math.random() * 1.5,
        opacity: 0.15 + Math.random() * 0.35,
        wind: 1.5 + Math.random() * 2,
    }))
}

function createSplashes(count = 30) {
    return Array.from({ length: count }, () => ({
        x: 0, y: 0, radius: 0, maxRadius: 0, opacity: 0, active: false,
    }))
}

function createSnowFlakes(w, h, count = 120) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1.5 + Math.random() * 3.5,
        speed: 0.5 + Math.random() * 1.5,
        wind: -0.3 + Math.random() * 0.6,
        wobbleAmp: 30 + Math.random() * 40,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: 0.4 + Math.random() * 0.5,
        t: Math.random() * 1000,
    }))
}

function createStars(w, h, count = 80) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.7,
        r: 0.5 + Math.random() * 2,
        twinkleSpeed: 0.005 + Math.random() * 0.015,
        twinkleOffset: Math.random() * Math.PI * 2,
        baseOpacity: 0.3 + Math.random() * 0.5,
    }))
}

function createFireflies(w, h, count = 25) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: h * 0.3 + Math.random() * h * 0.6,
        speedX: (-0.3 + Math.random() * 0.6),
        speedY: (-0.2 + Math.random() * 0.4),
        r: 2 + Math.random() * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2,
        t: Math.random() * 1000,
    }))
}

function createClouds(w, h, count = 6) {
    return Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w * 1.5 - w * 0.25,
        y: h * 0.05 + Math.random() * h * 0.4,
        width: 180 + Math.random() * 250,
        height: 60 + Math.random() * 80,
        speed: 0.15 + Math.random() * 0.4,
        opacity: 0.12 + Math.random() * 0.2,
        puffs: Array.from({ length: 4 + Math.floor(Math.random() * 4) }, () => ({
            ox: (-0.3 + Math.random() * 0.6),
            oy: (-0.3 + Math.random() * 0.6),
            r: 0.3 + Math.random() * 0.5,
        })),
    }))
}

function createMistLayers(w, h) {
    return Array.from({ length: 5 }, (_, i) => ({
        y: h * (0.15 + i * 0.17),
        amplitude: 20 + Math.random() * 30,
        speed: 0.0005 + Math.random() * 0.001,
        thickness: 60 + Math.random() * 80,
        opacity: 0.08 + Math.random() * 0.12,
        offset: Math.random() * Math.PI * 2,
    }))
}

// ─── Draw helpers ─────────────────────────────────────────────
function drawRain(ctx, drops, splashes, w, h, dt) {
    const dtSec = dt / 16
    let splashIdx = 0

    drops.forEach(d => {
        d.x += d.wind * dtSec
        d.y += d.speed * dtSec

        if (d.y > h) {
            // Activate a splash
            if (splashIdx < splashes.length) {
                const s = splashes[splashIdx]
                s.x = d.x
                s.y = h - 2 + Math.random() * 4
                s.radius = 0
                s.maxRadius = 3 + Math.random() * 5
                s.opacity = 0.3 + Math.random() * 0.3
                s.active = true
                splashIdx++
            }
            d.y = -d.len - Math.random() * 100
            d.x = Math.random() * w * 1.2 - w * 0.1
        }

        ctx.beginPath()
        ctx.strokeStyle = `rgba(180, 210, 240, ${d.opacity})`
        ctx.lineWidth = d.thickness
        ctx.lineCap = 'round'
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x + d.wind * 0.6, d.y + d.len)
        ctx.stroke()
    })

    // Draw splashes
    splashes.forEach(s => {
        if (!s.active) return
        s.radius += 0.35 * dtSec
        s.opacity -= 0.015 * dtSec
        if (s.radius >= s.maxRadius || s.opacity <= 0) {
            s.active = false
            return
        }
        ctx.beginPath()
        ctx.strokeStyle = `rgba(200, 220, 255, ${s.opacity})`
        ctx.lineWidth = 1
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI, true)
        ctx.stroke()
    })
}

function drawSnow(ctx, flakes, w, h, dt, time) {
    const dtSec = dt / 16
    flakes.forEach(f => {
        f.t += dtSec
        f.y += f.speed * dtSec
        f.x += f.wind * dtSec + Math.sin(f.wobbleOffset + f.t * f.wobbleSpeed) * 0.3

        if (f.y > h + 10) {
            f.y = -10
            f.x = Math.random() * w
        }
        if (f.x > w + 20) f.x = -20
        if (f.x < -20) f.x = w + 20

        const glow = f.r > 3 ? 6 : 3
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity * 0.3})`
        ctx.arc(f.x, f.y, f.r + glow, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fill()
    })
}

function drawLightning(ctx, w, h, time) {
    const cycle = time % 8000
    const shouldFlash = (cycle > 3000 && cycle < 3150) ||
        (cycle > 3200 && cycle < 3280) ||
        (cycle > 6500 && cycle < 6600)

    if (!shouldFlash) return

    const intensity = 0.15 + Math.random() * 0.25
    ctx.fillStyle = `rgba(200, 210, 255, ${intensity})`
    ctx.fillRect(0, 0, w, h)

    // Draw bolt
    if (Math.random() > 0.5) {
        const startX = w * (0.2 + Math.random() * 0.6)
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`
        ctx.lineWidth = 2 + Math.random() * 2
        ctx.moveTo(startX, 0)
        let x = startX, y = 0
        const segments = 8 + Math.floor(Math.random() * 8)
        for (let i = 0; i < segments; i++) {
            x += (-30 + Math.random() * 60)
            y += h / segments * (0.6 + Math.random() * 0.8)
            ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Glow around bolt
        ctx.shadowColor = 'rgba(180, 200, 255, 0.8)'
        ctx.shadowBlur = 20
        ctx.stroke()
        ctx.shadowBlur = 0
    }
}

function drawStars(ctx, stars, time) {
    stars.forEach(s => {
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset)
        const opacity = s.baseOpacity + twinkle * 0.3
        if (opacity <= 0) return

        // Glow
        ctx.beginPath()
        ctx.fillStyle = `rgba(200, 210, 255, ${opacity * 0.3})`
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()

        // Cross sparkle for bigger stars
        if (s.r > 1.5 && twinkle > 0.2) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`
            ctx.lineWidth = 0.5
            const len = s.r * 3 * twinkle
            ctx.beginPath()
            ctx.moveTo(s.x - len, s.y)
            ctx.lineTo(s.x + len, s.y)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(s.x, s.y - len)
            ctx.lineTo(s.x, s.y + len)
            ctx.stroke()
        }
    })
}

function drawMoon(ctx, w, h) {
    const mx = w * 0.82, my = h * 0.12, r = 35

    // Outer glow
    const glow = ctx.createRadialGradient(mx, my, r * 0.5, mx, my, r * 4)
    glow.addColorStop(0, 'rgba(200, 210, 240, 0.12)')
    glow.addColorStop(0.5, 'rgba(180, 190, 220, 0.05)')
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(mx - r * 4, my - r * 4, r * 8, r * 8)

    // Moon body
    const moonGrad = ctx.createRadialGradient(mx - r * 0.2, my - r * 0.2, 0, mx, my, r)
    moonGrad.addColorStop(0, 'rgba(245, 245, 250, 0.95)')
    moonGrad.addColorStop(0.6, 'rgba(220, 220, 235, 0.9)')
    moonGrad.addColorStop(1, 'rgba(200, 200, 215, 0.85)')
    ctx.beginPath()
    ctx.fillStyle = moonGrad
    ctx.arc(mx, my, r, 0, Math.PI * 2)
    ctx.fill()

    // Craters
    const craters = [
        { ox: -8, oy: -5, cr: 6 },
        { ox: 10, oy: 8, cr: 4 },
        { ox: -3, oy: 12, cr: 5 },
        { ox: 12, oy: -10, cr: 3 },
    ]
    craters.forEach(c => {
        ctx.beginPath()
        ctx.fillStyle = 'rgba(180, 180, 195, 0.25)'
        ctx.arc(mx + c.ox, my + c.oy, c.cr, 0, Math.PI * 2)
        ctx.fill()
    })
}

function drawFireflies(ctx, flies, w, h, dt, time) {
    const dtSec = dt / 16
    flies.forEach(f => {
        f.t += dtSec
        f.x += f.speedX * dtSec
        f.y += f.speedY * dtSec

        // Gentle direction changes
        if (Math.random() < 0.005) {
            f.speedX = -0.3 + Math.random() * 0.6
            f.speedY = -0.2 + Math.random() * 0.4
        }

        // Wrap
        if (f.x < -20) f.x = w + 20
        if (f.x > w + 20) f.x = -20
        if (f.y < h * 0.2) f.y = h * 0.8
        if (f.y > h * 0.9) f.y = h * 0.3

        const pulse = Math.sin(f.t * f.pulseSpeed + f.pulseOffset)
        const opacity = Math.max(0, 0.2 + pulse * 0.6)

        // Outer glow
        const glowGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6)
        glowGrad.addColorStop(0, `rgba(255, 230, 100, ${opacity * 0.4})`)
        glowGrad.addColorStop(0.5, `rgba(255, 200, 50, ${opacity * 0.15})`)
        glowGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = glowGrad
        ctx.fillRect(f.x - f.r * 6, f.y - f.r * 6, f.r * 12, f.r * 12)

        // Core
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 240, 120, ${opacity})`
        ctx.arc(f.x, f.y, f.r * (0.8 + pulse * 0.2), 0, Math.PI * 2)
        ctx.fill()
    })
}

function drawClouds(ctx, clouds, w, h, dt) {
    const dtSec = dt / 16
    clouds.forEach(c => {
        c.x += c.speed * dtSec
        if (c.x > w + c.width) c.x = -c.width * 1.5

        ctx.save()
        ctx.globalAlpha = c.opacity
        c.puffs.forEach(p => {
            const px = c.x + c.width * (0.5 + p.ox * 0.5)
            const py = c.y + c.height * p.oy
            const pr = c.width * p.r * 0.3
            const grad = ctx.createRadialGradient(px, py, 0, px, py, pr)
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)')
            grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)')
            grad.addColorStop(1, 'transparent')
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(px, py, pr, 0, Math.PI * 2)
            ctx.fill()
        })
        ctx.restore()
    })
}

function drawMist(ctx, layers, w, h, time) {
    layers.forEach(l => {
        const waveX = Math.sin(time * l.speed + l.offset) * l.amplitude
        const grad = ctx.createLinearGradient(0, l.y - l.thickness, 0, l.y + l.thickness)
        grad.addColorStop(0, 'transparent')
        grad.addColorStop(0.3, `rgba(255, 255, 255, ${l.opacity})`)
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${l.opacity * 1.3})`)
        grad.addColorStop(0.7, `rgba(255, 255, 255, ${l.opacity})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(waveX - 50, l.y - l.thickness, w + 100, l.thickness * 2)
    })
}

function drawSun(ctx, w, h, time) {
    const sx = w * 0.78, sy = h * 0.12, r = 50

    // Large glow
    const pulse = Math.sin(time * 0.001) * 0.05
    const glow1 = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 6)
    glow1.addColorStop(0, `rgba(255, 220, 80, ${0.12 + pulse})`)
    glow1.addColorStop(0.3, `rgba(255, 200, 60, ${0.06 + pulse})`)
    glow1.addColorStop(0.6, `rgba(255, 180, 40, 0.02)`)
    glow1.addColorStop(1, 'transparent')
    ctx.fillStyle = glow1
    ctx.fillRect(0, 0, w, h * 0.6)

    // Rays
    ctx.save()
    ctx.translate(sx, sy)
    const rayCount = 12
    const rotation = time * 0.0002
    for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + rotation
        const rayLen = r * 3 + Math.sin(time * 0.002 + i) * r * 0.5
        ctx.save()
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.moveTo(0, -r * 1.2)
        ctx.lineTo(-4, -rayLen)
        ctx.lineTo(4, -rayLen)
        ctx.closePath()
        ctx.fillStyle = `rgba(255, 230, 120, ${0.04 + Math.sin(time * 0.003 + i * 0.5) * 0.02})`
        ctx.fill()
        ctx.restore()
    }
    ctx.restore()

    // Sun orb
    const orbGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r)
    orbGrad.addColorStop(0, 'rgba(255, 240, 180, 0.25)')
    orbGrad.addColorStop(0.4, 'rgba(255, 220, 120, 0.12)')
    orbGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = orbGrad
    ctx.beginPath()
    ctx.arc(sx, sy, r, 0, Math.PI * 2)
    ctx.fill()
}

function drawDuskGlow(ctx, w, h, time) {
    const pulse = Math.sin(time * 0.0008) * 0.03

    // Horizon glow
    const horizonGrad = ctx.createLinearGradient(0, h * 0.5, 0, h)
    horizonGrad.addColorStop(0, 'transparent')
    horizonGrad.addColorStop(0.3, `rgba(255, 120, 50, ${0.04 + pulse})`)
    horizonGrad.addColorStop(0.6, `rgba(255, 80, 40, ${0.08 + pulse})`)
    horizonGrad.addColorStop(1, `rgba(200, 50, 30, ${0.06 + pulse})`)
    ctx.fillStyle = horizonGrad
    ctx.fillRect(0, h * 0.5, w, h * 0.5)

    // Sun disk on horizon
    const sx = w * 0.5, sy = h * 0.85
    const sunGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 120)
    sunGrad.addColorStop(0, `rgba(255, 160, 60, ${0.3 + pulse})`)
    sunGrad.addColorStop(0.3, `rgba(255, 120, 40, ${0.15 + pulse})`)
    sunGrad.addColorStop(0.6, `rgba(255, 80, 30, 0.05)`)
    sunGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = sunGrad
    ctx.beginPath()
    ctx.arc(sx, sy, 120, 0, Math.PI * 2)
    ctx.fill()
}

function drawDawnGlow(ctx, w, h, time) {
    const pulse = Math.sin(time * 0.0006) * 0.03

    // Horizon glow - warm pastel
    const horizonGrad = ctx.createLinearGradient(0, h * 0.5, 0, h)
    horizonGrad.addColorStop(0, 'transparent')
    horizonGrad.addColorStop(0.4, `rgba(255, 180, 100, ${0.04 + pulse})`)
    horizonGrad.addColorStop(0.7, `rgba(255, 200, 130, ${0.08 + pulse})`)
    horizonGrad.addColorStop(1, `rgba(255, 220, 160, ${0.06 + pulse})`)
    ctx.fillStyle = horizonGrad
    ctx.fillRect(0, h * 0.5, w, h * 0.5)

    // Glow on the right (sunrise side)
    const sx = w * 0.85, sy = h * 0.8
    const sunGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 160)
    sunGrad.addColorStop(0, `rgba(255, 200, 120, ${0.2 + pulse})`)
    sunGrad.addColorStop(0.4, `rgba(255, 170, 80, ${0.1 + pulse})`)
    sunGrad.addColorStop(0.7, `rgba(255, 140, 60, 0.04)`)
    sunGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = sunGrad
    ctx.beginPath()
    ctx.arc(sx, sy, 160, 0, Math.PI * 2)
    ctx.fill()
}

// ─── Main Canvas component ───────────────────────────────────
function WeatherCanvas({ theme, timeOfDay, tempBand, isWindy }) {
    const canvasRef = useRef(null)
    const stateRef = useRef(null)
    const animRef = useRef(null)
    const prevTimeRef = useRef(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            canvas.width = window.innerWidth * dpr
            canvas.height = window.innerHeight * dpr
            canvas.style.width = window.innerWidth + 'px'
            canvas.style.height = window.innerHeight + 'px'
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
        resize()

        const w = window.innerWidth
        const h = window.innerHeight

        // Initialize particles
        stateRef.current = {
            rainDrops: createRainDrops(w, h),
            splashes: createSplashes(),
            snowFlakes: createSnowFlakes(w, h),
            stars: createStars(w, h),
            fireflies: createFireflies(w, h),
            clouds: createClouds(w, h),
            mistLayers: createMistLayers(w, h),
        }

        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
            if (animRef.current) cancelAnimationFrame(animRef.current)
        }
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !stateRef.current) return
        const ctx = canvas.getContext('2d')

        const isNight = timeOfDay === 'night'
        const isDusk = timeOfDay === 'dusk'
        const isDawn = timeOfDay === 'dawn'
        const isRain = theme === 'rain' || theme === 'drizzle'
        const isThunder = theme === 'thunderstorm'
        const isSnow = theme === 'snow'
        const isClouds = theme === 'clouds'
        const isMist = theme === 'mist'
        const isClear = theme === 'clear'
        const isWarmNight = isNight && (tempBand === 'warm' || tempBand === 'hot')

        let startTime = performance.now()

        const animate = (timestamp) => {
            const dt = Math.min(timestamp - (prevTimeRef.current || timestamp), 50)
            prevTimeRef.current = timestamp
            const elapsed = timestamp - startTime
            const w = window.innerWidth
            const h = window.innerHeight
            const s = stateRef.current

            ctx.clearRect(0, 0, w, h)

            // Background time-of-day effects
            if (isDusk) drawDuskGlow(ctx, w, h, elapsed)
            if (isDawn) drawDawnGlow(ctx, w, h, elapsed)
            if (!isNight && !isDusk && !isDawn && isClear) drawSun(ctx, w, h, elapsed)

            // Weather conditions
            if (isClouds || (isRain && !isThunder)) drawClouds(ctx, s.clouds, w, h, dt)
            if (isMist) drawMist(ctx, s.mistLayers, w, h, elapsed)
            if (isRain || isThunder) drawRain(ctx, s.rainDrops, s.splashes, w, h, dt)
            if (isThunder) {
                drawClouds(ctx, s.clouds, w, h, dt)
                drawLightning(ctx, w, h, elapsed)
            }
            if (isSnow) drawSnow(ctx, s.snowFlakes, w, h, dt, elapsed)

            // Night effects
            if (isNight) {
                drawStars(ctx, s.stars, elapsed)
                drawMoon(ctx, w, h)
            }
            if (isWarmNight) drawFireflies(ctx, s.fireflies, w, h, dt, elapsed)

            // Wind streaks (drawn as simple fast lines)
            if (isWindy) {
                ctx.globalAlpha = 0.15
                for (let i = 0; i < 5; i++) {
                    const wy = h * (0.15 + i * 0.17)
                    const wx = ((elapsed * 0.3 + i * 400) % (w * 1.6)) - w * 0.3
                    ctx.beginPath()
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
                    ctx.lineWidth = 1
                    ctx.moveTo(wx, wy)
                    ctx.lineTo(wx + w * 0.25, wy - 2)
                    ctx.stroke()
                }
                ctx.globalAlpha = 1
            }

            animRef.current = requestAnimationFrame(animate)
        }

        animRef.current = requestAnimationFrame(animate)
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current)
        }
    }, [theme, timeOfDay, tempBand, isWindy])

    return (
        <canvas
            ref={canvasRef}
            className="weather-canvas"
            aria-hidden="true"
        />
    )
}

export default memo(WeatherCanvas)
