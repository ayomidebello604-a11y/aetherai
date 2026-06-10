import { useRef } from 'react';
import { Loader2 } from 'lucide-react';


export default function CodeEditor({
  code, onCodeChange, onAnalyse, isAnalyzing, instruction, onInstructionChange, detectedLanguage
}) {
  const lines = code.split('\n')
  const textareaRef = useRef(null)
  const lineNumbersRef = useRef(null)

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  return (
    <div className="w-full lg:w-1/2 flex flex-col border-r border-black min-w-0 h-full">

      {/* Header */}
      <div className="px-4 sm:px-5 py-2 sm:py-3 border-b border-black flex-shrink-0">
        <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-50">
          Code Editor
        </span>
      </div>

      {/* Detected Language Indicator */}
      <div className="px-4 sm:px-5 py-2 border-b border-black bg-[#f0f0f0] flex-shrink-0">
        <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase opacity-60">
          Detected Language: <span className="font-mono text-[9px] sm:text-[10px] text-black\">{detectedLanguage}</span>
        </span>
      </div>

      {/* Instruction Input */}
      <div className="px-4 sm:px-5 py-2 sm:py-3 border-b border-black bg-[#f5f5f5] flex-shrink-0">
        <input
          type="text"
          placeholder="Enter instruction..."
          value={instruction}
          onChange={e => onInstructionChange(e.target.value)}
          className="w-full text-[10px] sm:text-[11px] px-2 sm:px-3 py-2 border border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>
    
      {/* Editor Container - scrollable, grows to fill space */}
      <div className="flex-1 bg-[#1b1b1b] min-h-0 flex overflow-hidden">
        {/* Line numbers */}
        <div ref={lineNumbersRef} className="py-5 px-4 text-right select-none flex-shrink-0 overflow-hidden" style={{ minWidth: '48px' }}>
          {lines.map((_, i) => (
            <div key={i} className="text-[12px] leading-7 font-mono text-white opacity-20">
              {i + 1}
            </div>
          ))}
        </div>
        {/* Code textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={e => onCodeChange(e.target.value)}
          onScroll={handleScroll}
          placeholder="Paste your code here..."
          spellCheck={false}
          className="flex-1 py-5 pr-6 bg-transparent text-[#e2e2e2] font-mono text-[13px] leading-7 resize-none focus:outline-none w-full placeholder-[#666] overflow-y-auto"
          style={{ minHeight: '100%' }}
        />
      </div>

      {/* Button Bar - Always Visible at Bottom */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#1b1b1b] border-t border-black flex-shrink-0">
        <span className="text-[9px] font-bold tracking-widest uppercase text-white opacity-30">
          {lines.length} lines · UTF-8
        </span>
        <button 
          onClick={onAnalyse}
          disabled={!code.trim() || isAnalyzing}
          className="bg-white text-black px-4 py-1.5 text-[9px] font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all border border-white disabled:opacity-50 disabled:cursor-not-allowed">
          {isAnalyzing ? (<Loader2 className="animate-spin" />) : '▶ Analyse'}
        </button>
      </div>

    </div>
  )
}
