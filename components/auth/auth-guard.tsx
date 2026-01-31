'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'

const PUBLIC_PATHS = ['/', '/auth/login', '/auth/signup']

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        // Check auth on every path change
        const checkAuth = () => {
            const user = auth.getCurrentUser()
            const isPublicPath = PUBLIC_PATHS.includes(pathname)

            if (!user && !isPublicPath) {
                setAuthorized(false)
                router.push('/auth/login')
            } else {
                setAuthorized(true)
            }
        }

        checkAuth()

        // Listen for auth changes specially
        window.addEventListener('auth-change', checkAuth)
        return () => window.removeEventListener('auth-change', checkAuth)
    }, [pathname, router])

    // While checking, we might want to show nothing or a loader to prevent flash
    // But for now, we render children and let the effect redirect if needed
    // To be stricter, we could return null if !authorized && !isPublicPath

    return <>{children}</>
}
