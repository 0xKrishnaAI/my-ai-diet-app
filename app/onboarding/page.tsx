'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { MagneticButton } from '@/components/antigravity/magnetic-button'
import { PageTransition } from '@/components/ui/page-transition'
import { ConfettiEffect } from '@/components/ui/confetti-effect'
import { useToast } from '@/components/ui/toast'
import { useAppState } from '@/lib/store'
import { goals, dietaryPreferences } from '@/data/mock-plan'
import { ArrowLeft, ArrowRight, Flame, Dumbbell, Scale, Zap, Check, User, Activity, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const goalIcons: Record<string, typeof Flame> = {
  'weight-loss': Flame,
  'muscle-gain': Dumbbell,
  'maintain': Scale,
  'performance': Zap,
}

const activityLevels = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise', multiplier: 1.2 },
  { id: 'light', label: 'Lightly Active', description: '1-3 days/week', multiplier: 1.375 },
  { id: 'moderate', label: 'Moderate', description: '3-5 days/week', multiplier: 1.55 },
  { id: 'active', label: 'Very Active', description: '6-7 days/week', multiplier: 1.725 },
  { id: 'active', label: 'Very Active', description: '6-7 days/week', multiplier: 1.725 },
  { id: 'athlete', label: 'Athlete', description: 'Training twice daily', multiplier: 1.9 },
]

import { auth } from '@/lib/auth'

