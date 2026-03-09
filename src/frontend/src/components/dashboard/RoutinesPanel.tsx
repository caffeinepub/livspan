import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n/useI18n";
import {
  CheckCircle2,
  Circle,
  Edit2,
  ListChecks,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Frequency = "daily" | "weekly";

interface Routine {
  id: string;
  name: string;
  frequency: Frequency;
  completedToday: boolean;
  lastCompletedDate: string; // ISO date string "YYYY-MM-DD"
}

const STORAGE_KEY = "livspan-routines";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function isCompletedToday(routine: Routine): boolean {
  return (
    routine.completedToday && routine.lastCompletedDate === getTodayString()
  );
}

function loadRoutines(): Routine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Routine[];
  } catch {
    return [];
  }
}

function saveRoutines(routines: Routine[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Routine Form Dialog ──────────────────────────────────────────────────────

interface RoutineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  initialFrequency?: Frequency;
  isEdit?: boolean;
  onSave: (name: string, frequency: Frequency) => void;
  isSaving: boolean;
}

function RoutineFormDialog({
  open,
  onOpenChange,
  initialName = "",
  initialFrequency = "daily",
  isEdit = false,
  onSave,
  isSaving,
}: RoutineFormDialogProps) {
  const { t } = useI18n();
  const [name, setName] = useState(initialName);
  const [frequency, setFrequency] = useState<Frequency>(initialFrequency);

  // Sync form state when dialog opens with new initial values
  useEffect(() => {
    if (open) {
      setName(initialName);
      setFrequency(initialFrequency);
    }
  }, [open, initialName, initialFrequency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), frequency);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md border-0"
        style={{
          background: "rgba(0, 20, 10, 0.90)",
          backdropFilter: "blur(28px) saturate(200%)",
          WebkitBackdropFilter: "blur(28px) saturate(200%)",
          border: "1px solid rgba(0, 255, 120, 0.22)",
          borderRadius: "16px",
          boxShadow:
            "0 8px 40px rgba(0, 255, 100, 0.14), 0 1px 0 rgba(255,255,255,0.06) inset",
        }}
        data-ocid="routines.dialog"
      >
        <DialogHeader>
          <DialogTitle
            className="font-light tracking-wide"
            style={{
              background: "linear-gradient(135deg, #a8ffce, #4fffb0)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {isEdit ? t.routinesPanel.editButton : t.routinesPanel.addButton}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="routine-name"
              className="text-xs uppercase tracking-wider"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              {t.routinesPanel.nameLabel}
            </Label>
            <Input
              id="routine-name"
              data-ocid="routines.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.routinesPanel.namePlaceholder}
              className="focus:ring-0"
              style={{
                background: "rgba(0, 30, 15, 0.5)",
                borderColor: "rgba(0, 255, 120, 0.25)",
                color: "#a8ffce",
              }}
              required
              autoFocus
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label
              className="text-xs uppercase tracking-wider"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              {t.routinesPanel.frequencyLabel}
            </Label>
            <Select
              value={frequency}
              onValueChange={(val) => setFrequency(val as Frequency)}
            >
              <SelectTrigger
                data-ocid="routines.select"
                className="focus:ring-0"
                style={{
                  background: "rgba(0, 30, 15, 0.5)",
                  borderColor: "rgba(0, 255, 120, 0.25)",
                  color: "#a8ffce",
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">
                  {t.routinesPanel.frequencyDaily}
                </SelectItem>
                <SelectItem value="weekly">
                  {t.routinesPanel.frequencyWeekly}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              data-ocid="routines.cancel_button"
              onClick={() => onOpenChange(false)}
              style={{ color: "rgba(100, 220, 160, 0.65)" }}
            >
              {t.routinesPanel.confirmDeleteNo}
            </Button>
            <Button
              type="submit"
              data-ocid="routines.save_button"
              disabled={isSaving || !name.trim()}
              className="bg-gradient-to-r from-helix-accent via-helix-strand to-helix-glow text-background font-medium hover:opacity-90 transition-opacity"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.routinesPanel.savingButton}
                </>
              ) : (
                t.routinesPanel.saveButton
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation ──────────────────────────────────────────────────────

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteDialogProps) {
  const { t } = useI18n();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="border-0"
        style={{
          background: "rgba(0, 20, 10, 0.90)",
          backdropFilter: "blur(28px) saturate(200%)",
          WebkitBackdropFilter: "blur(28px) saturate(200%)",
          border: "1px solid rgba(0, 255, 120, 0.22)",
          borderRadius: "16px",
        }}
        data-ocid="routines.dialog"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-light" style={{ color: "#7effc0" }}>
            {t.routinesPanel.confirmDelete}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm" />
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            data-ocid="routines.cancel_delete_button"
            className="border-helix-strand/30"
            style={{
              background: "rgba(0, 30, 15, 0.5)",
              color: "rgba(100, 220, 160, 0.7)",
            }}
          >
            {t.routinesPanel.confirmDeleteNo}
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="routines.confirm_delete_button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-500/80 hover:bg-red-500 text-white border-0"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {t.routinesPanel.confirmDeleteYes}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Routine Card ─────────────────────────────────────────────────────────────

interface RoutineCardProps {
  routine: Routine;
  index: number;
  onToggle: (id: string) => void;
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

function RoutineCard({
  routine,
  index,
  onToggle,
  onEdit,
  onDelete,
}: RoutineCardProps) {
  const { t } = useI18n();
  const done = isCompletedToday(routine);
  const ocidIndex = index + 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      data-ocid={`routines.item.${ocidIndex}`}
      className="group relative rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: done ? "rgba(0, 40, 20, 0.40)" : "rgba(0, 20, 10, 0.35)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: done
          ? "1px solid rgba(0, 255, 120, 0.28)"
          : "1px solid rgba(0, 255, 120, 0.15)",
        boxShadow: done
          ? "0 4px 24px rgba(0, 255, 100, 0.12)"
          : "0 4px 32px rgba(0, 255, 100, 0.06)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.72 0.17 160 / 0.04) 0%, oklch(0.55 0.18 210 / 0.06) 100%)",
        }}
      />

      <div className="relative px-4 py-3 sm:px-5 flex items-center gap-3">
        {/* Completion toggle */}
        <button
          type="button"
          data-ocid={`routines.checkbox.${ocidIndex}`}
          onClick={() => onToggle(routine.id)}
          className="flex-shrink-0 transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-helix-accent/50 rounded-full"
          title={
            done ? t.routinesPanel.completedToday : t.routinesPanel.notCompleted
          }
          aria-label={
            done ? t.routinesPanel.completedToday : t.routinesPanel.notCompleted
          }
          aria-pressed={done}
        >
          {done ? (
            <CheckCircle2
              className="w-5 h-5"
              style={{ color: "#00e87a" }}
              strokeWidth={2}
            />
          ) : (
            <Circle
              className="w-5 h-5"
              style={{ color: "rgba(0, 245, 255, 0.3)" }}
              strokeWidth={1.5}
            />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium truncate transition-all duration-200"
            style={{
              color: done ? "#7effc0" : "rgba(0, 245, 255, 0.75)",
              textDecoration: done ? "none" : "none",
            }}
          >
            {routine.name}
          </p>
          <span
            className="text-xs font-mono"
            style={{ color: "rgba(100, 220, 160, 0.45)" }}
          >
            {routine.frequency === "daily"
              ? t.routinesPanel.frequencyDaily
              : t.routinesPanel.frequencyWeekly}
            {done && (
              <span
                className="ml-2"
                style={{ color: "rgba(0, 232, 122, 0.7)" }}
              >
                · {t.routinesPanel.completedToday}
              </span>
            )}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            data-ocid={`routines.edit_button.${ocidIndex}`}
            onClick={() => onEdit(routine)}
            className="h-7 w-7 text-helix-accent/60 hover:text-helix-accent hover:bg-helix-accent/10"
            title={t.routinesPanel.editButton}
          >
            <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            data-ocid={`routines.delete_button.${ocidIndex}`}
            onClick={() => onDelete(routine.id)}
            className="h-7 w-7 text-red-400/50 hover:text-red-400 hover:bg-red-400/10"
            title={t.routinesPanel.deleteButton}
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RoutinesPanel() {
  const { t } = useI18n();
  const [routines, setRoutines] = useState<Routine[]>(loadRoutines);
  const [formOpen, setFormOpen] = useState(false);
  const [editRoutine, setEditRoutine] = useState<Routine | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const persist = (updated: Routine[]) => {
    setRoutines(updated);
    saveRoutines(updated);
  };

  const handleAdd = () => {
    setEditRoutine(null);
    setFormOpen(true);
  };

  const handleEdit = (routine: Routine) => {
    setEditRoutine(routine);
    setFormOpen(true);
  };

  const handleSave = (name: string, frequency: Frequency) => {
    setIsSaving(true);
    // Tiny artificial delay to show saving state for UX
    setTimeout(() => {
      if (editRoutine) {
        persist(
          routines.map((r) =>
            r.id === editRoutine.id ? { ...r, name, frequency } : r,
          ),
        );
      } else {
        const newRoutine: Routine = {
          id: generateId(),
          name,
          frequency,
          completedToday: false,
          lastCompletedDate: "",
        };
        persist([...routines, newRoutine]);
      }
      setIsSaving(false);
      setFormOpen(false);
      setEditRoutine(null);
    }, 280);
  };

  const handleToggle = (id: string) => {
    const today = getTodayString();
    persist(
      routines.map((r) => {
        if (r.id !== id) return r;
        const alreadyDone = isCompletedToday(r);
        return {
          ...r,
          completedToday: !alreadyDone,
          lastCompletedDate: !alreadyDone ? today : r.lastCompletedDate,
        };
      }),
    );
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    setIsDeleting(true);
    setTimeout(() => {
      persist(routines.filter((r) => r.id !== deleteId));
      setDeleteId(null);
      setIsDeleting(false);
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-md"
            style={{
              background: "rgba(0, 232, 122, 0.15)",
              border: "1px solid rgba(0, 255, 120, 0.3)",
            }}
          >
            <ListChecks
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
              {t.routinesPanel.title}
            </h3>
            <p
              className="text-xs font-mono"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              {t.routinesPanel.subtitle}
            </p>
          </div>
        </div>

        <Button
          onClick={handleAdd}
          data-ocid="routines.add_button"
          size="sm"
          className="bg-gradient-to-r from-helix-accent via-helix-strand to-helix-glow text-background font-medium hover:opacity-90 transition-opacity gap-1.5"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          <span className="hidden sm:inline">{t.routinesPanel.addButton}</span>
        </Button>
      </div>

      {/* Empty State */}
      {routines.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="routines.empty_state"
          className="flex flex-col items-center justify-center py-16 gap-4 text-center"
        >
          <div
            className="p-5 rounded-2xl border border-helix-strand/20"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.17 160 / 0.05) 0%, oklch(0.55 0.18 210 / 0.08) 100%)",
            }}
          >
            <ListChecks
              className="w-10 h-10 text-helix-accent/50"
              strokeWidth={1}
            />
          </div>
          <p
            className="text-sm max-w-xs leading-relaxed"
            style={{ color: "rgba(100, 220, 160, 0.65)" }}
          >
            {t.routinesPanel.emptyState}
          </p>
          <Button
            onClick={handleAdd}
            variant="outline"
            size="sm"
            className="border-helix-strand/40 text-helix-accent hover:bg-helix-accent/10 gap-1.5"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            {t.routinesPanel.addButton}
          </Button>
        </motion.div>
      )}

      {/* Routine List */}
      {routines.length > 0 && (
        <div data-ocid="routines.list" className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {routines.map((routine, index) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                index={index}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <RoutineFormDialog
        open={formOpen}
        onOpenChange={(val) => {
          setFormOpen(val);
          if (!val) setEditRoutine(null);
        }}
        initialName={editRoutine?.name ?? ""}
        initialFrequency={editRoutine?.frequency ?? "daily"}
        isEdit={!!editRoutine}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => {
          if (!val) setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
