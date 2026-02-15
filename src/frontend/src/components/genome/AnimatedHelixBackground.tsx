export default function AnimatedHelixBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Green to blue gradient - subtle breathing animation */}
          <linearGradient id="helixBgGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.15 150)" stopOpacity="0.18">
              <animate
                attributeName="stop-opacity"
                values="0.18;0.28;0.18"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="oklch(0.60 0.14 170)" stopOpacity="0.22">
              <animate
                attributeName="stop-opacity"
                values="0.22;0.32;0.22"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="oklch(0.58 0.13 200)" stopOpacity="0.18">
              <animate
                attributeName="stop-opacity"
                values="0.18;0.28;0.18"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <linearGradient id="helixBgGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.68 0.16 155)" stopOpacity="0.16">
              <animate
                attributeName="stop-opacity"
                values="0.16;0.26;0.16"
                dur="6.5s"
                repeatCount="indefinite"
                begin="0.5s"
              />
            </stop>
            <stop offset="50%" stopColor="oklch(0.62 0.15 180)" stopOpacity="0.20">
              <animate
                attributeName="stop-opacity"
                values="0.20;0.30;0.20"
                dur="6.5s"
                repeatCount="indefinite"
                begin="0.5s"
              />
            </stop>
            <stop offset="100%" stopColor="oklch(0.60 0.14 210)" stopOpacity="0.16">
              <animate
                attributeName="stop-opacity"
                values="0.16;0.26;0.16"
                dur="6.5s"
                repeatCount="indefinite"
                begin="0.5s"
              />
            </stop>
          </linearGradient>

          {/* Depth layer gradient - darker background strand */}
          <linearGradient id="helixBgGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.50 0.10 160)" stopOpacity="0.12" />
            <stop offset="50%" stopColor="oklch(0.48 0.09 185)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="oklch(0.50 0.10 205)" stopOpacity="0.12" />
          </linearGradient>

          {/* Gentle glow filter */}
          <filter id="helixGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle glow for main strands */}
          <filter id="helixSubtleGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Bokeh blur filter */}
          <filter id="bokehBlur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Background depth layer - darker strands */}
        <g className="motion-safe:animate-helix-bg-breathe motion-reduce:opacity-30" opacity="0.5">
          <path
            d="M 20% 0 Q 12% 12.5, 20% 25 T 20% 50 T 20% 75 T 20% 100"
            fill="none"
            stroke="url(#helixBgGradient3)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            filter="url(#helixGlow)"
          />
          <path
            d="M 80% 0 Q 88% 12.5, 80% 25 T 80% 50 T 80% 75 T 80% 100"
            fill="none"
            stroke="url(#helixBgGradient3)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            filter="url(#helixGlow)"
          />
        </g>

        {/* Main left helix strand with gentle green-blue glow */}
        <g className="motion-safe:animate-helix-bg-breathe motion-reduce:opacity-40">
          <path
            d="M 15% 0 Q 8% 12.5, 15% 25 T 15% 50 T 15% 75 T 15% 100"
            fill="none"
            stroke="url(#helixBgGradient1)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            filter="url(#helixSubtleGlow)"
          />
        </g>

        {/* Main right helix strand with gentle green-blue glow */}
        <g className="motion-safe:animate-helix-bg-breathe-alt motion-reduce:opacity-40">
          <path
            d="M 85% 0 Q 92% 12.5, 85% 25 T 85% 50 T 85% 75 T 85% 100"
            fill="none"
            stroke="url(#helixBgGradient2)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            filter="url(#helixSubtleGlow)"
          />
        </g>

        {/* Connecting base pairs with gentle visibility */}
        <g className="motion-safe:animate-helix-bg-pulse motion-reduce:opacity-20">
          {Array.from({ length: 20 }).map((_, i) => {
            const y = (i / 19) * 100;
            const phase = (i / 19) * Math.PI * 4;
            const leftX = 15 + Math.sin(phase) * 8;
            const rightX = 85 - Math.sin(phase) * 8;

            return (
              <line
                key={i}
                x1={`${leftX}%`}
                y1={`${y}%`}
                x2={`${rightX}%`}
                y2={`${y}%`}
                stroke="oklch(0.60 0.12 175)"
                strokeWidth="1"
                strokeOpacity="0.18"
                vectorEffect="non-scaling-stroke"
                filter="url(#helixGlow)"
              />
            );
          })}
        </g>

        {/* Bokeh-like light orbs for depth - green to blue tones */}
        <g className="motion-safe:animate-helix-bg-glow motion-reduce:hidden">
          {/* Large background orbs */}
          <circle 
            cx="12%" 
            cy="20%" 
            r="80" 
            fill="oklch(0.62 0.14 155)" 
            opacity="0.10" 
            filter="url(#bokehBlur)" 
          />
          <circle 
            cx="88%" 
            cy="45%" 
            r="100" 
            fill="oklch(0.58 0.13 195)" 
            opacity="0.12" 
            filter="url(#bokehBlur)" 
          />
          <circle 
            cx="18%" 
            cy="70%" 
            r="90" 
            fill="oklch(0.65 0.15 165)" 
            opacity="0.09" 
            filter="url(#bokehBlur)" 
          />
          <circle 
            cx="82%" 
            cy="85%" 
            r="70" 
            fill="oklch(0.60 0.14 205)" 
            opacity="0.11" 
            filter="url(#bokehBlur)" 
          />
          
          {/* Medium orbs */}
          <circle 
            cx="25%" 
            cy="35%" 
            r="50" 
            fill="oklch(0.64 0.15 160)" 
            opacity="0.14" 
            filter="url(#helixGlow)" 
          />
          <circle 
            cx="75%" 
            cy="60%" 
            r="55" 
            fill="oklch(0.59 0.13 190)" 
            opacity="0.16" 
            filter="url(#helixGlow)" 
          />
          <circle 
            cx="30%" 
            cy="90%" 
            r="45" 
            fill="oklch(0.62 0.14 175)" 
            opacity="0.13" 
            filter="url(#helixGlow)" 
          />
          
          {/* Small sharp orbs for detail */}
          <circle 
            cx="40%" 
            cy="15%" 
            r="20" 
            fill="oklch(0.68 0.16 150)" 
            opacity="0.22" 
            filter="url(#helixGlow)" 
          />
          <circle 
            cx="60%" 
            cy="40%" 
            r="25" 
            fill="oklch(0.66 0.15 170)" 
            opacity="0.20" 
            filter="url(#helixGlow)" 
          />
          <circle 
            cx="50%" 
            cy="75%" 
            r="18" 
            fill="oklch(0.61 0.14 200)" 
            opacity="0.24" 
            filter="url(#helixGlow)" 
          />
          <circle 
            cx="70%" 
            cy="25%" 
            r="22" 
            fill="oklch(0.63 0.14 185)" 
            opacity="0.19" 
            filter="url(#helixGlow)" 
          />
        </g>
      </svg>
    </div>
  );
}
