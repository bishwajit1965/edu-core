import { useQuery } from "@tanstack/react-query";

interface PublicApiQueryProps<T> {
  key: readonly unknown[];
  queryFn: () => Promise<T>;
}
export const usePublicApiQuery = <T>({
  key,
  queryFn,
}: PublicApiQueryProps<T>) => {
  return useQuery({
    queryKey: key,
    queryFn,
  });
};
