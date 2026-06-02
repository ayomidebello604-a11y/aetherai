import React from 'react'
import {
Search, Code2, Package, Server, CheckCircle2,
PenLine, HelpCircle, ArrowRight,
} from 'lucide-react'

export default function LandingDocs() {
  return (
    <section id="docs" className="border-t border-black">
      {/* ── Intro ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-black">
        <div className="p-12 lg:p-16 border-r border-black">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-black inline-block" />
            <span className="text-[10px] font-bold tracking-[.2em] uppercase">Documentation</span>
          </div>
          <h2 className="font-black leading-[.95] tracking-tight mb-6"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}>
            HOW IT<br/>WORKS.
          </h2>
          <p className="text-base leading-relaxed opacity-55 max-w-sm">
            AETHER is a two-mode AI workspace. Pick a mode, type your input,
            and get a structured, intelligent response — no setup, no noise.
          </p>
        </div>

        {/* Quick Steps */}
        <div className="p-12 lg:p-16 flex items-center">
          <div className="w-full border border-black divide-y divide-black">
            <div className="flex items-start gap-4 p-5">
              <span className="bg-black text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 flex-shrink-0 mt-0.5">01</span>
              <div>
                <div className="text-[13px] font-bold mb-1">Create an account</div>
                <div className="text-[12px] opacity-55 leading-relaxed">Register with your email or continue with Google. Under 30 seconds — no credit card required.</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5">
              <span className="bg-black text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 flex-shrink-0 mt-0.5">02</span>
              <div>
                <div className="text-[13px] font-bold mb-1">Choose your workspace mode</div>
                <div className="text-[12px] opacity-55 leading-relaxed">Select Researcher for knowledge queries or Co-Programmer for code analysis from the sidebar.</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5">
              <span className="bg-black text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 flex-shrink-0 mt-0.5">03</span>
              <div>
                <div className="text-[13px] font-bold mb-1">Enter your input and get results</div>
                <div className="text-[12px] opacity-55 leading-relaxed">Type a question or paste your code. AETHER returns a clean, structured response instantly.</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5">
              <span className="bg-black text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 flex-shrink-0 mt-0.5">04</span>
              <div>
                <div className="text-[13px] font-bold mb-1">Save your work</div>
                <div className="text-[12px] opacity-55 leading-relaxed">Save answers and annotated code directly to your session for reference later.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mode Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-black">
        {/* Mode 1: Researcher */}
        <div className="p-12 lg:p-14 border-r border-black">
          <div className="w-10 h-10 border border-black flex items-center justify-center mb-5">
            <Search size={18} />
          </div>
          <span className="bg-black text-white text-[9px] font-bold tracking-[.15em] uppercase px-2 py-1 inline-block mb-4">Mode 01</span>
          <h3 className="text-2xl font-black tracking-tight mb-3">Researcher</h3>
          <p className="text-sm leading-relaxed opacity-60 mb-6 max-w-md">Ask any question — factual, conceptual, analytical. AETHER synthesises a clear, direct answer and points you to the sources it drew from. Built for depth, not surface-level replies.</p>
          <div className="h-px bg-black opacity-10 mb-5" />
          <ul className="divide-y divide-gray-100">
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[13px] leading-relaxed opacity-65">Ask open-ended or highly specific research questions in plain language</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[13px] leading-relaxed opacity-65">Get a synthesized answer with referenced sources listed below it</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[13px] leading-relaxed opacity-65">Filter sources by type — Academic, News, or Documentation</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[13px] leading-relaxed opacity-65">Save any answer to revisit it in the same session</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[13px] leading-relaxed opacity-65">Works across any domain — science, law, finance, technology, history</span>
            </li>
          </ul>
        </div>

        {/* Mode 2: Co-Programmer */}
        <div className="p-12 lg:p-14">
          <div className="w-10 h-10 border border-black flex items-center justify-center mb-5">
            <Code2 size={18} />
          </div>
          <span className="bg-black text-white text-[9px] font-bold tracking-[.15em] uppercase px-2 py-1 inline-block mb-4">Mode 02</span>
          <h3 className="text-2xl font-black tracking-tight mb-3">Co-Programmer</h3>
          <p className="text-sm leading-relaxed opacity-60 mb-6 max-w-md">Paste any block of code. AETHER analyses it and returns structured annotations — covering complexity, correctness, potential bugs, and concrete improvement suggestions.</p>
          <div className="h-px bg-black opacity-10 mb-5" />
          <ul className="divide-y divide-gray-100">
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[13px] leading-relaxed opacity-65">Supports TypeScript, Python, Go, and Rust out of the box</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[13px] leading-relaxed opacity-65">Switch languages with one click — editor resets to a matching starter template</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[13px] leading-relaxed opacity-65">Hit Analyse to send your code to the AI and get labelled annotations</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[13px] leading-relaxed opacity-65">Annotations cover: time complexity, correctness, edge cases, suggestions</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[13px] leading-relaxed opacity-65">Save annotated code snapshots directly from the workspace</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── How It Works ───────────────────────── */}
      <div className="border-b border-black">
        <div className="flex items-center justify-between px-12 py-6 border-b border-black">
          <span className="text-[11px] font-bold tracking-[.2em] uppercase">Under the Hood</span>
          <span className="text-[12px] opacity-40">What happens between input and response</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          <div className="p-8 border-r border-black">
            <div className="text-[32px] font-black opacity-[.07] leading-none mb-3">01</div>
            <PenLine size={20} className="opacity-60 mb-3" />
            <div className="text-[14px] font-bold mb-2">You enter your input</div>
            <div className="text-[13px] opacity-55 leading-relaxed">Type a research question or paste code. No special syntax needed.</div>
          </div>
          <div className="p-8 border-r border-black">
            <div className="text-[32px] font-black opacity-[.07] leading-none mb-3">02</div>
            <Package size={20} className="opacity-60 mb-3" />
            <div className="text-[14px] font-bold mb-2">Frontend calls the backend</div>
            <div className="text-[13px] opacity-55 leading-relaxed">Your input is wrapped in a structured prompt and sent to the secure Next.js API route.</div>
          </div>
          <div className="p-8 border-r border-black">
            <div className="text-[32px] font-black opacity-[.07] leading-none mb-3">03</div>
            <Server size={20} className="opacity-60 mb-3" />
            <div className="text-[14px] font-bold mb-2">AI processes the request</div>
            <div className="text-[13px] opacity-55 leading-relaxed">Groq's Llama 3.3 70B model processes the prompt server-side. Your API key stays private.</div>
          </div>
          <div className="p-8">
            <div className="text-[32px] font-black opacity-[.07] leading-none mb-3">04</div>
            <CheckCircle2 size={20} className="opacity-60 mb-3" />
            <div className="text-[14px] font-bold mb-2">Response is returned</div>
            <div className="text-[13px] opacity-55 leading-relaxed">The AI's response is formatted and streamed back to your browser in real time.</div>
          </div>
        </div>
      </div>

      {/* ── CTA ────────────────────────────────── */}
      <div className="px-12 lg:px-16 py-16 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black tracking-tight mb-2">Ready to try AETHER?</h3>
          <p className="text-sm opacity-55">No credit card required. Join hundreds discovering AI that actually thinks.</p>
        </div>
        <a href="/auth" className="bg-black text-white px-6 py-3 rounded text-sm font-bold hover:bg-gray-800 transition flex items-center gap-2">
          Get Started
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  )
}