import React from 'react'
import { ArrowRight } from 'lucide-react'
import AIFigure from '@/components/ui/AIFigure'
import Tag from '@/components/ui/Tag'

const STATS = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '2',     label: 'Active Modes' },
  { value: '∞',     label: 'Query Depth' },
]

export default function LandingHero() {
  return (
    <section className="min-h-screen pt-16 sm:pt-[72px] flex flex-col">

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 border-b border-black">

        {/* ── Left: copy ── */}
        <div className="flex flex-col justify-between p-5 sm:p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-black">
          <div>
            {/* System badge */}
            <div className="flex items-center gap-3 mb-12">
              <span className="w-2 h-2 bg-black inline-block" />
              <span className="text-[11px] font-bold tracking-[.2em] uppercase">
                AETHER AI SYSTEM — v2.4.1
              </span>
            </div>

            <h1 className="font-black leading-[.95] tracking-tight mb-6 sm:mb-8"
                style={{ fontSize: 'clamp(32px, 6vw, 73px)' }}>
              PRECISION<br/>INTELLIGENCE.
            </h1>

            <p className="text-sm sm:text-base leading-relaxed opacity-60 max-w-md mb-8 sm:mb-10">
              A multi-mode AI workspace engineered for research and code synthesis.
              No noise. No distraction. Only structure, clarity, and velocity.
            </p>

            <div className="flex flex-wrap gap-2 mb-8 sm:mb-12">
              <Tag variant="solid">Researcher</Tag>
              <Tag variant="outline">Co-Programmer</Tag>
              <Tag variant="outline">Source Verified</Tag>
              <Tag variant="outline">Code Analysis</Tag>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <a href="/auth"
                 className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white
                            text-[10px] sm:text-[11px] font-bold tracking-widest uppercase border border-black
                            hover:bg-white hover:text-black transition-all group whitespace-nowrap">
                Enter System
                <ArrowRight size={14}
                  className="group-hover:translate-x-1 transition-transform"/>
              </a>
              <a href="#features"
                 className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase opacity-40
                            hover:opacity-100 transition-opacity">
                View Features →
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 border-t border-black pt-6 sm:pt-8 mt-8 sm:mt-16">
            {STATS.map(s => (
              <div key={s.label}>
                <div 
                  suppressHydrationWarning
                  className="text-lg sm:text-2xl font-black tracking-tight mb-1"
                >
                  {s.value}
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-40">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: AI Figure ── */}
        <div className="relative flex items-center justify-center bg-gray-50 p-5 sm:p-8 lg:p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-[.04]"
               style={{ backgroundImage: 'linear-gradient(#000 1px,transparent 1px), linear-gradient(90deg,#000 1px,transparent 1px)',
                         backgroundSize: '32px 32px' }} />
          {['UNIT-01','SYS-CORE','STATUS: ACTIVE','AETHER/AI'].map((l, i) => (
            <span key={l}
              className={`absolute text-[7px] sm:text-[9px] font-bold tracking-[.15em] uppercase opacity-25
                ${i===0?'top-3 sm:top-5 left-3 sm:left-5':i===1?'top-3 sm:top-5 right-3 sm:right-5':i===2?'bottom-3 sm:bottom-5 left-3 sm:left-5':'bottom-3 sm:bottom-5 right-3 sm:right-5'}`}>
              {l}
            </span>
          ))}
          <AIFigure size={parseInt('clamp(200, 50vw, 340)'.match(/\d+/)[0])} />
        </div>

      </div>
    </section>
  )
}
