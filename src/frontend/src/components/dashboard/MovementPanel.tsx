import {
  Variant_gym_run_bike_walk,
  Variant_intense_light_medium,
} from "@/backend";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetMovementDay,
  useSaveMovementDay,
} from "@/hooks/useMovementQueries";
import { useI18n } from "@/i18n/useI18n";
import { Activity, Loader2, Timer, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── Activity Type Selector ───────────────────────────────────────────────────
interface ActivityTypeSelectorProps {
  value: Variant_gym_run_bike_walk;
  onChange: (value: Variant_gym_run_bike_walk) => void;
  labels: Record<Variant_gym_run_bike_walk, string>;
}

function ActivityTypeSelector({
  value,
  onChange,
  labels,
}: ActivityTypeSelectorProps) {
  const options: Variant_gym_run_bike_walk[] = [
    Variant_gym_run_bike_walk.walk,
    Variant_gym_run_bike_walk.run,
    Variant_gym_run_bike_walk.bike,
    Variant_gym_run_bike_walk.gym,
  ];

  return (
    <div
      className="grid grid-cols-4 gap-2 p-2 rounded-lg"
      style={{
        background: "rgba(0, 20, 10, 0.3)",
        border: "1px solid rgba(0, 255, 120, 0.12)",
      }}
    >
      {options.map((option) => {
        const isSelected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`
              py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 border
              ${
                isSelected
                  ? "border-helix-accent/70 bg-helix-accent/20 text-helix-accent shadow-sm"
                  : "border-helix-strand/30 bg-helix-glow/5 hover:border-helix-strand/50"
              }
            `}
            style={isSelected ? {} : { color: "rgba(100, 220, 160, 0.65)" }}
          >
            {labels[option]}
          </button>
        );
      })}
    </div>
  );
}

// ─── Intensity Toggle ─────────────────────────────────────────────────────────
interface IntensityToggleProps {
  value: Variant_intense_light_medium;
  onChange: (value: Variant_intense_light_medium) => void;
  labels: Record<Variant_intense_light_medium, string>;
}

function IntensityToggle({ value, onChange, labels }: IntensityToggleProps) {
  const options: Variant_intense_light_medium[] = [
    Variant_intense_light_medium.light,
    Variant_intense_light_medium.medium,
    Variant_intense_light_medium.intense,
  ];

  const gradients: Record<Variant_intense_light_medium, string> = {
    [Variant_intense_light_medium.light]:
      "from-helix-accent/30 to-helix-strand/30",
    [Variant_intense_light_medium.medium]:
      "from-helix-strand/30 to-helix-glow/30",
    [Variant_intense_light_medium.intense]:
      "from-helix-glow/30 to-helix-accent/50",
  };

  return (
    <div
      className="flex rounded-lg overflow-hidden border border-helix-strand/30"
      style={{ background: "rgba(0, 20, 10, 0.3)" }}
    >
      {options.map((option, idx) => {
        const isSelected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`
              flex-1 py-2 px-3 text-xs font-medium transition-all duration-200
              ${idx > 0 ? "border-l border-helix-strand/30" : ""}
              ${
                isSelected
                  ? `bg-gradient-to-r ${gradients[option]} text-helix-accent`
                  : "bg-transparent hover:bg-helix-glow/5"
              }
            `}
            style={isSelected ? {} : { color: "rgba(100, 220, 160, 0.65)" }}
          >
            {labels[option]}
          </button>
        );
      })}
    </div>
  );
}

// ─── Active Minutes Input ─────────────────────────────────────────────────────
interface ActiveMinutesInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

