import PaymentGate from "@/components/auth/PaymentGate";
import { Toaster } from "@/components/ui/sonner";
import { useIsUserActivated } from "@/hooks/useActivationQueries";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "@/hooks/useUserProfileQueries";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import StartDashboard from "@/pages/StartDashboard";
import type { Principal } from "@dfinity/principal";
import { ThemeProvider } from "next-themes";

function LoadingScreen() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* DNA helix background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url(/assets/generated/dna-helix-bg.dim_1440x2560.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 z-0 bg-black/75" />

      {/* Scan overlay */}
      <div className="scan-overlay" />

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo with neon glow ring */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full animate-neon-glow-pulse"
            style={{
              boxShadow:
                "0 0 20px rgba(0, 255, 180, 0.4), 0 0 50px rgba(0, 245, 255, 0.2)",
              borderRadius: "50%",
            }}
          />
          <img
            src="/assets/uploads/IMG_8864-1.png"
            alt="LivSpan Token"
            className="w-24 h-24 relative z-10"
            style={{
              filter: "drop-shadow(0 0 16px rgba(0, 255, 180, 0.5))",
            }}
          />
        </div>

        {/* HUD-style title */}
        <div className="text-center space-y-1">
          <p
            className="text-xs font-medium tracking-[0.3em] uppercase"
            style={{ color: "rgba(0, 245, 255, 0.5)" }}
          >
            SYSTEM INITIALIZING
          </p>
        </div>

        {/* HUD loading bar */}
        <div
          className="w-48 rounded-full overflow-hidden"
          style={{
            background: "rgba(0, 245, 255, 0.08)",
            border: "1px solid rgba(0, 245, 255, 0.15)",
            height: "3px",
          }}
        >
          <div className="hud-loading-bar h-full" />
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Derive principal for activation check
  const principal: Principal | null = identity ? identity.getPrincipal() : null;

  // Profile query — only runs when authenticated
  const { isFetched: profileFetched } = useGetCallerUserProfile();

  // Activation query — only runs when authenticated
  const { data: isActivated, isFetched: activationFetched } =
    useIsUserActivated(principal);

  // Show loading screen during initialization or while fetching auth-dependent data
  const isLoading =
    isInitializing ||
    actorFetching ||
    (isAuthenticated && (!profileFetched || !activationFetched));

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Unauthenticated users go to StartDashboard which renders ProfileOnboardingGate (login prompt)
  if (!isAuthenticated) {
    return <StartDashboard />;
  }

  // Authenticated but not yet activated → show payment gate
  if (!isActivated) {
    return <PaymentGate />;
  }

  // Authenticated and activated → show full dashboard
  return <StartDashboard />;
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      <LanguageProvider>
        <AppContent />
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}
