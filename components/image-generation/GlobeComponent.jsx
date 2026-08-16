// Shown in the result panel before the first generation.
// Pass a greeting string or it defaults to "Good Evening, AETHER."

export default function GlobeComponent({ greeting = "Good Evening, AETHER." }) {
  return (
    <div className="flex flex-col items-center gap-0 mb-auto pt-8 flex-shrink-0">

      {/* Orb */}
      <div className="relative w-[280px] h-[280px] flex items-center justify-center mb-12">

        {/* Outer glow rings */}
        <span className="absolute inset-[-20px] border border-white/[.06]"
              style={{ borderRadius: "50%" }} />
        <span className="absolute inset-[-44px] border border-white/[.03]"
              style={{ borderRadius: "50%" }} />

        {/* Animated glow behind the orb */}
        <div
          className="absolute inset-[-66px] animate-pulse"
          style={{
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(140,100,255,0.35) 0%, rgba(60,120,255,0.18) 40%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />

        {/* The orb itself */}
        <div
          className="w-64 h-64 relative z-10 overflow-hidden"
          style={{ borderRadius: "50%" }}>

          {/* Spinning conic gradient */}
          <div
            className="w-full h-full animate-spin"
            style={{
              borderRadius:  "50%",
              background:    "conic-gradient(from 0deg,#a78bfa,#60a5fa, #34d399,#fbbf24,#f472b6,#a78bfa)",
              filter:        "blur(2px) brightness(1.35)",
              animationDuration: "6s",
            }}
          />

          {/* Soft dark inner layer — adds depth */}
          <div
            className="absolute inset-2"
            style={{ borderRadius: "50%", background: "rgba(0,0,0,0.15)" }}
          />

          {/* Highlight sheen — top-left gloss */}
          <div
            className="absolute inset-0 z-10"
            style={{
              borderRadius: "50%",
              background:   "radial-gradient(circle at 32% 32%, rgba(255,255,255,0.55), transparent 58%)",
            }}
          />

        </div>
      </div>

      {/* Greeting text */}
      <div className="text-center">
        <p className="text-[22px] font-bold tracking-tight text-white leading-snug">
          {greeting}
        </p>
        <p className="text-[22px] font-light text-white/60 leading-snug">
          Can I help you with anything?
        </p>
      </div>

    </div>
  )
}