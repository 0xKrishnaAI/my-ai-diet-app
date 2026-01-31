import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { ToastProvider } from '@/components/ui/toast'
import { AuthGuard } from '@/components/auth/auth-guard'
import { LazyMotion, domMax } from "framer-motion"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'BiteAI - AI-Powered Nutrition',
  description: 'Your personal AI nutritionist. Get custom meal plans tailored to your goals, powered by advanced machine learning.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${geistMono.variable} font-sans antialiased grain-overlay`}>
        <LazyMotion features={domMax}>
          <ErrorBoundary>
            <ToastProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
            </ToastProvider>
          </ErrorBoundary>
        </LazyMotion>
        <Analytics />
      </body>
    </html>
  )
}
