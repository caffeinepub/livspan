import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "de" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 hover:text-helix-accent transition-colors"
      style={{ color: "rgba(100, 220, 160, 0.65)" }}
      aria-label="Switch language"
    >
      <Languages className="w-4 h-4" />
      <span className="text-xs font-mono tracking-wider">
        <span
          className={cn(language === "en" && "text-helix-accent font-medium")}
        >
          EN
        </span>
        {" / "}
        <span
          className={cn(language === "de" && "text-helix-accent font-medium")}
        >
          DE
        </span>
      </span>
    </Button>
  );
}
