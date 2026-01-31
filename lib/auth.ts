'use client'



// Types
export interface User {
    id: string
    email: string
    name: string
    age?: string
    createdAt: string
}

interface AuthSession {
    user: User
    token: string // Simple mock token
    expiresAt: number
}

interface AuthUserRecord {
    id: string
    email: string
    passwordHash: string // In a real app, use bcrypt. Here we just mock hashing.
    salt: string
    name: string
    age?: string
    createdAt: string
}

const STORAGE_KEYS = {
    USERS: 'biteai-auth-users',
    SESSION: 'biteai-session',
}

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const auth = {
    // Sign Up
    async signUp(data: { email: string; password: string; name: string; age?: string }): Promise<{ user: User | null; error?: string }> {
        await delay(800) // Simulate network

        try {
            if (typeof window === 'undefined') return { user: null, error: 'Client side only' }

            const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS)
            const users: Record<string, AuthUserRecord> = usersRaw ? JSON.parse(usersRaw) : {}

            // Check if email exists
            if (users[data.email]) {
                return { user: null, error: 'User already exists with this email' }
            }

            // Create new user
            const id = crypto.randomUUID()
            const newUser: AuthUserRecord = {
                id,
                email: data.email,
                passwordHash: btoa(data.password), // MOCK HASH - DO NOT USE IN PRODUCTION SERVER
                salt: 'salt',
                name: data.name,
                age: data.age,
                createdAt: new Date().toISOString(),
            }

            // Save to "DB"
            users[data.email] = newUser
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

            // Auto login
            return this.signIn(data.email, data.password)
        } catch (e) {
            console.error(e)
            return { error: 'Failed to create account' }
        }
    },

    // Sign In
    async signIn(email: string, password: string): Promise<{ user: User | null; error?: string }> {
        await delay(800)

        try {
            if (typeof window === 'undefined') return { error: 'Client side only' }

            const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS)
            const users: Record<string, AuthUserRecord> = usersRaw ? JSON.parse(usersRaw) : {}

            const userRecord = users[email]

            // Validate credentials
            if (!userRecord || userRecord.passwordHash !== btoa(password)) {
                return { error: 'Invalid email or password' }
            }

            // Create session
            const user: User = {
                id: userRecord.id,
                email: userRecord.email,
                name: userRecord.name,
                age: userRecord.age,
                createdAt: userRecord.createdAt,
            }

            const session: AuthSession = {
                user,
                token: crypto.randomUUID(),
                expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
            }

            localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))

            // Dispatch event for components to react
            window.dispatchEvent(new Event('auth-change'))

            return { user }
        } catch (e) {
            console.error(e)
            return { error: 'Login failed' }
        }
    },

    // Sign Out
    async signOut(): Promise<void> {
        await delay(300)
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.SESSION)
            window.dispatchEvent(new Event('auth-change'))
        }
    },

    // Get Current User
    getCurrentUser(): User | null {
        if (typeof window === 'undefined') return null

        try {
            const sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION)
            if (!sessionRaw) return null

            const session: AuthSession = JSON.parse(sessionRaw)

            if (Date.now() > session.expiresAt) {
                localStorage.removeItem(STORAGE_KEYS.SESSION)
                return null
            }

            return session.user
        } catch {
            return null
        }
    }
}
