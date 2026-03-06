import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useGetTodaySleep, useSaveSleepEntry } from "@/hooks/useSleepQueries";
import { useI18n } from "@/i18n/useI18n";
import { Loader2, Moon, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Gradient Slider ─────────────────────────────────────────────────────────
interface GradientSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  id?: string;
}

function GradientSlider({
  value,
  min,
  max,
  step,
  onChange,
  id,
}: GradientSliderProps) {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="relative w-full h-6 flex items-center">
      {/* Gradient track background */}
      <div className="absolute inset-y-0 flex items-center w-full pointer-events-none">
        <div className="relative w-full h-2 rounded-full overflow-hidden">
          {/* Full gradient */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(to right, oklch(0.72 0.17 160), oklch(0.65 0.15 185), oklch(0.58 0.18 210))",
            }}
          />
          {/* Unfilled overlay from thumb to end */}
          <div
            className="absolute inset-y-0 right-0 rounded-r-full"
            style={{
              left: `${percent}%`,
              background: "oklch(0.25 0.04 200 / 0.55)",
            }}
          />
        </div>
      </div>
      {/* Native range input — transparent, sits on top for interaction */}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="relative w-full h-2 appearance-none bg-transparent cursor-pointer slider-helix"
        style={{ zIndex: 1 }}
      />
    </div>
  );
}

// ─── Gradient Progress Bar ────────────────────────────────────────────────────
function GradientProgressBar({ percent }: { percent: number }) {
  return (
    <div
      className="w-full h-1.5 rounded-full overflow-hidden"
      style={{ background: "oklch(0.25 0.04 200 / 0.4)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${Math.min(100, percent)}%`,
          background:
            "linear-gradient(to right, oklch(0.72 0.17 160), oklch(0.65 0.15 185), oklch(0.58 0.18 210))",
        }}
      />
    </div>
  );
}

