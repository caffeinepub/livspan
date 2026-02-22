import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
          'absolute left-1/2 top-1/2 -translate-y-1/2 w-8 h-px transition-all duration-300',
          isSelected ? 'bg-helix-strand/50' : 'bg-helix-strand/20'
        )}
      />

      {/* Factor card */}
      <Card
        onClick={onClick}
        className={cn(
          'ml-12 cursor-pointer transition-all duration-300 hover:scale-105',
          'backdrop-blur-md shadow-lg',
          isSelected
            ? 'bg-card/95 shadow-helix-accent/40 shadow-xl scale-105 border-helix-accent/70'
            : 'bg-card/85 hover:bg-card/95 hover:shadow-helix-glow/25 border-helix-strand/30'
        )}
      >
        <CardContent className="p-4">
          <h3
            className={cn(
              'text-base font-light tracking-wide mb-1 transition-colors',
              isSelected
                ? 'bg-gradient-to-r from-helix-accent to-helix-glow bg-clip-text text-transparent'
                : 'text-foreground'
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
