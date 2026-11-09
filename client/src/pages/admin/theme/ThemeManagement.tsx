import { useMemo, useState } from "react";
import QueryStateHandler from "../../../components/ui/QueryStateHandler";
import { useAdminThemes } from "../../../hooks/theme/useAdminThemes";
import DataTable, {
  type DataTableColumn,
} from "../../../components/ui/DataTable";
import PageHeader from "../../../components/ui/PageHeader";
import { LucideIcon } from "../../../components/ui/LucideIcons";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import { normalizeDate } from "../../../helpers/NormalizeDate";
import ThemeForm from "./ThemeForm";
import { confirmDelete, showError } from "../../../utils/alert";
import { useApiMutation } from "../../../hooks/theme/useApiMutation";

const ThemeManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // View related states
  const [selectedTheme, setSelectedTheme] = useState<
    NonNullable<typeof themes>[number] | null
  >(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // Edit theme state
  const [selectedEditingTheme, setSelectedEditingTheme] = useState<
    NonNullable<typeof themes>[number] | null
  >(null);

  // Form toggler state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(true);

  // Fetches themes data
  const {
    data: themes,
    isLoading,
    isPending,
    isError,
    error,
  } = useAdminThemes();

  const themeDeleteMutation = useApiMutation({
    method: "delete",
    key: ["themes", "admin"],
  });

  const filteredThemes = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    if (!search) return themes ?? [];

    return (themes ?? []).filter((theme) =>
      [theme.name, theme.slug, theme.description].some((value) =>
        value?.toLowerCase().includes(search),
      ),
    );
  }, [themes, searchQuery]);

  // View related handlers
  const handleViewTheme = (themeId: string) => {
    const themeSelected = themes?.find((theme) => theme._id === themeId);
    setSelectedTheme(themeSelected ?? null);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTheme(null);
  };

  // Create form toggler
  const createThemeFormHandler = () => {
    setIsFormOpen((prev) => !prev);
    setIsTableOpen((prev) => !prev);
    setSelectedEditingTheme(null);
  };

  // Editing theme handler
  const handleSelectEditingTheme = (editThemeId: string | number) => {
    const editingTheme = themes?.find((theme) => theme._id === editThemeId);
    setSelectedEditingTheme(editingTheme ?? null);
    setIsTableOpen(false);
    setIsFormOpen(true);
  };

  const handleCancelThemeForm = () => {
    setSelectedEditingTheme(null);
    setIsFormOpen(false);
    setIsTableOpen(true);
  };

  // DELETE HANDLER
  const handleDeleteTheme = async (deleteId: string) => {
    try {
      const confirmed = await confirmDelete();
      if (!confirmed.isConfirmed) return;
      await themeDeleteMutation.mutateAsync({ id: deleteId });
    } catch (error) {
      showError("Encountered error!");
      console.error(error);
    }
  };

  const columns: DataTableColumn<NonNullable<typeof themes>[number]>[] = [
    {
      header: "Theme",
      cell: (theme) => (
        <div className="flex items-center gap-3">
          <img
            src={theme.preview.url}
            alt={theme.name}
            className="h-12 w-20 rounded object-cover"
          />
          <div>
            <p className="font-semibold">{theme.name}</p>
            <p className="text-xs text-base-content/50">{theme.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Status",
      cell: (theme) => (
        <span
          className={
            theme.isActive
              ? "text-green-600 font-medium"
              : "text-red-500 font-medium"
          }
        >
          {theme.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const renderActions = (theme: NonNullable<typeof themes>[number]) => (
    <>
      <Button
        size="xs"
        variant="success"
        icon={LucideIcon.Eye}
        onClick={() => handleViewTheme(theme._id)}
      >
        View
      </Button>

      <Button
        size="xs"
        variant="primary"
        icon={LucideIcon.Edit}
        onClick={() => handleSelectEditingTheme(theme._id)}
      >
        Edit
      </Button>

      <Button
        size="xs"
        variant="danger"
        icon={LucideIcon.Trash2}
        onClick={() => handleDeleteTheme(theme._id)}
      >
        Delete
      </Button>
    </>
  );

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isPending={isPending}
      isError={isError}
      error={error}
      loadingMessage="Loading themes..."
    >
      <PageHeader
        title="Theme Management"
        description="Create, edit, preview, and manage institutional homepage themes."
        actions={
          <div className="lg:flex flex-1 grid items-center gap-2">
            <div className="aura text-emerald-600">
              <div className="card bg-base-100 text-base-content">
                <div className="card-body p-0.5">
                  <h3 className="flex items-center gap-2 rounded-md border border-gray-300 bg-base-100 px-2 py-1 text-sm font-bold lg:text-lg">
                    <LucideIcon.List size={16} />
                    Themes:
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-medium text-white">
                      {themes?.length ?? 0}
                    </span>
                  </h3>
                </div>
              </div>
            </div>
            <Button
              onClick={createThemeFormHandler}
              icon={isFormOpen ? LucideIcon.Eye : LucideIcon.UploadCloudIcon}
              size="xs"
            >
              {isFormOpen ? "Back to Themes" : "Create Theme"}
            </Button>
          </div>
        }
      />

      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Theme Details"
      >
        <div className="space-y-2">
          {/* Theme Image */}
          <div className="">
            <figure>
              <img
                src={selectedTheme?.preview ? selectedTheme?.preview?.url : ""}
                alt={selectedTheme?.name}
                className="h-auto object-contain bg-center w-full rounded-md"
              />
              <figcaption>THEME IMAGE PREVIEW</figcaption>
            </figure>
          </div>

          {/* 1. Theme details info */}
          <div className="flex flex-1 items-center gap-2 justify-between border-b border-gray-300 pb-1">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-1">
              <LucideIcon.Image /> {selectedTheme?.name ?? ""} Theme
            </h2>
            <Badge color={`${selectedTheme?.isActive ? "blue" : "red"}`}>
              {selectedTheme?.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="text-sm">
            <p>{selectedTheme?.description ?? ""}</p>
          </div>
          {/* 2. Basic Info */}
          <div className="">
            <h2 className="font-bold text-gray-700 border-b border-gray-300 pb-1">
              1. Basic Information
            </h2>
            <div className="flex flex-1 justify-between gap-8">
              <div className="">
                <p className="flex items-center gap-1 text-sm">
                  <LucideIcon.CheckCircle size={14} /> Name:
                </p>
                <p className="flex items-center gap-1 text-sm">
                  <LucideIcon.CheckCircle size={14} /> Slug:
                </p>
                <p className="flex items-center gap-1 text-sm">
                  <LucideIcon.CheckCircle size={14} /> Description:
                </p>
                <p className="flex items-center gap-1 text-sm">
                  <LucideIcon.CheckCircle size={14} /> Status:
                </p>
              </div>
              <div className="">
                <p className="text-sm">{selectedTheme?.name ?? ""}</p>
                <p className="text-sm">{selectedTheme?.slug ?? ""}</p>
                <p className="text-sm line-clamp-1">
                  {selectedTheme?.description ?? ""}
                </p>
                <p className="text-sm line-clamp-1">
                  {selectedTheme?.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Colors */}
          <div className="space-y-2">
            <h2 className="font-bold text-gray-700 border-b border-gray-300 pb-1">
              2. Colors
            </h2>

            <div className="grid lg:grid-cols-4 grid-cols-3 justify-between gap-2">
              <div className="">
                <div
                  className="border border-gray-300 shadow p-2 rounded-sm mb-0.5"
                  style={{
                    backgroundColor:
                      selectedTheme?.config?.colors?.primary ?? "",
                  }}
                ></div>
                <p className="text-sm flex items-center gap-2">
                  <LucideIcon.CheckCircle size={14} /> Primary:
                </p>
                <p className="text-xs items-center gap-2">
                  {selectedTheme?.config?.colors?.primary ?? ""}
                </p>
              </div>
              <div className="">
                <div
                  className="border border-gray-300 shadow p-2 rounded-sm mb-0.5"
                  style={{
                    backgroundColor:
                      selectedTheme?.config?.colors?.secondary ?? "",
                  }}
                ></div>
                <p className="text-sm flex items-center gap-2">
                  <LucideIcon.CheckCircle size={14} /> Secondary:
                </p>
                <p className="text-xs flex items-center gap-2">
                  {selectedTheme?.config?.colors?.secondary ?? ""}
                </p>
              </div>
              <div className="">
                <div
                  className="border border-gray-300 shadow p-2 rounded-sm mb-0.5"
                  style={{
                    backgroundColor:
                      selectedTheme?.config?.colors?.accent ?? "",
                  }}
                ></div>
                <p className="text-sm flex items-center gap-2">
                  <LucideIcon.CheckCircle size={14} /> Accent:
                </p>
                <p className="text-xs flex items-center gap-2">
                  {selectedTheme?.config?.colors?.accent ?? ""}
                </p>
              </div>
              <div className="">
                <div
                  className="border border-gray-300 shadow p-2 rounded-sm mb-0.5"
                  style={{
                    backgroundColor:
                      selectedTheme?.config?.colors?.background ?? "",
                  }}
                ></div>
                <p className="text-sm flex items-center gap-2">
                  <LucideIcon.CheckCircle size={14} /> Background:
                </p>
                <p className="text-xs flex items-center gap-2">
                  {selectedTheme?.config?.colors?.background ?? ""}
                </p>
              </div>
              <div className="">
                <div
                  className="border border-gray-300 shadow p-2 rounded-sm mb-0.5"
                  style={{
                    backgroundColor:
                      selectedTheme?.config?.colors?.surface ?? "",
                  }}
                ></div>
                <p className="text-sm flex items-center gap-2">
                  <LucideIcon.CheckCircle size={14} /> Surface:
                </p>
                <p className="text-xs flex items-center gap-2">
                  {selectedTheme?.config?.colors?.surface ?? ""}
                </p>
              </div>
              <div className="">
                <div
                  className="border border-gray-300 shadow p-2 rounded-sm mb-0.5"
                  style={{
                    backgroundColor: selectedTheme?.config?.colors?.text ?? "",
                  }}
                ></div>
                <p className="text-sm flex items-center gap-2">
                  <LucideIcon.CheckCircle size={14} /> Text:
                </p>
                <p className="text-xs flex items-center gap-2">
                  {selectedTheme?.config?.colors?.text ?? ""}
                </p>
              </div>
              <div className="">
                <div
                  className="border border-gray-300 shadow p-2 rounded-sm mb-0.5"
                  style={{
                    backgroundColor: selectedTheme?.config?.colors?.muted ?? "",
                  }}
                ></div>
                <p className="text-sm flex items-center gap-2">
                  <LucideIcon.CheckCircle size={14} /> Muted:
                </p>
                <p className="text-xs flex items-center gap-2">
                  {selectedTheme?.config?.colors?.muted ?? ""}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Typography */}
          <div className="">
            <h2 className="font-bold text-gray-700 border-b border-gray-300 pb-1">
              3. Typography
            </h2>
            <div className="flex flex-1 justify-between gap-8 space-y-1">
              <div className="space-y-1">
                <p className="lg:text-sm text-xs flex items-center gap-1 font-bold">
                  <LucideIcon.CheckCircle size={14} /> Heading Font:
                </p>
                <p className="lg:text-sm text-xs flex items-center gap-1 font-bold">
                  <LucideIcon.CheckCircle size={14} /> Body Font:
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  {selectedTheme?.config?.typography?.headingFont ?? ""}
                </p>
                <p className="text-sm">
                  {selectedTheme?.config?.typography?.bodyFont ?? ""}
                </p>
              </div>
            </div>
          </div>

          {/* 5.  Layout Configuration */}
          <div className="space-y-1">
            <h2 className="font-bold text-gray-700 border-b border-gray-300 pb-1">
              4. Layout Configuration
            </h2>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <p className="lg:text-sm text-xs flex items-center gap-1">
                  <span className="lg:text-sm text-xs">
                    <span className="lg:text-sm text-xs font-bold">
                      • Header:{" "}
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.header?.layout ?? ""} ,
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.header
                        ?.showInstitutionName
                        ? "name"
                        : ""}
                      ,
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.header?.showLogo
                        ? "logo"
                        : ""}
                      ,
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.header?.showTopBar
                        ? "top bar"
                        : ""}
                      ,
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.header?.sticky
                        ? "sticky"
                        : "not sticky"}
                    </span>
                  </span>
                </p>
              </div>
              <div className="grid lg:grid-cols-1 gap-2">
                <p className="text-sm flex items-center gap-1">
                  <span className="lg:text-sm text-xs font-bold">• Hero:</span>
                  <span className="lg:text-sm text-xs">
                    <span>
                      {selectedTheme?.config?.layout?.hero?.layout ?? ""},
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.hero?.showHero
                        ? "hero"
                        : "no hero"}
                      ,
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.hero?.showPrimaryButton
                        ? "primary btn"
                        : "no primary btn"}
                      ,
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.hero?.showSecondaryButton
                        ? "secondary btn"
                        : "no secondary btn"}
                      ,
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.hero?.showSubtitle
                        ? "subtitle"
                        : "no subtitle"}
                    </span>
                  </span>
                </p>
              </div>
              <div className="grid lg:grid-cols-1 gap-2">
                <p className="lg:text-sm text-xs flex items-center gap-1">
                  <span className="lg:text-sm text-xs font-bold">
                    • Slider:{" "}
                  </span>
                  <span>
                    {selectedTheme?.config?.layout?.slider?.autoplay
                      ? "auto play"
                      : "no auto play"}
                    ,
                  </span>
                  <span>
                    {selectedTheme?.config?.layout?.slider?.enabled
                      ? "slider"
                      : "no slider"}
                    ,
                  </span>
                  <span>
                    Interval{" "}
                    {selectedTheme?.config?.layout?.slider?.interval
                      ? selectedTheme?.config?.layout?.slider?.interval
                      : "no interval"}
                  </span>
                </p>
              </div>
              <div className="">
                <div className="inline-flex flex-1 items-center gap-1 line-clamp-2">
                  <span className="lg:text-sm text-xs font-bold">
                    • Slides:{" "}
                  </span>
                  <p className="lg:text-sm text-xs flex items-center">
                    {selectedTheme?.config?.layout?.slider?.slides
                      ? selectedTheme?.config?.layout?.slider?.slides
                          ?.slice(0, 1)
                          ?.map((slide, index) => (
                            <span key={index}>
                              <span>{slide?.image ? "image" : "no image"}</span>
                              ,{" "}
                              <span>
                                {slide?.primaryButtonLink
                                  ? "btn link"
                                  : "no btn link"}
                              </span>
                              ,{" "}
                              <span>
                                {slide?.secondaryButtonLink
                                  ? "sec btn link"
                                  : "no sec btn link"}
                              </span>
                              ,{" "}
                              <span>
                                {slide?.subtitle ? "sub title" : "no sub title"}
                              </span>
                              ,{" "}
                              <span>
                                {slide?.title ? "title" : "no title"}
                              </span>{" "}
                            </span>
                          ))
                      : "no section configured"}
                  </p>
                </div>
              </div>
              <p className="flex items-center gap-1">
                <span className="lg:text-sm text-xs font-bold">
                  • Sections:
                </span>
                <span className="lg:text-sm text-xs">
                  {selectedTheme?.config?.layout?.sections
                    ? selectedTheme?.config?.layout?.sections
                        ?.slice(0, 1)
                        ?.map((sec, index) => (
                          <span key={index}>
                            <span>
                              {sec?.enabled ? "section" : "no section"}
                            </span>
                            , <span>{sec?.key ? "key" : "no key"}</span>,{" "}
                            <span>{sec?.layout ? "layout" : "no layout"}</span>,{" "}
                            <span>{sec?.order ? "order" : "no order"}</span>,{" "}
                            <span>{sec?.title ? "title" : "no title"}</span>
                          </span>
                        ))
                    : "no section configured"}
                </span>
              </p>
              <div className="">
                <p className="flex items-center gap-1">
                  <span className="lg:text-sm text-xs font-bold">
                    • Footer:{" "}
                  </span>
                  <span className="lg:text-sm text-xs">
                    <span>
                      {selectedTheme?.config?.layout?.footer?.layout ?? ""},
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.footer?.showContactInfo
                        ? "Contact Info"
                        : "no Contact Info"}
                      ,
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.footer?.showLogo
                        ? "logo"
                        : "no logo"}
                      ,
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.footer?.showQuickLinks
                        ? "quick link"
                        : "no quick link"}
                      ,
                    </span>
                    <span>
                      {selectedTheme?.config?.layout?.footer?.showSocialLinks
                        ? "social link"
                        : "no social link"}
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 6. Theme Metadata */}
          <div className="space-y-1">
            <h2 className="font-bold text-gray-700 border-b border-gray-300 pb-1">
              5. Theme Metadata
            </h2>
            <div className="space-y-0.5">
              <p className="lg:text-sm text-xs flex font-bold text-gray-600 items-center justify-between gap-2">
                <span className="flex items-center gap-1">
                  <LucideIcon.CalendarClock size={14} />
                  Created At: {normalizeDate(selectedTheme?.createdAt ?? "")}
                </span>
              </p>
              <p className="lg:text-sm text-xs flex font-bold text-gray-600 items-center justify-between gap-2">
                <span className="flex items-center gap-1">
                  <LucideIcon.CalendarClock size={14} />
                  Last Updated At:{" "}
                  {normalizeDate(selectedTheme?.updatedAt ?? "")}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end py-2">
          <Button
            size="xs"
            variant="danger"
            icon={LucideIcon.XCircle}
            onClick={handleCloseViewModal}
            title="Close Modal"
          >
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </Modal>

      {(isFormOpen || selectedEditingTheme) && (
        <ThemeForm
          onCancel={handleCancelThemeForm}
          theme={selectedEditingTheme ?? undefined}
        />
      )}

      {isTableOpen && (
        <DataTable
          data={filteredThemes}
          columns={columns}
          getRowId={(theme) => theme._id}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search themes..."
          emptyMessage="No themes found."
          actions={renderActions}
        />
      )}
    </QueryStateHandler>
  );
};

export default ThemeManagement;
