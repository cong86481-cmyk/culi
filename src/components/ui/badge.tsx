'use client'

import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'secondary' | 'info'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  pulse?: boolean
  className?: string
}

export function Badge({
  children,
  variant = 'primary',
  size = 'sm',
  dot = false,
  pulse = false,
  className,
}: BadgeProps) {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-error/10 text-error border-error/20',
    secondary: 'bg-surface text-text-secondary border-border',
    info: 'bg-info/10 text-info border-info/20',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            pulse && 'animate-pulse',
            variant === 'primary' && 'bg-primary',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'error' && 'bg-error',
            variant === 'secondary' && 'bg-text-muted',
            variant === 'info' && 'bg-info'
          )}
        />
      )}
      {children}
    </span>
  )
}

// Status Badge specific component for convenience
interface StatusConfig {
  variant: 'primary' | 'success' | 'warning' | 'error' | 'secondary' | 'info'
  label: string
  dot: boolean
  pulse?: boolean
}

const statusConfig: Record<string, StatusConfig> = {
  AVAILABLE: { variant: 'success' as const, label: 'Còn hàng', dot: true },
  SOLD: { variant: 'error' as const, label: 'Đã bán', dot: true },
  PENDING: { variant: 'warning' as const, label: 'Chờ xử lý', dot: true, pulse: true },
  APPROVED: { variant: 'success' as const, label: 'Đã duyệt', dot: true },
  REJECTED: { variant: 'error' as const, label: 'Từ chối', dot: true },
}

export function StatusBadge({
  status,
  size = 'sm',
}: {
  status: 'AVAILABLE' | 'SOLD' | 'PENDING' | 'APPROVED' | 'REJECTED'
  size?: 'sm' | 'md' | 'lg'
}) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} size={size} dot={config.dot} pulse={config.pulse}>
      {config.label}
    </Badge>
  )
}
