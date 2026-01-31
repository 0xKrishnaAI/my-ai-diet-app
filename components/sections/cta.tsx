'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { MagneticButton } from '@/components/antigravity/magnetic-button'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ArrowRight, Sparkles } from 'lucide-react'

interface CTAProps {
  onGetStarted: () => void
}

export function CTA({ onGetStarted }: CTAProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative px-4 sm:px-6 py-20 sm:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center p-8 sm:p-12 lg:p-16 rounded-3xl bg-card/50 backdrop-blur-xl border border-glass-border"
        >
          {/* Icon */}
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-6"
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Ready to Transform Your{' '}
            <span className="text-primary">Nutrition?</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands who have already revolutionized their health with AI-powered meal planning.
            Start your free trial today - no credit card required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton onClick={onGetStarted} className="group w-full sm:w-auto">
              <span className="flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>

            <ShimmerButton
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/80"
            >
              Schedule Demo
            </ShimmerButton>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="flex -space-x-2">
              {['JM', 'SK', 'AL', 'RW'].map((initials, i) => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-400 border-2 border-background flex items-center justify-center text-xs font-semibold text-white"
                  style={{ zIndex: 4 - i }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              <span className="text-foreground font-semibold">500+</span> joined this week
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
