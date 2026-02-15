import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/i18n/useI18n';
import { useFastingWindowTimer } from '@/hooks/useFastingWindowTimer';
import { getDailySummary, getWeeklySummary, getStreak } from '@/lib/fastingMetrics';
import { formatDuration, formatHours } from '@/lib/timeFormat';
import { Clock, TrendingUp, Calendar, Flame, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IntermittentFastingPanel() {
  const { t } = useI18n();
  const { phase, elapsed, remaining, progress } = useFastingWindowTimer();
  
  const dailySummary = getDailySummary();
  const weeklySummary = getWeeklySummary();
  const streak = getStreak();

  const statusColor = phase === 'fasting' ? 'text-helix-accent' : 'text-chart-2';
  const statusBg = phase === 'fasting' ? 'bg-helix-accent/10' : 'bg-chart-2/10';
  const statusBorder = phase === 'fasting' ? 'border-helix-accent/30' : 'border-chart-2/30';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-helix-glow/10 border border-helix-strand/30">
          <Clock className="w-5 h-5 text-helix-accent" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-light tracking-wide text-foreground">
            {t.fastingPanel.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            {t.fastingPanel.subtitle}
          </p>
        </div>
      </div>

      {/* Status & Timer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current Status */}
        <Card className="border-helix-strand/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2">
              <div className={cn('w-2 h-2 rounded-full', phase === 'fasting' ? 'bg-helix-accent' : 'bg-chart-2')} />
              {t.fastingPanel.status.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-mono', statusBg, statusBorder, statusColor)}>
              {phase === 'fasting' ? t.fastingPanel.status.fasting : t.fastingPanel.status.eating}
            </div>
            <div className="text-xs text-muted-foreground">
              {phase === 'fasting' ? t.fastingPanel.status.fastingDesc : t.fastingPanel.status.eatingDesc}
            </div>
          </CardContent>
        </Card>

        {/* Live Timer */}
        <Card className="border-helix-strand/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-light tracking-wide">
              {phase === 'fasting' ? t.fastingPanel.timer.elapsed : t.fastingPanel.timer.remaining}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-mono tabular-nums text-helix-accent">
              {formatDuration(phase === 'fasting' ? elapsed : remaining)}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {phase === 'fasting' ? t.fastingPanel.timer.elapsedDesc : t.fastingPanel.timer.remainingDesc}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="border-helix-strand/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-light tracking-wide">
            {t.fastingPanel.progress.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground font-mono tabular-nums">
            <span>{progress.toFixed(1)}%</span>
            <span>{t.fastingPanel.progress.complete}</span>
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-helix-strand/20" />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Daily Summary */}
        <Card className="border-helix-strand/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              {t.fastingPanel.daily.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="text-2xl font-mono tabular-nums text-foreground">
                {dailySummary.sessions}
              </div>
              <div className="text-xs text-muted-foreground">
                {t.fastingPanel.daily.sessions}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-mono tabular-nums text-muted-foreground">
                {formatHours(dailySummary.totalHours)}
              </div>
              <div className="text-xs text-muted-foreground">
                {t.fastingPanel.daily.hours}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card className="border-helix-strand/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              {t.fastingPanel.weekly.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="text-2xl font-mono tabular-nums text-foreground">
                {weeklySummary.sessions}
              </div>
              <div className="text-xs text-muted-foreground">
                {t.fastingPanel.weekly.sessions}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-mono tabular-nums text-muted-foreground">
                {formatHours(weeklySummary.totalHours)}
              </div>
              <div className="text-xs text-muted-foreground">
                {t.fastingPanel.weekly.hours}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="border-helix-strand/30 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2">
              <Flame className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              {t.fastingPanel.streak.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="text-2xl font-mono tabular-nums text-foreground">
                {streak}
              </div>
              <div className="text-xs text-muted-foreground">
                {t.fastingPanel.streak.days}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Tips */}
      <Card className="border-helix-strand/30 bg-helix-glow/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-helix-accent" strokeWidth={1.5} />
            {t.fastingPanel.insights.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {phase === 'fasting' ? t.fastingPanel.insights.fastingTip : t.fastingPanel.insights.eatingTip}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
