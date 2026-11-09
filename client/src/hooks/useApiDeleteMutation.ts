import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";

import axios from "../lib/apiService.js";

type UseApiDeleteOptions = {
  url: string;
  key: QueryKey | string;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
};

export const useApiDelete = ({
  url,
  key,
  onSuccess,
  onError,
}: UseApiDeleteOptions) => {
  const queryClient = useQueryClient();

  const mutationFn = async ({ id }: { id: string | number }) => {
    return axios.delete(`${url}/${id}`).then((res) => res.data);
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: Array.isArray(key) ? key : [key],
      });
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};
