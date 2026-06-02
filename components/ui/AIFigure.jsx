// components/ui/AIFigure.jsx
// Geometric AI representative — used in the landing page hero

export default function AIFigure({ size = 400 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none"
         xmlns="http://w3.org">
      {/* outer frame */}
      <rect x="1" y="1" width="398" height="398" stroke="#000" strokeWidth="1" fill="#fff"/>
      
      {/* subtle grid */}
      {[100, 200, 300].map(v => (
        <g key={v}>
          <line x1={v} y1="0" x2={v} y2="400" stroke="#000" strokeWidth=".5" opacity=".08"/>
          <line x1="0" y1={v} x2="400" y2={v} stroke="#000" strokeWidth=".5" opacity=".08"/>
        </g>
      ))}
      
      {/* head */}
      <rect x="148" y="52"  width="104" height="104" fill="#000"/>
      <rect x="168" y="74"  width="24" height="24" fill="#fff"/>
      <rect x="208" y="74"  width="24" height="24" fill="#fff"/>
      <rect x="175" y="81"  width="10" height="10" fill="#000"/>
      <rect x="215" y="81"  width="10" height="10" fill="#000"/>
      <rect x="172" y="130" width="56" height="5"  fill="#fff"/>
      
      {/* neck */}
      <rect x="188" y="156" width="24" height="24" fill="#000"/>
      
      {/* torso */}
      <rect x="96"  y="180" width="208" height="130" fill="#000"/>
      <rect x="112" y="196" width="176" height="90"  fill="#fff"/>
      
      {/* chest grid dots */}
      {[0, 1, 2, 3, 4, 5].map(i =>
        [0, 1].map(j => (
          <rect key={`${i}${j}`}
            x={124 + i*26} y={210 + j*26} width="14" height="14"
            fill="#000" opacity={i+j<3?1:i+j===3?.5:.2}/>
        ))
      )}
      
      {/* arms */}
      <rect x="36"  y="180" width="60" height="100" fill="#000"/>
      <rect x="304" y="180" width="60" height="100" fill="#000"/>
      <rect x="36"  y="246" width="60" height="3"   fill="#fff" opacity=".5"/>
      <rect x="304" y="246" width="60" height="3"   fill="#fff" opacity=".5"/>
      
      {/* hands */}
      <rect x="28"  y="280" width="76" height="42" fill="#000"/>
      <rect x="296" y="280" width="76" height="42" fill="#000"/>
      
      {/* fingers L */}
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={i} x={28+i*14} y="322" width="10"
              height={[18, 22, 24, 22, 18][i]} fill="#000"/>
      ))}
      
      {/* fingers R */}
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={i} x={296+i*14} y="322" width="10"
              height={[18, 22, 24, 22, 18][i]} fill="#000"/>
      ))}
      
      {/* legs */}
      <rect x="120" y="310" width="64" height="72" fill="#000"/>
      <rect x="216" y="310" width="64" height="72" fill="#000"/>
      
      {/* feet */}
      <rect x="110" y="380" width="84" height="10" fill="#000"/>
      <rect x="206" y="380" width="84" height="10" fill="#000"/>
      
      {/* corner brackets */}
      {[[16, 16], [368, 16], [16, 368], [368, 368]].map(([x, y], i) => (
        <g key={i}>
          <rect x={i<2?x:x-20} y={i%2===0?y:y-20}
                width="20" height="2" fill="#000"/>
          <rect x={i<2?x:x+18} y={i%2===0?y:y-18}
                width="2" height="20" fill="#000"/>
        </g>
      ))}
    </svg>
  )
}
