import apiService from "../lib/apiService.js";
import { useQuery } from "@tanstack/react-query";

export const useApiQuery = ({
  queryKey,
  url,
  params = {},
  enabled = true,
  select,
  onSuccess,
  onError,
  retry = 1,
  staleTime = 0,
  gcTime = 5 * 60 * 1000,
  fetcher = (url, { params }) =>
    apiService
      .getAll(
        Object.keys(params).length
          ? `${url}?${new URLSearchParams(
              Object.entries(params).reduce<Record<string, string>>(
                (queryParams, [key, value]) => {
                  queryParams[key] = String(value);
                  return queryParams;
                },
                {},
              ),
            ).toString()}`
          : url,
      )
      .then((res: { data: unknown }) => {
        console.log("Hook got the response:", res);
        return res.data;
      }),
  refetchOnWindowFocus = true,
  options = {},
}: {
  queryKey: string | readonly unknown[];
  url: string;
  params?: Record<string, unknown>;
  enabled?: boolean;
  select?: (data: unknown) => unknown;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  retry?: number | boolean;
  staleTime?: number;
  gcTime?: number;
  fetcher?: (
    url: string,
    options: { params: Record<string, unknown> },
  ) => Promise<unknown>;
  refetchOnWindowFocus?: boolean;
  options?: Record<string, unknown>;
}) => {
  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      console.log("TanStack Query: queryFn executed", url);
      try {
        const data = await fetcher(url, { params });
        console.log("TanStack Query received:", data);
        onSuccess?.(data);
        return data;
      } catch (error) {
        onError?.(error);
        throw error;
      }
    },
    enabled,
    select,
    retry,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    ...options,
  });
};
