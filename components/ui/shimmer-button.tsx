'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    className?: string
    shimmerColor?: string
}

export function ShimmerButton({
    children,
    className = '',
    shimmerColor = 'rgba(255, 255, 255, 0.3)',
    ...props
}: ShimmerButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'relative overflow-hidden rounded-full px-8 py-4 font-semibold',
                'bg-primary text-primary-foreground',
                'transition-all duration-300',
                className
            )}
            {...props}
        >
            <span className="relative z-10">{children}</span>

            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 -translate-x-full"
                animate={{
                    translateX: ['- 100%', '200%'],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: 'linear',
                }}
                style={{
                    background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
                }}
            />
        </motion.button>
    )
}
