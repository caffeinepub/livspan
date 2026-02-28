import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import StartDashboard from '@/pages/StartDashboard';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useUserProfileQueries';
import { useIsUserActivated } from '@/hooks/useActivationQueries';
import PaymentGate from '@/components/auth/PaymentGate';
import { Loader2 } from 'lucide-react';
import { Principal } from '@dfinity/principal';

function LoadingScreen() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* DNA helix background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/generated/dna-helix-bg.dim_1440x2560.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 z-0 bg-black/70 backdrop-blur-sm" />

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <img 
          src="/assets/IMG_8398-1.png" 
          alt="LivSpan Token" 
          className="w-32 h-32 animate-pulse"
        />
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-helix-accent" />
          <p className="text-lg font-light text-helix-glow">Loading...</p>
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
  const { isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  // Activation query — only runs when authenticated
  const {
    data: isActivated,
    isLoading: activationLoading,
    isFetched: activationFetched,
  } = useIsUserActivated(principal);

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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <LanguageProvider>
        <AppContent />
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}
