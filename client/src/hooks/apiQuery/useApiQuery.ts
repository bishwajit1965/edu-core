import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

interface ApiQueryProps<T> {
  key: readonly unknown[];
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean;
  options?: Omit<
    UseQueryOptions<T, Error, T, readonly unknown[]>,
    "queryKey" | "queryFn"
  >;
}

export const useApiQuery = <T>({
  key,
  queryFn,
  enabled = true,
  staleTime = 0,
  gcTime = 5 * 60 * 1000,
  retry = 1,
  refetchOnWindowFocus = true,
  options,
}: ApiQueryProps<T>) => {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn,
    enabled,
    staleTime,
    gcTime,
    retry,
    refetchOnWindowFocus,
    ...options,
  });
};

/***===========================================
 * USAGE OF THIS GLOBAL QUERY HOOK
 *===========================================*/
// const { data: notices, isLoading } = useApiQuery({
//   key: GLOBAL_API_KEYS.NOTICES,
//   queryFn: getPublicNotices,
// });

// const {
//   data: roles,
//   isLoading,
//   error,
// } = useApiQuery({
//   key: GLOBAL_API_KEYS.ROLE,
//   queryFn: getAllRoles,
// });

// const { data: permissions } = useApiQuery({
//   key: GLOBAL_API_KEYS.PERMISSION,
//   queryFn: getAllPermissions,
// });
