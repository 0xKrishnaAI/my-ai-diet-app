'use client'

import React from "react"

import { useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Home, Target, Utensils, Droplets, User } from 'lucide-react'

interface DockItem {
  icon: React.ReactNode
  label: string
  href: string
}

const dockItems: DockItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'Home', href: '/' },
  { icon: <Target className="w-5 h-5" />, label: 'Goals', href: '/profile' },
  { icon: <Utensils className="w-5 h-5" />, label: 'Meals', href: '/dashboard' },
  { icon: <Droplets className="w-5 h-5" />, label: 'Water', href: '/dashboard#water' },
  { icon: <User className="w-5 h-5" />, label: 'Profile', href: '/profile' },
]

interface FloatingDockProps {
  activeIndex?: number
  onNavigate?: (href: string) => void
}

export function FloatingDock({ activeIndex = 0, onNavigate }: FloatingDockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.nav
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={prefersReducedMotion ? {} : { delay: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
      className={cn(
        'fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3',
        'rounded-2xl',
        'bg-card/80 backdrop-blur-2xl',
        'border border-glass-border',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {dockItems.map((item, index) => (
        <motion.button
          key={item.label}
          onClick={() => onNavigate?.(item.href)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onFocus={() => setHoveredIndex(index)}
          onBlur={() => setHoveredIndex(null)}
          animate={prefersReducedMotion ? {} : {
            scale: hoveredIndex === index ? 1.2 : 1,
            y: hoveredIndex === index ? -8 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={cn(
            'relative p-2.5 sm:p-3 rounded-xl transition-colors duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            activeIndex === index
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          )}
          aria-label={item.label}
          aria-current={activeIndex === index ? 'page' : undefined}
        >
          {item.icon}

          {/* Active indicator */}
          {activeIndex === index && (
            <motion.div
              layoutId="dock-indicator"
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}

          {/* Label tooltip */}
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'absolute -top-10 left-1/2 -translate-x-1/2',
                  'px-3 py-1.5 rounded-lg',
                  'bg-card border border-glass-border',
                  'text-xs font-medium text-foreground',
                  'whitespace-nowrap',
                  'pointer-events-none'
                )}
                role="tooltip"
              >
                {item.label}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </motion.nav>
  )
}
