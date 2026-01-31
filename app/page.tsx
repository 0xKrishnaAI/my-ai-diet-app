'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Testimonials } from '@/components/sections/testimonials'
import { Pricing } from '@/components/sections/pricing'
import { FAQ } from '@/components/sections/faq'
import { CTA } from '@/components/sections/cta'
import { Footer } from '@/components/sections/footer'
import { FloatingDock } from '@/components/antigravity/floating-dock'
import { SplashScreen } from '@/components/ui/splash-screen'
import { PageTransition } from '@/components/ui/page-transition'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { useAppState } from '@/lib/store'

export default function HomePage() {
  const router = useRouter()
  const { state, isLoaded, setHasSeenSplash } = useAppState()
  const [showSplash, setShowSplash] = useState(true)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      // Skip splash if already seen in this session
      if (state.hasSeenSplash) {
        setShowSplash(false)
        setIsReady(true)
      }
    }
  }, [isLoaded, state.hasSeenSplash])

  const handleSplashComplete = () => {
    setShowSplash(false)
    setHasSeenSplash(true)
    setIsReady(true)
  }

  const handleGetStarted = () => {
    if (state.profile.completedOnboarding) {
      router.push('/dashboard')
    } else {
      router.push('/onboarding')
    }
  }

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  // Show splash screen
  if (showSplash && isLoaded && !state.hasSeenSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  // Wait for state to load
  if (!isReady && !isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background grain-overlay">
        <Hero onGetStarted={handleGetStarted} />
        <ScrollReveal direction="up" delay={0}>
          <Features />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.1}>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0}>
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.1}>
          <Pricing onGetStarted={handleGetStarted} />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0}>
          <FAQ />
        </ScrollReveal>
        <ScrollReveal direction="fade" delay={0}>
          <CTA onGetStarted={handleGetStarted} />
        </ScrollReveal>
        <Footer />
        <FloatingDock activeIndex={0} onNavigate={handleNavigate} />
      </main>
    </PageTransition>
  )
}
