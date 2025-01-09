import React, { useState, useEffect } from 'react'
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from "@/shadcn/lib/utils"

export type NotificationType = 'info' | 'success' | 'warning' | 'danger' | 'message'

interface NotificationProps {
  id: number
  variant: NotificationType
  sender?: {
    name: string
    avatar: string
  }
  title?: string
  message: string
  onDismiss: () => void
  displayDuration: number
}

export function Notification({
  variant,
  sender,
  title,
  message,
  onDismiss,
  displayDuration
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsVisible(true)
    const id = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300) // Wait for the fade out animation
    }, displayDuration)
    setTimeoutId(id)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [displayDuration, onDismiss])

  const pauseAutoDismiss = () => {
    if (timeoutId) clearTimeout(timeoutId)
  }

  const resumeAutoDismiss = () => {
    const id = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300)
    }, displayDuration)
    setTimeoutId(id)
  }

  const getIcon = () => {
    switch (variant) {
      case 'info': return <Info className="h-5 w-5" />
      case 'success': return <CheckCircle className="h-5 w-5" />
      case 'warning': return <AlertTriangle className="h-5 w-5" />
      case 'danger': return <AlertCircle className="h-5 w-5" />
      default: return null
    }
  }

  const variantStyles = {
    info: 'border-blue-500 bg-blue-50 text-blue-800',
    success: 'border-green-500 bg-green-50 text-green-800',
    warning: 'border-yellow-500 bg-yellow-50 text-yellow-800',
    danger: 'border-red-500 bg-red-50 text-red-800',
    message: 'border-gray-300 bg-white text-gray-800',
  }

  return (
    <div
      className={cn(
        "pointer-events-auto relative rounded-md border bg-white p-4 shadow-md transition-all duration-300",
        variantStyles[variant],
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      )}
      role="alert"
      onMouseEnter={pauseAutoDismiss}
      onMouseLeave={resumeAutoDismiss}
    >
      <div className="flex items-start gap-3">
        {variant !== 'message' && (
          <div className={cn(
            "rounded-full p-1",
            variant === 'info' && "bg-blue-100 text-blue-600",
            variant === 'success' && "bg-green-100 text-green-600",
            variant === 'warning' && "bg-yellow-100 text-yellow-600",
            variant === 'danger' && "bg-red-100 text-red-600"
          )}>
            {getIcon()}
          </div>
        )}
        {variant === 'message' && sender && (
          <img src={sender.avatar} alt={sender.name} className="h-12 w-12 rounded-full" />
        )}
        <div className="flex-1">
          {(title || sender) && (
            <h3 className="text-sm font-semibold">
              {sender ? sender.name : title}
            </h3>
          )}
          <p className="mt-1 text-sm">{message}</p>
          {variant === 'message' && (
            <div className="mt-2 flex gap-4">
              <button className="text-sm font-bold text-blue-600 hover:text-blue-800">Reply</button>
              <button className="text-sm font-bold text-gray-600 hover:text-gray-800" onClick={onDismiss}>Dismiss</button>
            </div>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Dismiss notification"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
