
import React from 'react'
import clsx from 'clsx'

export default function Tag({
  children, variant = 'outline', size = 'sm', className
}) {
  return (
    <span className={clsx(
      'inline-flex items-center font-bold tracking-widest uppercase',
      size === 'sm' && 'text-[10px] px-2 py-1',
      size === 'md' && 'text-[11px] px-3 py-1.5',
      variant === 'outline' && 'border border-black text-black bg-white',
      variant === 'solid'   && 'bg-black text-white',
      variant === 'muted'   && 'border border-gray-300 text-gray-500 bg-gray-100',
      className
    )}>
      {children}
    </span>
  )
}
