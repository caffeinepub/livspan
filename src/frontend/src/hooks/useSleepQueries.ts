import type { SleepDay } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "./queryKeys";
import { useActor } from "./useActor";

/**
 * Hook to fetch today's sleep entry for the current user
 */
export function useGetTodaySleep() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<SleepDay | null>({
    queryKey: queryKeys.sleep.today,
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getTodaySleepEntry();
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
 * Hook to save today's sleep entry for the current user
 */
export function useSaveSleepEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: SleepDay) => {
      if (!actor) throw new Error("Actor not available");
      const today = BigInt(Math.floor(Date.now() / 86_400_000));
      await actor.saveSleepDayEntry(today, entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sleep.today });
    },
    onError: (error: unknown) => {
      console.error("Failed to save sleep entry:", error);
    },
  });
}
