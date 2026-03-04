import type { StressDay } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { stressDay } from "./queryKeys";
import { useActor } from "./useActor";

function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

/**
 * Hook to fetch today's stress entry for the current user
 */
export function useGetStressDay(date?: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const dateKey = date ?? getTodayDateString();

  const query = useQuery<StressDay | null>({
    queryKey: stressDay(dateKey),
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getStressDay(dateKey);
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
 * Hook to save today's stress entry for the current user
 */
export function useSaveStressDay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: StressDay) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveStressDay(entry);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: stressDay(variables.date) });
    },
    onError: (error: unknown) => {
      console.error("Failed to save stress entry:", error);
    },
  });
}
