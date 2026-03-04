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

      {/* Factor card with green-blue gradient background */}
      <Card
        onClick={onClick}
        className={cn(
          "ml-12 cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden",
          "backdrop-blur-md shadow-lg border",
          isSelected
            ? "shadow-helix-accent/40 shadow-xl scale-105 border-helix-accent/70"
            : "hover:shadow-helix-glow/25 border-helix-strand/30",
        )}
      >
        {/* Gradient background layer */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            isSelected
              ? "gradient-card-gb-selected opacity-100"
              : "gradient-card-gb-muted opacity-60 hover:opacity-80",
          )}
        />

        {/* Radial gradient overlay for depth */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            isSelected
              ? "gradient-card-radial-gb opacity-70"
              : "gradient-card-radial-gb-muted opacity-40 hover:opacity-60",
          )}
        />

        <CardContent className="p-4 relative z-10">
          <h3
            className={cn(
              "text-base font-light tracking-wide mb-1 transition-colors",
              isSelected
                ? "bg-gradient-to-r from-helix-accent to-helix-glow bg-clip-text text-transparent drop-shadow-sm"
                : "text-foreground",
            )}
          >
            {label}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
