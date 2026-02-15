import { useState } from 'react';
import HelixSpine from '@/components/genome/HelixSpine';
import FactorMarker from '@/components/dashboard/FactorMarker';
import AnimatedHelixBackground from '@/components/genome/AnimatedHelixBackground';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import IntermittentFastingPanel from '@/components/dashboard/IntermittentFastingPanel';
import { useI18n } from '@/i18n/useI18n';
import { Dna } from 'lucide-react';

type FactorType = 'nutrition' | 'sleep' | 'movement' | 'stress' | 'fasting';

interface Factor {
  id: FactorType;
  position: number;
}

const factors: Factor[] = [
  { id: 'nutrition', position: 0 },
  { id: 'sleep', position: 1 },
  { id: 'movement', position: 2 },
  { id: 'stress', position: 3 },
  { id: 'fasting', position: 4 },
];

export default function StartDashboard() {
  const [selectedFactor, setSelectedFactor] = useState<FactorType | null>(null);
  const { t } = useI18n();

  const handleFactorClick = (factorId: FactorType) => {
    setSelectedFactor(selectedFactor === factorId ? null : factorId);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Static generated DNA helix background image */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 blur-sm"
        style={{
          backgroundImage: 'url(/assets/generated/dna-helix-dashboard-bokeh.dim_1440x2560.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen',
        }}
      />

      {/* Animated SVG helix background */}
      <AnimatedHelixBackground />

      {/* Background texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/livspan-bio-texture.dim_1440x2560.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-helix-strand/20 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-helix-glow/10 border border-helix-strand/30">
                <Dna className="w-6 h-6 text-helix-accent" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-2xl font-light tracking-wide text-foreground">
                  {t.header.title}
                </h1>
                <p className="text-xs text-muted-foreground font-mono tracking-wider">
                  {t.header.subtitle}
                </p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-light tracking-wide text-foreground">
              {t.intro.heading}
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              {t.intro.description}
            </p>
          </div>

          {/* Helix spine with factor markers */}
          <HelixSpine>
            {factors.map((factor) => (
              <FactorMarker
                key={factor.id}
                id={factor.id}
                label={t.factors[factor.id].label}
                description={t.factors[factor.id].description}
                position={factor.position}
                isSelected={selectedFactor === factor.id}
                onClick={() => handleFactorClick(factor.id)}
              />
            ))}
          </HelixSpine>

          {/* Intermittent Fasting Panel - conditionally rendered */}
          {selectedFactor === 'fasting' && (
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <IntermittentFastingPanel />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-helix-strand/20 backdrop-blur-sm bg-background/80 mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-muted-foreground font-light">
              {t.footer.builtWith}{' '}
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
              © {new Date().getFullYear()} {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
