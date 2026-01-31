'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiEffectProps {
  active: boolean
  onComplete?: () => void
  duration?: number
  particleCount?: number
}

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  color: string
  velocity: { x: number; y: number }
}

const colors = [
  '#22c55e', // primary green
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#eab308', // yellow
  '#f97316', // orange
  '#ec4899', // pink
  '#8b5cf6', // purple
]

export function ConfettiEffect({ 
  active, 
  onComplete, 
  duration = 3000,
  particleCount = 50 
}: ConfettiEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (active) {
      // Generate particles
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 100,
          y: Math.random() * 30 + 50,
        },
      }))
      setParticles(newParticles)

      // Clear after duration
      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [active, duration, particleCount, onComplete])

  if (!active && particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              rotate: particle.rotation,
              scale: particle.scale,
              opacity: 1,
            }}
            animate={{
              x: `${particle.x + particle.velocity.x}%`,
              y: `${particle.y + particle.velocity.y}%`,
              rotate: particle.rotation + 720,
              opacity: 0,
            }}
            transition={{
              duration: duration / 1000,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              backgroundColor: particle.color,
              boxShadow: `0 0 8px ${particle.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
