import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/i18n/useI18n';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetStressDay, useSaveStressDay } from '@/hooks/useStressQueries';
import { Heart, Activity, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
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
  placeholder = '0',
}: NumericInputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)));
    } else if (e.target.value === '') {
      onChange(0);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-muted-foreground flex-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          value={value || ''}
          placeholder={placeholder}
          onChange={handleChange}
          className="w-24 text-right bg-transparent border border-helix-strand/40 rounded-md px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-helix-accent/60 focus:ring-1 focus:ring-helix-accent/30"
        />
        <span className="text-xs text-muted-foreground w-10">{unit}</span>
      </div>
    </div>
  );
}

// ─── Blood Pressure Display ───────────────────────────────────────────────────
function BloodPressureDisplay({
  systolic,
  diastolic,
  pulse,
  bpLabel,
  pulseLabel,
}: {
  systolic: number;
  diastolic: number;
  pulse: number;
  bpLabel: string;
  pulseLabel: string;
}) {
  const hasBP = systolic > 0 && diastolic > 0;
  const hasPulse = pulse > 0;

  return (
    <div className="flex items-center justify-center gap-4 py-3 px-4 rounded-lg border border-helix-strand/30 bg-helix-glow/5 flex-wrap">
      <Heart className="w-4 h-4 text-helix-accent" strokeWidth={1.5} />
      <span className="text-sm font-mono text-foreground tabular-nums">
        {hasBP ? `${systolic}/${diastolic}` : '—/—'}{' '}
        <span className="text-xs text-muted-foreground">mmHg</span>
      </span>
      <span className="text-muted-foreground">·</span>
      <Activity className="w-4 h-4 text-helix-glow" strokeWidth={1.5} />
      <span className="text-sm font-mono text-foreground tabular-nums">
        {hasPulse ? pulse : '—'}{' '}
        <span className="text-xs text-muted-foreground">bpm</span>
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
        <div className="p-2 rounded-md bg-helix-glow/20 border border-helix-accent/40">
          <Heart className="w-5 h-5 text-helix-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-light tracking-wide gradient-green-glow">
            {t.stressPanel.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">{t.stressPanel.subtitle}</p>
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
          bpLabel={t.stressPanel.bloodPressure.label}
          pulseLabel={t.stressPanel.pulse.label}
        />
      )}

      {/* Blood Pressure Card */}
      {isAuthenticated && (
        <Card className="border-helix-strand/30 relative overflow-hidden">
          <div className="absolute inset-0 gradient-card-sage-subtle opacity-60" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
              <Heart className="w-4 h-4" strokeWidth={1.5} />
              {t.stressPanel.bloodPressure.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <NumericInputField
              label={t.stressPanel.bloodPressure.systolic}
              value={systolic}
              onChange={setSystolic}
              unit="mmHg"
              min={0}
              max={300}
              placeholder="120"
            />
            <div className="border-t border-helix-strand/20" />
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
              <div className="text-center text-xs text-muted-foreground pt-1">
                <span className="font-mono text-foreground text-sm">
                  {systolic}/{diastolic}
                </span>{' '}
                mmHg
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pulse Card */}
      {isAuthenticated && (
        <Card className="border-helix-strand/30 relative overflow-hidden">
          <div className="absolute inset-0 gradient-panel-amber opacity-40" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
              <Activity className="w-4 h-4" strokeWidth={1.5} />
              {t.stressPanel.pulse.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
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
