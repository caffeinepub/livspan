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
        <div
          className="p-2 rounded-md"
          style={{
            background: "rgba(0, 232, 122, 0.15)",
            border: "1px solid rgba(0, 255, 120, 0.3)",
          }}
        >
          <Clock
            className="w-5 h-5"
            style={{ color: "#00e87a" }}
            strokeWidth={1.5}
          />
        </div>
        <div>
          <h3
            className="text-xl font-light tracking-wide"
            style={{
              background: "linear-gradient(135deg, #a8ffce, #4fffb0)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t.fastingPanel.title}
          </h3>
          <p
            className="text-xs font-mono"
            style={{ color: "rgba(100, 220, 160, 0.6)" }}
          >
            {protocolLabel}
          </p>
        </div>
      </div>

      {/* Fasting Schedule Settings (authenticated users only) */}
      {isAuthenticated && <FastingScheduleSettings />}

      {/* Status & Timer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current Status */}
        <Card className="glass-card relative overflow-hidden border-0">
          <CardHeader className="pb-3">
            <CardTitle
              className="text-sm font-light tracking-wide flex items-center gap-2"
              style={{ color: "#00e87a" }}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  phase === "fasting" ? "bg-helix-accent" : "bg-chart-2",
                )}
              />
              {t.fastingPanel.status.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
            <div
              className="text-xs"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              {phase === "fasting"
                ? t.fastingPanel.status.fastingDesc
                : t.fastingPanel.status.eatingDesc}
            </div>
          </CardContent>
        </Card>

        {/* Live Timer */}
        <Card className="glass-card relative overflow-hidden border-0">
          <CardHeader className="pb-3">
            <CardTitle
              className="text-sm font-light tracking-wide"
              style={{ color: "#00e87a" }}
            >
              {t.fastingPanel.timer.remaining}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-light tabular-nums gradient-green-blue">
              {formatDuration(remaining)}
            </div>
            <div
              className="text-xs"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              {t.fastingPanel.timer.remainingDesc}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="glass-card relative overflow-hidden border-0">
        <CardHeader className="pb-3">
          <CardTitle
            className="text-sm font-light tracking-wide"
            style={{ color: "#00e87a" }}
          >
            {t.fastingPanel.progress.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={progress} className="h-3 progress-helix" />
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: "rgba(100, 220, 160, 0.6)" }}>
              {t.fastingPanel.timer.elapsed}
            </span>
            <span
              className="font-mono tabular-nums"
              style={{ color: "#00ffaa" }}
            >
              {formatDuration(elapsed)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Insights Section */}
      <Card className="glass-card relative overflow-hidden border-0">
        <CardHeader className="pb-3">
          <CardTitle
            className="text-sm font-light tracking-wide flex items-center gap-2"
            style={{ color: "#00e87a" }}
          >
            <Lightbulb className="w-4 h-4" strokeWidth={1.5} />
            {t.fastingPanel.insights.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "rgba(100, 220, 160, 0.6)" }}
          >
            {phase === "fasting"
              ? t.fastingPanel.insights.fastingTip
              : t.fastingPanel.insights.eatingTip}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
