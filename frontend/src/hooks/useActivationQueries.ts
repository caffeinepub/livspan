import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { queryKeys } from './queryKeys';
import type { Principal } from '@dfinity/principal';

/**
 * Hook to check if a specific user is activated (has paid the 1 ICP fee).
 * Polls every 30 seconds to detect when the admin confirms payment.
 */
export function useIsUserActivated(principal: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: queryKeys.activation.user(principal?.toString() ?? ''),
    queryFn: async () => {
      if (!actor || !principal) throw new Error('Actor or principal not available');
      return actor.isUserActivated(principal);
    },
    enabled: !!actor && !actorFetching && !!principal,
    retry: false,
    // Poll every 30 seconds to detect activation
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !!principal && query.isFetched,
  };
}

/**
 * Hook to fetch the owner's ICP payment address.
 * Public — no authentication required.
 */
export function useGetIcpAddress() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: queryKeys.icpAddress,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getIcpAddress();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    // Address rarely changes; cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}
