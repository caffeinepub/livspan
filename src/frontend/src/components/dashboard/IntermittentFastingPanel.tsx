import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetCallerFastingSchedule } from "@/hooks/useFastingScheduleQueries";
import { useFastingWindowTimer } from "@/hooks/useFastingWindowTimer";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useI18n } from "@/i18n/useI18n";
import { formatDuration } from "@/lib/timeFormat";
import { cn } from "@/lib/utils";
import { Clock, Lightbulb } from "lucide-react";
import FastingScheduleSettings from "./FastingScheduleSettings";

export default function IntermittentFastingPanel() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Load user's fasting schedule
  const { data: savedSchedule } = useGetCallerFastingSchedule();

  // Use saved schedule or default
  const { phase, elapsed, remaining, progress } =
    useFastingWindowTimer(savedSchedule);

  const statusColor =
    phase === "fasting" ? "text-helix-accent" : "text-chart-2";
  const statusBg = phase === "fasting" ? "bg-helix-accent/10" : "bg-chart-2/10";
  const statusBorder =
    phase === "fasting" ? "border-helix-accent/30" : "border-chart-2/30";

  // Calculate protocol label
  const startHour = savedSchedule?.startHour ?? 20;
  const endHour = savedSchedule?.endHour ?? 12;
  const fastingHours =
    endHour > startHour ? endHour - startHour : 24 - startHour + endHour;
  const eatingHours = 24 - fastingHours;
  const protocolLabel = `${fastingHours}:${eatingHours} ${t.fastingPanel.subtitle.split(" ")[1] || "PROTOCOL"}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-helix-glow/10 border border-helix-strand/30">
          <Clock className="w-5 h-5 text-helix-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-light tracking-wide gradient-green-glow">
            {t.fastingPanel.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            {protocolLabel}
          </p>
        </div>
      </div>

      {/* Fasting Schedule Settings (authenticated users only) */}
      {isAuthenticated && <FastingScheduleSettings />}

      {/* Status & Timer Section with green-blue gradients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current Status */}
        <Card className="border-helix-strand/30 relative overflow-hidden">
          <div className="absolute inset-0 gradient-panel-amber opacity-60" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  phase === "fasting" ? "bg-helix-accent" : "bg-chart-2",
                )}
              />
              {t.fastingPanel.status.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 relative z-10">
            <div
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-mono",
                statusBg,
                statusBorder,
                statusColor,
              )}
            >
              {phase === "fasting"
                ? t.fastingPanel.status.fasting
                : t.fastingPanel.status.eating}
            </div>
            <div className="text-xs text-muted-foreground">
              {phase === "fasting"
                ? t.fastingPanel.status.fastingDesc
                : t.fastingPanel.status.eatingDesc}
            </div>
          </CardContent>
        </Card>

        {/* Live Timer */}
        <Card className="border-helix-strand/30 relative overflow-hidden">
          <div className="absolute inset-0 gradient-panel-sage opacity-70" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-light tracking-wide text-helix-accent">
              {t.fastingPanel.timer.remaining}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 relative z-10">
            <div className="text-3xl font-light tabular-nums gradient-green-blue">
              {formatDuration(remaining)}
            </div>
            <div className="text-xs text-muted-foreground">
              {t.fastingPanel.timer.remainingDesc}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar with green-blue gradient */}
      <Card className="border-helix-strand/30 relative overflow-hidden">
        <div className="absolute inset-0 gradient-card-amber-subtle opacity-50" />
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-sm font-light tracking-wide text-helix-accent">
            {t.fastingPanel.progress.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 relative z-10">
          <Progress value={progress} className="h-3 progress-helix" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t.fastingPanel.timer.elapsed}
            </span>
            <span className="font-mono tabular-nums text-foreground">
              {formatDuration(elapsed)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Insights Section with green-blue gradient */}
      <Card className="border-helix-strand/30 relative overflow-hidden">
        <div className="absolute inset-0 gradient-panel-sage opacity-40" />
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
            <Lightbulb className="w-4 h-4" strokeWidth={1.5} />
            {t.fastingPanel.insights.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {phase === "fasting"
              ? t.fastingPanel.insights.fastingTip
              : t.fastingPanel.insights.eatingTip}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