// ─── Quality Label Helper ─────────────────────────────────────────────────────
function getQualityLabel(
  score: number,
  t: ReturnType<typeof useI18n>["t"],
): string {
  if (score <= 2) return t.sleepPanel.quality.poor;
  if (score <= 4) return t.sleepPanel.quality.fair;
  if (score <= 6) return t.sleepPanel.quality.good;
  if (score <= 8) return t.sleepPanel.quality.veryGood;
  return t.sleepPanel.quality.excellent;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SleepPanel() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const SLEEP_GOAL_HOURS = 8;

  // Local form state
  const [durationHours, setDurationHours] = useState(7);
  const [qualityScore, setQualityScore] = useState(7);

  // React Query hooks
  const { data: sleepData } = useGetTodaySleep();
  const saveMutation = useSaveSleepEntry();

  // Initialize form with fetched data
  useEffect(() => {
    if (sleepData) {
      setDurationHours(sleepData.durationHours);
      setQualityScore(Number(sleepData.qualityScore));
    }
  }, [sleepData]);

  const durationProgress = (durationHours / SLEEP_GOAL_HOURS) * 100;

  const handleSave = async () => {
    if (!isAuthenticated) return;

    try {
      await saveMutation.mutateAsync({
        durationHours: durationHours,
        qualityScore: BigInt(qualityScore),
      });
      toast.success(t.sleepPanel.actions.saveSuccess);
    } catch {
      toast.error(t.sleepPanel.actions.saveError);
    }
  };

  const isSaving = saveMutation.isPending;

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
          <Moon
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
            {t.sleepPanel.title}
          </h3>
          <p
            className="text-xs font-mono"
            style={{ color: "rgba(100, 220, 160, 0.6)" }}
          >
            {t.sleepPanel.subtitle}
          </p>
        </div>
      </div>

      {/* Auth Required Message */}
      {!isAuthenticated && (
        <Alert className="border-helix-strand/30 bg-helix-glow/5">
          <AlertDescription
            className="text-sm"
            style={{ color: "rgba(100, 220, 160, 0.65)" }}
          >
            {t.sleepPanel.authRequired}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary display */}
      {isAuthenticated && (
        <div
          className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg flex-wrap"
          style={{
            background: "rgba(0, 30, 15, 0.4)",
            border: "1px solid rgba(0, 255, 120, 0.2)",
          }}
        >
          <Moon
            className="w-4 h-4"
            style={{ color: "#00e87a" }}
            strokeWidth={1.5}
          />
          <span
            className="text-sm font-mono tabular-nums"
            style={{ color: "#7effc0" }}
          >
            {durationHours.toFixed(1)} {t.sleepPanel.duration.unit}
          </span>
          <span style={{ color: "rgba(100, 220, 160, 0.5)" }}>·</span>
          <Star className="w-4 h-4 text-helix-glow" strokeWidth={1.5} />
          <span
            className="text-sm font-mono tabular-nums"
            style={{ color: "#7effc0" }}
          >
            {t.sleepPanel.quality.label} {qualityScore}/10
          </span>
          <span
            className="text-xs"
            style={{ color: "rgba(100, 220, 160, 0.6)" }}
          >
            — {getQualityLabel(qualityScore, t)}
          </span>
        </div>
      )}

      {/* Sleep Duration Card */}
      {isAuthenticated && (
        <Card className="glass-card relative overflow-hidden border-0">
          <CardHeader className="pb-3">
            <CardTitle
              className="text-sm font-light tracking-wide flex items-center gap-2"
              style={{ color: "#00e87a" }}
            >
              <Moon className="w-4 h-4" strokeWidth={1.5} />
              {t.sleepPanel.duration.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex items-center justify-between text-xs mb-1"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              <span>{t.sleepPanel.duration.recommended}</span>
              <span
                className="font-mono tabular-nums"
                style={{ color: "#00ffaa" }}
              >
                {durationHours.toFixed(1)} {t.sleepPanel.duration.unit}
              </span>
            </div>
            <GradientSlider
              id="sleep-duration-slider"
              value={durationHours}
              min={0}
              max={12}
              step={0.5}
              onChange={setDurationHours}
            />
            <div className="space-y-1">
              <GradientProgressBar percent={durationProgress} />
              <div
                className="text-xs text-right"
                style={{ color: "rgba(100, 220, 160, 0.6)" }}
              >
                {Math.round(Math.min(100, durationProgress))}% —{" "}
                {t.sleepPanel.duration.progress}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sleep Quality Card */}
      {isAuthenticated && (
        <Card className="glass-card relative overflow-hidden border-0">
          <CardHeader className="pb-3">
            <CardTitle
              className="text-sm font-light tracking-wide flex items-center gap-2"
              style={{ color: "#00e87a" }}
            >
              <Star className="w-4 h-4" strokeWidth={1.5} />
              {t.sleepPanel.quality.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex items-center justify-between text-xs mb-1"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              <span>{t.sleepPanel.quality.scale}: 1–10</span>
              <span
                className="font-mono tabular-nums"
                style={{ color: "#00ffaa" }}
              >
                {qualityScore}/10 — {getQualityLabel(qualityScore, t)}
              </span>
            </div>
            <GradientSlider
              id="sleep-quality-slider"
              value={qualityScore}
              min={1}
              max={10}
              step={1}
              onChange={setQualityScore}
            />
            {/* Quality scale labels */}
            <div
              className="flex justify-between text-xs"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              <span>{t.sleepPanel.quality.poor}</span>
              <span>{t.sleepPanel.quality.fair}</span>
              <span>{t.sleepPanel.quality.good}</span>
              <span>{t.sleepPanel.quality.veryGood}</span>
              <span>{t.sleepPanel.quality.excellent}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      {isAuthenticated && (
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-helix-accent via-helix-strand to-helix-glow text-background font-medium hover:opacity-90 transition-opacity"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t.sleepPanel.actions.saving}
            </>
          ) : (
            t.sleepPanel.actions.save
          )}
        </Button>
      )}
    </div>
  );
}
