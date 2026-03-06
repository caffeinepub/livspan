import LoginButton from "@/components/auth/LoginButton";
import DiaryPanel from "@/components/dashboard/DiaryPanel";
import FactorMarker from "@/components/dashboard/FactorMarker";
import IntermittentFastingPanel from "@/components/dashboard/IntermittentFastingPanel";
import MovementPanel from "@/components/dashboard/MovementPanel";
import NutritionPanel from "@/components/dashboard/NutritionPanel";
import SleepPanel from "@/components/dashboard/SleepPanel";
import StressPanel from "@/components/dashboard/StressPanel";
import AnimatedHelixBackground from "@/components/genome/AnimatedHelixBackground";
import HelixSpine from "@/components/genome/HelixSpine";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import ProfileOnboardingGate from "@/components/profile/ProfileOnboardingGate";
import { useI18n } from "@/i18n/useI18n";
import { useState } from "react";

type FactorType =
  | "nutrition"
  | "sleep"
  | "movement"
  | "stress"
  | "fasting"
  | "diary";

interface Factor {
  id: FactorType;
  position: number;
}

const factors: Factor[] = [
  { id: "nutrition", position: 0 },
  { id: "sleep", position: 1 },
  { id: "movement", position: 2 },
  { id: "stress", position: 3 },
  { id: "fasting", position: 4 },
  { id: "diary", position: 5 },
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
            backgroundImage:
              "url(/assets/generated/dna-helix-bg.dim_1440x2560.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
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
            backgroundImage:
              "url(/assets/generated/livspan-bio-texture.dim_1440x2560.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Header */}
        <header
          className="relative z-10 border-b border-helix-strand/30 backdrop-blur-md"
          style={{
            background: "rgba(0, 15, 8, 0.55)",
            backdropFilter: "blur(20px)",
            borderBottomColor: "rgba(0, 255, 120, 0.18)",
          }}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Logo - matching login page */}
                <img
                  src="/assets/IMG_8398-1.png"
                  alt="LivSpan Logo"
                  className="w-12 h-12"
                />
                <div>
                  <h1 className="text-2xl font-light tracking-wide gradient-green-glow">
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
          {selectedFactor === "fasting" && (
            <section className="max-w-4xl mx-auto">
              <IntermittentFastingPanel />
            </section>
          )}

          {selectedFactor === "nutrition" && (
            <section className="max-w-4xl mx-auto">
              <NutritionPanel />
            </section>
          )}

          {selectedFactor === "sleep" && (
            <section className="max-w-4xl mx-auto">
              <div className="p-8 glass-card">
                <SleepPanel />
              </div>
            </section>
          )}

          {selectedFactor === "movement" && (
            <section className="max-w-4xl mx-auto">
              <div className="p-8 glass-card">
                <MovementPanel />
              </div>
            </section>
          )}

          {selectedFactor === "stress" && (
            <section className="max-w-4xl mx-auto">
              <div className="p-8 glass-card">
                <StressPanel />
              </div>
            </section>
          )}

          {selectedFactor === "diary" && (
            <section className="max-w-4xl mx-auto">
              <div className="p-8 glass-card">
                <DiaryPanel />
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer
          className="relative z-10 border-t border-helix-strand/30 backdrop-blur-md mt-16"
          style={{
            background: "rgba(0, 15, 8, 0.55)",
            backdropFilter: "blur(20px)",
            borderTopColor: "rgba(0, 255, 120, 0.18)",
          }}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
              <span>
                © {new Date().getFullYear()} LivSpan — {t.footer.copyright}
              </span>
              <span>
                {t.footer.builtWith}{" "}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    typeof window !== "undefined"
                      ? window.location.hostname
                      : "livspan",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-helix-accent hover:text-helix-glow transition-colors"
                >
                  caffeine.ai
                </a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </ProfileOnboardingGate>
  );
}