export default function OnboardingPage() {
  const router = useRouter()
  const { state, isLoaded, updateProfile } = useAppState()
  const { showToast } = useToast()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showConfetti, setShowConfetti] = useState(false)
  const [checkAuth, setCheckAuth] = useState(true)

  // Local form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    targetWeight: '',
    goal: null as string | null,
    dietaryPreferences: [] as string[],
    activityLevel: 'moderate',
    allergies: [] as string[],
  })

  // Prefill from Auth
  useEffect(() => {
    if (checkAuth) {
      // Dynamic import to avoid SSR issues if any, or just direct import
      // We'll use the auth object we imported implicitly?
      // Need to import auth first
      import('@/lib/auth').then(({ auth }) => {
        const user = auth.getCurrentUser()
        if (user) {
          setFormData(prev => ({
            ...prev,
            name: user.name || prev.name,
            age: user.age || prev.age,
          }))
        }
      })
      setCheckAuth(false)
    }
  }, [checkAuth])

  // Load existing profile data
  useEffect(() => {
    if (isLoaded && state.profile) {
      setFormData({
        name: state.profile.name || '',
        age: state.profile.age || '',
        height: state.profile.height || '',
        weight: state.profile.weight || '',
        targetWeight: state.profile.targetWeight || '',
        goal: state.profile.goal,
        dietaryPreferences: state.profile.dietaryPreferences || [],
        activityLevel: state.profile.activityLevel || 'moderate',
        allergies: state.profile.allergies || [],
      })
    }
  }, [isLoaded, state.profile])

  const totalSteps = 5

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setDirection(1)
      setStep(step + 1)
      showToast(`Step ${step + 2} of ${totalSteps}`, 'info')
    } else {
      // Trigger confetti before navigation
      setShowConfetti(true)
      showToast('Profile complete! Generating your plan...', 'success')

      // Save profile and navigate after a brief delay
      setTimeout(() => {
        updateProfile({
          ...formData,
          completedOnboarding: true,
          joinedDate: state.profile.joinedDate || new Date().toISOString(),
          streak: state.profile.streak || 0,
        })
        router.push('/analyzing')
      }, 1500)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1)
      setStep(step - 1)
    } else {
      router.push('/')
    }
  }

  const canProceed = () => {
    switch (step) {
      case 0: return formData.name.trim().length > 0
      case 1: return formData.goal !== null
      case 2: return formData.dietaryPreferences.length > 0
      case 3: return formData.activityLevel !== ''
      case 4: return formData.weight && formData.height && formData.age
      default: return true
    }
  }

  const togglePreference = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(id)
        ? prev.dietaryPreferences.filter((p) => p !== id)
        : [...prev.dietaryPreferences, id],
    }))
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const stepTitles = [
    { title: "What's your name?", subtitle: "Let's personalize your experience" },
    { title: "What's your goal?", subtitle: 'Select what best matches your journey' },
    { title: 'Any dietary preferences?', subtitle: 'Select all that apply' },
    { title: 'How active are you?', subtitle: 'This helps calculate your needs' },
    { title: 'Tell us about yourself', subtitle: 'We need a few numbers to get started' },
  ]

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
        {/* Progress bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-secondary z-50">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Back button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="fixed top-8 left-4 sm:left-8 p-3 rounded-full bg-glass border border-glass-border hover:bg-secondary transition-colors z-50"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>

        {/* Step indicator */}
        <div className="fixed top-8 right-4 sm:right-8 flex items-center gap-2 z-50">
          {[...Array(totalSteps)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8 }}
              animate={{
                scale: i === step ? 1.2 : 1,
                backgroundColor: i <= step ? 'oklch(0.696 0.17 145)' : 'oklch(0.2 0.005 285)'
              }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>

        {/* Content */}
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 0: Name */}
            {step === 0 && (
              <motion.div
                key="name"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center"
                  >
                    <User className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
                    {stepTitles[0].title}
                  </h1>
                  <p className="text-muted-foreground">{stepTitles[0].subtitle}</p>
                </div>

                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    autoFocus
                    className="w-full px-6 py-4 text-xl text-center rounded-2xl bg-input border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 1: Goals */}
            {step === 1 && (
              <motion.div
                key="goals"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
                    {stepTitles[1].title}
                  </h1>
                  <p className="text-muted-foreground">{stepTitles[1].subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goals.map((goal, index) => {
                    const Icon = goalIcons[goal.id] || Flame
                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <GlassCard
                          selected={formData.goal === goal.id}
                          onClick={() => setFormData({ ...formData, goal: goal.id })}
                          className="p-6"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                'p-3 rounded-xl transition-colors',
                                formData.goal === goal.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary text-foreground'
                              )}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{goal.title}</h3>
                              <p className="text-sm text-muted-foreground">{goal.description}</p>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Dietary Preferences */}
            {step === 2 && (
              <motion.div
                key="preferences"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
                    {stepTitles[2].title}
                  </h1>
                  <p className="text-muted-foreground">{stepTitles[2].subtitle}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dietaryPreferences.map((pref, index) => (
                    <motion.div
                      key={pref.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlassCard
                        selected={formData.dietaryPreferences.includes(pref.id)}
                        onClick={() => togglePreference(pref.id)}
                        className="p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{pref.label}</span>
                          {formData.dietaryPreferences.includes(pref.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              <Check className="w-4 h-4 text-primary" />
                            </motion.div>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Activity Level */}
            {step === 3 && (
              <motion.div
                key="activity"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center"
                  >
                    <Activity className="w-8 h-8 text-blue-400" />
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
                    {stepTitles[3].title}
                  </h1>
                  <p className="text-muted-foreground">{stepTitles[3].subtitle}</p>
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                  {activityLevels.map((level, index) => (
                    <motion.div
                      key={level.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassCard
                        selected={formData.activityLevel === level.id}
                        onClick={() => setFormData({ ...formData, activityLevel: level.id })}
                        className="p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{level.label}</h3>
                            <p className="text-sm text-muted-foreground">{level.description}</p>
                          </div>
                          {formData.activityLevel === level.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              <Check className="w-5 h-5 text-primary" />
                            </motion.div>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Metrics */}
            {step === 4 && (
              <motion.div
                key="metrics"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
                    {stepTitles[4].title}
                  </h1>
                  <p className="text-muted-foreground">{stepTitles[4].subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-foreground">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="28"
                      className="w-full px-4 py-3 rounded-xl bg-input border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-foreground">Height (inches)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="70"
                      className="w-full px-4 py-3 rounded-xl bg-input border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-foreground">Current Weight (lbs)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="180"
                      className="w-full px-4 py-3 rounded-xl bg-input border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-foreground">Target Weight (lbs)</label>
                    <input
                      type="number"
                      value={formData.targetWeight}
                      onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                      placeholder="165"
                      className="w-full px-4 py-3 rounded-xl bg-input border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </motion.div>
                </div>

                {/* Privacy note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>Your data is stored locally and never shared</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Next button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2"
        >
          <MagneticButton
            onClick={handleNext}
            className={cn(
              'transition-opacity duration-300',
              !canProceed() && 'opacity-50 pointer-events-none'
            )}
          >
            <span className="flex items-center gap-2">
              {step === totalSteps - 1 ? 'Generate My Plan' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </span>
          </MagneticButton>
        </motion.div>
      </main>

      {/* Confetti celebration on completion */}
      <ConfettiEffect
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
        particleCount={80}
        duration={2500}
      />
    </PageTransition>
  )
}
