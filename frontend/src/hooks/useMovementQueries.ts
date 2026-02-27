import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MovementDay } from '@/backend';
import { toast } from 'sonner';
import { movementDay } from './queryKeys';

function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Hook to fetch today's movement entry for the current user
 */
export function useGetMovementDay(date?: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const dateKey = date ?? getTodayDateString();

  const query = useQuery<MovementDay | null>({
    queryKey: movementDay(dateKey),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMovementDay(dateKey);
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
 * Hook to save today's movement entry for the current user
 */
export function useSaveMovementDay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: MovementDay) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveMovementDay(entry);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: movementDay(variables.date) });
    },
    onError: (error: unknown) => {
      console.error('Failed to save movement entry:', error);
    },
  });
}
