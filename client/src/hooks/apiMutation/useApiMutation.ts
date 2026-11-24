import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export type MutationMethod = "create" | "update" | "delete";

export interface MutationPayload<TPayload = unknown> {
  id?: string | number;
  payload?: TPayload;
  [key: string]: unknown;
}

export interface MutationSuccessContext<TData, TVariables> {
  data: TData;
  variables: TVariables;
  method: MutationMethod;
}

interface UseApiMutationOptions<
  TData = unknown,
  TVariables extends MutationPayload = MutationPayload,
> {
  method?: MutationMethod;
  key?: string | readonly unknown[];

  mutationFn: (variables: TVariables) => Promise<TData>;

  onSuccess?: (data: TData, variables: TVariables) => void;

  onError?: (error: Error, variables: TVariables) => void;

  showToast?: boolean;

  successMessage?:
    | string
    | ((context: MutationSuccessContext<TData, TVariables>) => string);

  errorMessage?: string;
}

export const useApiMutation = <
  TData = unknown,
  TVariables extends MutationPayload = MutationPayload,
>({
  method = "create",
  key,
  mutationFn,
  onSuccess,
  onError,
  showToast = true,
  successMessage,
  errorMessage,
}: UseApiMutationOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn,

    onSuccess: async (data, variables) => {
      // Invalidate related queries
      if (key) {
        const queryKey = Array.isArray(key) ? key : [key];

        await queryClient.invalidateQueries({
          queryKey,
        });
      }

      // Execute custom success callback
      onSuccess?.(data, variables);

      if (!showToast) return;

      // Extract backend message if available
      const backendMessage =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
          ? data.message
          : undefined;

      // Resolve success message
      const message =
        typeof successMessage === "function"
          ? successMessage({
              data,
              variables,
              method,
            })
          : (successMessage ??
            backendMessage ??
            (method === "create"
              ? "Data created successfully!"
              : method === "update"
                ? "Data updated successfully!"
                : "Data deleted successfully!"));

      // Show success notification
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    },

    onError: (error, variables) => {
      // Execute custom error callback
      onError?.(error, variables);

      if (!showToast) return;

      // Show error notification
      void Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: errorMessage ?? error.message ?? "Operation failed!",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });
    },
  });
};

/***===========================================
 * USAGE OF THIS GLOBAL MUTATION HOOK
 *===========================================*/

// 1. CREATE EXAMPLE
// const createRoleMutation = useApiMutation({
//   method: "create",
//   key: GLOBAL_API_KEYS.ROLE,
//   mutationFn: ({ payload }) => createRole(payload),
//   successMessage: "Role created successfully!",
// });

// SUBMITTING CREATE MUTATION
// createRoleMutation.mutate({
//   payload: {
//     name: "Library Officer",
//     key: "LIBRARY_OFFICER",
//     description: "Manages library resources.",
//   },
// });
// -------------------------------------------

// 2. UPDATE EXAMPLE
// const updateRoleMutation = useApiMutation({
//   method: "update",
//   key: GLOBAL_API_KEYS.ROLE,
//   mutationFn: ({ id, payload }) => updateRole(id as string, payload),
//   successMessage: "Role updated successfully!",
// });

// SUBMITTING UPDATE MUTATION
// updateRoleMutation.mutate({
//   id: roleId,
//   payload: {
//     name: "Senior Library Officer",
//     description: "Manages library operations.",
//   },
// });

// -------------------------------------------

// 2. DELETE EXAMPLE
// const deleteRoleMutation = useApiMutation({
//   method: "delete",
//   key: PUBLIC_API_KEYS.ROLE,
//   mutationFn: ({ id }) => softDeleteRole(id as string),
//   successMessage: "Role deleted successfully!",
// });

// SUBMITTING DELETE MUTATION
// deleteRoleMutation.mutate({
//   id: roleId,
// });

// -------------------------------------------
