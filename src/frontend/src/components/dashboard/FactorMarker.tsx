import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FactorMarkerProps {
  id: string;
  label: string;
  description: string;
  position: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function FactorMarker({
  label,
  description,
  isSelected,
  onClick,
}: FactorMarkerProps) {
  return (
    <div className="relative">
      {/* Connection line to helix */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-y-1/2 w-8 h-px transition-all duration-300",
        )}
        style={{
          background: isSelected
            ? "linear-gradient(to right, rgba(0, 245, 255, 0.6), rgba(0, 255, 136, 0.4))"
            : "rgba(0, 245, 255, 0.15)",
          boxShadow: isSelected ? "0 0 4px rgba(0, 245, 255, 0.5)" : undefined,
        }}
      />

      {/* Factor card with HUD glassmorphism */}
      <Card
        onClick={onClick}
        className={cn(
          "ml-12 cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden border-0",
        )}
        style={{
          background: isSelected
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(18px) saturate(200%)",
          WebkitBackdropFilter: "blur(18px) saturate(200%)",
          border: isSelected
            ? "1px solid rgba(0, 245, 255, 0.4)"
            : "1px solid rgba(255, 255, 255, 0.1)",
          borderTop: isSelected
            ? "2px solid rgba(0, 255, 180, 0.55)"
            : "1px solid rgba(255, 255, 255, 0.18)",
          borderRadius: "10px",
          boxShadow: isSelected
            ? "0 4px 24px rgba(0, 245, 255, 0.2), 0 0 40px rgba(0, 255, 136, 0.1), 0 1px 0 rgba(255,255,255,0.04) inset"
            : "0 4px 16px rgba(0, 245, 255, 0.05), 0 1px 0 rgba(255,255,255,0.02) inset",
        }}
      >
        <CardContent className="p-4">
          <h3
            className="text-base font-semibold tracking-wide mb-1 transition-colors"
            style={{
              fontFamily: "Sora, sans-serif",
              background: isSelected
                ? "linear-gradient(135deg, #00f5ff, #00ff88)"
                : undefined,
              WebkitBackgroundClip: isSelected ? "text" : undefined,
              backgroundClip: isSelected ? "text" : undefined,
              WebkitTextFillColor: isSelected ? "transparent" : undefined,
              color: isSelected ? undefined : "rgba(0, 245, 255, 0.7)",
              filter: isSelected
                ? "drop-shadow(0 0 6px rgba(0, 245, 255, 0.4))"
                : undefined,
            }}
          >
            {label}
          </h3>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "rgba(0, 245, 255, 0.4)" }}
          >
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
