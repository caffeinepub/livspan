import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FastingSchedule } from '@/backend';
import { toast } from 'sonner';
import { queryKeys } from './queryKeys';

/**
 * Hook to fetch the current user's fasting schedule
 */
export function useGetCallerFastingSchedule() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<FastingSchedule | null>({
    queryKey: queryKeys.fastingSchedule,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerFastingSchedule();
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
 * Hook to save the current user's fasting schedule
 */
export function useSaveCallerFastingSchedule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schedule: FastingSchedule) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerFastingSchedule(schedule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fastingSchedule });
      toast.success('Fasting schedule saved successfully');
    },
    onError: (error: any) => {
      console.error('Failed to save fasting schedule:', error);
      toast.error('Failed to save fasting schedule');
    },
  });
}
