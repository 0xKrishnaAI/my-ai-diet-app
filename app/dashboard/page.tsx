'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingDock } from '@/components/antigravity/floating-dock'
import { MacroStats } from '@/components/sections/macro-stats'
import { WaterTracker } from '@/components/sections/water-tracker'
import { SwipeableMealCard } from '@/components/ui/swipeable-meal-card'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { VibeSwitcher } from '@/components/ui/vibe-switcher'
import { StreakDisplay } from '@/components/ui/streak-display'
import { DashboardSkeleton } from '@/components/ui/skeleton-loaders'
import { SmartEmptyState } from '@/components/ui/smart-empty-state'
import { PageTransition } from '@/components/ui/page-transition'
import { ConfettiEffect } from '@/components/ui/confetti-effect'
import { MealDetailModal } from '@/components/ui/meal-detail-modal'
import { useToast } from '@/components/ui/toast'
import type { Meal } from '@/data/mock-plan'
import { useAppState, vibeConfigs } from '@/lib/store'
import { mockPlan } from '@/data/mock-plan'
import { Calendar, ChevronLeft, ChevronRight, Sparkles, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

// Alternative meals for AI regeneration
const alternativeMeals: Meal[] = [
  {
    id: 'alt-1',
    name: 'Keto Avocado Salad',
    time: '12:30 PM',
    calories: 550,
    protein: 25,
    carbs: 12,
    fat: 45,
    image: '/meals/lunch.jpg',
    ingredients: ['Avocado', 'Bacon', 'Spinach', 'Olive Oil', 'Walnuts'],
  },
  {
    id: 'alt-2',
    name: 'Protein Pancakes',
    time: '8:00 AM',
    calories: 420,
    protein: 35,
    carbs: 40,
    fat: 10,
    image: '/meals/breakfast.jpg',
    ingredients: ['Oats', 'Protein Powder', 'Banana', 'Egg Whites', 'Maple Syrup'],
  },
  {
    id: 'alt-3',
    name: 'Grilled Steak & Asparagus',
    time: '7:00 PM',
    calories: 680,
    protein: 65,
    carbs: 10,
    fat: 35,
    image: '/meals/dinner.jpg',
    ingredients: ['Sirloin Steak', 'Asparagus', 'Butter', 'Garlic', 'Rosemary'],
  },
  {
    id: 'alt-4',
    name: 'Vegan Buddha Bowl',
    time: '1:00 PM',
    calories: 480,
    protein: 18,
    carbs: 65,
    fat: 15,
    image: '/meals/lunch.jpg',
    ingredients: ['Quinoa', 'Chickpeas', 'Sweet Potato', 'Tahini', 'Kale'],
  }
]


export default function DashboardPage() {
  const router = useRouter()
  const { state, isLoaded, toggleMeal, addWater, removeWater, updateProfile } = useAppState()
  const [isLoading, setIsLoading] = useState(true)
  const [swappingMeal, setSwappingMeal] = useState<string | null>(null)
  const [showAiThinking, setShowAiThinking] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [currentPlan, setCurrentPlan] = useState(mockPlan)
  const [lastCompletedCount, setLastCompletedCount] = useState(0)
  const { showToast } = useToast()

  // Simulate initial load
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setIsLoading(false), 800)
      return () => clearTimeout(timer)
    }
  }, [isLoaded])

  // Calculate consumed macros based on completed meals
  const consumed = useMemo(() => {
    const completed = currentPlan.meals.filter((meal) => state.completedMeals.includes(meal.id))
    return {
      calories: completed.reduce((sum, meal) => sum + meal.calories, 0),
      protein: completed.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: completed.reduce((sum, meal) => sum + meal.carbs, 0),
      fat: completed.reduce((sum, meal) => sum + meal.fat, 0),
    }
  }, [state.completedMeals])

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  const handleSwapMeal = (mealId: string) => {
    setSwappingMeal(mealId)
    setShowAiThinking(true)

    // Simulate AI thinking
    setTimeout(() => {
      setShowAiThinking(false)
      setSwappingMeal(null)

      // Swap with a random alternative
      const randomAlt = alternativeMeals[Math.floor(Math.random() * alternativeMeals.length)]
      const updatedMeals = currentPlan.meals.map(m =>
        m.id === mealId ? { ...randomAlt, id: `swapped-${Date.now()}` } : m
      )

      setCurrentPlan(prev => ({ ...prev, meals: updatedMeals }))
      showToast('Meal refreshed with AI suggestions!', 'success')
      // In a real app, this would fetch a new meal suggestion
    }, 1500)
  }

  // Trigger confetti when all meals completed
  useEffect(() => {
    const completedCount = state.completedMeals.length
    const allMealsComplete = completedCount === currentPlan.meals.length && currentPlan.meals.length > 0

    // Only trigger if we just reached completion
    if (allMealsComplete && completedCount > lastCompletedCount) {
      setShowConfetti(true)
      showToast('Amazing! All meals completed today! 🎉', 'success')
    }
    setLastCompletedCount(completedCount)
  }, [state.completedMeals, lastCompletedCount, showToast, currentPlan.meals.length])

  const handleAiSuggest = () => {
    setShowAiThinking(true)
    setTimeout(() => {
      setShowAiThinking(false)
      // Regenerate plan - Force swap of ALL meals to ensure visible change
      const shuffled = [...currentPlan.meals].map((meal, i) => {
        // Cycle through alternatives based on index + random offset to ensure variety
        const offset = Math.floor(Math.random() * alternativeMeals.length)
        const alt = alternativeMeals[(i + offset) % alternativeMeals.length]
        return { ...alt, id: `regen-${Date.now()}-${i}` }
      })
      setCurrentPlan(prev => ({ ...prev, meals: shuffled }))
      showToast('New meal plan generated!', 'success')
    }, 1500)
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const currentVibe = vibeConfigs[state.profile.vibe]
  const greeting = state.profile.name
    ? `${currentVibe.greeting}, ${state.profile.name.split(' ')[0]}`
    : currentVibe.greeting

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setShowAiThinking(true)
      // Simulate image upload and analysis
      setTimeout(() => {
        setShowAiThinking(false)
        showToast('Healthy meal detected & logged! 📸', 'success')
        // In a real app, this would parse the image and add a meal
      }, 2500)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (isLoaded && !state.profile.completedOnboarding) {
      router.push('/onboarding')
    }
  }, [isLoaded, state.profile.completedOnboarding, router])

  if (!isLoaded || isLoading) {
    return (
      <main className="relative min-h-screen bg-background pb-24">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <DashboardSkeleton />
        </div>
        <FloatingDock activeIndex={2} onNavigate={handleNavigate} />
      </main>
    )
  }

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background pb-24">
        {/* AI Thinking Overlay */}
        <AnimatePresence>
          {showAiThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-glass-border rounded-2xl p-8 text-center max-w-sm mx-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-primary border-t-transparent"
                />
                <h3 className="text-lg font-semibold text-foreground mb-2 shimmer-text">
                  AI is thinking...
                </h3>
                <p className="text-sm text-muted-foreground">
                  Finding the perfect alternative for you
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-glass-border"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
                  {greeting}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span className="truncate">{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <StreakDisplay streak={state.profile.streak} size="sm" />
                <VibeSwitcher
                  currentVibe={state.profile.vibe}
                  onVibeChange={(vibe) => updateProfile({ vibe })}
                  compact
                />
              </div>
            </div>

            {/* Date navigation */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Previous day"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium"
              >
                Today
              </button>
              <button
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Next day"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Macro Stats */}
          <MacroStats plan={currentPlan} consumed={consumed} />

          {/* Meals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">{"Today's Meals"}</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAiSuggest}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Regenerate
              </motion.button>
            </div>

            {currentPlan.meals.length === 0 ? (
              <SmartEmptyState type="meals" onAction={() => router.push('/onboarding')} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPlan.meals.map((meal, index) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <div onClick={() => setSelectedMeal(meal)} className="cursor-pointer">
                      <SwipeableMealCard
                        meal={meal}
                        isCompleted={state.completedMeals.includes(meal.id)}
                        onToggle={() => toggleMeal(meal.id)}
                        onSwap={() => handleSwapMeal(meal.id)}
                      />
                    </div>

                    {/* Swapping indicator */}
                    {swappingMeal === meal.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 flex items-center justify-center gap-2 text-sm text-primary"
                      >
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Finding alternative...</span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Water Tracker */}
          <WaterTracker
            current={state.waterGlasses}
            goal={currentPlan.waterGoal}
            onAdd={addWater}
            onRemove={removeWater}
          />

          {/* Summary card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-glass-border p-6 text-center"
          >
            <p className="text-muted-foreground mb-2">
              {"You've completed"}{' '}
              <motion.span
                key={state.completedMeals.length}
                initial={{ scale: 1.5, color: 'oklch(0.696 0.17 145)' }}
                animate={{ scale: 1, color: 'oklch(0.696 0.17 145)' }}
                className="font-semibold"
              >
                {state.completedMeals.length}
              </motion.span>{' '}
              of <span className="text-foreground font-semibold">{mockPlan.meals.length}</span> meals today
            </p>
            <div className="w-full bg-secondary rounded-full h-2 mt-4 overflow-hidden">
              <motion.div
                className="bg-primary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(state.completedMeals.length / mockPlan.meals.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            {/* Completion message */}
            <AnimatePresence>
              {state.completedMeals.length === mockPlan.meals.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20"
                >
                  <p className="text-sm text-primary font-medium">
                    Awesome! You completed all your meals today!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <FloatingActionButton
          onQuickSwap={() => handleSwapMeal(mockPlan.meals[0]?.id)}
          onScanMeal={triggerFileUpload}
          onAiSuggest={handleAiSuggest}
        />

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        <FloatingDock activeIndex={2} onNavigate={handleNavigate} />

        {/* Confetti celebration */}
        <ConfettiEffect
          active={showConfetti}
          onComplete={() => setShowConfetti(false)}
          particleCount={60}
          duration={3500}
        />

        {/* Meal detail modal */}
        <MealDetailModal
          meal={selectedMeal}
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onMarkComplete={() => {
            if (selectedMeal) {
              toggleMeal(selectedMeal.id)
            }
          }}
          isCompleted={selectedMeal ? state.completedMeals.includes(selectedMeal.id) : false}
        />
      </main>
    </PageTransition>
  )
}
