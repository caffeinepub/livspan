import type { DiaryEntry } from "@/backend";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useAddDiaryEntry,
  useDeleteDiaryEntry,
  useGetDiaryEntries,
  useUpdateDiaryEntry,
} from "@/hooks/useDiaryQueries";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useI18n } from "@/i18n/useI18n";
import {
  BookOpen,
  Calendar,
  Edit2,
  Loader2,
  PenLine,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTimestamp(ts: bigint): string {
  // timestamp is nanoseconds (ICP Time type)
  const ms = Number(ts / 1_000_000n);
  const d = new Date(ms);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function previewContent(content: string, max = 100): string {
  if (content.length <= max) return content;
  return `${content.slice(0, max).trimEnd()}…`;
}

// ─── Entry Form Dialog ─────────────────────────────────────────────────────────
interface EntryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTitle?: string;
  initialContent?: string;
  isEdit?: boolean;
  onSave: (title: string, content: string) => Promise<void>;
  isSaving: boolean;
}

function EntryFormDialog({
  open,
  onOpenChange,
  initialTitle = "",
  initialContent = "",
  isEdit = false,
  onSave,
  isSaving,
}: EntryFormDialogProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  // Reset form when dialog opens
  const handleOpenChange = (val: boolean) => {
    if (val) {
      setTitle(initialTitle);
      setContent(initialContent);
    }
    onOpenChange(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSave(title.trim(), content.trim());
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg border-0"
        style={{
          background: "rgba(0, 20, 10, 0.85)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(0, 255, 120, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(0, 255, 100, 0.12)",
        }}
        data-ocid="diary.dialog"
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
            {isEdit ? t.diary.editButton : t.diary.addButton}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label
              htmlFor="diary-title"
              className="text-xs uppercase tracking-wider"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              {t.diary.titleLabel}
            </Label>
            <Input
              id="diary-title"
              data-ocid="diary.title_input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.diary.titlePlaceholder}
              className="focus:ring-0"
              style={{
                background: "rgba(0, 30, 15, 0.5)",
                borderColor: "rgba(0, 255, 120, 0.25)",
                color: "#a8ffce",
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="diary-content"
              className="text-xs uppercase tracking-wider"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              {t.diary.contentLabel}
            </Label>
            <Textarea
              id="diary-content"
              data-ocid="diary.content_textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.diary.contentPlaceholder}
              rows={6}
              className="resize-none focus:ring-0"
              style={{
                background: "rgba(0, 30, 15, 0.5)",
                borderColor: "rgba(0, 255, 120, 0.25)",
                color: "#a8ffce",
              }}
            />
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              data-ocid="diary.cancel_button"
              onClick={() => onOpenChange(false)}
              style={{ color: "rgba(100, 220, 160, 0.65)" }}
            >
              {t.diary.confirmDeleteNo}
            </Button>
            <Button
              type="submit"
              data-ocid="diary.save_button"
              disabled={isSaving || !title.trim()}
              className="bg-gradient-to-r from-helix-accent via-helix-strand to-helix-glow text-background font-medium hover:opacity-90 transition-opacity"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.diary.savingButton}
                </>
              ) : (
                t.diary.saveButton
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation ───────────────────────────────────────────────────────
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
          background: "rgba(0, 20, 10, 0.85)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(0, 255, 120, 0.2)",
          borderRadius: "16px",
        }}
        data-ocid="diary.dialog"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-light" style={{ color: "#7effc0" }}>
            {t.diary.confirmDelete}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm" />
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            data-ocid="diary.cancel_delete_button"
            className="border-helix-strand/30"
            style={{
              background: "rgba(0, 30, 15, 0.5)",
              color: "rgba(100, 220, 160, 0.7)",
            }}
          >
            {t.diary.confirmDeleteNo}
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="diary.confirm_delete_button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-500/80 hover:bg-red-500 text-white border-0"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {t.diary.confirmDeleteYes}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Entry Card ────────────────────────────────────────────────────────────────
interface EntryCardProps {
  entry: DiaryEntry;
  index: number;
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (id: string) => void;
}

function EntryCard({ entry, index, onEdit, onDelete }: EntryCardProps) {
  const { t } = useI18n();
  const ocidIndex = index + 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      data-ocid={`diary.item.${ocidIndex}`}
      className="group relative rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: "rgba(0, 20, 10, 0.35)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid rgba(0, 255, 120, 0.15)",
        boxShadow: "0 4px 32px rgba(0, 255, 100, 0.08)",
      }}
    >
      {/* Subtle glow gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.72 0.17 160 / 0.04) 0%, oklch(0.55 0.18 210 / 0.06) 100%)",
        }}
      />

      <div className="relative p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <PenLine
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: "#00e87a" }}
                strokeWidth={1.5}
              />
              <h4
                className="text-sm font-medium truncate"
                style={{ color: "#7effc0" }}
              >
                {entry.title}
              </h4>
            </div>
            {entry.content && (
              <p
                className="text-xs leading-relaxed line-clamp-2"
                style={{ color: "rgba(93, 255, 170, 0.8)" }}
              >
                {previewContent(entry.content)}
              </p>
            )}
            <div className="flex items-center gap-1.5 mt-2">
              <Calendar
                className="w-3 h-3"
                style={{ color: "rgba(100, 220, 160, 0.5)" }}
                strokeWidth={1.5}
              />
              <span
                className="text-xs font-mono"
                style={{ color: "rgba(100, 220, 160, 0.5)" }}
              >
                {formatTimestamp(entry.timestamp)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              data-ocid={`diary.edit_button.${ocidIndex}`}
              onClick={() => onEdit(entry)}
              className="h-7 w-7 text-helix-accent/70 hover:text-helix-accent hover:bg-helix-accent/10"
              title={t.diary.editButton}
            >
              <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              data-ocid={`diary.delete_button.${ocidIndex}`}
              onClick={() => onDelete(entry.id)}
              className="h-7 w-7 text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
              title={t.diary.deleteButton}
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function DiaryPanel() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<DiaryEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries
  const { data: entries = [], isLoading, isError } = useGetDiaryEntries();
  const addMutation = useAddDiaryEntry();
  const updateMutation = useUpdateDiaryEntry();
  const deleteMutation = useDeleteDiaryEntry();

  const isFormSaving = addMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const handleAdd = () => {
    setEditEntry(null);
    setFormOpen(true);
  };

  const handleEdit = (entry: DiaryEntry) => {
    setEditEntry(entry);
    setFormOpen(true);
  };

  const handleSave = async (title: string, content: string) => {
    try {
      if (editEntry) {
        await updateMutation.mutateAsync({ id: editEntry.id, title, content });
        toast.success(t.diary.saveButton);
      } else {
        await addMutation.mutateAsync({ title, content });
        toast.success(t.diary.addButton);
      }
      setFormOpen(false);
      setEditEntry(null);
    } catch {
      toast.error(t.diary.loadingError);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success(t.diary.deleteButton);
    } catch {
      toast.error(t.diary.loadingError);
    } finally {
      setDeleteId(null);
    }
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
            <BookOpen
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
              {t.diary.title}
            </h3>
            <p
              className="text-xs font-mono"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              {t.diary.subtitle}
            </p>
          </div>
        </div>

        {isAuthenticated && (
          <Button
            onClick={handleAdd}
            data-ocid="diary.add_button"
            size="sm"
            className="bg-gradient-to-r from-helix-accent via-helix-strand to-helix-glow text-background font-medium hover:opacity-90 transition-opacity gap-1.5"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span className="hidden sm:inline">{t.diary.addButton}</span>
          </Button>
        )}
      </div>

      {/* Auth Required */}
      {!isAuthenticated && (
        <Alert className="border-helix-strand/30 bg-helix-glow/5">
          <AlertDescription
            className="text-sm"
            style={{ color: "rgba(100, 220, 160, 0.65)" }}
          >
            {t.profile.loginRequired.description}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isAuthenticated && isLoading && (
        <div
          data-ocid="diary.loading_state"
          className="flex items-center justify-center py-12 gap-3"
          style={{ color: "rgba(100, 220, 160, 0.65)" }}
        >
          <Loader2 className="w-5 h-5 animate-spin text-helix-accent" />
          <span className="text-sm">Loading…</span>
        </div>
      )}

      {/* Error State */}
      {isAuthenticated && isError && !isLoading && (
        <Alert
          data-ocid="diary.error_state"
          className="border-red-500/30 bg-red-500/5"
        >
          <AlertDescription className="text-sm text-red-400">
            {t.diary.loadingError}
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {isAuthenticated && !isLoading && !isError && entries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="diary.empty_state"
          className="flex flex-col items-center justify-center py-16 gap-4 text-center"
        >
          <div
            className="p-5 rounded-2xl border border-helix-strand/20 bg-helix-glow/5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.17 160 / 0.05) 0%, oklch(0.55 0.18 210 / 0.08) 100%)",
            }}
          >
            <BookOpen
              className="w-10 h-10 text-helix-accent/50"
              strokeWidth={1}
            />
          </div>
          <p
            className="text-sm max-w-xs leading-relaxed"
            style={{ color: "rgba(100, 220, 160, 0.65)" }}
          >
            {t.diary.emptyState}
          </p>
          <Button
            onClick={handleAdd}
            variant="outline"
            size="sm"
            className="border-helix-strand/40 text-helix-accent hover:bg-helix-accent/10 gap-1.5"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            {t.diary.addButton}
          </Button>
        </motion.div>
      )}

      {/* Entry List */}
      {isAuthenticated && !isLoading && !isError && entries.length > 0 && (
        <div data-ocid="diary.list" className="space-y-3">
          <AnimatePresence mode="popLayout">
            {entries.map((entry, index) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <EntryFormDialog
        open={formOpen}
        onOpenChange={(val) => {
          setFormOpen(val);
          if (!val) setEditEntry(null);
        }}
        initialTitle={editEntry?.title ?? ""}
        initialContent={editEntry?.content ?? ""}
        isEdit={!!editEntry}
        onSave={handleSave}
        isSaving={isFormSaving}
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
