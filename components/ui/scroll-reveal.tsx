'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'

interface ScrollRevealProps {
    children: ReactNode
    className?: string
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
    once?: boolean
    amount?: number
}

const directionVariants: Record<string, Variants> = {
    up: {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    },
    down: {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 },
    },
    left: {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
    },
    right: {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    },
    fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
}

export function ScrollReveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    once = true,
    amount = 0.3,
}: ScrollRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, amount })
    const controls = useAnimation()

    useEffect(() => {
        if (isInView) {
            controls.start('visible')
        } else {
            controls.start('hidden')
        }
    }, [isInView, controls])

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={directionVariants[direction]}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
