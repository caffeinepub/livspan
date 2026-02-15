import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple, Moon, Activity, Clock, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FactorMarkerProps {
  id: 'nutrition' | 'sleep' | 'movement' | 'stress' | 'fasting';
  label: string;
  description: string;
  position: number;
  isSelected: boolean;
  onClick: () => void;
}

const iconMap = {
  nutrition: Apple,
  sleep: Moon,
  movement: Activity,
  stress: Brain,
  fasting: Clock,
};

export default function FactorMarker({
  id,
  label,
  description,
  position,
  isSelected,
  onClick,
}: FactorMarkerProps) {
  const Icon = iconMap[id];
  const isLeft = position % 2 === 0;

  return (
    <div
      className={cn(
        'relative flex items-center gap-6',
        isLeft ? 'justify-start' : 'justify-end flex-row-reverse'
      )}
    >
      {/* Connection line to helix */}
      <div className="relative flex items-center">
        <div
          className={cn(
            'h-px bg-helix-strand/20 transition-all duration-300',
            isSelected ? 'w-16 bg-helix-accent/40' : 'w-12',
            isLeft ? 'origin-right' : 'origin-left'
          )}
        />
        
        {/* Node dot */}
        <div
          className={cn(
            'w-2 h-2 rounded-full border transition-all duration-300',
            isSelected
              ? 'bg-helix-accent border-helix-accent shadow-helix-glow'
              : 'bg-helix-strand/30 border-helix-strand/40',
            isLeft ? '-ml-1' : '-mr-1'
          )}
        />
      </div>

      {/* Factor card */}
      <Card
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={cn(
          'w-72 cursor-pointer transition-all duration-300 border-helix-strand/30',
          'hover:border-helix-accent/50 hover:shadow-lg hover:shadow-helix-glow/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-helix-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          isSelected && 'border-helix-accent/60 shadow-xl shadow-helix-glow/20 bg-card/80 backdrop-blur-sm'
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'p-2 rounded-md border transition-all duration-300',
                isSelected
                  ? 'bg-helix-accent/10 border-helix-accent/40'
                  : 'bg-helix-strand/5 border-helix-strand/20'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-colors duration-300',
                  isSelected ? 'text-helix-accent' : 'text-muted-foreground'
                )}
                strokeWidth={1.5}
              />
            </div>
            <CardTitle className="text-lg font-light tracking-wide">{label}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-xs font-light leading-relaxed">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