function ActiveMinutesInput({
  value,
  onChange,
  label,
}: ActiveMinutesInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(num)) {
      onChange(Math.max(0, Math.min(300, num)));
    } else if (e.target.value === "") {
      onChange(0);
    }
  };

  const percent = (value / 60) * 100; // 60 min as reference goal

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "rgba(100, 220, 160, 0.6)" }}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={300}
            value={value}
            onChange={handleChange}
            className="w-20 text-right rounded-md px-2 py-1 text-sm font-mono focus:outline-none"
            style={{
              background: "rgba(0, 30, 15, 0.5)",
              border: "1px solid rgba(0, 255, 120, 0.25)",
              color: "#a8ffce",
            }}
          />
          <span
            className="text-xs"
            style={{ color: "rgba(100, 220, 160, 0.6)" }}
          >
            min
          </span>
        </div>
      </div>
      {/* Progress bar toward 60 min goal */}
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
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MovementPanel() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const today = getTodayDateString();

  // Local form state
  const [activeMinutes, setActiveMinutes] = useState(30);
  const [activityType, setActivityType] = useState<Variant_gym_run_bike_walk>(
    Variant_gym_run_bike_walk.walk,
  );
  const [intensity, setIntensity] = useState<Variant_intense_light_medium>(
    Variant_intense_light_medium.medium,
  );

  // React Query hooks
  const { data: movementData } = useGetMovementDay(today);
  const saveMutation = useSaveMovementDay();

  // Initialize form with fetched data
  useEffect(() => {
    if (movementData) {
      setActiveMinutes(Number(movementData.activeMinutes));
      setActivityType(movementData.activityType);
      setIntensity(movementData.intensity);
    }
  }, [movementData]);

  const handleSave = async () => {
    if (!isAuthenticated) return;

    try {
      await saveMutation.mutateAsync({
        date: today,
        activeMinutes: BigInt(activeMinutes),
        activityType,
        intensity,
      });
      toast.success(t.movementPanel.actions.saveSuccess);
    } catch {
      toast.error(t.movementPanel.actions.saveError);
    }
  };

  const isSaving = saveMutation.isPending;

  const activityLabels: Record<Variant_gym_run_bike_walk, string> = {
    [Variant_gym_run_bike_walk.walk]: t.movementPanel.activityTypes.walk,
    [Variant_gym_run_bike_walk.run]: t.movementPanel.activityTypes.run,
    [Variant_gym_run_bike_walk.bike]: t.movementPanel.activityTypes.bike,
    [Variant_gym_run_bike_walk.gym]: t.movementPanel.activityTypes.gym,
  };

  const intensityLabels: Record<Variant_intense_light_medium, string> = {
    [Variant_intense_light_medium.light]: t.movementPanel.intensityLevels.light,
    [Variant_intense_light_medium.medium]:
      t.movementPanel.intensityLevels.medium,
    [Variant_intense_light_medium.intense]:
      t.movementPanel.intensityLevels.intense,
  };

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
          <Activity
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
            {t.movementPanel.title}
          </h3>
          <p
            className="text-xs font-mono"
            style={{ color: "rgba(100, 220, 160, 0.6)" }}
          >
            {t.movementPanel.subtitle}
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
            {t.movementPanel.authRequired}
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
          <Timer
            className="w-4 h-4"
            style={{ color: "#00e87a" }}
            strokeWidth={1.5}
          />
          <span
            className="text-sm font-mono tabular-nums"
            style={{ color: "#7effc0" }}
          >
            {activeMinutes} min
          </span>
          <span style={{ color: "rgba(100, 220, 160, 0.5)" }}>·</span>
          <Activity className="w-4 h-4 text-helix-glow" strokeWidth={1.5} />
          <span className="text-sm font-mono" style={{ color: "#7effc0" }}>
            {activityLabels[activityType]}
          </span>
          <span style={{ color: "rgba(100, 220, 160, 0.5)" }}>·</span>
          <Zap className="w-4 h-4 text-helix-strand" strokeWidth={1.5} />
          <span className="text-sm font-mono" style={{ color: "#7effc0" }}>
            {intensityLabels[intensity]}
          </span>
        </div>
      )}

      {/* Active Minutes Card */}
      {isAuthenticated && (
        <Card className="glass-card relative overflow-hidden border-0">
          <CardHeader className="pb-3">
            <CardTitle
              className="text-sm font-light tracking-wide flex items-center gap-2"
              style={{ color: "#00e87a" }}
            >
              <Timer className="w-4 h-4" strokeWidth={1.5} />
              {t.movementPanel.activeMinutes.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActiveMinutesInput
              value={activeMinutes}
              onChange={setActiveMinutes}
              label={t.movementPanel.activeMinutes.description}
            />
          </CardContent>
        </Card>
      )}

      {/* Activity Type Card */}
      {isAuthenticated && (
        <Card className="glass-card relative overflow-hidden border-0">
          <CardHeader className="pb-3">
            <CardTitle
              className="text-sm font-light tracking-wide flex items-center gap-2"
              style={{ color: "#00e87a" }}
            >
              <Activity className="w-4 h-4" strokeWidth={1.5} />
              {t.movementPanel.activityType.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTypeSelector
              value={activityType}
              onChange={setActivityType}
              labels={activityLabels}
            />
          </CardContent>
        </Card>
      )}

      {/* Intensity Card */}
      {isAuthenticated && (
        <Card className="glass-card relative overflow-hidden border-0">
          <CardHeader className="pb-3">
            <CardTitle
              className="text-sm font-light tracking-wide flex items-center gap-2"
              style={{ color: "#00e87a" }}
            >
              <Zap className="w-4 h-4" strokeWidth={1.5} />
              {t.movementPanel.intensity.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IntensityToggle
              value={intensity}
              onChange={setIntensity}
              labels={intensityLabels}
            />
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
              {t.movementPanel.actions.saving}
            </>
          ) : (
            t.movementPanel.actions.save
          )}
        </Button>
      )}
    </div>
  );
}
