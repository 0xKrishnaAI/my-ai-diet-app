'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingDock } from '@/components/antigravity/floating-dock'
import { GlassCard } from '@/components/ui/glass-card'
import { VibeSwitcher } from '@/components/ui/vibe-switcher'
import { StreakCard } from '@/components/ui/streak-display'
import { ProfileCardSkeleton } from '@/components/ui/skeleton-loaders'
import { PageTransition } from '@/components/ui/page-transition'
import { MagneticButton } from '@/components/antigravity/magnetic-button'
import { useToast } from '@/components/ui/toast'
import { useAppState, vibeConfigs } from '@/lib/store'
import { goals, dietaryPreferences } from '@/data/mock-plan'
import {
  User, Settings, Edit2, Save, X, ChevronRight,
  Flame, Dumbbell, Scale, Zap, LogOut, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

const goalIcons: Record<string, typeof Flame> = {
  'weight-loss': Flame,
  'muscle-gain': Dumbbell,
  'maintain': Scale,
  'performance': Zap,
}

const activityLevels = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { id: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { id: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { id: 'active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { id: 'athlete', label: 'Athlete', description: 'Very hard exercise & physical job' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { state, isLoaded, updateProfile, resetState } = useAppState()
  const { showToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(state.profile)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded) {
      setEditedProfile(state.profile)
    }
  }, [isLoaded, state.profile])

  const handleSave = () => {
    updateProfile(editedProfile)
    setIsEditing(false)
    showToast('Profile saved successfully!', 'success')
  }

  const handleCancel = () => {
    setEditedProfile(state.profile)
    setIsEditing(false)
  }

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  const currentGoal = goals.find((g) => g.id === state.profile.goal)
  const GoalIcon = currentGoal ? goalIcons[currentGoal.id] : Flame
  const currentVibe = vibeConfigs[state.profile.vibe]

  // Get initials for avatar
  const initials = state.profile.name
    ? state.profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'BA'

  if (!isLoaded) {
    return (
      <main className="relative min-h-screen bg-background pb-24">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <ProfileCardSkeleton />
        </div>
        <FloatingDock activeIndex={4} onNavigate={handleNavigate} />
      </main>
    )
  }

  // Check if profile is incomplete
  const isProfileIncomplete = !state.profile.name || !state.profile.completedOnboarding

  return (
    <main className="relative min-h-screen bg-background pb-24">
      <PageTransition>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-glass-border"
        >
          <div className="max-w-2xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">Profile</h1>
              <div className="flex items-center gap-2">
                <VibeSwitcher
                  currentVibe={state.profile.vibe}
                  onVibeChange={(vibe) => updateProfile({ vibe })}
                  compact
                />
                {!isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="p-2 rounded-lg bg-primary text-primary-foreground"
                    >
                      <Save className="w-5 h-5" />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          {/* Profile incomplete prompt */}
          {isProfileIncomplete && !isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center"
            >
              <p className="text-foreground mb-4">
                Complete your profile for personalized recommendations
              </p>
              <MagneticButton onClick={() => router.push('/onboarding')} strength={0.3}>
                Complete Setup
              </MagneticButton>
            </motion.div>
          )}

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-glass-border p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              {/* Avatar with glow */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(34, 197, 94, 0.3)',
                    '0 0 40px rgba(34, 197, 94, 0.5)',
                    '0 0 20px rgba(34, 197, 94, 0.3)',
                  ]
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center relative overflow-hidden"
              >
                <span className="text-2xl font-bold text-primary relative z-10">{initials}</span>
                {/* Animated gradient overlay */}
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/40"
                />
              </motion.div>

              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full text-xl font-bold text-foreground bg-transparent border-b border-glass-border focus:border-primary outline-none pb-1"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-foreground">
                    {state.profile.name || 'Set your name'}
                  </h2>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {currentVibe.greeting}
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Weight', value: state.profile.weight ? `${state.profile.weight} lbs` : '--' },
                { label: 'Height', value: state.profile.height ? `${state.profile.height}"` : '--' },
                { label: 'Age', value: state.profile.age || '--' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-xl bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Streak Card */}
          <StreakCard streak={state.profile.streak} />

          {/* Goal Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => setActiveSection(activeSection === 'goal' ? null : 'goal')}
              className="w-full bg-glass backdrop-blur-xl rounded-2xl border border-glass-border p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <GoalIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Current Goal</p>
                  <p className="font-semibold text-foreground">
                    {currentGoal?.title || 'Not set'}
                  </p>
                </div>
              </div>
              <ChevronRight className={cn(
                'w-5 h-5 text-muted-foreground transition-transform',
                activeSection === 'goal' && 'rotate-90'
              )} />
            </button>

            <AnimatePresence>
              {activeSection === 'goal' && isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {goals.map((goal) => {
                      const Icon = goalIcons[goal.id]
                      return (
                        <GlassCard
                          key={goal.id}
                          selected={editedProfile.goal === goal.id}
                          onClick={() => setEditedProfile({ ...editedProfile, goal: goal.id })}
                          className="p-4"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn(
                              'w-5 h-5',
                              editedProfile.goal === goal.id ? 'text-primary' : 'text-muted-foreground'
                            )} />
                            <span className="text-sm font-medium text-foreground">{goal.title}</span>
                          </div>
                        </GlassCard>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Activity Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <button
              onClick={() => setActiveSection(activeSection === 'activity' ? null : 'activity')}
              className="w-full bg-glass backdrop-blur-xl rounded-2xl border border-glass-border p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Activity Level</p>
                  <p className="font-semibold text-foreground">
                    {activityLevels.find((a) => a.id === state.profile.activityLevel)?.label || 'Moderate'}
                  </p>
                </div>
              </div>
              <ChevronRight className={cn(
                'w-5 h-5 text-muted-foreground transition-transform',
                activeSection === 'activity' && 'rotate-90'
              )} />
            </button>

            <AnimatePresence>
              {activeSection === 'activity' && isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mt-3">
                    {activityLevels.map((level) => (
                      <GlassCard
                        key={level.id}
                        selected={editedProfile.activityLevel === level.id}
                        onClick={() => setEditedProfile({ ...editedProfile, activityLevel: level.id })}
                        className="p-3"
                      >
                        <p className="font-medium text-foreground text-sm">{level.label}</p>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </GlassCard>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Dietary Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setActiveSection(activeSection === 'diet' ? null : 'diet')}
              className="w-full bg-glass backdrop-blur-xl rounded-2xl border border-glass-border p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Dietary Preferences</p>
                  <p className="font-semibold text-foreground">
                    {state.profile.dietaryPreferences.length > 0
                      ? state.profile.dietaryPreferences.map(
                        (p) => dietaryPreferences.find((d) => d.id === p)?.label
                      ).filter(Boolean).join(', ')
                      : 'No restrictions'}
                  </p>
                </div>
              </div>
              <ChevronRight className={cn(
                'w-5 h-5 text-muted-foreground transition-transform',
                activeSection === 'diet' && 'rotate-90'
              )} />
            </button>

            <AnimatePresence>
              {activeSection === 'diet' && isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {dietaryPreferences.map((pref) => {
                      const isSelected = editedProfile.dietaryPreferences.includes(pref.id)
                      return (
                        <GlassCard
                          key={pref.id}
                          selected={isSelected}
                          onClick={() => {
                            const newPrefs = isSelected
                              ? editedProfile.dietaryPreferences.filter((p) => p !== pref.id)
                              : [...editedProfile.dietaryPreferences, pref.id]
                            setEditedProfile({ ...editedProfile, dietaryPreferences: newPrefs })
                          }}
                          className="p-3"
                        >
                          <span className="text-sm font-medium text-foreground">{pref.label}</span>
                        </GlassCard>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Settings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-glass-border overflow-hidden"
          >
            <button
              onClick={() => router.push('/onboarding')}
              className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Restart Onboarding</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="border-t border-glass-border" />

            <button
              onClick={() => {
                resetState()
                router.push('/')
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-destructive/10 transition-colors text-destructive"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Reset All Data</span>
              </div>
            </button>
          </motion.div>
        </div>
      </PageTransition>

      <FloatingDock activeIndex={4} onNavigate={handleNavigate} />
    </main>
  )
}
