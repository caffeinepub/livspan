import type { DiaryEntry } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { useActor } from "./useActor";

/**
 * Hook to fetch all diary entries for the current user (sorted newest first)
 */
export function useGetDiaryEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<DiaryEntry[]>({
    queryKey: queryKeys.diary.entries,
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getDiaryEntries();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}

/**
 * Hook to add a new diary entry
 */
export function useAddDiaryEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      content,
    }: {
      title: string;
      content: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addDiaryEntry(title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.diary.entries });
    },
  });
}

/**
 * Hook to update an existing diary entry
 */
export function useUpdateDiaryEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
    }: {
      id: string;
      title: string;
      content: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateDiaryEntry(id, title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.diary.entries });
    },
  });
}

/**
 * Hook to delete a diary entry
 */
export function useDeleteDiaryEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteDiaryEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.diary.entries });
    },
  });
}
