import { useState } from 'react';
import HelixSpine from '@/components/genome/HelixSpine';
import FactorMarker from '@/components/dashboard/FactorMarker';
import AnimatedHelixBackground from '@/components/genome/AnimatedHelixBackground';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import LoginButton from '@/components/auth/LoginButton';
import ProfileOnboardingGate from '@/components/profile/ProfileOnboardingGate';
import IntermittentFastingPanel from '@/components/dashboard/IntermittentFastingPanel';
import NutritionPanel from '@/components/dashboard/NutritionPanel';
import { useI18n } from '@/i18n/useI18n';

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
    <ProfileOnboardingGate>
      <div className="min-h-screen relative overflow-hidden">
        {/* DNA helix background image - lowest layer */}
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(/assets/generated/dna-helix-bg.dim_1440x2560.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Dark gradient overlay for depth and contrast */}
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        {/* Animated SVG helix background - reduced opacity to not compete with photo */}
        <div className="fixed inset-0 z-0 opacity-20">
          <AnimatedHelixBackground />
        </div>

        {/* Subtle static background texture - very low opacity */}
        <div
          className="fixed inset-0 z-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: 'url(/assets/generated/livspan-bio-texture.dim_1440x2560.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Header */}
        <header className="relative z-10 border-b border-helix-strand/30 backdrop-blur-md bg-background/70">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Logo */}
                <img 
                  src="/assets/generated/livspan-logo.dim_400x400.png" 
                  alt="LivSpan Logo" 
                  className="w-12 h-12"
                />
                <div>
                  <h1 className="text-2xl font-light tracking-wide bg-gradient-to-r from-helix-accent to-helix-glow bg-clip-text text-transparent">
                    {t.header.title}
                  </h1>
                  <p className="text-xs text-muted-foreground font-light">
                    {t.header.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <LoginButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 container mx-auto px-4 py-8">
          {/* Factor selection with helix spine */}
          <section className="mb-12">
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
          </section>

          {/* Factor-specific panels */}
          {selectedFactor === 'fasting' && (
            <section className="max-w-4xl mx-auto">
              <IntermittentFastingPanel />
            </section>
          )}

          {selectedFactor === 'nutrition' && (
            <section className="max-w-4xl mx-auto">
              <NutritionPanel />
            </section>
          )}

          {selectedFactor === 'sleep' && (
            <section className="max-w-4xl mx-auto">
              <div className="p-8 rounded-lg border border-helix-strand/40 bg-card/90 backdrop-blur-md shadow-xl">
                <h2 className="text-xl font-light mb-2 bg-gradient-to-r from-helix-accent to-helix-glow bg-clip-text text-transparent">{t.factors.sleep.label}</h2>
                <p className="text-sm text-muted-foreground">
                  {t.factors.sleep.description}
                </p>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Coming soon...
                </p>
              </div>
            </section>
          )}

          {selectedFactor === 'movement' && (
            <section className="max-w-4xl mx-auto">
              <div className="p-8 rounded-lg border border-helix-strand/40 bg-card/90 backdrop-blur-md shadow-xl">
                <h2 className="text-xl font-light mb-2 bg-gradient-to-r from-helix-accent to-helix-glow bg-clip-text text-transparent">{t.factors.movement.label}</h2>
                <p className="text-sm text-muted-foreground">
                  {t.factors.movement.description}
                </p>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Coming soon...
                </p>
              </div>
            </section>
          )}

          {selectedFactor === 'stress' && (
            <section className="max-w-4xl mx-auto">
              <div className="p-8 rounded-lg border border-helix-strand/40 bg-card/90 backdrop-blur-md shadow-xl">
                <h2 className="text-xl font-light mb-2 bg-gradient-to-r from-helix-accent to-helix-glow bg-clip-text text-transparent">{t.factors.stress.label}</h2>
                <p className="text-sm text-muted-foreground">
                  {t.factors.stress.description}
                </p>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Coming soon...
                </p>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-helix-strand/30 backdrop-blur-md bg-background/70 mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} LivSpan. {t.footer.copyright}</p>
              <p>
                {t.footer.builtWith}{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.hostname : 'livspan-app'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-helix-accent transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ProfileOnboardingGate>
  );
}
