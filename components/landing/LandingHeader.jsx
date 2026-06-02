import React from 'react'
import { AetherWordmark } from '@/components/ui/AetherLogo'
import StatusIndicator from '@/components/ui/StatusIndicator'

export default function LandingHeader() {
  const navItems = [
    {id: 'Features', href: '#features'},
    {id: 'Documentation', href: '#documentation'},
    {id: 'Contact', href: '#contact'}
  ]
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-black bg-white">

      <AetherWordmark size="sm" />

      <nav className="hidden md:flex items-center gap-8">
        {navItems.map(item => (
          <a key={item.id} href={item.href}
             className="text-[11px] font-bold tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity">
            {item.id}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <StatusIndicator status="online" label="All Systems" />
        <a href="/auth"
           className="inline-flex items-center px-5 py-2.5 bg-black text-white text-[11px] font-bold tracking-widest uppercase border border-black hover:bg-white hover:text-black transition-all duration-150">
          Enter System
        </a>
      </div>

    </header>
  )
}
