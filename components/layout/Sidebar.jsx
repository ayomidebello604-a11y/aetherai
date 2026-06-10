// components/layout/Sidebar.tsx
'use client'
import React from 'react'
import { Search, Code2, Settings, LogOut, ChevronRight } from 'lucide-react'
import { AetherWordmark } from '@/components/ui/AetherLogo'
import clsx from 'clsx'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { id: 'researcher',    label: 'Researcher',    icon: <Search size={15}/>,  href: '/researcher' },
  { id: 'coprogrammer', label: 'Co-Programmer', icon: <Code2 size={15}/>,   href: '/coprogrammer' },
]

export default function Sidebar({ activeItem, onClose }) {
    const supabase = createClient()
  const router = useRouter()
  
  const handleLogout = async() => {
  await supabase.auth.signOut()
  router.push('/auth')
  }

  const handleNavClick = () => {
    onClose?.()
  }

  return (
    <aside className="w-60 h-screen bg-black flex flex-col flex-shrink-0">

      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <AetherWordmark inverted size="sm" />
      </div>

      {/* Section label */}
      <div className="px-6 pt-6 pb-2">
        <span className="text-[10px] font-bold tracking-[.15em] uppercase text-white/30">
          Workspace Mode
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 mt-1">
        {navItems.map(item => {
          const active = item.id === activeItem
          return (
            <a key={item.id} href={item.href}
               onClick={handleNavClick}
               className={clsx(
                 'flex items-center justify-between px-3 py-3 mb-1 transition-all',
                 active
                   ? 'bg-white text-black'
                   : 'text-white hover:bg-white/10'
               )}>
              <div className="flex items-center gap-3">
                <span className={active ? 'text-black' : 'text-white'}>{item.icon}</span>
                <span className="text-[11px] font-bold tracking-widest uppercase">
                  {item.label}
                </span>
              </div>
              {active && <ChevronRight size={11} className="opacity-40"/>}
            </a>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-white/10">
               <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full sm:w-auto px-3 sm:px-0 py-2 sm:py-0 bg-red-600 hover:bg-red-700 sm:bg-transparent sm:hover:bg-transparent text-white transition-colors rounded sm:rounded-none text-[11px] sm:text-[13px]"
          >
            <LogOut size={16} className="sm:size-[13px]"/>
            <span className="font-bold tracking-widest uppercase sm:hidden">Logout</span>
          </button>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 bg-white block"/>
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/30">
            System Online
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <button className="hidden sm:flex items-center gap-2 text-white/40 hover:text-white transition-colors">
            <Settings size={13}/>
            <span className="text-[10px] font-bold tracking-widest uppercase">Config</span>
          </button>
        
        </div>
      </div>

    </aside>
  )
}
