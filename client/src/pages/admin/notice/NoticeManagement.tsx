import { useEffect, useMemo, useState } from "react";
import {
  archiveNotice,
  createNotice,
  deleteNotice,
  getAllNotices,
  NOTICE_AUDIENCE,
  publishNotice,
  updateNotice,
  withdrawNotice,
  type CreateNoticePayload,
  type Notice,
  type UpdateNoticePayload,
} from "../../../features/notice/noticeApi";
import PageHeader from "../../../components/ui/PageHeader";
import Card from "../../../components/ui/Card";
import { CalendarDays, FileText, LucideFilter, Users } from "lucide-react";
import Pagination from "../../../components/ui/Pagination";
import Button from "../../../components/ui/Button";
import { LucideIcon } from "../../../components/ui/LucideIcons";
import DataState from "../../../components/ui/DataState";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import {
  confirmArchive,
  confirmDelete,
  confirmPublish,
  showSuccess,
} from "../../../utils/alert";

const NoticeManagement = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**---> PAGINATION --->*/
  const [paginatedData, setPaginatedData] = useState(notices || []);
  const dataLength = paginatedData?.length;

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("");

  // Create notice modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [audience, setAudience] = useState("GENERAL");
  const [academicSession, setAcademicSession] = useState("");
  const [className, setClassName] = useState("");
  const [group, setGroup] = useState("");
  const [section, setSection] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  // Edit notice state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNoticeId, setEditNoticeId] = useState<string | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Withdraw notice state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawNoticeId, setWithdrawNoticeId] = useState<string | null>(null);
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // // Notice attachments states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [existingAttachments, setExistingAttachments] = useState<
    Notice["attachments"]
  >([]);

  console.log("Editing notice option", isEditModalOpen.toString());
  console.log("Editing Id", editNoticeId);
  console.log("Editing notice", editingNotice);

  // Modal toggle option
  const modalOpenToggler = editNoticeId ? isEditModalOpen : isCreateModalOpen;

  // Search and filter logic
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        notice.title.toLowerCase().includes(search) ||
        notice.content.toLowerCase().includes(search);

      const matchesStatus = !statusFilter || notice.status === statusFilter;

      const matchesCategory =
        !categoryFilter || notice.category === categoryFilter;

      const matchesAudience =
        !audienceFilter || notice.audience === audienceFilter;

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesAudience
      );
    });
  }, [notices, searchTerm, statusFilter, categoryFilter, audienceFilter]);

  console.log("Notices", notices);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await getAllNotices();
        setNotices(response);
      } catch (error) {
        console.error("Error fetching notices:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const loadFormData = (editingNotice: Notice | null) => {
    setTitle(editingNotice?.title || "");
    setContent(editingNotice?.content || "");
    setCategory(editingNotice?.category || "GENERAL");
    setAudience(editingNotice?.audience || "GENERAL");
    setAcademicSession(editingNotice?.target?.academicSession || "");
    setClassName(editingNotice?.target?.className || "");
    setGroup(editingNotice?.target?.group || "");
    setSection(editingNotice?.target?.section || "");
    setExpiresAt(
      editingNotice?.expiresAt
        ? new Date(editingNotice.expiresAt).toISOString().slice(0, 16)
        : "",
    );
    setSelectedFiles([]);
    setExistingAttachments(editingNotice?.attachments || []);
    setSubmitError(null);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("GENERAL");
    setAudience("GENERAL");
    setAcademicSession("");
    setClassName("");
    setGroup("");
    setSection("");
    setExpiresAt("");
    setSubmitError(null);
    setSelectedFiles([]);
    setIsDragging(false);
    setExistingAttachments([]);
  };

  const closeCreateModal = () => {
    if (submitting) return;
    setIsCreateModalOpen(false);
    setEditingNotice(null);
    setEditNoticeId(null);
    resetForm();
  };

  /**---> CREATE NOTICE HANDLER --->*/
  const handleCreateNotice = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setEditingNotice(null);
    setEditNoticeId(null);
    setSubmitting(true);
    setSubmitError(null);

    try {
      let target: CreateNoticePayload["target"];

      if (audience === NOTICE_AUDIENCE.CLASS) {
        target = {
          academicSession: academicSession.trim() || undefined,
          className: className.trim() || undefined,
          group: group.trim() || undefined,
          section: section.trim() || undefined,
        };
      }

      const payload: CreateNoticePayload = {
        title: title.trim(),
        content: content.trim(),
        category: category as CreateNoticePayload["category"],
        audience: audience as CreateNoticePayload["audience"],
        ...(target && { target }),
        ...(expiresAt && {
          expiresAt: new Date(expiresAt).toISOString(),
        }),
      };

      const createdNotice = await createNotice(payload, selectedFiles);

      if (createdNotice) {
        showSuccess("Notice created successfully!");
        setNotices((previous) => [createdNotice, ...previous]);
      }

      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error creating notice:", err);

      setSubmitError(
        err instanceof Error ? err.message : "Failed to create notice.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /**---> EDIT NOTICE HANDLER --->*/
  const handleEditNotice = async (editingNotice: Notice | null) => {
    setSubmitting(true);
    try {
      const payload: UpdateNoticePayload = {
        title: title.trim(),
        content: content.trim(),
        category: category as UpdateNoticePayload["category"],
        audience: audience as UpdateNoticePayload["audience"],
        target:
          audience === NOTICE_AUDIENCE.CLASS
            ? {
                academicSession: academicSession.trim() || undefined,
                className: className.trim() || undefined,
                group: group.trim() || undefined,
                section: section.trim() || undefined,
              }
            : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      };
      const response = await updateNotice(
        editingNotice?._id || "",
        payload,
        selectedFiles,
      );
      if (response) {
        showSuccess("Notice updated successfully!");
        const updatedNotices = notices.map((notice) =>
          notice._id === response._id ? response : notice,
        );
        setNotices(updatedNotices);
        setIsEditModalOpen(false);
        setEditingNotice(null);
        setEditNoticeId(null);
        resetForm();
      }
    } catch (err) {
      console.error("Error updating notice:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Failed to update notice.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectNoticeId = (noticeId: string) => {
    setEditNoticeId(noticeId);
    const selectedNotice = notices.find((notice) => notice._id === noticeId);
    if (selectedNotice) {
      setEditingNotice(selectedNotice);
      loadFormData(selectedNotice);
      setIsEditModalOpen(true);
      setIsCreateModalOpen(false);
    }
  };

  /**---> PUBLISH NOTICE HANDLER --->*/
  const handlePublishNotice = async (noticeId: string) => {
    const result = await confirmPublish();

    if (!result.isConfirmed) return;

    try {
      const noticeToPublish = notices.find((notice) => notice._id === noticeId);
      if (!noticeToPublish) {
        throw new Error("Notice not found.");
      }

      const response = await publishNotice(noticeToPublish._id);
      if (response) {
        showSuccess("Notice published successfully!");
        const updatedNotices = notices.map((notice) =>
          notice._id === response._id ? response : notice,
        );
        setNotices(updatedNotices);
      }
    } catch (err) {
      console.error("Error publishing notice:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Failed to publish notice.",
      );
    } finally {
      setLoading(false);
    }
  };

  /**---> ARCHIVE NOTICE HANDLER --->*/
  const handleArchiveNotice = async (noticeId: string) => {
    const result = await confirmArchive();

    if (!result.isConfirmed) return;

    try {
      const noticeToArchive = notices.find((notice) => notice._id === noticeId);

      if (!noticeToArchive) {
        throw new Error("Notice not found.");
      }
      const response = await archiveNotice(noticeToArchive._id);

      if (response) {
        showSuccess("Notice archived successfully!");
        const updatedNotices = notices.map((notice) =>
          notice._id === response._id ? response : notice,
        );
        setNotices(updatedNotices);
      }
    } catch (err) {
      console.error("Error archiving notice:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Failed to archive notice.",
      );
    }
  };

  /**---> OPEN WITHDRAW NOTICE MODAL --->*/
  const handleOpenWithdrawModal = (noticeId: string) => {
    setWithdrawNoticeId(noticeId);
    setWithdrawalReason("");
    setWithdrawError(null);
    setIsWithdrawModalOpen(true);
  };

  /**---> CLOSE WITHDRAW NOTICE MODAL --->*/
  const handleCloseWithdrawModal = () => {
    if (withdrawing) return;

    setIsWithdrawModalOpen(false);
    setWithdrawNoticeId(null);
    setWithdrawalReason("");
    setWithdrawError(null);
  };

  /**---> WITHDRAW NOTICE HANDLER --->*/
  const handleWithdrawNotice = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!withdrawNoticeId) return;

    const reason = withdrawalReason.trim();

    if (!reason) {
      setWithdrawError("Please provide a withdrawal reason.");
      return;
    }

    setWithdrawing(true);
    setWithdrawError(null);

    try {
      const response = await withdrawNotice(withdrawNoticeId, {
        withdrawalReason: reason,
      });

      if (response) {
        setNotices((previous) =>
          previous.map((notice) =>
            notice._id === response._id ? response : notice,
          ),
        );

        showSuccess("Notice withdrawn successfully!");
        handleCloseWithdrawModal();
      }
    } catch (err) {
      console.error("Error withdrawing notice:", err);

      setWithdrawError(
        err instanceof Error ? err.message : "Failed to withdraw notice.",
      );
    } finally {
      setWithdrawing(false);
    }
  };

  /**---> DELETE NOTICE HANDLER --->*/
  const handleDeleteNotice = async (noticeId: string) => {
    const result = await confirmDelete();
    if (!result.isConfirmed) return;

    try {
      const noticeToDelete = notices.find((notice) => notice._id === noticeId);
      if (!noticeToDelete) {
        throw new Error("Notice not found.");
      }
      const response = await deleteNotice(noticeToDelete._id);

      if (response) {
        showSuccess("Notice deleted successfully!");
        const updatedNotices = notices.filter(
          (notice) => notice._id !== response._id,
        );
        setNotices(updatedNotices);
      }
    } catch (err) {
      console.error("Error deleting notice:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Failed to delete notice.",
      );
    }
  };

  /**===============================================
   * FILES / MEDIA DEALING HANDLERS
   *
   * @param files
   **===============================================*/

  // Handle Incoming / newly added files
  const handleFiles = (files: FileList | File[]) => {
    const incomingFiles = Array.from(files);

    setSelectedFiles((previousFiles) => {
      const newFiles = incomingFiles.filter(
        (newFile) =>
          !previousFiles.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size &&
              existingFile.lastModified === newFile.lastModified,
          ),
      );

      return [...previousFiles, ...newFiles];
    });
  };

  // File removal handler
  const handleRemoveFile = (index: number) => {
    setSelectedFiles((previousFiles) =>
      previousFiles.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  // File input handler
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      handleFiles(event.target.files);
    }

    event.target.value = "";
  };

  const handleRemoveExistingAttachment = (publicId: string) => {
    setExistingAttachments((previousAttachments) =>
      previousAttachments.filter(
        (attachment) => attachment.publicId !== publicId,
      ),
    );
  };

  const categoryOptions = [
    { value: "GENERAL", label: "General" },
    { value: "ACADEMIC", label: "Academic" },
    { value: "EXAMINATION", label: "Examination" },
    { value: "ADMISSION", label: "Admission" },
    { value: "MEETING", label: "Meeting" },
    { value: "EVENT", label: "Event" },
    { value: "EMERGENCY", label: "Emergency" },
  ];

  const audienceOptions = [
    { value: "GENERAL", label: "General" },
    { value: "STUDENTS", label: "Students" },
    { value: "TEACHERS", label: "Teachers" },
    { value: "STAFF", label: "Staff" },
    { value: "GUARDIANS", label: "Guardians" },
    { value: "CLASS", label: "Class" },
  ];

  const getStatusStyle = (status: Notice["status"]) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-700";
      case "APPROVED":
        return "bg-blue-100 text-blue-700";
      case "PENDING_APPROVAL":
        return "bg-yellow-100 text-yellow-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "ARCHIVED":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /**---> LOADING STATUS & ERROR MESSAGES --->*/
  if (loading || error) return <DataState loading={loading} error={error} />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notice Management"
        description="Create, manage, and publish institutional notices."
        actions={
          <div className="lg:flex flex-1 grid items-center gap-2">
            <div className="aura text-emerald-600">
              <div className="card bg-base-100 text-base-content">
                <div className="card-body p-0.5">
                  <h3 className="lg:text-lg text-medium font-bold border border-gray-300 py-0.5 px-2 rounded-md bg-base-100 flex items-center gap-2">
                    <span>
                      <LucideIcon.List size={16} />
                    </span>{" "}
                    Notices:
                    {/* {showDeleted
                      ? "Deleted Students List"
                      : "Regular Students List"}{" "} */}
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-xs text-white font-thin">
                      {dataLength}
                    </span>
                  </h3>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              icon={LucideIcon.UploadCloudIcon}
              size="xs"
            >
              Create Notice
            </Button>
          </div>
        }
      />

      {/* ---> SEARCH FILTERS ---> */}
      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full"
          />

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="PUBLISHED">Published</option>
            <option value="REJECTED">Rejected</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">All Categories</option>
            <option value="GENERAL">General</option>
            <option value="ACADEMIC">Academic</option>
            <option value="EXAMINATION">Examination</option>
            <option value="ADMISSION">Admission</option>
            <option value="MEETING">Meeting</option>
            <option value="EVENT">Event</option>
            <option value="EMERGENCY">Emergency</option>
          </select>

          {/* Audience */}
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">All Audiences</option>
            <option value="GENERAL">General</option>
            <option value="STUDENTS">Students</option>
            <option value="TEACHERS">Teachers</option>
            <option value="STAFF">Staff</option>
            <option value="GUARDIANS">Guardians</option>
            <option value="CLASS">Class</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredNotices.length} of {notices.length} notices
          </p>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setCategoryFilter("");
              setAudienceFilter("");
            }}
            className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
          >
            <LucideFilter size={14} /> Clear filters
          </button>
        </div>
      </Card>

      {notices.length === 0 ? (
        <Card>
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-semibold">No notices found</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no notices to display.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {paginatedData.map((notice) => (
            <Card key={notice._id}>
              <div className="flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {notice.category}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      notice.status,
                    )}`}
                  >
                    {notice.status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {notice.title}
                  </h3>

                  <p className="line-clamp-4 text-sm leading-6 text-gray-600">
                    {notice.content}
                  </p>

                  {notice.status === "WITHDRAWN" && notice.withdrawalReason && (
                    <div className="rounded-md border border-orange-200 bg-orange-50 p-2">
                      <p className="text-xs font-semibold text-orange-700">
                        Withdrawal Reason
                      </p>
                      <p className="mt-1 text-sm text-orange-800">
                        {notice.withdrawalReason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-2 border-t border-gray-200 pt-4 text-sm text-gray-500">
                  <div className="lg:flex flex-1 grid items-center justify-between lg:gap-4 gap-6">
                    <div className="lg:border-r border-gray-300 pr-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>Audience: {notice.audience}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        <span>
                          {notice.createdAt
                            ? new Date(notice.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span>{notice.attachments.length} attachment(s)</span>
                      </div>
                    </div>

                    <div className="flex flex-1 items-center lg:justify-end justify-start lg:gap-1 gap-4">
                      {(notice.status === "WITHDRAWN" ||
                        notice.status === "DRAFT") && (
                        <Button
                          size="xs"
                          variant="primary"
                          icon={LucideIcon.Edit}
                          onClick={() => handleSelectNoticeId(notice._id)}
                          title="Edit Notice"
                        >
                          <span className="sr-only">Edit</span>
                        </Button>
                      )}

                      {(notice.status === "DRAFT" ||
                        notice.status === "WITHDRAWN") && (
                        <Button
                          size="xs"
                          variant="success"
                          icon={LucideIcon.Check}
                          onClick={() => handlePublishNotice(notice._id)}
                          title="Publish Notice"
                        >
                          <span className="sr-only">Publish</span>
                        </Button>
                      )}

                      <Button
                        size="xs"
                        variant="base"
                        icon={LucideIcon.Archive}
                        onClick={() => handleArchiveNotice(notice._id)}
                        title="Archive Notice"
                      >
                        <span className="sr-only">Archive</span>
                      </Button>

                      {notice.status === "PUBLISHED" && (
                        <Button
                          size="xs"
                          variant="warning"
                          icon={LucideIcon.BanknoteArrowDown}
                          onClick={() => handleOpenWithdrawModal(notice._id)}
                          title="Withdraw Notice"
                        >
                          <span className="sr-only">Withdraw</span>
                        </Button>
                      )}

                      <Button
                        size="xs"
                        variant="danger"
                        icon={LucideIcon.Trash2}
                        onClick={() => handleDeleteNotice(notice._id)}
                        title="Delete Notice"
                      >
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ----> PAGINATION READER ---->*/}
      <div className="lg:my-8 my-4">
        <Pagination
          items={filteredNotices}
          dataLength={dataLength}
          onPaginatedDataChange={setPaginatedData}
        />
      </div>

      {/* Create Notice Modal */}
      <Modal
        isOpen={modalOpenToggler}
        onClose={closeCreateModal}
        title={`${editingNotice ? "Edit Notice" : "Create Notice"}`}
        className="max-w-2xl"
      >
        <form onSubmit={handleCreateNotice} className="space-y-2">
          <Input
            label="Notice Title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter notice title"
            required
            maxLength={200}
          />

          <Textarea
            label="Notice Content"
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write the notice content..."
            rows={6}
            required
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Category"
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              options={categoryOptions}
            />

            <Select
              label="Audience"
              name="audience"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
              options={audienceOptions}
            />
          </div>

          {/* Class-specific target fields */}
          {audience === NOTICE_AUDIENCE.CLASS && (
            <div className="space-y-3 rounded-lg border border-base-content/15 p-3">
              <h3 className="font-semibold text-sm">
                Class Target Information
              </h3>

              <Input
                label="Academic Session"
                name="academicSession"
                value={academicSession}
                onChange={(event) => setAcademicSession(event.target.value)}
                placeholder="e.g. 2026"
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Input
                  label="Class"
                  name="className"
                  value={className}
                  onChange={(event) => setClassName(event.target.value)}
                  placeholder="e.g. Class 10"
                />

                <Input
                  label="Group"
                  name="group"
                  value={group}
                  onChange={(event) => setGroup(event.target.value)}
                  placeholder="e.g. Science"
                />

                <Input
                  label="Section"
                  name="section"
                  value={section}
                  onChange={(event) => setSection(event.target.value)}
                  placeholder="e.g. A"
                />
              </div>
            </div>
          )}

          <Input
            label="Expiry Date (Optional)"
            name="expiresAt"
            type="datetime-local"
            value={expiresAt}
            onChange={(event) => setExpiresAt(event.target.value)}
          />

          {submitError && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {submitError}
            </p>
          )}

          {/* Display Existing attachments */}
          {existingAttachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Existing Attachments
              </p>

              {existingAttachments.map((attachment) => (
                <div
                  key={attachment.publicId}
                  className="flex items-center justify-between gap-3 rounded-md border border-gray-300 p-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {attachment.resourceType === "image" ? (
                      <img
                        src={attachment.url}
                        alt="Notice attachment"
                        className="h-12 w-12 rounded object-cover lg:hover:scale-150"
                      />
                    ) : (
                      <FileText className="h-8 w-8 text-gray-500" />
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {attachment.publicId.split("/").pop()}
                      </p>

                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View attachment
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveExistingAttachment(attachment.publicId)
                    }
                    className="text-sm font-medium flex items-center gap-1 text-red-600 hover:text-base-100 border border-red-200 py-0.5 px-1 rounded-md shadow hover:bg-red-600"
                  >
                    <LucideIcon.XCircle size={14} /> Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ---> NOTICE ATTACHMENTS File / Media Handling Input---> */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Attachments</label>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFiles(event.dataTransfer.files);
              }}
              onClick={() => document.getElementById("notice-files")?.click()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <input
                id="notice-files"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />

              <p className="font-medium text-gray-700">
                Drag and drop files here
              </p>

              <p className="mt-1 text-sm text-gray-500">
                or click to browse files
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-gray-300 p-3"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={
                            file ? URL.createObjectURL(file) : file || "Avatar"
                          }
                          alt="Student preview"
                          className="h-12 w-12 rounded-lg border border-gray-300 object-cover lg:hover:scale-150"
                        />
                      ) : (
                        <FileText className="h-8 w-8 text-gray-500" />
                      )}

                      <p className="truncate text-sm font-medium">
                        {file.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-sm font-medium flex items-center gap-1 text-red-600 hover:text-base-100 border border-red-200 py-0.5 px-1 rounded-md shadow hover:bg-red-600"
                    >
                      <LucideIcon.XCircle size={14} /> Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-base-content/15 pt-4">
            <Button
              type="button"
              size="xs"
              variant="warning"
              onClick={closeCreateModal}
              disabled={submitting}
              icon={LucideIcon.XCircle}
            >
              Cancel
            </Button>

            {!editNoticeId && (
              <Button
                type="submit"
                size="xs"
                variant="success"
                loading={submitting}
                icon={LucideIcon.UploadCloudIcon}
              >
                Create Notice
              </Button>
            )}

            {editNoticeId && (
              <Button
                type="submit"
                size="xs"
                variant="primary"
                onClick={() => handleEditNotice(editingNotice)}
                disabled={submitting}
                icon={LucideIcon.Edit}
                loading={submitting}
              >
                Edit Notice
              </Button>
            )}
          </div>
        </form>
      </Modal>

      {/* Withdraw Notice Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={handleCloseWithdrawModal}
        title="Withdraw Published Notice"
        className="max-w-xl"
      >
        <form onSubmit={handleWithdrawNotice} className="space-y-4">
          <div className="rounded-md border border-orange-200 bg-orange-50 p-3">
            <p className="text-sm text-orange-800">
              Withdrawing this notice will revoke its published status. The
              notice and its publication history will be retained.
            </p>
          </div>

          <Textarea
            label="Reason for Withdrawal"
            name="withdrawalReason"
            value={withdrawalReason}
            onChange={(event) => setWithdrawalReason(event.target.value)}
            placeholder="Explain why this notice is being withdrawn..."
            rows={4}
            required
          />

          {withdrawError && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {withdrawError}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-base-content/15 pt-4">
            <Button
              type="button"
              size="xs"
              variant="secondary"
              onClick={handleCloseWithdrawModal}
              disabled={withdrawing}
              icon={LucideIcon.XCircle}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="xs"
              variant="warning"
              loading={withdrawing}
              disabled={!withdrawalReason.trim()}
              icon={LucideIcon.XCircle}
            >
              Withdraw Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoticeManagement;
