import { useState } from 'react'
import React from 'react'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

// Global toast state
let toasts: Toast[] = []
let listeners: (() => void)[] = []

const notify = () => {
  listeners.forEach(listener => listener())
}

export const toast = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9)
  const newToast: Toast = { id, title, description, variant }
  
  toasts = [...toasts, newToast]
  notify()
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    notify()
  }, 5000)
}

export const dismiss = (id: string) => {
  toasts = toasts.filter(t => t.id !== id)
  notify()
}

export function useToast() {
  const [, setState] = useState({})

  React.useEffect(() => {
    const listener = () => setState({})
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  return { toasts, dismiss }
} 