'use client'

import { useRef, useEffect } from 'react'

export default function ImagePromptInput({
  prompt, setPrompt,
  width,  setWidth,
  height, setHeight,
  loading,
  onSubmit,
  lastGen,
}) {
  const textareaRef = useRef(null)

  // Auto-expand textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [prompt])
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[580px] flex-shrink-0 relative z-10 bg-white/[.06] border border-white/10 focus-within:border-white/22 transition-colors"
    >
      {/* Follow-up indicator */}
      {lastGen && (
        <div className="px-4 pt-2 pb-0">
          <div className="text-[11px] text-white/40 flex items-center gap-1 mb-1">
            <span>↻</span>
            <span>Refining: "{lastGen.prompt.substring(0, 40)}{lastGen.prompt.length > 40 ? '...' : ''}"</span>
          </div>
        </div>
      )}

      {/* Textarea */}
      <div className="px-4 pt-3 pb-1">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSubmit(e)
            }
          }}
          placeholder={lastGen ? "Describe what to improve..." : "Message AI Image Studio…"}
          className="w-full bg-transparent border-none outline-none text-white text-[13px] font-sans leading-relaxed resize-none min-h-[44px] max-h-[200px] overflow-y-auto placeholder:text-white/28"
        />
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between px-3 pb-2.5">

        {/* Left: attach + pill label + dimension inputs */}
        <div className="flex items-center gap-2">

          {/* Attach icon */}
          <button type="button"
                  className="w-7 h-7 flex items-center justify-center bg-white/[.06] border border-white/[.08] text-white/40 hover:text-white transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49 l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19  a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          {/* "Create an image" pill */}
          <div className="inline-flex items-center gap-1.5 bg-white/[.08]  border border-white/15 px-2.5 py-1.5 text-[10px] font-semibold text-white/60">
            <svg width="10" height="10" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Create an image
          </div>

          {/* Width × Height inputs */}
          <div className="flex items-center border border-white/[.09] bg-white/[.04]">
            <input
              type="number"
              value={width}
              onChange={e => setWidth(Number(e.target.value))}
              className="bg-transparent border-none text-white/65 font-mono text-[11px] font-bold text-center w-[52px] px-2 py-1 outline-none"
            />
            <span className="text-[10px] opacity-25 border-x border-white/[.09] px-1.5 py-1">×</span>
            <input
              type="number"
              value={height}
              onChange={e => setHeight(Number(e.target.value))}
              className="bg-transparent border-none text-white/65 font-mono text-[11px] font-bold text-center w-[52px] px-2 py-1 outline-none"
            />
          </div>

        </div>

        {/* Right: voice icon + send button */}
        <div className="flex items-center gap-1.5">

          {/* Voice icon */}
          <button type="button"
                  className="w-7 h-7 flex items-center justify-center bg-white/[.06] border border-white/[.08] text-white/40 hover:text-white transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8"  y1="23" x2="16" y2="23"/>
            </svg>
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-7 h-7 bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="12" height="12" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>

        </div>
      </div>
    </form>
  )
}