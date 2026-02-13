import { useState } from 'react';
import HelixSpine from '@/components/genome/HelixSpine';
import FactorMarker from '@/components/dashboard/FactorMarker';
import { Dna } from 'lucide-react';

type FactorType = 'nutrition' | 'sleep' | 'movement' | 'fasting';

interface Factor {
  id: FactorType;
  label: string;
  description: string;
  position: number;
}

const factors: Factor[] = [
  {
    id: 'nutrition',
    label: 'Nutrition',
    description: 'Track your daily nutritional intake and balance',
    position: 0,
  },
  {
    id: 'sleep',
    label: 'Sleep',
    description: 'Monitor sleep quality and duration',
    position: 1,
  },
  {
    id: 'movement',
    label: 'Movement',
    description: 'Record physical activity and exercise',
    position: 2,
  },
  {
    id: 'fasting',
    label: 'Intermittent Fasting',
    description: 'Manage your fasting windows and schedules',
    position: 3,
  },
];

export default function StartDashboard() {
  const [selectedFactor, setSelectedFactor] = useState<FactorType | null>(null);

  const handleFactorClick = (factorId: FactorType) => {
    setSelectedFactor(selectedFactor === factorId ? null : factorId);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/livspan-bio-texture.dim_1440x2560.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* DNA helix background */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/livspan-dna-helix-bg.dim_1440x2560.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-helix-strand/20 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-helix-glow/10 border border-helix-strand/30">
              <Dna className="w-6 h-6 text-helix-accent" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-wide text-foreground">
                LivSpan
              </h1>
              <p className="text-xs text-muted-foreground font-mono tracking-wider">
                LONGEVITY DASHBOARD
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-light tracking-wide text-foreground">
              Your Health Genome
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Monitor the four fundamental factors that influence longevity and well-being.
              Each element connects to form your unique health profile.
            </p>
          </div>

          {/* Helix spine with factor markers */}
          <HelixSpine>
            {factors.map((factor) => (
              <FactorMarker
                key={factor.id}
                id={factor.id}
                label={factor.label}
                description={factor.description}
                position={factor.position}
                isSelected={selectedFactor === factor.id}
                onClick={() => handleFactorClick(factor.id)}
              />
            ))}
          </HelixSpine>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-helix-strand/20 backdrop-blur-sm bg-background/80 mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-muted-foreground font-light">
              Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'livspan-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-helix-accent hover:text-helix-accent/80 transition-colors underline-offset-4 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-xs text-muted-foreground/60 font-mono">
              © {new Date().getFullYear()} LivSpan
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
