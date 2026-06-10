import { useState } from 'react';
import { Loader } from 'lucide-react';

export default function AnalysisPanel({ analysedCode, analysis, originalCode, onCodeApply, error, loading }) {
  const [showModified, setShowModified] = useState(true)
  const hasAnalysis = analysis && analysis.trim().length > 0
  const modifiedLines = (analysedCode || '').split('\n')

  return (
    <div className="w-full lg:w-1/2 flex flex-col border-l border-black">

      {/* Header */}
      <div className="px-4 sm:px-5 py-2 sm:py-3 border-b border-black flex-shrink-0">
        <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-50">
          Analysis Output
        </span>
      </div>

      {/* Tabs */}
      {hasAnalysis && (
        <div className="flex border-b border-black bg-[#f5f5f5] flex-shrink-0">
          <button
            onClick={() => setShowModified(true)}
            className={`flex-1 px-3 sm:px-4 py-2 text-[8px] sm:text-[9px] font-bold tracking-widest uppercase border-r border-black transition-all ${
              showModified ? 'bg-black text-white' : 'hover:bg-[#eee]'
            }`}
          >
            Modified Code
          </button>
          <button
            onClick={() => setShowModified(false)}
            className={`flex-1 px-3 sm:px-4 py-2 text-[8px] sm:text-[9px] font-bold tracking-widest uppercase transition-all ${
              !showModified ? 'bg-black text-white' : 'hover:bg-[#eee]'
            }`}
          >
            Explanation
          </button>
        </div>
      )}

      {/* Content */}
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5">
        {loading ? (
          <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-center mt-8">
            <Loader className="animate-spin mx-auto" />
             Analyzing your code...
          </p>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-[10px] sm:text-[11px]">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : !hasAnalysis ? (
          <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase opacity-25 text-center mt-8">
            Paste code and click Analyse
          </p>
        ) : showModified ? (
          <div className="space-y-2">
            <div className="bg-[#1b1b1b] rounded text-[10px] sm:text-[11px] font-mono text-[#e2e2e2] p-2 sm:p-3 overflow-x-auto max-h-96">
              {modifiedLines.map((line, i) => (
                <div key={i} className="leading-6 whitespace-pre-wrap break-words">
                  {line || ' '}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-[11px] sm:text-[12px] leading-6 space-y-3 whitespace-pre-wrap break-words">
            {analysis}
          </div>
        )}
      </div>

      {/* Actions */}
      {hasAnalysis && (
        <div className="p-3 sm:p-4 border-t border-black space-y-2 flex-shrink-0">
          <button
            onClick={() => onCodeApply(analysedCode)}
            className="w-full bg-black text-white border border-black py-2 sm:py-2.5 text-[8px] sm:text-[9px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all"
          >
            Apply Changes
          </button>
        </div>
      )}

    </div>
  )
}
