import StartDashboard from './pages/StartDashboard';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <StartDashboard />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
