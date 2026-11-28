import { useMemo, useState } from "react";

import Button from "../../../components/ui/Button.js";
import Card from "../../../components/ui/Card.js";
import PageHeader from "../../../components/ui/PageHeader.js";
import {
  createAdmissionInstructions,
  getAllAdmissionInstructions,
  softDeleteAdmissionInstructions,
  updateAdmissionInstructions,
  updateAdmissionInstructionsStatus,
  type CreateAdmissionInstructionsPayload,
  type IAdmissionInstructions,
  type UpdateAdmissionInstructionsPayload,
} from "../../../features/admissionInstructionsApiService/admissionInstructionsApiService.js";
import { useApiQuery } from "../../../hooks/apiQuery/useApiQuery.js";
import type { DataTableColumn } from "../../../components/ui/DataTable.js";
import { LucideIcon } from "../../../components/ui/LucideIcons.js";
import QueryStateHandler from "../../../components/ui/QueryStateHandler.js";
import DataTable from "../../../components/ui/DataTable.js";
import { useApiMutation } from "../../../hooks/apiMutation/useApiMutation.js";
import { ADMIN_QUERY_KEY_CONSTANTS } from "../../../components/apiKeyConstants/adminApiKeyConstants/adminQueryKeyConstants.js";
import { useQueryClient } from "@tanstack/react-query";
import { confirmDelete, showError } from "../../../utils/alert.js";

// Adjust this import path if your form is stored in another folder.
import AdmissionInstructionsForm from "./components/AdmissionInstructionsForm.js";

