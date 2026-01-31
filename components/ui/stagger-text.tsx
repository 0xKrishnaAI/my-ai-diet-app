'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StaggerTextProps {
    text: string
    className?: string
    delay?: number
    staggerDelay?: number
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
}

export function StaggerText({
    text,
    className = '',
    delay = 0,
    staggerDelay = 0.03,
    as = 'span'
}: StaggerTextProps) {
    const letters = text.split('')

    const container = {
        hidden: { opacity: 0 },
        visible: (i: number = 1) => ({
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: delay
            },
        }),
    }

    const child = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 200,
            },
        },
    }

    const Tag = motion[as] as typeof motion.span

    return (
        <Tag
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={`${letter}-${index}`}
                    variants={child}
                    style={{ display: 'inline-block', whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
                >
                    {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
            ))}
        </Tag>
    )
}
