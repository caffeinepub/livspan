import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/useI18n';
import { Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 text-muted-foreground hover:text-helix-accent transition-colors"
      aria-label="Switch language"
    >
      <Languages className="w-4 h-4" />
      <span className="text-xs font-mono tracking-wider">
        <span className={cn(language === 'en' && 'text-helix-accent font-medium')}>EN</span>
        {' / '}
        <span className={cn(language === 'de' && 'text-helix-accent font-medium')}>DE</span>
      </span>
    </Button>
  );
}
