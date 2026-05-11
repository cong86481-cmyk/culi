'use client'

import { useEffect, useState, useRef } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinkleDelay: number
}

interface Meteor {
  id: number
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
}

export function FloatingParticles() {
  const [stars, setStars] = useState<Star[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const meteorsRef = useRef<Meteor[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    // Generate fewer stars
    const newStars: Star[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      twinkleSpeed: Math.random() * 3 + 2,
      twinkleDelay: Math.random() * 3,
    }))
    setStars(newStars)

    // Canvas cho meteors
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let meteorId = 0
    let lastMeteorTime = 0
    const meteorInterval = 3000 // Tăng interval để giảm số lượng

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    let time = 0
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate)
      
      const deltaTime = currentTime - lastTime
      lastTime = currentTime
      time += deltaTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn meteor định kỳ
      if (currentTime - lastMeteorTime > meteorInterval && meteorsRef.current.length < 2) {
        meteorsRef.current.push({
          id: meteorId++,
          x: Math.random() * canvas.width * 0.8,
          y: Math.random() * canvas.height * 0.2,
          length: 80 + Math.random() * 60,
          speed: 6 + Math.random() * 4,
          angle: Math.PI / 4,
          opacity: 1,
        })
        lastMeteorTime = currentTime
      }

      // Update và vẽ meteors
      for (let i = meteorsRef.current.length - 1; i >= 0; i--) {
        const meteor = meteorsRef.current[i]
        meteor.x += Math.cos(meteor.angle) * meteor.speed
        meteor.y += Math.sin(meteor.angle) * meteor.speed
        meteor.opacity -= 0.015

        if (meteor.opacity <= 0 || meteor.x > canvas.width || meteor.y > canvas.height) {
          meteorsRef.current.splice(i, 1)
          continue
        }

        // Vẽ meteor đơn giản
        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length

        const gradient = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y)
        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(0.7, `rgba(255, 200, 100, ${meteor.opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(255, 255, 255, ${meteor.opacity})`)

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(meteor.x, meteor.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      // Vẽ glow cho stars trên canvas (chỉ vài stars)
      stars.slice(0, 20).forEach((star) => {
        const twinkle = Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleDelay) * 0.3 + 0.7
        
        ctx.beginPath()
        ctx.arc(
          (star.x / 100) * canvas.width,
          (star.y / 100) * canvas.height,
          star.size * (1 + twinkle * 0.3),
          0,
          Math.PI * 2
        )
        ctx.fillStyle = `rgba(255, 200, 100, ${star.opacity * twinkle * 0.15})`
        ctx.fill()
      })
    }
    animate(0)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {/* Stars - SVG đơn giản */}
      <svg className="absolute inset-0 w-full h-full">
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="rgba(255, 200, 120, 1)"
            opacity={star.opacity}
            style={{
              animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
              animationDelay: `${star.twinkleDelay}s`,
            }}
          />
        ))}
      </svg>

      {/* Canvas cho meteors */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-70"
        style={{ mixBlendMode: 'screen' }}
      />

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}

// Cosmic dust - CSS thuần túy
export function CosmicDust() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: 15 + Math.random() * 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: 'rgba(255, 150, 50, 0.4)',
            animation: `dust-${p.id % 3} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes dust-0 {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.3; }
          100% { transform: translate(-50px, -100px); opacity: 0; }
        }
        
        @keyframes dust-1 {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          25% { opacity: 0.4; }
          75% { opacity: 0.2; }
          100% { transform: translate(40px, -80px); opacity: 0; }
        }
        
        @keyframes dust-2 {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          30% { opacity: 0.45; }
          70% { opacity: 0.25; }
          100% { transform: translate(-30px, -120px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// Energy Lines - CSS đơn giản
export function EnergyLines() {
  const lines = [
    { angle: 0, delay: 0 },
    { angle: 45, delay: 0.5 },
    { angle: 90, delay: 1 },
    { angle: 135, delay: 1.5 },
    { angle: 180, delay: 2 },
    { angle: 225, delay: 2.5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {lines.map((line) => (
        <div
          key={line.angle}
          className="absolute top-1/2 left-1/2 origin-left"
          style={{
            width: '150px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.4), transparent)',
            transform: `rotate(${line.angle}deg)`,
            animation: 'energyPulse 3s ease-in-out infinite',
            animationDelay: `${line.delay}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes energyPulse {
          0%, 100% { opacity: 0; transform: rotate(var(--angle)) scaleX(0); }
          50% { opacity: 1; transform: rotate(var(--angle)) scaleX(1); }
        }
      `}</style>
    </div>
  )
}

// Pulse Rings - CSS đơn giản
export function PulseRings() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full border border-[rgba(255,107,0,0.2)]"
          style={{
            width: `${100 + i * 100}px`,
            height: `${100 + i * 100}px`,
            marginLeft: `-${50 + i * 50}px`,
            marginTop: `-${50 + i * 50}px`,
            animation: 'pulseRing 4s ease-out infinite',
            animationDelay: `${i * 1.3}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes pulseRing {
          0% { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
