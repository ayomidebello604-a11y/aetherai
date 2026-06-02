
'use client'
import React from 'react'
import clsx from 'clsx'

export default function Input({ label, error, icon, className, id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId}
          className="text-[11px] font-bold tracking-widest uppercase text-black">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            'w-full bg-white text-black font-sans text-sm',
            'border border-black px-4 py-3',
            'placeholder:text-black placeholder:opacity-40',
            'focus:outline-none focus:border-2',
            'transition-all duration-100',
            icon && 'pl-10',
            error && 'border-red-600',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[11px] font-semibold text-red-600 tracking-wide">
          {error}
        </span>
      )}
    </div>
  )
}
