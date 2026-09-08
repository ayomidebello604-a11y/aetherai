"use client"

import React, { Suspense } from "react"
import  { useState, useRef, useEffect } from 'react'
import { BookmarkPlus, BookmarkCheck, Download, RotateCcw, AlertCircle } from "lucide-react"
import WorkspaceLayout  from "@/components/layout/WorkspaceLayout"
import WorkspaceHeader  from "@/components/layout/WorkspaceHeader"
import GlobeComponent   from "@/components/image-generation/GlobeComponent"
import MockImageStrip   from "@/components/image-generation/MockImageStrip"
import ImagePromptInput from "@/components/image-generation/ImagePromptInput"

// localStorage helpers (unchanged)
const KEY = "aether_saved_images"
const getSaved    = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]") } catch { return [] } }
const saveImage   = (e) => localStorage.setItem(KEY, JSON.stringify([e, ...getSaved()]))
const isSaved     = (id) => getSaved().some(i => i.id === id)

export default function ImgGenerationPage() {
  // ── Your original state — all unchanged ─────────────────────────────────
  const [prompt,      setPrompt]      = useState("")
  const [width,       setWidth]       = useState(512)
  const [height,      setHeight]      = useState(512)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [imageSrc,    setImageSrc]    = useState(null)

  // ── New state ────────────────────────────────────────────────────────────
  const [generations, setGenerations] = useState([])
  const [savedIds,    setSavedIds]    = useState(() => new Set(getSaved().map(i => i.id)))
  const [lastGen,     setLastGen]     = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) canvasRef.current.scrollTop = canvasRef.current.scrollHeight
  }, [generations])

  // ── Your original handleSubmit — only small additions ────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null); setImageSrc(null)
    if (!prompt.trim()) { setError("Please enter a prompt."); return }
    setLoading(true)
    const submitted = prompt; setPrompt("")
    try {
      const requestBody = { prompt: submitted, width, height }
      if (lastGen) {
        requestBody.previousPrompt = lastGen.prompt
        requestBody.previousId = lastGen.id
      }
      const res  = await fetch("/api/generate-image", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      const data = await res.json()
      if (!res.ok || !data.success) { setError(data?.error || "Generation failed"); return }
      let src = data.image
      if (!src.startsWith("data:") && !src.startsWith("http")) src = `data:image/png;base64,${src}`
      setImageSrc(src)
      const newGen = {
        id:    `gen_${Date.now()}`, prompt: submitted, src, width, height,
        align: generations.length % 2 === 0 ? "left" : "right",
        time:  new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),
        isFollowUp: !!lastGen,
        previousId: lastGen?.id,
      }
      setGenerations(prev => [...prev, newGen])
      setLastGen(newGen)
    } catch (err) { setError(String(err)) }
    finally       { setLoading(false) }
  }

  function handleSave(gen) {
    if (savedIds.has(gen.id)) return
    saveImage({ id: gen.id, prompt: gen.prompt, src: gen.src, width: gen.width, height: gen.height, savedAt: new Date().toISOString() })
    setSavedIds(prev => new Set([...prev, gen.id]))
  }

  const isEmpty = generations.length === 0 && !loading

  return (
    <WorkspaceLayout activeItem="imagegen">
      <WorkspaceHeader mode="Image Studio" />

      {/* Warm charcoal canvas — deliberately distinct from the sidebar's near-black */}
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative bg-[#141312]">

        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-white/30 text-sm">Loading page…</div>}>
          {isEmpty ? (

            // ── EMPTY STATE: Globe + Mock strip + Input ──────────────
            <div className="flex-1 flex flex-col items-center justify-start md:justify-center px-6 pb-5 pt-6 relative z-5">
              <GlobeComponent />
              <MockImageStrip />
              <ImagePromptInput
                prompt={prompt}   setPrompt={setPrompt}
                width={width}     setWidth={setWidth}
                height={height}   setHeight={setHeight}
                loading={loading} onSubmit={handleSubmit}
                lastGen={lastGen}
              />

            </div>

          ) : (

          // ── AFTER GENERATION: canvas + sticky input ──────────────
          <>
            <div ref={canvasRef}
                 className="flex-1 overflow-y-auto relative z-5 px-3 py-6 sm:px-6 sm:py-8 flex flex-col gap-8">
              {generations.map(gen => (
                <div key={gen.id}
                     className="w-full max-w-3xl mx-auto flex flex-col gap-3 items-center">
                  <div className="self-stretch sm:self-auto sm:max-w-[560px] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed bg-white/[.04] border border-white/[.07] text-white/70">
                    {gen.isFollowUp && (
                      <span className="flex items-center gap-1 text-[11px] text-white/40 mb-1">
                        <RotateCcw size={10} /> Follow-up
                      </span>
                    )}
                    {gen.prompt}
                  </div>
                     <div className="relative w-full max-w-3xl max-h-[min(62vh,560px)] overflow-hidden rounded-xl border border-white/[.08] bg-white/[.03] hover:border-white/[.16] transition-colors"
                       style={{ aspectRatio: `${gen.width} / ${gen.height}` }}>
                    <img src={gen.src} alt={gen.prompt} className="absolute inset-0 w-full h-full object-contain"/>
                    <span className="absolute top-2.5 left-2.5 rounded-md bg-black/40 backdrop-blur-sm px-2 py-1 text-[10px] text-white/60 z-10">
                      {gen.width} × {gen.height}
                    </span>
                  </div>
                  <div className="self-start flex gap-2">
                    <button onClick={() => handleSave(gen)} disabled={savedIds.has(gen.id)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${savedIds.has(gen.id) ? "border border-white/10 text-white/30 cursor-default" : "bg-[#F3EDE4] text-black hover:bg-white"}`}>
                      {savedIds.has(gen.id) ? <><BookmarkCheck size={13}/> Saved</> : <><BookmarkPlus size={13}/> Save</>}
                    </button>
                    <a href={gen.src} download={`aether_${gen.id}.png`}
                       className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all">
                      <Download size={13}/> Download
                    </a>
                  </div>
                  <span className="text-[11px] text-white/25">{gen.time} · {gen.width}×{gen.height}</span>
                </div>
              ))}
              {loading && (
                <div className="self-start w-full max-w-3xl mx-auto flex flex-col gap-2">
                  <div className="w-40 h-4 rounded-md bg-white/[.04] animate-pulse"/>
                  <div className="w-full max-h-[min(62vh,560px)] aspect-square rounded-xl bg-white/[.03] border border-white/[.06] flex items-center justify-center animate-pulse">
                    <span className="text-xs text-white/30">Generating…</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="self-start flex items-center gap-2 rounded-lg bg-white/[.04] border border-white/[.08] px-3.5 py-2.5 text-[13px] text-white/60">
                  <AlertCircle size={14} className="text-white/40 flex-shrink-0" /> {error}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-white/[.06] flex-shrink-0 relative z-20 flex justify-center bg-[#141312]/95 backdrop-blur-sm">
              <ImagePromptInput
                prompt={prompt}   setPrompt={setPrompt}
                width={width}     setWidth={setWidth}
                height={height}   setHeight={setHeight}
                loading={loading} onSubmit={handleSubmit}
                lastGen={lastGen}
              />
            </div>
          </>

        )}
        </Suspense>   
      </div>
    </WorkspaceLayout>
  )
}