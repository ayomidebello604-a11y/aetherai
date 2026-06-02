
import React from 'react'
import { ChevronRight } from 'lucide-react'
import StatusIndicator from '@/components/ui/StatusIndicator'
import clsx from 'clsx'

export default function WorkspaceHeader({
  mode, sessionId = 'SES-0041', username, className
}) {
  return (
    <header className={clsx(
      'flex items-center justify-between px-8 py-4 border-b border-black bg-white',
      className
    )}>

    
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold tracking-widest uppercase opacity-30">
          AETHER
        </span>
        <ChevronRight size={12} className="opacity-30"/>
        <span className="text-[11px] font-bold tracking-widest uppercase">
          {mode}
        </span>
        {username && (
          <>
            <ChevronRight size={12} className="opacity-30"/>
            <span className="text-[11px] font-bold tracking-widest text-black">
              {username}
            </span>
          </>
        )}
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-bold tracking-widest uppercase text-green">
          {sessionId}
        </span>
        <StatusIndicator status="online" label="Active" className = "text-green-300" />
      </div>

    </header>
  )
}
