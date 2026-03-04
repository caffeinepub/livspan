export default function AnimatedHelixBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Green to blue gradient for main helix - scientific palette */}
          <linearGradient
            id="helixMainGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="oklch(0.62 0.15 150)" />
            <stop offset="50%" stopColor="oklch(0.58 0.14 175)" />
            <stop offset="100%" stopColor="oklch(0.55 0.13 200)" />
          </linearGradient>

          {/* Secondary gradient with slight offset */}
          <linearGradient
            id="helixSecondaryGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="oklch(0.60 0.14 155)" />
            <stop offset="50%" stopColor="oklch(0.56 0.13 180)" />
            <stop offset="100%" stopColor="oklch(0.53 0.12 205)" />
          </linearGradient>

          {/* Glow filter for luminous effect */}
          <filter id="helixGlowFilter">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Stronger glow for emphasis */}
          <filter id="helixStrongGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left helix strand - filigree vertical double helix */}
        <g className="motion-safe:animate-helix-bg-breathe motion-reduce:opacity-40">
          <path
            d="M 35% 0 Q 25% 12.5, 35% 25 T 35% 50 T 35% 75 T 35% 100"
            fill="none"
            stroke="url(#helixMainGradient)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            filter="url(#helixStrongGlow)"
          />
        </g>

        {/* Right helix strand - filigree vertical double helix */}
        <g className="motion-safe:animate-helix-bg-breathe-alt motion-reduce:opacity-40">
          <path
            d="M 65% 0 Q 75% 12.5, 65% 25 T 65% 50 T 65% 75 T 65% 100"
            fill="none"
            stroke="url(#helixSecondaryGradient)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            filter="url(#helixStrongGlow)"
          />
        </g>

        {/* Connecting base pairs - scientific appearance with even distribution */}
        <g className="motion-safe:animate-helix-bg-pulse motion-reduce:opacity-25">
          {Array.from({ length: 24 }, (_, i) => {
            const y = (i / 23) * 100;
            const phase = (i / 23) * Math.PI * 4;
            const leftX = 35 + Math.sin(phase) * 10;
            const rightX = 65 - Math.sin(phase) * 10;
            const key = `bg-pair-pos-${(y * 100).toFixed(0)}`;
            return (
              <line
                key={key}
                x1={`${leftX}%`}
                y1={`${y}%`}
                x2={`${rightX}%`}
                y2={`${y}%`}
                stroke="oklch(0.58 0.13 175)"
                strokeWidth="0.8"
                strokeOpacity="0.25"
                vectorEffect="non-scaling-stroke"
                filter="url(#helixGlowFilter)"
              />
            );
          })}
        </g>

        {/* Subtle accent nodes along the helix for scientific detail */}
        <g className="motion-safe:animate-helix-bg-glow motion-reduce:hidden">
          {Array.from({ length: 12 }, (_, i) => {
            const y = (i / 11) * 100;
            const phase = (i / 11) * Math.PI * 4;
            const leftX = 35 + Math.sin(phase) * 10;
            const rightX = 65 - Math.sin(phase) * 10;
            const hue = 150 + (i / 11) * 50; // Green to blue transition
            const key = `bg-node-pos-${(y * 100).toFixed(0)}`;

            return (
              <g key={key}>
                <circle
                  cx={`${leftX}%`}
                  cy={`${y}%`}
                  r="3"
                  fill={`oklch(0.60 0.14 ${hue})`}
                  opacity="0.3"
                  filter="url(#helixGlowFilter)"
                />
                <circle
                  cx={`${rightX}%`}
                  cy={`${y}%`}
                  r="3"
                  fill={`oklch(0.58 0.13 ${hue + 5})`}
                  opacity="0.3"
                  filter="url(#helixGlowFilter)"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
