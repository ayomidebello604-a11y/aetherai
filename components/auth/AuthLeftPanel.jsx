import React from 'react'
import { AetherWordmark } from '@/components/ui/AetherLogo'
import StatusIndicator from '@/components/ui/StatusIndicator'

const DIAGNOSTICS = [
  { label: 'Auth Service',   status: 'online' },
  { label: 'Researcher',     status: 'online' },
  { label: 'Co-Programmer',  status: 'online' },
  { label: 'Session Store',  status: 'pending' },
]

export default function AuthLeftPanel() {
  return (
    <div className="bg-black text-white min-h-screen p-12 lg:p-16 flex flex-col justify-between border-r border-black">

      <div>
        <AetherWordmark inverted size="sm" className="mb-16" />

        <h1 className="font-black leading-[.93] tracking-tight mb-8"
            style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}>
          SYSTEM<br/>AUTHORIZATION
        </h1>

        <p className="text-sm leading-relaxed text-white/55 max-w-xs">
          Secure gateway for user identification. Authenticate to access
          the Researcher and Co-Programmer workspaces.
        </p>
      </div>

      {/* Diagnostics */}
      <div className="border-t border-white/10 pt-8">
        <span className="text-[10px] font-bold tracking-[.15em] uppercase text-white/30 block mb-5">
          Diagnostic Status
        </span>
        {DIAGNOSTICS.map(d => (
          <div key={d.label}
               className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold tracking-widest uppercase text-white/50">
              {d.label}
            </span>
            <StatusIndicator status={d.status}
              label={d.status === 'pending' ? 'Standby' : 'Online'} />
          </div>
        ))}
      </div>

    </div>
  )
}
