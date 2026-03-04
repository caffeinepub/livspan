import type { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

/**
 * Hook to check if a specific user is activated (has paid the 1 ICP fee).
 * Polls every 30 seconds to detect when the admin confirms payment.
 */
export function useIsUserActivated(principal: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: queryKeys.activation.user(principal?.toString() ?? ""),
    queryFn: async () => {
      if (!actor || !principal)
        throw new Error("Actor or principal not available");
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
 * Hook that polls activation status every 12 seconds while on the PaymentGate screen.
 * When the backend returns true (triggered by automatic ledger check), the caller
 * can react and forward the user to the dashboard.
 *
 * @param principal - The authenticated user's principal (null = disabled)
 * @param enabled   - Set to false to pause polling (e.g. after activation detected)
 */
export function useActivationPolling(
  principal: Principal | null,
  enabled = true,
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: queryKeys.activation.user(principal?.toString() ?? ""),
    queryFn: async () => {
      if (!actor || !principal)
        throw new Error("Actor or principal not available");
      return actor.isUserActivated(principal);
    },
    enabled: !!actor && !actorFetching && !!principal && enabled,
    retry: false,
    // Poll every 12 seconds for near-real-time detection
    refetchInterval: 12_000,
    refetchIntervalInBackground: false,
    // Keep previous data while refetching so UI doesn't flicker
    placeholderData: (prev) => prev,
  });
}

/**
 * Hook to fetch the current user's personal subaccount payment address.
 * Each user gets a unique ICP account-ID derived from their principal.
 * Requires authentication.
 */
export function useGetUserPaymentAddress() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<string>({
    queryKey: ["userPaymentAddress"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      // getUserPaymentAddress returns the hex account-ID string (typed as Principal in IDL but is actually a string)
      const addr = await actor.getUserPaymentAddress();
      return addr as unknown as string;
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
    staleTime: 10 * 60 * 1000, // address is stable per user
  });
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
      if (!actor) throw new Error("Actor not available");
      const address = await actor.getIcpAddress();
      // Fall back to the default address if none is configured
      return (
        address ||
        "5677f79bb400519598c0e75be936cafc391a930d21268d6fcf1eee3cb5c9d582"
      );
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
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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
      if (!actor) throw new Error("Actor not available");
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
      if (!actor) throw new Error("Actor not available");
      return actor.verifyAndActivate();
    },
    onSuccess: (activated) => {
      if (activated) {
        // Invalidate all activation queries so App.tsx re-renders with StartDashboard
        queryClient.invalidateQueries({ queryKey: ["userActivation"] });
      }
    },
  });
}
