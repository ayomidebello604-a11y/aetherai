import React from 'react'
import clsx from 'clsx'

export default function AetherLogo({ size = 28, inverted = false, className }) {
  const fg = inverted ? '#fff' : '#000'
  const bg = inverted ? '#000' : '#fff'
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <rect x=".5" y=".5" width="27" height="27" stroke={fg} strokeWidth="1" fill={bg}/>
      <rect x="6"  y="6"  width="6" height="6" fill={fg}/>
      <rect x="16" y="6"  width="6" height="6" fill={fg}/>
      <rect x="10" y="15" width="8" height="7" fill={fg}/>
      <line x1="9"  y1="12" x2="9"  y2="15" stroke={fg} strokeWidth="1.2"/>
      <line x1="19" y1="12" x2="19" y2="15" stroke={fg} strokeWidth="1.2"/>
    </svg>
  )
}

export function AetherWordmark({ size = 'md', inverted = false, className }) {
  const c = inverted ? 'text-white' : 'text-black'
  const logoSz = size === 'sm' ? 20 : size === 'md' ? 28 : 36
  const textSz = size === 'sm' ? 'text-[11px]' : size === 'md' ? 'text-sm' : 'text-base'
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <AetherLogo size={logoSz} inverted={inverted} />
      <div className="flex flex-col">
        <span className={clsx('font-black tracking-widest uppercase leading-none', c, textSz)}>
          AETHER
        </span>
        <span className={clsx('font-bold tracking-[.15em] uppercase opacity-50 mt-0.5', c,
          size==='sm'?'text-[8px]':'text-[9px]')}>
          AI SYSTEM
        </span>
      </div>
    </div>
  )
}