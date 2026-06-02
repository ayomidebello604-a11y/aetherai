import React from 'react'

export default function SourceCards({ sources }) {
  if (!sources || sources.length === 0) return null
  
  return (
    <div className="grid gap-2 mt-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))` }}>
      {sources.map((s) => (
        <div key={s.num} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="text-[9px] font-bold tracking-widest uppercase opacity-50 mb-1">
            Source {s.num}
          </div>
          <div className="text-[10px] font-semibold">{s.domain}</div>
          <div className="text-[10px] opacity-60 mt-1 leading-tight">{s.snippet}</div>
        </div>
      ))}
    </div>
  )
}
