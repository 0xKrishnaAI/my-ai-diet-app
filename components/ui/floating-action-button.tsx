'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, RefreshCw, Camera, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  onQuickSwap?: () => void
  onScanMeal?: () => void
  onAiSuggest?: () => void
}

export function FloatingActionButton({ onQuickSwap, onScanMeal, onAiSuggest }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: RefreshCw, label: 'Quick Swap', onClick: onQuickSwap, color: 'bg-blue-500' },
    { icon: Camera, label: 'Upload Photo', onClick: onScanMeal, color: 'bg-purple-500' },
    { icon: Sparkles, label: 'AI Suggest', onClick: onAiSuggest, color: 'bg-primary' },
  ]

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col-reverse items-center gap-3">
      {/* Action buttons */}
      <AnimatePresence>
        {isOpen && (
          <>
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  action.onClick?.()
                  setIsOpen(false)
                }}
                className="group flex items-center gap-3"
              >
                {/* Label */}
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  className="px-3 py-1.5 rounded-lg bg-card border border-glass-border text-sm font-medium text-foreground whitespace-nowrap shadow-lg"
                >
                  {action.label}
                </motion.span>

                {/* Icon button */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110',
                    action.color
                  )}
                >
                  <action.icon className="w-5 h-5" />
                </div>
              </motion.button>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)]',
          'bg-primary text-primary-foreground',
          'transition-shadow hover:shadow-[0_0_30px_oklch(0.696_0.17_145_/_0.5)]'
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
