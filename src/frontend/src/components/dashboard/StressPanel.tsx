import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useGetStressDay, useSaveStressDay } from "@/hooks/useStressQueries";
import { useI18n } from "@/i18n/useI18n";
import { Activity, Heart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── Numeric Input Field ──────────────────────────────────────────────────────
interface NumericInputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  min?: number;
  max?: number;
  placeholder?: string;
}

function NumericInputField({
  label,
  value,
  onChange,
  unit,
  min = 0,
  max = 999,
  placeholder = "0",
}: NumericInputFieldProps) {
  const inputId = `numeric-input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)));
    } else if (e.target.value === "") {
      onChange(0);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <label
        htmlFor={inputId}
        className="text-sm flex-1"
        style={{ color: "rgba(100, 220, 160, 0.6)" }}
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="number"
          min={min}
          max={max}
          value={value || ""}
          placeholder={placeholder}
          onChange={handleChange}
          className="w-24 text-right rounded-md px-3 py-2 text-sm font-mono focus:outline-none"
          style={{
            background: "rgba(0, 30, 15, 0.5)",
            border: "1px solid rgba(0, 255, 120, 0.25)",
            color: "#a8ffce",
          }}
        />
        <span
          className="text-xs w-10"
          style={{ color: "rgba(100, 220, 160, 0.6)" }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

// ─── Blood Pressure Display ───────────────────────────────────────────────────
function BloodPressureDisplay({
  systolic,
  diastolic,
  pulse,
}: {
  systolic: number;
  diastolic: number;
  pulse: number;
}) {
  const hasBP = systolic > 0 && diastolic > 0;
  const hasPulse = pulse > 0;

  return (
    <div
      className="flex items-center justify-center gap-4 py-3 px-4 rounded-lg flex-wrap"
      style={{
        background: "rgba(0, 30, 15, 0.4)",
        border: "1px solid rgba(0, 255, 120, 0.2)",
      }}
    >
      <Heart
        className="w-4 h-4"
        style={{ color: "#00e87a" }}
        strokeWidth={1.5}
      />
      <span
        className="text-sm font-mono tabular-nums"
        style={{ color: "#7effc0" }}
      >
        {hasBP ? `${systolic}/${diastolic}` : "—/—"}{" "}
        <span className="text-xs" style={{ color: "rgba(100, 220, 160, 0.6)" }}>
          mmHg
        </span>
      </span>
      <span style={{ color: "rgba(100, 220, 160, 0.5)" }}>·</span>
      <Activity className="w-4 h-4 text-helix-glow" strokeWidth={1.5} />
      <span
        className="text-sm font-mono tabular-nums"
        style={{ color: "#7effc0" }}
      >
        {hasPulse ? pulse : "—"}{" "}
        <span className="text-xs" style={{ color: "rgba(100, 220, 160, 0.6)" }}>
          bpm
        </span>
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StressPanel() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const today = getTodayDateString();

  // Local form state
  const [systolic, setSystolic] = useState(0);
  const [diastolic, setDiastolic] = useState(0);
  const [pulse, setPulse] = useState(0);

  // React Query hooks
  const { data: stressData } = useGetStressDay(today);
  const saveMutation = useSaveStressDay();

  // Initialize form with fetched data
  useEffect(() => {
    if (stressData) {
      setSystolic(Number(stressData.systolic));
      setDiastolic(Number(stressData.diastolic));
      setPulse(Number(stressData.pulse));
    }
  }, [stressData]);

  const handleSave = async () => {
    if (!isAuthenticated) return;

    try {
      await saveMutation.mutateAsync({
        date: today,
        systolic: BigInt(systolic),
        diastolic: BigInt(diastolic),
        pulse: BigInt(pulse),
      });
      toast.success(t.stressPanel.actions.saveSuccess);
    } catch {
      toast.error(t.stressPanel.actions.saveError);
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
          <Heart
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
            {t.stressPanel.title}
          </h3>
          <p
            className="text-xs font-mono"
            style={{ color: "rgba(100, 220, 160, 0.6)" }}
          >
            {t.stressPanel.subtitle}
          </p>
        </div>
      </div>

      {/* Auth Required Message */}
      {!isAuthenticated && (
        <Alert className="border-helix-strand/30 bg-helix-glow/5">
          <AlertDescription className="text-sm text-muted-foreground">
            {t.stressPanel.authRequired}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary display */}
      {isAuthenticated && (
        <BloodPressureDisplay
          systolic={systolic}
          diastolic={diastolic}
          pulse={pulse}
        />
      )}

      {/* Blood Pressure Card */}
      {isAuthenticated && (
        <Card className="glass-card relative overflow-hidden border-0">
          <CardHeader className="pb-3">
            <CardTitle
              className="text-sm font-light tracking-wide flex items-center gap-2"
              style={{ color: "#00e87a" }}
            >
              <Heart className="w-4 h-4" strokeWidth={1.5} />
              {t.stressPanel.bloodPressure.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumericInputField
              label={t.stressPanel.bloodPressure.systolic}
              value={systolic}
              onChange={setSystolic}
              unit="mmHg"
              min={0}
              max={300}
              placeholder="120"
            />
            <div
              className="border-t"
              style={{ borderColor: "rgba(0, 255, 120, 0.15)" }}
            />
            <NumericInputField
              label={t.stressPanel.bloodPressure.diastolic}
              value={diastolic}
              onChange={setDiastolic}
              unit="mmHg"
              min={0}
              max={200}
              placeholder="80"
            />
            {/* BP display */}
            {(systolic > 0 || diastolic > 0) && (
              <div
                className="text-center text-xs pt-1"
                style={{ color: "rgba(100, 220, 160, 0.6)" }}
              >
                <span
                  className="font-mono text-sm"
                  style={{ color: "#00ffaa" }}
                >
                  {systolic}/{diastolic}
                </span>{" "}
                mmHg
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pulse Card */}
      {isAuthenticated && (
        <Card className="glass-card relative overflow-hidden border-0">
          <CardHeader className="pb-3">
            <CardTitle
              className="text-sm font-light tracking-wide flex items-center gap-2"
              style={{ color: "#00e87a" }}
            >
              <Activity className="w-4 h-4" strokeWidth={1.5} />
              {t.stressPanel.pulse.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NumericInputField
              label={t.stressPanel.pulse.description}
              value={pulse}
              onChange={setPulse}
              unit="bpm"
              min={0}
              max={300}
              placeholder="70"
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
              {t.stressPanel.actions.saving}
            </>
          ) : (
            t.stressPanel.actions.save
          )}
        </Button>
      )}
    </div>
  );
}
