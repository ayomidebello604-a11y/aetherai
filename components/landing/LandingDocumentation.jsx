import React from 'react'
import {
Search, Code2, Package, Server, CheckCircle2,
PenLine, HelpCircle, ArrowRight,
} from 'lucide-react'

export default function LandingDocs() {
  return (
    <section id="documentation" className="border-t border-black">
      {/* ── Intro ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-black">
        <div className="p-6 sm:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-black">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-2 h-2 bg-black inline-block" />
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[.2em] uppercase">Documentation</span>
          </div>
          <h2 className="font-black leading-[.95] tracking-tight mb-4 sm:mb-6"
              style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}>
            START IN<br/>3 MINUTES.
          </h2>
          <p className="text-sm sm:text-base leading-relaxed opacity-55 max-w-sm">
            AETHER has two simple tools. Pick what you need, type your question or paste code,
            and get helpful answers — no complicated setup, just results.
          </p>
        </div>

        {/* Quick Steps */}
        <div className="p-6 sm:p-10 lg:p-16 flex items-center">
          <div className="w-full border border-black divide-y divide-black">
            <div className="flex items-start gap-4 p-4 sm:p-5">
              <span className="bg-black text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2 py-1 flex-shrink-0 mt-0.5">01</span>
              <div>
                <div className="text-[12px] sm:text-[13px] font-bold mb-1">Create an account</div>
                <div className="text-[11px] sm:text-[12px] opacity-55 leading-relaxed">Register with your email or continue with Google. Under 30 seconds — no credit card required.</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 sm:p-5">
              <span className="bg-black text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2 py-1 flex-shrink-0 mt-0.5">02</span>
              <div>
                <div className="text-[12px] sm:text-[13px] font-bold mb-1">Choose your workspace mode</div>
                <div className="text-[11px] sm:text-[12px] opacity-55 leading-relaxed">Select Researcher for knowledge queries or Co-Programmer for code analysis from the sidebar.</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 sm:p-5">
              <span className="bg-black text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2 py-1 flex-shrink-0 mt-0.5">03</span>
              <div>
                <div className="text-[12px] sm:text-[13px] font-bold mb-1">Enter your input and get results</div>
                <div className="text-[11px] sm:text-[12px] opacity-55 leading-relaxed">Type a question or paste your code. AETHER returns a clean, structured response instantly.</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 sm:p-5">
              <span className="bg-black text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2 py-1 flex-shrink-0 mt-0.5">04</span>
              <div>
                <div className="text-[12px] sm:text-[13px] font-bold mb-1">Save your work</div>
                <div className="text-[11px] sm:text-[12px] opacity-55 leading-relaxed">Save answers and annotated code directly to your session for reference later.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mode Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-black">
        {/* Mode 1: Researcher */}
        <div className="p-6 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-black">
          <div className="w-10 h-10 border border-black flex items-center justify-center mb-5">
            <Search size={18} />
          </div>
          <span className="bg-black text-white text-[8px] sm:text-[9px] font-bold tracking-[.15em] uppercase px-2 py-1 inline-block mb-4">Mode 01</span>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-3">Researcher</h3>
          <p className="text-sm leading-relaxed opacity-60 mb-6 max-w-md">Ask any question and get a clear answer. AETHER shows you where it found the information so you know you can trust it. Perfect for learning about anything — science, history, tech, or just life questions.</p>
          <div className="h-px bg-black opacity-10 mb-5" />
          <ul className="divide-y divide-gray-100">
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[12px] sm:text-[13px] leading-relaxed opacity-65">Ask any question, specific or broad</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[12px] sm:text-[13px] leading-relaxed opacity-65">Get an answer backed by real sources</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[12px] sm:text-[13px] leading-relaxed opacity-65">Sort sources by category — News, Research, or Guides</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[12px] sm:text-[13px] leading-relaxed opacity-65">Save any answer to revisit it in the same session</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[12px] sm:text-[13px] leading-relaxed opacity-65">Works across any domain — science, law, finance, technology, history</span>
            </li>
          </ul>
        </div>

        {/* Mode 2: Co-Programmer */}
        <div className="p-6 sm:p-10 lg:p-14">
          <div className="w-10 h-10 border border-black flex items-center justify-center mb-5">
            <Code2 size={18} />
          </div>
          <span className="bg-black text-white text-[8px] sm:text-[9px] font-bold tracking-[.15em] uppercase px-2 py-1 inline-block mb-4">Mode 02</span>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-3">Co-Programmer</h3>
          <p className="text-sm leading-relaxed opacity-60 mb-6 max-w-md">Paste your code and get useful feedback. AETHER spots problems, explains what your code does, and suggests how to make it better.</p>
          <div className="h-px bg-black opacity-10 mb-5" />
          <ul className="divide-y divide-gray-100">
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[12px] sm:text-[13px] leading-relaxed opacity-65">Works with popular languages like Python, JavaScript, Go, and Rust</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[12px] sm:text-[13px] leading-relaxed opacity-65">Change languages instantly — editor gets a fresh template</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[12px] sm:text-[13px] leading-relaxed opacity-65">Click Analyse to check your code and get clear feedback</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[12px] sm:text-[13px] leading-relaxed opacity-65">Feedback covers: what the code does, how fast it is, potential issues, and ways to improve</span>
            </li>
            <li className="flex items-start gap-3 py-2.5">
              <span className="w-1 h-1 bg-black flex-shrink-0 mt-2" />
              <span className="text-[12px] sm:text-[13px] leading-relaxed opacity-65">Save annotated code snapshots directly from the workspace</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── How It Works ───────────────────────── */}
      <div className="border-b border-black">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 sm:px-10 lg:px-12 py-4 sm:py-6 border-b border-black gap-2 sm:gap-0">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[.2em] uppercase">How It Works</span>
          <span className="text-[11px] sm:text-[12px] opacity-40">From your question to your answer</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          <div className="p-6 sm:p-8 border-r border-black border-b sm:border-b-0">
            <div className="text-[24px] sm:text-[32px] font-black opacity-[.07] leading-none mb-3">01</div>
            <PenLine size={18} className="opacity-60 mb-3" />
            <div className="text-[13px] sm:text-[14px] font-bold mb-2">You enter your input</div>
            <div className="text-[12px] sm:text-[13px] opacity-55 leading-relaxed">Type a research question or paste code. No special syntax needed.</div>
          </div>
          <div className="p-6 sm:p-8 border-r border-black border-b sm:border-b-0">
            <div className="text-[24px] sm:text-[32px] font-black opacity-[.07] leading-none mb-3">02</div>
            <Package size={18} className="opacity-60 mb-3" />
            <div className="text-[13px] sm:text-[14px] font-bold mb-2">We get your message</div>
            <div className="text-[12px] sm:text-[13px] opacity-55 leading-relaxed">Your input is sent securely to our servers, ready for processing.</div>
          </div>
          <div className="p-6 sm:p-8 border-r border-black border-b sm:border-b-0 lg:border-b-0">
            <div className="text-[24px] sm:text-[32px] font-black opacity-[.07] leading-none mb-3">03</div>
            <Server size={18} className="opacity-60 mb-3" />
            <div className="text-[13px] sm:text-[14px] font-bold mb-2">AI processes it</div>
            <div className="text-[12px] sm:text-[13px] opacity-55 leading-relaxed">Our AI reads and understands your question or code, then generates a helpful response. Your privacy is protected.</div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="text-[24px] sm:text-[32px] font-black opacity-[.07] leading-none mb-3">04</div>
            <CheckCircle2 size={18} className="opacity-60 mb-3" />
            <div className="text-[13px] sm:text-[14px] font-bold mb-2">You get your answer</div>
            <div className="text-[12px] sm:text-[13px] opacity-55 leading-relaxed">The response appears in your browser instantly. No waiting, no confusion.</div>
          </div>
        </div>
      </div>

      {/* ── CTA ────────────────────────────────── */}
      <div className="px-6 sm:px-10 lg:px-16 py-10 sm:py-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-0">
        <div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2">Give it a try</h3>
          <p className="text-sm opacity-55">No payment needed. Start exploring — simple, fast, and actually helpful.</p>
        </div>
        <a href="/auth" className="bg-black text-white px-6 py-3 text-sm font-bold hover:bg-gray-800 transition flex items-center gap-2 whitespace-nowrap">
          Get Started
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  )
}