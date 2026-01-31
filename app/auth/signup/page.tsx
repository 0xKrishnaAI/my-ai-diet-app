'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form' // Optional, but let's stick to simple state to avoid deps if needed. I'll use simple state.
import { auth } from '@/lib/auth'
import { useToast } from '@/components/ui/toast'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Loader2, Mail, Lock, User, Calendar } from 'lucide-react'

export default function SignUpPage() {
    const router = useRouter()
    const { showToast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        password: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Basic validation
        if (!formData.name || !formData.email || !formData.password) {
            showToast('Please fill in all required fields', 'error')
            setIsLoading(false)
            return
        }

        try {
            const { user, error } = await auth.signUp(formData)

            if (error) {
                showToast(error, 'error')
                setIsLoading(false)
                return
            }

            if (user) {
                showToast('Account created successfully! 🎉', 'success')
                // Brief delay for success state
                setTimeout(() => {
                    router.push('/onboarding')
                }, 1000)
            }
        } catch (err) {
            showToast('Something went wrong', 'error')
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-card border border-glass-border rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground mb-2">
                    Create Account
                </h1>
                <p className="text-muted-foreground">
                    Join BiteAI and start your journey
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-secondary/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary/50 focus:bg-secondary transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-secondary/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary/50 focus:bg-secondary transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                            type="number"
                            placeholder="Age"
                            value={formData.age}
                            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                            className="w-full bg-secondary/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary/50 focus:bg-secondary transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full bg-secondary/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary/50 focus:bg-secondary transition-all"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <ShimmerButton
                        className="w-full font-semibold h-12"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Account...
                            </span>
                        ) : (
                            'Sign Up'
                        )}
                    </ShimmerButton>
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary font-medium hover:underline">
                    Sign In
                </Link>
            </div>
        </div>
    )
}
