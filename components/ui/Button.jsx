
'use client'
import React from 'react'
import clsx from 'clsx'

export default function Button({
  variant = 'primary', size = 'md', className, children, onClick, ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2',
        'font-bold tracking-widest uppercase text-[11px]',
        'transition-all duration-150 cursor-pointer select-none',
        variant === 'primary' &&
          'bg-black text-white border border-black hover:bg-white hover:text-black',
        variant === 'secondary' &&
          'bg-white text-black border border-black hover:bg-black hover:text-white',
        variant === 'ghost' &&
          'bg-transparent text-black border border-transparent hover:border-black',
        size === 'sm' && 'px-4 py-2',
        size === 'md' && 'px-6 py-3',
        size === 'lg' && 'px-8 py-4 text-[12px]',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className
      )}
      onClick = {onClick}
      {...props}
    >
      {children}
    </button>
  )
}
