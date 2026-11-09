import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTheme,
  deleteTheme,
  updateTheme,
} from "../../features/theme/themeApi.js";
import Swal from "sweetalert2";

type MutationMethod = "create" | "update" | "delete";

type MutationPayload = {
  id?: Parameters<typeof updateTheme>[0];
  payload?: Parameters<typeof createTheme>[0];
  previewFile?: File;
  slideFiles?: File[];
};

export const useApiMutation = ({
  method = "create",
  key,
  onSuccess,
  onError,
  showToast = true,
  successMessage, // string | function
}: {
  method?: MutationMethod;
  key?: string | readonly unknown[];
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
  successMessage?:
    | string
    | ((args: {
        data: unknown;
        variables: MutationPayload;
        method: MutationMethod;
      }) => string);
}) => {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    id,
    payload,
    previewFile,
    slideFiles = [],
  }: MutationPayload) => {
    if (method === "create") {
      if (!payload) throw new Error("A payload is required to create a theme");
      return createTheme(payload, previewFile, slideFiles);
    }
    if (method === "update") {
      if (id === undefined || !payload) {
        throw new Error("An id and payload are required to update a theme");
      }
      return updateTheme(id, payload, previewFile, slideFiles);
    }
    if (id === undefined)
      throw new Error("An id is required to delete a theme");
    return deleteTheme(id);
  };

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (key) {
        const queryKey = Array.isArray(key) ? key : [key];
        queryClient.invalidateQueries({ queryKey });
      }

      onSuccess?.(data);

      if (!showToast) return;

      const backendMessage =
        typeof data === "object" && data !== null && "message" in data
          ? typeof data.message === "string"
            ? data.message
            : undefined
          : undefined;

      //🧠 Dynamic message support
      const message =
        typeof successMessage === "function"
          ? successMessage({ data, variables, method })
          : (successMessage ??
            backendMessage ??
            (method === "create"
              ? "Operation is successful!"
              : method === "update"
                ? "Data update successfully!"
                : "Data deleted successfully!"));

      // 🌷 SHOW SUCCESS MESSAGE
      return Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    },
    onError,
  });
};
