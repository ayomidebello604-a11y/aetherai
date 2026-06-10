'use client'

import { useState } from 'react';
import React from 'react'
import { AetherWordmark } from '@/components/ui/AetherLogo'
import StatusIndicator from '@/components/ui/StatusIndicator'
import { Menu, X } from 'lucide-react'

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navItems = [
    {id: 'Features', href: '#features'},
    {id: 'Documentation', href: '#documentation'},
    {id: 'Contact', href: '#contact'}
  ]
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-black bg-white">

      <AetherWordmark size="sm" />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        {navItems.map(item => (
          <a key={item.id} href={item.href}
             className="text-[11px] font-bold tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity">
            {item.id}
          </a>
        ))}
      </nav>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-4 lg:gap-6">
        <StatusIndicator status="online" label="All Systems" />
        <a href="/auth"
           className="inline-flex items-center px-5 py-2.5 bg-black text-white text-[11px] font-bold tracking-widest uppercase border border-black hover:bg-white hover:text-black transition-all duration-150 whitespace-nowrap">
          Enter System
        </a>
      </div>

      {/* Mobile Actions */}
      <div className="md:hidden flex items-center gap-3">
        <a href="/auth"
           className="inline-flex items-center px-3 py-2 bg-black text-white text-[10px] font-bold tracking-widest uppercase border border-black hover:bg-white hover:text-black transition-all duration-150 whitespace-nowrap">
          Login
        </a>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 transition-colors">
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-black md:hidden">
          <nav className="flex flex-col divide-y divide-black">
            {navItems.map(item => (
              <a key={item.id} href={item.href}
                 onClick={() => setIsMenuOpen(false)}
                 className="px-4 py-3 text-[11px] font-bold tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">
                {item.id}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
