import { ReactNode } from 'react';

interface HelixSpineProps {
  children: ReactNode;
}

export default function HelixSpine({ children }: HelixSpineProps) {
  return (
    <div className="relative w-full max-w-3xl mx-auto py-12">
      {/* Central vertical axis - very subtle */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-helix-strand/10 -translate-x-1/2" />

      {/* DNA helix strands */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="helixGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(var(--helix-strand))" stopOpacity="0.15" />
            <stop offset="50%" stopColor="oklch(var(--helix-strand))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="oklch(var(--helix-strand))" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="helixGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(var(--helix-accent))" stopOpacity="0.12" />
            <stop offset="50%" stopColor="oklch(var(--helix-accent))" stopOpacity="0.22" />
            <stop offset="100%" stopColor="oklch(var(--helix-accent))" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* Left helix strand - with gentle breathing motion */}
        <g className="helix-motion-layer motion-safe:animate-helix-breathe motion-reduce:animate-none">
          <path
            d="M 30% 0 Q 20% 25, 30% 50 T 30% 100"
            fill="none"
            stroke="url(#helixGradient1)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Right helix strand - with gentle breathing motion (phase-shifted) */}
        <g className="helix-motion-layer motion-safe:animate-helix-breathe-alt motion-reduce:animate-none">
          <path
            d="M 70% 0 Q 80% 25, 70% 50 T 70% 100"
            fill="none"
            stroke="url(#helixGradient2)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Connecting base pairs - subtle horizontal lines with pulse */}
        <g className="motion-safe:animate-helix-pulse motion-reduce:animate-none">
          {[0, 1, 2, 3].map((i) => {
            const y = (i / 3) * 100;
            const leftX = 30 + Math.sin((i / 3) * Math.PI * 2) * 10;
            const rightX = 70 - Math.sin((i / 3) * Math.PI * 2) * 10;
            
            return (
              <line
                key={i}
                x1={`${leftX}%`}
                y1={`${y}%`}
                x2={`${rightX}%`}
                y2={`${y}%`}
                stroke="oklch(var(--helix-strand))"
                strokeWidth="0.5"
                strokeOpacity="0.15"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>
      </svg>

      {/* Factor markers container */}
      <div className="relative space-y-24" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
