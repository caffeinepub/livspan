import type { NutritionDay } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { useActor } from "./useActor";

/**
 * Hook to fetch today's nutrition entry for the authenticated user
 */
export function useGetTodayNutrition() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<NutritionDay | null>({
    queryKey: queryKeys.nutrition.today,
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getTodayNutritionEntry();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

/**
 * Hook to save/update today's nutrition entry
 * Returns mutation object so caller can handle success/error notifications
 */
export function useSaveNutritionEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: NutritionDay) => {
      if (!actor) throw new Error("Actor not available");

      // Calculate today's timestamp (in days since epoch)
      const today = BigInt(Math.floor(Date.now() / 86400000));

      await actor.saveNutritionDayEntry(today, entry);
    },
    onSuccess: () => {
      // Invalidate and refetch today's nutrition data
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.today });
    },
  });
}
