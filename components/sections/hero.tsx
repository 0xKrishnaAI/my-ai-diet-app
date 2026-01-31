'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { MagneticButton } from '@/components/antigravity/magnetic-button'
import { BlurText } from '@/components/ui/blur-text'
import { StaggerText } from '@/components/ui/stagger-text'
import { TypingEffect } from '@/components/ui/typing-effect'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { ParticleBackground } from '@/components/ui/particle-background'
import { Sparkles, ArrowRight, Play, Apple, Salad, Carrot, Leaf } from 'lucide-react'
import { useState } from 'react'

interface HeroProps {
  onGetStarted: () => void
}

const floatingFoods = [
  { icon: Apple, color: 'text-red-400', delay: 0 },
  { icon: Salad, color: 'text-green-400', delay: 0.5 },
  { icon: Carrot, color: 'text-orange-400', delay: 1 },
  { icon: Leaf, color: 'text-emerald-400', delay: 1.5 },
]

export function Hero({ onGetStarted }: HeroProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isHoveringDemo, setIsHoveringDemo] = useState(false)

  return (
    <AuroraBackground className="min-h-screen">
      <section className="relative flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20 min-h-screen overflow-hidden">
        {/* Particle background */}
        <ParticleBackground particleCount={40} className="z-0" />
        {/* Floating food icons */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {floatingFoods.map((food, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  y: [-20, -200],
                  x: Math.sin(index * 2) * 50,
                }}
                transition={{
                  duration: 4,
                  delay: food.delay,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className={`absolute ${food.color}`}
                style={{
                  left: `${15 + index * 25}%`,
                  bottom: '10%',
                }}
              >
                <food.icon className="w-8 h-8" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass border border-glass-border mb-6 sm:mb-8 backdrop-blur-sm"
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            </motion.div>
            <span className="text-sm text-muted-foreground">AI-Powered Nutrition Platform</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
              New
            </span>
          </motion.div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 sm:mb-6">
            <BlurText text="Eat Smarter with" className="text-foreground block" />
            <span className="text-primary mt-2 block">
              <StaggerText text="BiteAI" delay={0.5} staggerDelay={0.08} />
            </span>
          </h1>

          {/* Animated tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed px-4"
          >
            Your personal AI nutritionist that creates{' '}
            <span className="text-foreground font-medium">
              <TypingEffect
                words={['personalized meal plans', 'smart macro tracking', 'delicious recipes', 'real-time suggestions']}
                className="text-primary"
              />
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-base text-muted-foreground mb-8 sm:mb-12 px-4"
          >
            Powered by advanced AI. Trusted by 50,000+ health enthusiasts.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <MagneticButton onClick={onGetStarted} className="group w-full sm:w-auto">
              <span className="flex items-center justify-center gap-2">
                Start Free Trial
                <motion.span
                  animate={prefersReducedMotion ? {} : { x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </motion.span>
              </span>
            </MagneticButton>

            <motion.button
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              onMouseEnter={() => setIsHoveringDemo(true)}
              onMouseLeave={() => setIsHoveringDemo(false)}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-foreground border border-glass-border hover:bg-glass hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-2 group"
              aria-label="Watch demo video"
            >
              <motion.div
                animate={isHoveringDemo && !prefersReducedMotion ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="p-1 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors"
              >
                <Play className="w-3 h-3 text-primary fill-primary" aria-hidden="true" />
              </motion.div>
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats with animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-16 max-w-xl mx-auto"
          >
            {[
              { value: 50000, suffix: '+', label: 'Active Users' },
              { value: 2000000, suffix: '+', label: 'Meals Generated' },
              { value: 98, suffix: '%', label: 'Goal Success' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={prefersReducedMotion ? {} : { y: -5 }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { opacity: [1, 0.3, 1], y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>

        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>
    </AuroraBackground>
  )
}
