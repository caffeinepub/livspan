import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/i18n/useI18n';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerFastingSchedule } from '@/hooks/useFastingScheduleQueries';
import { useGetCallerUserProfile } from '@/hooks/useUserProfileQueries';
import { useFastingWindowTimer } from '@/hooks/useFastingWindowTimer';
import { useGetTodayNutrition, useSaveNutritionEntry } from '@/hooks/useQueries';
import {
  calculateBMI,
  formatBMI,
  calculateProteinTarget,
  formatProteinTarget,
  calculateProgress,
  calculateWaterProgress,
  safeParseFloat,
} from '@/lib/nutritionCalculations';
import { Utensils, Scale, Activity, Leaf, Clock, Loader2, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ─── Gradient Slider ─────────────────────────────────────────────────────────
interface GradientSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  id?: string;
}

function GradientSlider({ value, min, max, step, onChange, id }: GradientSliderProps) {
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
                'linear-gradient(to right, oklch(0.72 0.17 160), oklch(0.65 0.15 185), oklch(0.58 0.18 210))',
            }}
          />
          {/* Unfilled overlay from thumb to end */}
          <div
            className="absolute inset-y-0 right-0 rounded-r-full"
            style={{
              left: `${percent}%`,
              background: 'oklch(0.25 0.04 200 / 0.55)',
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
      style={{ background: 'oklch(0.25 0.04 200 / 0.4)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${Math.min(100, percent)}%`,
          background:
            'linear-gradient(to right, oklch(0.72 0.17 160), oklch(0.65 0.15 185), oklch(0.58 0.18 210))',
        }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NutritionPanel() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Load user's fasting schedule and profile
  const { data: savedSchedule } = useGetCallerFastingSchedule();
  const { phase } = useFastingWindowTimer(savedSchedule);
  const { data: userProfile } = useGetCallerUserProfile();

  // Local form state
  const [bodyWeight, setBodyWeight] = useState('');
  const [proteinGrams, setProteinGrams] = useState(0);
  const [vegetableGrams, setVegetableGrams] = useState(0);
  const [waterLiters, setWaterLiters] = useState(0);

  // React Query hooks
  const { data: nutritionData } = useGetTodayNutrition();
  const saveMutation = useSaveNutritionEntry();

  // Initialize form with fetched data
  useEffect(() => {
    if (nutritionData) {
      if (nutritionData.bodyWeightKg !== undefined) {
        setBodyWeight(nutritionData.bodyWeightKg.toString());
      }
      if (nutritionData.proteinGrams !== undefined) {
        setProteinGrams(Number(nutritionData.proteinGrams));
      }
      if (nutritionData.vegetableGrams !== undefined) {
        setVegetableGrams(Number(nutritionData.vegetableGrams));
      }
      setWaterLiters(nutritionData.waterLiters ?? 0);
    }
  }, [nutritionData]);

  // Calculate BMI and protein target
  const currentWeight = safeParseFloat(bodyWeight);
  const heightCm = userProfile?.heightCm ? Number(userProfile.heightCm) : 0;
  const bmi = calculateBMI(currentWeight, heightCm);
  const proteinTarget = calculateProteinTarget(currentWeight);
  const vegetableGoal = 400; // Fixed 400g/day

  // Calculate progress
  const proteinProgress = proteinTarget ? calculateProgress(proteinGrams, proteinTarget) : 0;
  const vegetableProgress = calculateProgress(vegetableGrams, vegetableGoal);
  const waterProgress = calculateWaterProgress(waterLiters);

  const getBmiCategory = (bmiValue: number): string => {
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal weight';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const handleSave = async () => {
    if (!isAuthenticated) return;

    const entry = {
      caloriesConsumed: BigInt(0),
      caloriesBurned: BigInt(0),
      protein: 0,
      fat: 0,
      carbs: 0,
      waterMl: BigInt(Math.round(waterLiters * 1000)),
      bodyWeightKg: currentWeight > 0 ? currentWeight : undefined,
      proteinGrams: proteinGrams > 0 ? BigInt(proteinGrams) : undefined,
      vegetableGrams: vegetableGrams > 0 ? BigInt(vegetableGrams) : undefined,
      waterLiters: waterLiters,
    };

    try {
      await saveMutation.mutateAsync(entry);
      toast.success(t.nutritionPanel.actions.saveSuccess);
    } catch {
      toast.error(t.nutritionPanel.actions.saveError);
    }
  };

  const isSaving = saveMutation.isPending;
  const hasChanges =
    (nutritionData?.bodyWeightKg !== undefined
      ? bodyWeight !== nutritionData.bodyWeightKg.toString()
      : bodyWeight !== '') ||
    (nutritionData?.proteinGrams !== undefined
      ? proteinGrams !== Number(nutritionData.proteinGrams)
      : proteinGrams !== 0) ||
    (nutritionData?.vegetableGrams !== undefined
      ? vegetableGrams !== Number(nutritionData.vegetableGrams)
      : vegetableGrams !== 0) ||
    waterLiters !== (nutritionData?.waterLiters ?? 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-helix-glow/20 border border-helix-accent/40">
          <Utensils className="w-5 h-5 text-helix-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-light tracking-wide gradient-green-glow">
            {t.nutritionPanel.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">{t.nutritionPanel.subtitle}</p>
        </div>
      </div>

      {/* Auth Required Message */}
      {!isAuthenticated && (
        <Alert className="border-helix-strand/30 bg-helix-glow/5">
          <AlertDescription className="text-sm text-muted-foreground">
            {t.nutritionPanel.authRequired}
          </AlertDescription>
        </Alert>
      )}

      {/* Fasting Phase Status */}
      {isAuthenticated && (
        <Card className="border-helix-strand/30 relative overflow-hidden">
          <div className="absolute inset-0 gradient-panel-sage opacity-40" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              {t.nutritionPanel.fastingPhase.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  phase === 'fasting' ? 'bg-helix-accent' : 'bg-helix-glow'
                )}
              />
              <span className="text-sm font-mono text-foreground">
                {phase === 'fasting'
                  ? t.nutritionPanel.fastingPhase.fasting
                  : t.nutritionPanel.fastingPhase.eating}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {phase === 'fasting'
                ? t.nutritionPanel.fastingPhase.fastingTip
                : t.nutritionPanel.fastingPhase.eatingTip}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Body Weight Card */}
      {isAuthenticated && (
        <Card className="border-helix-strand/30 relative overflow-hidden">
          <div className="absolute inset-0 gradient-card-amber-subtle opacity-50" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
              <Scale className="w-4 h-4" strokeWidth={1.5} />
              {t.nutritionPanel.weight.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">
                  {t.nutritionPanel.weight.unit}
                </Label>
                <Input
                  type="number"
                  value={bodyWeight}
                  onChange={(e) => setBodyWeight(e.target.value)}
                  placeholder="70.0"
                  className="border-helix-strand/30 bg-transparent focus:border-helix-accent/60 focus:ring-helix-accent/20"
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>
              {bmi !== null && (
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">{t.nutritionPanel.bmi.label}</div>
                  <div className="text-2xl font-light tabular-nums gradient-green-glow">
                    {formatBMI(bmi)}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.nutritionPanel.bmi.unit}</div>
                </div>
              )}
            </div>
            {bmi !== null && (
              <div className="text-xs text-muted-foreground">{getBmiCategory(bmi)}</div>
            )}
            {heightCm === 0 && currentWeight > 0 && (
              <div className="text-xs text-muted-foreground italic">
                {t.nutritionPanel.bmi.heightMissing}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Protein Intake Card */}
      {isAuthenticated && (
        <Card className="border-helix-strand/30 relative overflow-hidden">
          <div className="absolute inset-0 gradient-card-sage-subtle opacity-60" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
              <Activity className="w-4 h-4" strokeWidth={1.5} />
              {t.nutritionPanel.protein.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            {proteinTarget !== null ? (
              <>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>
                    {t.nutritionPanel.protein.target}: {formatProteinTarget(proteinTarget)}
                  </span>
                  <span className="font-mono tabular-nums text-foreground">{proteinGrams}g</span>
                </div>
                <GradientSlider
                  id="protein-slider"
                  value={proteinGrams}
                  min={0}
                  max={300}
                  step={5}
                  onChange={setProteinGrams}
                />
                <div className="space-y-1">
                  <GradientProgressBar percent={proteinProgress} />
                  <div className="text-xs text-muted-foreground text-right">
                    {Math.round(proteinProgress)}% — {t.nutritionPanel.protein.progress}
                  </div>
                </div>
              </>
            ) : (
              <>
                <GradientSlider
                  id="protein-slider-no-target"
                  value={proteinGrams}
                  min={0}
                  max={300}
                  step={5}
                  onChange={setProteinGrams}
                />
                <p className="text-xs text-muted-foreground">
                  {t.nutritionPanel.protein.targetUnavailable}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vegetables & Fruit Card */}
      {isAuthenticated && (
        <Card className="border-helix-strand/30 relative overflow-hidden">
          <div className="absolute inset-0 gradient-panel-amber opacity-40" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
              <Leaf className="w-4 h-4" strokeWidth={1.5} />
              {t.nutritionPanel.vegetables.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>
                {t.nutritionPanel.vegetables.goal}: {vegetableGoal}g
              </span>
              <span className="font-mono tabular-nums text-foreground">{vegetableGrams}g</span>
            </div>
            <GradientSlider
              id="vegetable-slider"
              value={vegetableGrams}
              min={0}
              max={800}
              step={10}
              onChange={setVegetableGrams}
            />
            <div className="space-y-1">
              <GradientProgressBar percent={vegetableProgress} />
              <div className="text-xs text-muted-foreground text-right">
                {Math.round(vegetableProgress)}% — {t.nutritionPanel.vegetables.progress}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Water Intake Card */}
      {isAuthenticated && (
        <Card className="border-helix-strand/30 relative overflow-hidden">
          <div className="absolute inset-0 gradient-card-sage-subtle opacity-60" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
              <Droplets className="w-4 h-4" strokeWidth={1.5} />
              {t.nutritionPanel.water.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{t.nutritionPanel.water.goal}</span>
              <span className="font-mono tabular-nums text-foreground">
                {waterLiters.toFixed(1)} {t.nutritionPanel.water.unit}
              </span>
            </div>
            <GradientSlider
              id="water-slider"
              value={waterLiters}
              min={0}
              max={5}
              step={0.1}
              onChange={setWaterLiters}
            />
            <div className="space-y-1">
              <GradientProgressBar percent={waterProgress} />
              <div className="text-xs text-muted-foreground text-right">
                {Math.round(waterProgress)}% — {t.nutritionPanel.water.progress}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="bg-helix-strand/20" />

      {/* Save Button */}
      {isAuthenticated && (
        <Button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className={cn(
            'w-full gap-2 font-light tracking-wide',
            'bg-gradient-to-r from-helix-accent via-helix-strand to-helix-glow',
            'hover:from-helix-glow hover:via-helix-accent hover:to-helix-strand',
            'border-helix-strand/40 text-white shadow-md',
            'transition-all duration-300'
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t.nutritionPanel.actions.saving}
            </>
          ) : (
            t.nutritionPanel.actions.save
          )}
        </Button>
      )}
    </div>
  );
}
