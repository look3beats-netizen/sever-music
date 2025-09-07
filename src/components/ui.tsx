'use client'
import { HTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('card', className)} {...props} />
)

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'outline'|'danger' }>(
  ({ className, variant='primary', ...props }, ref) => {
    const base = variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'btn-danger'
    return <button ref={ref} className={clsx(base, className)} {...props} />
  }
)
Button.displayName = 'Button'

export const Label = ({ className, ...props }: HTMLAttributes<HTMLLabelElement>) => (
  <label className={clsx('label', className)} {...props} />
)

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className="input" {...props} />
)

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className="textarea" {...props} />
)

export const Progress = ({ value=0 }: { value?: number }) => (
  <div className="progress"><div className="progress-inner" style={{ width: `${value}%` }} /></div>
)
