import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import StartDashboard from '@/pages/StartDashboard';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <LanguageProvider>
        <StartDashboard />
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}
