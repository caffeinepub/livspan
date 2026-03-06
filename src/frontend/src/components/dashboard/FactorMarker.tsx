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
          isSelected ? "bg-helix-strand/50" : "bg-helix-strand/20",
        )}
      />

      {/* Factor card with glassmorphism */}
      <Card
        onClick={onClick}
        className={cn(
          "ml-12 cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden border-0",
        )}
        style={{
          background: isSelected
            ? "rgba(0, 30, 15, 0.5)"
            : "rgba(0, 20, 10, 0.35)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: isSelected
            ? "1px solid rgba(0, 255, 120, 0.4)"
            : "1px solid rgba(0, 255, 120, 0.15)",
          borderRadius: "16px",
          boxShadow: isSelected
            ? "0 4px 32px rgba(0, 255, 100, 0.18), 0 1px 0 rgba(255,255,255,0.04) inset"
            : "0 4px 32px rgba(0, 255, 100, 0.08), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        <CardContent className="p-4">
          <h3
            className={cn(
              "text-base font-light tracking-wide mb-1 transition-colors",
            )}
            style={{
              background: isSelected
                ? "linear-gradient(135deg, #a8ffce, #4fffb0)"
                : undefined,
              WebkitBackgroundClip: isSelected ? "text" : undefined,
              backgroundClip: isSelected ? "text" : undefined,
              WebkitTextFillColor: isSelected ? "transparent" : undefined,
              color: isSelected ? undefined : "#7effc0",
            }}
          >
            {label}
          </h3>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "rgba(100, 220, 160, 0.6)" }}
          >
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
