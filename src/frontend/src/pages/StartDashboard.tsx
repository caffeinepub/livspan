import LoginButton from "@/components/auth/LoginButton";
import DiaryPanel from "@/components/dashboard/DiaryPanel";
import FactorMarker from "@/components/dashboard/FactorMarker";
import IntermittentFastingPanel from "@/components/dashboard/IntermittentFastingPanel";
import MovementPanel from "@/components/dashboard/MovementPanel";
import NutritionPanel from "@/components/dashboard/NutritionPanel";
import RoutinesPanel from "@/components/dashboard/RoutinesPanel";
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
  | "diary"
  | "routines";

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
  { id: "routines", position: 6 },
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
          className="relative z-10 backdrop-blur-xl"
          style={{
            background: "rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(28px) saturate(200%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          {/* Neon accent top line */}
          <div className="hud-accent-line" />

          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Logo */}
                <img
                  src="/assets/uploads/IMG_8864-1.png"
                  alt="LivSpan Logo"
                  className="w-12 h-12"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(0, 255, 180, 0.35))",
                  }}
                />
                <div>
                  <h1
                    className="text-2xl font-semibold tracking-wide neon-text animate-hud-flicker"
                    style={{ fontFamily: "Sora, sans-serif" }}
                  >
                    {t.header.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="status-dot-active" />
                    <p
                      className="text-xs font-light tracking-widest uppercase"
                      style={{
                        color: "rgba(0, 245, 255, 0.5)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {t.header.subtitle}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <LoginButton />
              </div>
            </div>
          </div>
        </header>

        {/* Subtle scan-line overlay on content area — pointer-events-none */}
        <div
          className="scan-overlay pointer-events-none"
          style={{ zIndex: 2, opacity: 0.3 }}
        />

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

          {selectedFactor === "routines" && (
            <section className="max-w-4xl mx-auto">
              <div className="p-8 glass-card">
                <RoutinesPanel />
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer
          className="relative z-10 backdrop-blur-xl mt-16"
          style={{
            background: "rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(28px) saturate(200%)",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div className="container mx-auto px-4 py-6">
            <div
              className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
              style={{ color: "rgba(100, 220, 160, 0.55)" }}
            >
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
