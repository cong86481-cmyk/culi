'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Throttled mouse tracking
  useEffect(() => {
    let ticking = false
    const handleMouse = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePos({ x: e.clientX, y: e.clientY })
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Giảm số lượng particles
    particlesRef.current = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.2,
    }))

    let time = 0
    // Giảm frame rate bằng cách đếm frames
    let frameCount = 0
    const targetFPS = 30
    const frameInterval = 1000 / targetFPS
    let lastFrameTime = 0

    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate)
      
      // Skip frames để giảm CPU usage
      if (currentTime - lastFrameTime < frameInterval) return
      lastFrameTime = currentTime
      frameCount++
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.016

      const particles = particlesRef.current

      // Vẽ connection lines (mỗi 2 frames)
      if (frameCount % 2 === 0) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 120) {
              const opacity = (1 - distance / 120) * 0.15
              ctx.beginPath()
              ctx.strokeStyle = `rgba(255, 107, 0, ${opacity})`
              ctx.lineWidth = 0.5
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }

      // Update và vẽ particles (mỗi frame)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        
        const twinkle = Math.sin(time * 2 + p.id) * 0.2 + 0.8
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 140, 58, ${p.opacity * twinkle})`
        ctx.fill()
      })

      // Mouse glow (đơn giản hóa)
      const gradient = ctx.createRadialGradient(
        mousePos.x, mousePos.y, 0,
        mousePos.x, mousePos.y, 120
      )
      gradient.addColorStop(0, 'rgba(255, 107, 0, 0.08)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(mousePos.x, mousePos.y, 120, 0, Math.PI * 2)
      ctx.fill()
    }

    animate(0)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePos])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#0D0D14] to-[#0A0A0F]" />
      
      {/* Top highlight */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[40vh] bg-gradient-to-b from-[#FF6B00]/5 to-transparent" />
      
      {/* Canvas - đơn giản hóa */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10, 10, 15, 0.5) 100%)',
        }}
      />
    </div>
  )
}

// Gradient orbs - CSS thuần túy, không canvas
export function GradientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Primary orange orb */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full animate-orb-1"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '-10%',
          left: '-5%',
        }}
      />
      
      {/* Red orb */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full animate-orb-2"
        style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
          bottom: '-15%',
          right: '-5%',
        }}
      />
      
      {/* Purple orb */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full animate-orb-3"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '30%',
          right: '5%',
        }}
      />

      {/* Cyan orb */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full animate-orb-4"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          bottom: '20%',
          left: '10%',
        }}
      />

      <style jsx>{`
        @keyframes orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 30px) scale(1.1); }
        }
        
        @keyframes orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -30px) scale(1.05); }
        }
        
        @keyframes orb-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.08); }
        }
        
        @keyframes orb-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 20px) scale(1.06); }
        }

        .animate-orb-1 {
          animation: orb-1 20s ease-in-out infinite;
        }
        
        .animate-orb-2 {
          animation: orb-2 25s ease-in-out infinite;
        }
        
        .animate-orb-3 {
          animation: orb-3 18s ease-in-out infinite;
        }
        
        .animate-orb-4 {
          animation: orb-4 22s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Grid overlay - CSS thuần túy
export function GridOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[0]">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 107, 0, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 0, 1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  )
}

// Geometric shapes - CSS animations
export function GeometricShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Hexagons */}
      <svg className="absolute top-[15%] left-[10%] w-16 h-16 animate-float-1 opacity-20">
        <polygon
          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
          fill="none"
          stroke="rgba(255, 107, 0, 0.5)"
          strokeWidth="1"
        />
      </svg>
      
      <svg className="absolute top-[60%] right-[15%] w-12 h-12 animate-float-2 opacity-15">
        <polygon
          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
          fill="none"
          stroke="rgba(220, 38, 38, 0.5)"
          strokeWidth="1"
        />
      </svg>
      
      {/* Circles */}
      <div className="absolute top-[40%] left-[20%] w-10 h-10 rounded-full border border-[rgba(124,58,237,0.3)] animate-float-3 opacity-20" />
      <div className="absolute bottom-[30%] right-[25%] w-8 h-8 rounded-full border border-[rgba(6,182,212,0.3)] animate-float-4 opacity-15" />

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(180deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-15px, 15px) rotate(-180deg); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -15px); }
        }
        
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10px, 10px); }
        }

        .animate-float-1 {
          animation: float-1 15s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 18s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 12s ease-in-out infinite;
        }
        
        .animate-float-4 {
          animation: float-4 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
