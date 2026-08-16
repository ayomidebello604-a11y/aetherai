const EXAMPLES = [
  { src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=70", label: "City Night", w: 150,  h: 100 },
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=70", label: "Technology", w: 160, h: 100 },
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=70", label: "Landscape",  w: 180, h: 100 },
  { src: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=70", label: "Nature",     w: 150,  h: 100 },
  { src: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&q=70", label: "Space",      w: 160, h: 100 },
]

export default function MockImageStrip() {
  return (
    <div className="w-full max-w-[800px] mb-6 flex-shrink-0">
      <p className="text-[9px] font-bold tracking-[.14em] uppercase text-white/20 mb-3">
        Example generations
      </p>
      <div className="flex items-end gap-3 flex-wrap justify-center">
        {EXAMPLES.map((ex, i) => (
          <div key={i} className="relative overflow-hidden border border-white/[.09] flex-shrink-0 cursor-pointer hover:border-white/30 hover:-translate-y-0.5 transition-all duration-200 rounded-lg" style={{ width: ex.w, height: ex.h }}>
            <img src={ex.src} alt={ex.label} className="w-full h-full object-cover opacity-55" />
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/85 to-transparent text-[8px] font-bold tracking-widest uppercase text-white/65">
              {ex.label}
            </div>
            <CornerBrackets />
          </div>
        ))}
      </div>
    </div>
  )
}

// shared corner bracket helper
function CornerBrackets() {
  return (
    <>
      {[
        "top-1 left-1 border-t border-l",
        "top-1 right-1 border-t border-r",
        "bottom-1 left-1 border-b border-l",
        "bottom-1 right-1 border-b border-r",
      ].map((cls, i) => (
        <span key={i}
              className={`absolute w-2 h-2 z-10 border-white/40 ${cls}`} />
      ))}
    </>
  )
}