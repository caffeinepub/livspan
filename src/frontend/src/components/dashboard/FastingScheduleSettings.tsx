import type { FastingSchedule } from "@/backend";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetCallerFastingSchedule,
  useSaveCallerFastingSchedule,
} from "@/hooks/useFastingScheduleQueries";
import { useI18n } from "@/i18n/useI18n";
import { Info, Loader2, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";

interface FastingScheduleSettingsProps {
  onScheduleChange?: (schedule: FastingSchedule | null) => void;
}

export default function FastingScheduleSettings({
  onScheduleChange,
}: FastingScheduleSettingsProps) {
  const { t } = useI18n();
  const { data: savedSchedule, isLoading } = useGetCallerFastingSchedule();
  const saveMutation = useSaveCallerFastingSchedule();

  const [startHour, setStartHour] = useState<number>(20);
  const [endHour, setEndHour] = useState<number>(12);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize with saved schedule or defaults
  useEffect(() => {
    if (savedSchedule) {
      setStartHour(savedSchedule.startHour);
      setEndHour(savedSchedule.endHour);
    }
  }, [savedSchedule]);

  // Notify parent of schedule changes
  useEffect(() => {
    if (onScheduleChange) {
      onScheduleChange(savedSchedule ?? null);
    }
  }, [savedSchedule, onScheduleChange]);

  const handleSave = async () => {
    const schedule: FastingSchedule = {
      startHour,
      endHour,
    };

    saveMutation.mutate(schedule, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleCancel = () => {
    if (savedSchedule) {
      setStartHour(savedSchedule.startHour);
      setEndHour(savedSchedule.endHour);
    } else {
      setStartHour(20);
      setEndHour(12);
    }
    setIsEditing(false);
  };

  const calculateDuration = () => {
    if (endHour > startHour) {
      return endHour - startHour;
    }
    return 24 - startHour + endHour;
  };

  const duration = calculateDuration();
  const eatingDuration = 24 - duration;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  if (isLoading) {
    return (
      <Card className="border-helix-strand/30">
        <CardContent className="py-6 flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-helix-accent" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-helix-strand/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-light tracking-wide flex items-center gap-2">
          <Settings className="w-4 h-4 text-helix-accent" strokeWidth={1.5} />
          {t.fastingSchedule.title}
        </CardTitle>
        <CardDescription className="text-xs">
          {t.fastingSchedule.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {t.fastingSchedule.current.label}
                </span>
                <span className="font-mono tabular-nums text-foreground">
                  {String(startHour).padStart(2, "0")}:00 -{" "}
                  {String(endHour).padStart(2, "0")}:00
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {t.fastingSchedule.current.protocol}
                </span>
                <span className="font-mono tabular-nums text-helix-accent">
                  {duration}:{eatingDuration}
                </span>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {t.fastingSchedule.actions.edit}
            </Button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startHour" className="text-xs">
                  {t.fastingSchedule.fields.startHour}
                </Label>
                <Select
                  value={startHour.toString()}
                  onValueChange={(value) =>
                    setStartHour(Number.parseInt(value))
                  }
                  disabled={saveMutation.isPending}
                >
                  <SelectTrigger id="startHour" className="font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem
                        key={hour}
                        value={hour.toString()}
                        className="font-mono"
                      >
                        {String(hour).padStart(2, "0")}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endHour" className="text-xs">
                  {t.fastingSchedule.fields.endHour}
                </Label>
                <Select
                  value={endHour.toString()}
                  onValueChange={(value) => setEndHour(Number.parseInt(value))}
                  disabled={saveMutation.isPending}
                >
                  <SelectTrigger id="endHour" className="font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem
                        key={hour}
                        value={hour.toString()}
                        className="font-mono"
                      >
                        {String(hour).padStart(2, "0")}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Alert className="border-helix-strand/30 bg-helix-glow/5">
              <Info className="w-4 h-4 text-helix-accent" />
              <AlertDescription className="text-xs text-muted-foreground">
                {t.fastingSchedule.help.crossMidnight}
                <br />
                <span className="font-mono text-foreground mt-1 inline-block">
                  {t.fastingSchedule.help.protocol}: {duration}:{eatingDuration}
                </span>
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                size="sm"
                className="flex-1"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.fastingSchedule.actions.saving}
                  </>
                ) : (
                  t.fastingSchedule.actions.save
                )}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={saveMutation.isPending}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                {t.fastingSchedule.actions.cancel}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
