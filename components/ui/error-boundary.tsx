'use client'

import { Component, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, AlertTriangle } from 'lucide-react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught error:', error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full bg-glass backdrop-blur-xl rounded-2xl border border-glass-border p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center"
                        >
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </motion.div>

                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Oops! Something went wrong
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Don't worry, it's not your fault. Let's try refreshing.
                        </p>

                        {this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                                    Technical details
                                </summary>
                                <pre className="mt-2 p-3 rounded-lg bg-secondary text-xs overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={this.handleReset}
                            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </motion.button>
                    </motion.div>
                </div>
            )
        }

        return this.props.children
    }
}
