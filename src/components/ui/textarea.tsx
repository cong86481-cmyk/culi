'use client'

import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef, useState } from 'react'
import { AlertCircle } from 'lucide-react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
  maxLength?: number
  showCount?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helper, maxLength, showCount = false, id, value, ...props }, ref) => {
    const [charCount, setCharCount] = useState(String(value || '').length)
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      props.onChange?.(e)
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            className={cn(
              'input min-h-[120px] resize-none',
              error && 'input-error',
              className
            )}
            value={value}
            onChange={handleChange}
            maxLength={maxLength}
            aria-invalid={!!error}
            aria-describedby={error ? `${textareaId}-error` : helper ? `${textareaId}-helper` : undefined}
            {...props}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {error ? (
            <p id={`${textareaId}-error`} className="text-error text-sm flex items-center gap-1" role="alert">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          ) : helper ? (
            <p id={`${textareaId}-helper`} className="text-text-muted text-sm">
              {helper}
            </p>
          ) : (
            <span />
          )}
          {showCount && maxLength && (
            <span className="text-sm text-text-muted">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
