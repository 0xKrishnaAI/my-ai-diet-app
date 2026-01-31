'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Flame, Coffee, Check, Copy } from 'lucide-react'
import type { Meal } from '@/data/mock-plan'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface MealDetailModalProps {
    meal: Meal | null
    isOpen: boolean
    onClose: () => void
    onMarkComplete?: () => void
    isCompleted?: boolean
}

export function MealDetailModal({
    meal,
    isOpen,
    onClose,
    onMarkComplete,
    isCompleted = false
}: MealDetailModalProps) {
    const [copied, setCopied] = useState(false)

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (isOpen && e.key === 'Escape') {
                onClose()
            }
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    if (!meal) return null

    const handleCopyIngredients = () => {
        const text = meal.ingredients.join('\n')
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-none">
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="meal-modal-title"
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="bg-card border-t sm:border border-glass-border sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="relative p-6 border-b border-glass-border">
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </motion.button>



                                <h2 id="meal-modal-title" className="text-2xl font-bold text-foreground pr-10">{meal.name}</h2>

                                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>{meal.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Flame className="w-4 h-4" />
                                        <span>{meal.calories} cal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Macros */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: 'Protein', value: `${meal.protein}g`, color: 'text-blue-400' },
                                        { label: 'Carbs', value: `${meal.carbs}g`, color: 'text-amber-400' },
                                        { label: 'Fat', value: `${meal.fat}g`, color: 'text-pink-400' },
                                    ].map((macro) => (
                                        <motion.div
                                            key={macro.label}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center p-4 rounded-xl bg-secondary/50 border border-glass-border"
                                        >
                                            <p className="text-xs text-muted-foreground mb-1">{macro.label}</p>
                                            <p className={cn('text-xl font-bold', macro.color)}>{macro.value}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Ingredients */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-foreground">Ingredients</h3>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleCopyIngredients}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    Copy List
                                                </>
                                            )}
                                        </motion.button>
                                    </div>

                                    <div className="space-y-2">
                                        {meal.ingredients.map((ingredient, index) => (
                                            <motion.div
                                                key={ingredient}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-glass border border-glass-border"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                <span className="text-foreground">{ingredient}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Preparation hint */}
                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                    <div className="flex items-start gap-3">
                                        <Coffee className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium text-foreground mb-1">Pro Tip</p>
                                            <p className="text-sm text-muted-foreground">
                                                Prep these ingredients the night before for a quick and easy meal. Store in airtight containers for freshness.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            {onMarkComplete && (
                                <div className="p-6 border-t border-glass-border">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onMarkComplete}
                                        className={cn(
                                            'w-full px-6 py-4 rounded-full font-semibold transition-all',
                                            isCompleted
                                                ? 'bg-secondary text-foreground'
                                                : 'bg-primary text-primary-foreground'
                                        )}
                                    >
                                        {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )
            }
        </AnimatePresence >
    )
}
