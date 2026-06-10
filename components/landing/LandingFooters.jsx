export default function LandingFooter() {
  const links = {
    Product: ['Researcher Mode', 'Co-Programmer', 'How It Works', 'Changelog'],
    Resources: ['Documentation', 'API Reference', 'FAQ', 'Status'],
    Legal: ['Privacy Policy', 'Terms of Use', 'Cookie Policy'],
  }

  return (
    <div>
      <footer className="bg-black text-white px-6 sm:px-10 lg:px-12 pt-12 sm:pt-16 pb-6 sm:pb-8">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 border-b border-white/10 pb-10 sm:pb-12 mb-6 sm:mb-8">

          <div>
            <p className="text-base sm:text-xl font-black tracking-[0.15em] uppercase mb-2 sm:mb-3">Aether AI</p>
            <p className="text-[10px] sm:text-[11px] text-white/40 tracking-widest uppercase leading-relaxed max-w-[200px]">
              A dual-mode AI workspace for researchers and programmers.
            </p>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.18em] uppercase text-white/30 mb-3 sm:mb-4">
                {section}
              </p>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {items.map(item => (
                  <li key={item}>
                    <a href="#"
                      className="text-[12px] sm:text-[13px] text-white/50 hover:text-white tracking-wide transition-colors duration-150"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <p className="text-[10px] sm:text-[11px] text-white/25 tracking-widest uppercase order-2 sm:order-1">
            © 2025 Aether AI. All rights reserved.
          </p>

          <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2 flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] sm:text-[11px] text-white/25 tracking-widest uppercase\">
              All systems operational
            </span>
            <span className="w-px h-3 bg-white/10 hidden sm:inline\" />
            <span className="text-[10px] sm:text-[11px] text-white/20 tracking-[0.1em] uppercase hidden sm:inline\">
              AETHER
            </span>
          </div>
        </div>

      </footer>
    </div>
  )
}