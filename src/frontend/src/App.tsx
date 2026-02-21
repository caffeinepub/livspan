import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import StartDashboard from '@/pages/StartDashboard';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useUserProfileQueries';
import { Loader2 } from 'lucide-react';

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
  const { isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  // Show loading screen during initialization
  const isLoading = isInitializing || actorFetching || (!!identity && !isFetched);

  if (isLoading) {
    return <LoadingScreen />;
  }

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
