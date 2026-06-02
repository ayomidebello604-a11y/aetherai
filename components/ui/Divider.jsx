
import React from 'react'
import clsx from 'clsx'

export default function Divider({ orientation = 'horizontal', label, className }) {
  if (label) {
    return (
      <div className={clsx('flex items-center gap-4', className)}>
        <div className="flex-1 h-px bg-black" />
        <span className="text-[11px] font-bold tracking-widest uppercase opacity-40">
          {label}
        </span>
        <div className="flex-1 h-px bg-black" />
      </div>
    )
  }
  return (
    <div className={clsx(
      orientation === 'horizontal' ? 'w-full h-px bg-black' : 'h-full w-px bg-black',
      className
    )} />
  )
}
