"use client"

import React, { Suspense } from "react"
import  { useState, useRef, useEffect } from 'react'
import { BookmarkPlus, BookmarkCheck, Download } from "lucide-react"
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

function CornerBrackets() {
  return (
    <>
      {["top-1 left-1 border-t border-l","top-1 right-1 border-t border-r",
        "bottom-1 left-1 border-b border-l","bottom-1 right-1 border-b border-r"]
        .map((c,i) => <span key={i} className={`absolute w-2 h-2 z-10 border-white/40 ${c}`}/>)}
    </>
  )
}

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

      {/* Black background */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-black">

        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-white/30">Loading page...</div>}>
          {isEmpty ? (

            // ── EMPTY STATE: Globe + Mock strip + Input ──────────────
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-5 relative z-5">
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
                 className="flex-1 overflow-y-auto relative z-5 px-6 py-6 flex flex-col gap-6">
              {generations.map(gen => (
                <div key={gen.id}
                     className={`flex flex-col gap-2 max-w-[500px]
                       ${gen.align === "left" ? "self-start items-start" : "self-end items-end"}`}>
                  <div className={`px-3 py-2 text-[12px] leading-relaxed max-w-[360px] border ${gen.isFollowUp ? "bg-white/[.10] border-white/20 opacity-90" : "bg-white/[.06] border-white/10 opacity-80"}`}>
                    {gen.isFollowUp && <span className="text-[9px] text-white/50 block mb-1">↻ Follow-up:</span>}
                    {gen.prompt}
                  </div>
                  <div className="relative overflow-hidden border border-white/10"
                       style={{ width: `${Math.min(gen.width*.4,420)}px`, height: `${Math.min(gen.height*.4,260)}px` }}>
                    <img src={gen.src} alt={gen.prompt} className="w-full h-full object-cover"/>
                    <span className="absolute top-2 left-2 bg-black/75 border border-white/10 text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 text-white/50 z-10">{gen.width} × {gen.height}</span>
                    <CornerBrackets />
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleSave(gen)} disabled={savedIds.has(gen.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all ${savedIds.has(gen.id) ? "border border-white/12 text-white/30 cursor-default" : "bg-white text-black hover:bg-gray-100"}`}>
                      {savedIds.has(gen.id) ? <><BookmarkCheck size={11}/> Saved</> : <><BookmarkPlus size={11}/> Save</>}
                    </button>
                    <a href={gen.src} download={`aether_${gen.id}.png`}
                       className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase border border-white/12 text-white/35 hover:text-white hover:border-white/30 transition-all">
                      <Download size={11}/> Download
                    </a>
                  </div>
                  <span className="text-[9px] opacity-20 tracking-[.06em] uppercase">{gen.time} · {gen.width}×{gen.height}</span>
                </div>
              ))}
              {loading && (
                <div className="self-start flex flex-col gap-2">
                  <div className="w-40 h-4 bg-white/[.05] animate-pulse"/>
                  <div className="w-64 h-44 bg-white/[.04] border border-white/[.07] flex items-center justify-center animate-pulse">
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-25">Generating…</span>
                  </div>
                </div>
              )}
              {error && <div className="self-start bg-white/[.04] border border-white/10 px-3 py-2 text-[12px] opacity-60">⚠ {error}</div>}
            </div>

            <div className="px-6 py-3 border-t border-white/[.07] flex-shrink-0 relative z-20 flex justify-center">
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