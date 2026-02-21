import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  safeParseFloat,
  safeParseInt,
} from '@/lib/nutritionCalculations';
import { Utensils, Scale, Activity, Leaf, Clock, Loader2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function NutritionPanel() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Load user's fasting schedule and profile
  const { data: savedSchedule } = useGetCallerFastingSchedule();
  const { phase } = useFastingWindowTimer(savedSchedule);
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  // Local form state
  const [bodyWeight, setBodyWeight] = useState('');
  const [proteinGrams, setProteinGrams] = useState(0);
  const [vegetableGrams, setVegetableGrams] = useState(0);

  // React Query hooks
  const { data: nutritionData, isLoading: isLoadingData, isFetched } = useGetTodayNutrition();
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

  const handleSave = async () => {
    if (!isAuthenticated) return;

    const entry = {
      caloriesConsumed: BigInt(0),
      caloriesBurned: BigInt(0),
      protein: 0,
      fat: 0,
      carbs: 0,
      waterMl: BigInt(0),
      bodyWeightKg: currentWeight > 0 ? currentWeight : undefined,
      proteinGrams: proteinGrams > 0 ? BigInt(proteinGrams) : undefined,
      vegetableGrams: vegetableGrams > 0 ? BigInt(vegetableGrams) : undefined,
    };

    try {
      await saveMutation.mutateAsync(entry);
      toast.success(t.nutritionPanel.actions.saveSuccess);
    } catch (error) {
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
      : vegetableGrams !== 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-helix-glow/20 border border-helix-accent/40">
          <Utensils className="w-5 h-5 text-helix-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-light tracking-wide bg-gradient-to-r from-helix-accent to-helix-glow bg-clip-text text-transparent">{t.nutritionPanel.title}</h3>
          <p className="text-xs text-muted-foreground font-mono">{t.nutritionPanel.subtitle}</p>
        </div>
      </div>

      {/* Auth Required Message */}
      {!isAuthenticated && (
        <Alert className="border-helix-strand/30 bg-helix-glow/5">
          <AlertDescription className="text-sm text-muted-foreground">{t.nutritionPanel.authRequired}</AlertDescription>
        </Alert>
      )}

      {/* Fasting Phase Status */}
      {isAuthenticated && (
        <Card className="border-helix-strand/30 bg-helix-glow/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              {t.nutritionPanel.fastingPhase.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <div
                className={cn('w-2 h-2 rounded-full', phase === 'fasting' ? 'bg-helix-accent' : 'bg-amber-500')}
              />
              <span className="text-sm font-mono text-foreground">
                {phase === 'fasting' ? t.nutritionPanel.fastingPhase.fasting : t.nutritionPanel.fastingPhase.eating}
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

      {/* Daily Tracking Form */}
      {isAuthenticated && (
        <>
          {/* Body Weight Input */}
          <Card className="border-helix-strand/30 bg-white/50 dark:bg-stone-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
                <Scale className="w-4 h-4" strokeWidth={1.5} />
                {t.nutritionPanel.weight.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bodyWeight" className="text-xs text-muted-foreground">
                  {t.nutritionPanel.weight.unit}
                </Label>
                <Input
                  id="bodyWeight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={bodyWeight}
                  onChange={(e) => setBodyWeight(e.target.value)}
                  placeholder="0.0"
                  className="font-mono tabular-nums"
                  disabled={isLoadingData || isSaving}
                />
              </div>
            </CardContent>
          </Card>

          {/* BMI Display */}
          <Card className="border-helix-strand/30 bg-white/50 dark:bg-stone-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
                <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
                {t.nutritionPanel.bmi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!heightCm ? (
                <p className="text-sm text-muted-foreground">{t.nutritionPanel.bmi.heightMissing}</p>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light tabular-nums text-foreground">{formatBMI(bmi)}</span>
                  {bmi && <span className="text-xs text-muted-foreground">{t.nutritionPanel.bmi.unit}</span>}
                </div>
              )}
            </CardContent>
          </Card>

          <Separator className="bg-helix-strand/20" />

          {/* Protein Target & Slider */}
          <Card className="border-helix-strand/30 bg-white/50 dark:bg-stone-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
                <Activity className="w-4 h-4" strokeWidth={1.5} />
                {t.nutritionPanel.protein.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Target Display */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t.nutritionPanel.protein.target}</span>
                <span className="text-sm font-mono tabular-nums text-foreground">
                  {proteinTarget ? formatProteinTarget(proteinTarget) : t.nutritionPanel.protein.targetUnavailable}
                </span>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="proteinSlider" className="text-xs text-muted-foreground">
                    {t.nutritionPanel.protein.consumed}
                  </Label>
                  <span className="text-sm font-mono tabular-nums text-foreground">{proteinGrams} g</span>
                </div>
                <Slider
                  id="proteinSlider"
                  min={0}
                  max={300}
                  step={5}
                  value={[proteinGrams]}
                  onValueChange={(value) => setProteinGrams(value[0])}
                  disabled={isLoadingData || isSaving}
                  className="cursor-pointer slider-helix"
                />
              </div>

              {/* Progress */}
              {proteinTarget && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t.nutritionPanel.protein.progress}</span>
                    <span className="font-mono tabular-nums text-foreground">{proteinProgress}%</span>
                  </div>
                  <Progress value={proteinProgress} className="h-2 progress-helix" />
                  {proteinGrams >= (proteinTarget || 0) && (
                    <p className="text-xs text-helix-accent">{t.nutritionPanel.protein.targetReached}</p>
                  )}
                  {proteinGrams < (proteinTarget || 0) && proteinTarget && (
                    <p className="text-xs text-muted-foreground">
                      {t.nutritionPanel.protein.remaining.replace(
                        '{amount}',
                        (proteinTarget - proteinGrams).toString()
                      )}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vegetable Goal & Slider */}
          <Card className="border-helix-strand/30 bg-white/50 dark:bg-stone-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2 text-helix-accent">
                <Leaf className="w-4 h-4" strokeWidth={1.5} />
                {t.nutritionPanel.vegetables.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Goal Display */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t.nutritionPanel.vegetables.goal}</span>
                <span className="text-sm font-mono tabular-nums text-foreground">400 g</span>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vegetableSlider" className="text-xs text-muted-foreground">
                    {t.nutritionPanel.vegetables.consumed}
                  </Label>
                  <span className="text-sm font-mono tabular-nums text-foreground">{vegetableGrams} g</span>
                </div>
                <Slider
                  id="vegetableSlider"
                  min={0}
                  max={800}
                  step={10}
                  value={[vegetableGrams]}
                  onValueChange={(value) => setVegetableGrams(value[0])}
                  disabled={isLoadingData || isSaving}
                  className="cursor-pointer slider-helix"
                />
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.nutritionPanel.vegetables.progress}</span>
                  <span className="font-mono tabular-nums text-foreground">{vegetableProgress}%</span>
                </div>
                <Progress value={vegetableProgress} className="h-2 progress-helix" />
                {vegetableGrams >= vegetableGoal && (
                  <p className="text-xs text-helix-accent">{t.nutritionPanel.vegetables.goalReached}</p>
                )}
                {vegetableGrams < vegetableGoal && (
                  <p className="text-xs text-muted-foreground">
                    {t.nutritionPanel.vegetables.remaining.replace('{amount}', (vegetableGoal - vegetableGrams).toString())}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={!hasChanges || isSaving} className="w-full bg-gradient-to-r from-helix-accent to-helix-glow hover:from-helix-glow hover:to-helix-accent">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.nutritionPanel.actions.saving}
              </>
            ) : (
              t.nutritionPanel.actions.save
            )}
          </Button>
        </>
      )}
    </div>
  );
}
