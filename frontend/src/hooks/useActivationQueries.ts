import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
      const address = await actor.getIcpAddress();
      // Fall back to the default address if none is configured
      return address || 'eadaef90a0208bf42e25d15b9d99b767e72ed66ed1fab5b66a7799bfe88283c0';
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    // Address rarely changes; cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to check if the current caller is an admin.
 */
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

/**
 * Mutation hook to set the ICP payment address (admin only).
 */
export function useSetIcpAddress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (address: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setIcpAddress(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.icpAddress });
    },
  });
}

/**
 * Mutation hook to verify payment on the ICP Ledger and automatically activate the caller's account.
 * Returns true if payment was found and account is now activated, false if no qualifying payment found.
 */
export function useVerifyAndActivateMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyAndActivate();
    },
    onSuccess: (activated) => {
      if (activated) {
        // Invalidate all activation status queries so the gate dismisses immediately
        queryClient.invalidateQueries({ queryKey: ['activation'] });
      }
    },
  });
}
