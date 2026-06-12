'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Search, Code2, Layout, Shield } from 'lucide-react'

const FEATURES = [
  {
    num: '01', icon: <Search size={18}/>,
    title: 'Deep Research Engine',
    mode: 'Researcher',
    body: 'Query synthesis with real-time source verification and structured answer output.',
  },
  {
    num: '02', icon: <Code2 size={18}/>,
    title: 'Code Analysis Suite',
    mode: 'Co-Programmer',
    body: 'Integrated dark-mode editor with intelligent analysis and save-to-workspace.',
  },
  {
    num: '03', icon: <Layout size={18}/>,
    title: 'Zero Noise Interface',
    mode: 'Architecture',
    body: 'Swiss-modernist layout. 1px grid. Pure black and white — no gradients, no shadows.',
  },
  {
    num: '04', icon: <Shield size={18}/>,
    title: 'Secure Gateway',
    mode: 'Security',
    body: 'Split-view authorization with diagnostic status indicators and session control.',
  },
]

export default function LandingFeature() {
  return (
    <motion.section id="features"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-black">
      {FEATURES.map((f, i) => (
        <div key={f.num}
             className="p-6 sm:p-8 border-b sm:border-b-0 sm:border-r border-black last:border-r-0">
          <div className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-30 mb-4">
            {f.num} — {f.mode}
          </div>
          <div className="mb-4 opacity-60">{f.icon}</div>
          <h3 className="text-sm font-bold tracking-tight mb-3">{f.title}</h3>
          <p className="text-[12px] sm:text-[13px] leading-relaxed opacity-55">{f.body}</p>
        </div>
      ))}
    </motion.section>
  )
}