const AdmissionInstructionManagementPage = () => {
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [selectedInstruction, setSelectedInstruction] =
    useState<IAdmissionInstructions | null>(null);

  const isEditing = Boolean(selectedInstruction);

  /**==================================================
   * FETCH ADMISSION INSTRUCTIONS
   * ==================================================*/

  const {
    data: admissionInstructions = [],
    isLoading,
    isPending,
    isError,
    error,
  } = useApiQuery({
    key: [...ADMIN_QUERY_KEY_CONSTANTS.ADMISSION_INSTRUCTIONS],
    queryFn: getAllAdmissionInstructions,
  });

  /**================================================
   * CREATE / UPDATE MUTATION
   * ================================================*/

  const admissionInstructionMutation = useApiMutation({
    method: isEditing ? "update" : "create",
    key: [...ADMIN_QUERY_KEY_CONSTANTS.ADMISSION_INSTRUCTIONS],
    mutationFn: isEditing
      ? ({ permissionId, payload }) =>
          updateAdmissionInstructions(
            permissionId as string,
            payload as UpdateAdmissionInstructionsPayload,
          )
      : ({ payload }) =>
          createAdmissionInstructions(
            payload as CreateAdmissionInstructionsPayload,
          ),
  });

  /**================================================
   * PUBLISH / UNPUBLISH MUTATION
   * ================================================*/

  const instructionStatusMutation = useApiMutation({
    method: "update",
    key: [...ADMIN_QUERY_KEY_CONSTANTS.ADMISSION_INSTRUCTIONS],
    mutationFn: ({ instructionId, isActive }) =>
      updateAdmissionInstructionsStatus(
        instructionId as string,
        isActive as boolean,
      ),
    successMessage: ({ variables }) =>
      variables.isActive
        ? "Admission instructions published successfully!"
        : "Admission instructions unpublished successfully!",
  });

  /**================================================
   * SOFT DELETE MUTATION
   * ================================================*/

  const instructionDeleteMutation = useApiMutation({
    method: "delete",
    key: [...ADMIN_QUERY_KEY_CONSTANTS.ADMISSION_INSTRUCTIONS],
    mutationFn: ({ instructionId }) =>
      softDeleteAdmissionInstructions(instructionId as string),
  });

  /**================================================
   * QUERY INVALIDATION
   * ================================================*/

  const handleRefetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: [...ADMIN_QUERY_KEY_CONSTANTS.ADMISSION_INSTRUCTIONS],
    });
  };

  /**================================================
   * CREATE / UPDATE SUBMIT HANDLER
   * ================================================*/

  const onSubmit = async (
    payload:
      | CreateAdmissionInstructionsPayload
      | UpdateAdmissionInstructionsPayload,
    instructionId?: string,
  ): Promise<void> => {
    if (instructionId) {
      await admissionInstructionMutation.mutateAsync({
        permissionId: instructionId,
        payload,
      });
    } else {
      await admissionInstructionMutation.mutateAsync({ payload });
    }

    await handleRefetch();
  };

  /**================================================
   * OPEN CREATE FORM
   * ================================================*/

  const handleCreate = () => {
    setSelectedInstruction(null);
    setShowForm(true);
  };

  /**================================================
   * OPEN EDIT FORM
   * ================================================*/

  const handleEdit = (instructionId: string) => {
    const instruction =
      admissionInstructions.find(
        (item: IAdmissionInstructions) => item._id === instructionId,
      ) ?? null;

    if (!instruction) return;

    setSelectedInstruction(instruction);
    setShowForm(true);
  };

  /**================================================
   * FORM SUBMISSION
   * ================================================*/

  const handleFormSubmit = async (
    payload: CreateAdmissionInstructionsPayload,
  ): Promise<void> => {
    setIsSubmitting(true);

    try {
      await onSubmit(payload, selectedInstruction?._id);

      setShowForm(false);
      setSelectedInstruction(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**================================================
   * CLOSE FORM
   * ================================================*/

  const handleCancel = () => {
    setShowForm(false);
    setSelectedInstruction(null);
  };

  /**================================================
   * SEARCH FILTER
   * ================================================*/

  const filteredAdmissionInstructions = useMemo(() => {
    const search = searchValue.toLowerCase().trim();

    if (!search) return admissionInstructions;

    return admissionInstructions.filter((instruction: IAdmissionInstructions) =>
      [
        instruction.title ?? "",
        instruction.academicSession ?? "",
        instruction.introduction ?? "",
        String(instruction.sections?.length ?? 0),
        String(instruction.faqs?.length ?? 0),
        instruction.updatedAt ?? "",
        instruction.isPublished ? "published" : "draft",
      ]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [admissionInstructions, searchValue]);

  /**================================================
   * DATA TABLE COLUMNS
   * ================================================*/

  const columns = useMemo<DataTableColumn<IAdmissionInstructions>[]>(
    () => [
      {
        header: "Instruction Title",
        accessorKey: "title",
        sortable: true,
      },
      {
        header: "Admission Session",
        accessorKey: "academicSession",
        sortable: true,
      },
      {
        header: "Introduction",
        cell: (instruction) => instruction.introduction || "N/A",
      },
      {
        header: "Sections",
        cell: (instruction) => instruction.sections?.length || "N/A",
      },
      {
        header: "FAQs",
        cell: (instruction) => instruction.faqs?.length || "N/A",
      },
      {
        header: "Status",
        cell: (instruction) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              instruction.isPublished
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            {instruction.isPublished ? "🟢 Published" : "🔴 Draft"}
          </span>
        ),
      },
      {
        header: "Last Updated At",
        cell: (instruction) =>
          instruction.updatedAt
            ? new Date(instruction.updatedAt).toLocaleDateString()
            : "N/A",
      },
    ],
    [],
  );

  /**================================================
   * DELETE HANDLER
   * ================================================*/

  const handleDelete = async (instructionId: string) => {
    try {
      const confirmed = await confirmDelete();

      if (!confirmed.isConfirmed) return;

      await instructionDeleteMutation.mutateAsync({ instructionId });

      await handleRefetch();
    } catch (error) {
      showError("Encountered error!");
      console.error(error);
    }
  };

  /**================================================
   * PUBLISH / UNPUBLISH HANDLER
   * ================================================*/

  const handleInstructionStatusChange = async (
    instructionId: string,
    isPublished: boolean,
  ) => {
    await instructionStatusMutation.mutateAsync({
      instructionId,
      isActive: isPublished,
    });

    await handleRefetch();
  };

  /**================================================
   * RENDER
   * ================================================*/

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isPending={isPending}
      isError={isError}
      error={error}
      loadingMessage="Loading admission instructions..."
    >
      <div>
        <PageHeader
          subject="Total Instructions"
          dataLength={admissionInstructions.length}
          description="Create and manage institution admission instructions."
          actions={
            <div className="lg:flex flex-1 grid items-center gap-2">
              <Button
                size="xs"
                onClick={showForm ? handleCancel : handleCreate}
                variant="primary"
              >
                {!showForm ? (
                  <LucideIcon.UploadCloudIcon size={16} />
                ) : (
                  <LucideIcon.List size={16} />
                )}
                {showForm ? "Back to Instructions" : "Create Instructions"}
              </Button>
            </div>
          }
        />

        <div className="lg:space-y-8 space-y-4">
          {/* ADMISSION INSTRUCTIONS FORM */}

          {showForm && (
            <AdmissionInstructionsForm
              initialData={selectedInstruction}
              submitting={isSubmitting}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}

          {/* DATA TABLE */}

          {!showForm && (
            <div>
              <Card>
                <DataTable
                  data={filteredAdmissionInstructions}
                  columns={columns}
                  getRowId={(instruction) => instruction._id}
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  onSearchClear={() => setSearchValue("")}
                  searchPlaceholder="Search instructions..."
                  labelText="Number of instructions displayed:"
                  emptyMessage="No instructions found."
                  icon={<LucideIcon.List size={19} />}
                  dataLength={admissionInstructions.length}
                  actions={(instruction) => (
                    <>
                      <Button
                        variant="base"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={() => handleEdit(instruction._id)}
                        title="Edit Instruction"
                      >
                        <LucideIcon.Edit size={16} />
                      </Button>

                      {instruction.isPublished && (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={isSubmitting}
                          onClick={() =>
                            handleInstructionStatusChange(
                              instruction._id,
                              false,
                            )
                          }
                          title="Unpublish Instructions"
                        >
                          <LucideIcon.ToggleLeftIcon size={16} />
                        </Button>
                      )}

                      {!instruction.isPublished && (
                        <Button
                          variant="success"
                          size="sm"
                          disabled={isSubmitting}
                          onClick={() =>
                            handleInstructionStatusChange(instruction._id, true)
                          }
                          title="Publish Instructions"
                        >
                          <LucideIcon.ToggleRightIcon size={16} />
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(instruction._id)}
                        title="Delete Instructions"
                      >
                        <LucideIcon.Trash2 size={16} />
                      </Button>
                    </>
                  )}
                />
              </Card>
            </div>
          )}
        </div>
      </div>
    </QueryStateHandler>
  );
};

export default AdmissionInstructionManagementPage;
