import { ReactNode } from 'react';

interface HelixSpineProps {
  children: ReactNode;
}

export default function HelixSpine({ children }: HelixSpineProps) {
  return (
    <div className="relative w-full max-w-3xl mx-auto py-12">
      {/* Central vertical axis - very subtle */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-helix-strand/10 -translate-x-1/2" />

      {/* DNA helix strands - more filigree with thinner strokes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="helixGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(var(--helix-strand))" stopOpacity="0.12" />
            <stop offset="50%" stopColor="oklch(var(--helix-strand))" stopOpacity="0.20" />
            <stop offset="100%" stopColor="oklch(var(--helix-strand))" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="helixGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(var(--helix-accent))" stopOpacity="0.10" />
            <stop offset="50%" stopColor="oklch(var(--helix-accent))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(var(--helix-accent))" stopOpacity="0.10" />
          </linearGradient>
        </defs>

        {/* Left helix strand - thinner, more delicate */}
        <g className="helix-motion-layer motion-safe:animate-helix-breathe motion-reduce:animate-none">
          <path
            d="M 30% 0 Q 20% 25, 30% 50 T 30% 100"
            fill="none"
            stroke="url(#helixGradient1)"
            strokeWidth="0.75"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Right helix strand - thinner, more delicate */}
        <g className="helix-motion-layer motion-safe:animate-helix-breathe-alt motion-reduce:animate-none">
          <path
            d="M 70% 0 Q 80% 25, 70% 50 T 70% 100"
            fill="none"
            stroke="url(#helixGradient2)"
            strokeWidth="0.75"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Connecting base pairs - more frequent, evenly spaced for scientific look */}
        <g className="motion-safe:animate-helix-pulse motion-reduce:animate-none">
          {Array.from({ length: 16 }).map((_, i) => {
            const y = (i / 15) * 100;
            const phase = (i / 15) * Math.PI * 2;
            const leftX = 30 + Math.sin(phase) * 10;
            const rightX = 70 - Math.sin(phase) * 10;
            
            return (
              <line
                key={i}
                x1={`${leftX}%`}
                y1={`${y}%`}
                x2={`${rightX}%`}
                y2={`${y}%`}
                stroke="oklch(var(--helix-strand))"
                strokeWidth="0.4"
                strokeOpacity="0.12"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>
      </svg>

      {/* Factor markers container - adjusted spacing for 5 markers */}
      <div className="relative space-y-20" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
