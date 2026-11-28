import { useEffect, useState, type FormEvent } from "react";

import {
  uploadAdmissionInstructionMedia,
  type IAdmissionAttachment,
  type IAdmissionFAQ,
  type IAdmissionInstructionSection,
  type IAdmissionInstructions,
  type CreateAdmissionInstructionsPayload,
} from "../../../../features/admissionInstructionsApiService/admissionInstructionsApiService.js";
import Button from "../../../../components/ui/Button.js";
import { LucideIcon } from "../../../../components/ui/LucideIcons.js";

interface AdmissionInstructionProps {
  initialData?: IAdmissionInstructions | null;
  submitting: boolean;
  onSubmit: (payload: CreateAdmissionInstructionsPayload) => Promise<void>;
  onCancel: () => void;
}

type SectionForm = Omit<IAdmissionInstructionSection, "_id"> & {
  _id?: string;
  newFiles: File[];
};

type FAQForm = Omit<IAdmissionFAQ, "_id"> & {
  _id?: string;
};

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const createEmptySection = (): SectionForm => ({
  title: "",
  content: "",
  attachment: [],
  newFiles: [],
  order: 0,
  isVisible: true,
});

const createEmptyFAQ = (): FAQForm => ({
  question: "",
  answer: "",
  order: 0,
  isVisible: true,
});

const isSameFile = (first: File, second: File) =>
  first.name === second.name &&
  first.size === second.size &&
  first.lastModified === second.lastModified;

const AdmissionInstructionsForm = ({
  initialData,
  submitting,
  onSubmit,
  onCancel,
}: AdmissionInstructionProps) => {
  const [title, setTitle] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [introduction, setIntroduction] = useState("");

  const [sections, setSections] = useState<SectionForm[]>([
    createEmptySection(),
  ]);

  const [faqs, setFaqs] = useState<FAQForm[]>([]);

  const [attachments, setAttachments] = useState<IAdmissionAttachment[]>([]);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);

  const [error, setError] = useState("");

  // ================================================
  // INITIALIZE FORM
  // ================================================

  useEffect(() => {
    if (!initialData) {
      setTitle("");
      setAcademicSession("");
      setIntroduction("");
      setSections([createEmptySection()]);
      setFaqs([]);
      setAttachments([]);
      setNewAttachments([]);
      setError("");
      return;
    }

    setTitle(initialData.title || "");
    setAcademicSession(initialData.academicSession || "");
    setIntroduction(initialData.introduction || "");

    setSections(
      initialData.sections?.length
        ? initialData.sections.map((section) => ({
            ...section,
            attachment: section.attachment || [],
            newFiles: [],
          }))
        : [createEmptySection()],
    );

    setFaqs(
      initialData.faqs?.map((faq) => ({
        ...faq,
      })) || [],
    );

    setAttachments(initialData.attachments || []);
    setNewAttachments([]);
    setError("");
  }, [initialData]);

  // ================================================
  // FILE HELPERS
  // ================================================

  const getNewFileCount = () =>
    newAttachments.length +
    sections.reduce((total, section) => total + section.newFiles.length, 0);

  const validateFiles = (files: File[]) => {
    const validFiles: File[] = [];

    for (const file of files) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(`${file.name}: Unsupported file type.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name}: Maximum file size is 5 MB.`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const removeNewGeneralFile = (fileIndex: number) => {
    setNewAttachments((previous) =>
      previous.filter((_, index) => index !== fileIndex),
    );
  };

  const removeExistingGeneralFile = (publicId: string) => {
    setAttachments((previous) =>
      previous.filter((file) => file.publicId !== publicId),
    );
  };

  // ================================================
  // BASIC INFORMATION
  // ================================================

  // Basic information is controlled directly by state.

  // ================================================
  // SECTION HANDLERS
  // ================================================

  const updateSection = (
    index: number,
    field: Exclude<keyof SectionForm, "newFiles">,
    value: string | number | boolean,
  ) => {
    setSections((previous) =>
      previous.map((section, sectionIndex) =>
        sectionIndex === index
          ? {
              ...section,
              [field]: value,
            }
          : section,
      ),
    );
  };

  const addSection = () => {
    setSections((previous) => [
      ...previous,
      {
        ...createEmptySection(),
        order: previous.length,
      },
    ]);
  };

  const removeSection = (index: number) => {
    setSections((previous) =>
      previous
        .filter((_, sectionIndex) => sectionIndex !== index)
        .map((section, sectionIndex) => ({
          ...section,
          order: sectionIndex,
        })),
    );
  };

  const handleSectionFiles = (sectionIndex: number, files: FileList | null) => {
    if (!files?.length) return;

    const validFiles = validateFiles(Array.from(files));

    if (!validFiles.length) return;

    const currentSection = sections[sectionIndex];

    if (!currentSection) return;

    const uniqueNewFiles = validFiles.filter(
      (file) =>
        !currentSection.newFiles.some((existing) => isSameFile(existing, file)),
    );

    const totalAfterSelection = getNewFileCount() + uniqueNewFiles.length;

    if (totalAfterSelection > MAX_FILES) {
      setError(`A maximum of ${MAX_FILES} new files is allowed.`);
      return;
    }

    setSections((previous) =>
      previous.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              newFiles: [...section.newFiles, ...uniqueNewFiles],
            }
          : section,
      ),
    );

    if (validFiles.length === uniqueNewFiles.length) {
      setError("");
    }
  };

  const removeSectionFile = (sectionIndex: number, fileIndex: number) => {
    setSections((previous) =>
      previous.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              newFiles: section.newFiles.filter(
                (_, currentIndex) => currentIndex !== fileIndex,
              ),
            }
          : section,
      ),
    );
  };

  const removeExistingSectionFile = (
    sectionIndex: number,
    publicId: string,
  ) => {
    setSections((previous) =>
      previous.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              attachment: section.attachment.filter(
                (file) => file.publicId !== publicId,
              ),
            }
          : section,
      ),
    );
  };

  // ================================================
  // GENERAL ATTACHMENT HANDLERS
  // ================================================

  const handleGeneralFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const validFiles = validateFiles(Array.from(files));

    if (!validFiles.length) return;

    const uniqueNewFiles = validFiles.filter(
      (file) => !newAttachments.some((existing) => isSameFile(existing, file)),
    );

    const totalAfterSelection = getNewFileCount() + uniqueNewFiles.length;

    if (totalAfterSelection > MAX_FILES) {
      setError(`A maximum of ${MAX_FILES} new files is allowed.`);
      return;
    }

    setNewAttachments((previous) => [...previous, ...uniqueNewFiles]);

    if (validFiles.length === uniqueNewFiles.length) {
      setError("");
    }
  };

  // ================================================
  // FAQ HANDLERS
  // ================================================

  const updateFAQ = (
    index: number,
    field: keyof FAQForm,
    value: string | number | boolean,
  ) => {
    setFaqs((previous) =>
      previous.map((faq, faqIndex) =>
        faqIndex === index
          ? {
              ...faq,
              [field]: value,
            }
          : faq,
      ),
    );
  };

  const addFAQ = () => {
    setFaqs((previous) => [
      ...previous,
      {
        ...createEmptyFAQ(),
        order: previous.length,
      },
    ]);
  };

  const removeFAQ = (index: number) => {
    setFaqs((previous) =>
      previous
        .filter((_, faqIndex) => faqIndex !== index)
        .map((faq, faqIndex) => ({
          ...faq,
          order: faqIndex,
        })),
    );
  };

  // ================================================
  // FORM SUBMISSION
  // ================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    setError("");

    const cleanTitle = title.trim();
    const cleanSession = academicSession.trim();

    if (!cleanTitle || !cleanSession) {
      setError("Title and academic session are required.");
      return;
    }

    const validSections = sections.filter(
      (section) => section.title.trim() && section.content.trim(),
    );

    if (!validSections.length) {
      setError("Please add at least one complete instruction section.");
      return;
    }

    const validFAQs = faqs.filter(
      (faq) => faq.question.trim() && faq.answer.trim(),
    );

    const allNewFiles = [
      ...newAttachments,
      ...validSections.flatMap((section) => section.newFiles),
    ];

    if (allNewFiles.length > MAX_FILES) {
      setError(`A maximum of ${MAX_FILES} new files is allowed.`);
      return;
    }

    try {
      // Upload all newly selected files in one request.

      const uploadedFiles = allNewFiles.length
        ? await uploadAdmissionInstructionMedia(allNewFiles)
        : [];

      if (uploadedFiles.length !== allNewFiles.length) {
        throw new Error("Some files could not be uploaded successfully.");
      }

      // Assign uploaded references to general attachments first.

      const uploadedGeneralAttachments = uploadedFiles.slice(
        0,
        newAttachments.length,
      );

      let fileIndex = newAttachments.length;

      // Assign remaining references to their respective sections.

      const updatedSections = validSections.map((section, index) => {
        const { newFiles, ...sectionData } = section;

        const sectionAttachments = uploadedFiles.slice(
          fileIndex,
          fileIndex + newFiles.length,
        );

        fileIndex += newFiles.length;

        return {
          ...sectionData,
          title: section.title.trim(),
          content: section.content.trim(),
          attachment: [...(section.attachment || []), ...sectionAttachments],
          order: index,
        };
      });

      // Prepare final payload.

      const payload: CreateAdmissionInstructionsPayload = {
        title: cleanTitle,
        academicSession: cleanSession,
        introduction: introduction.trim(),

        sections: updatedSections,

        faqs: validFAQs.map((faq, index) => ({
          ...faq,
          question: faq.question.trim(),
          answer: faq.answer.trim(),
          order: index,
        })),

        attachments: [...attachments, ...uploadedGeneralAttachments],
      };

      await onSubmit(payload);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save admission instructions.",
      );
    }
  };

  // ================================================
  // RENDER
  // ================================================

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* BASIC INFORMATION */}

      <section className="space-y-4 rounded-xl border border-base-content/15 p-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Instructions Title *
          </label>

          <input
            className="input input-bordered w-full"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Admission Instructions for 2027-2028"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Academic Session *
          </label>

          <input
            className="input input-bordered w-full"
            value={academicSession}
            onChange={(event) => setAcademicSession(event.target.value)}
            placeholder="2027-2028"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Introduction</label>

          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            value={introduction}
            onChange={(event) => setIntroduction(event.target.value)}
            placeholder="Write an introduction for applicants..."
          />
        </div>
      </section>

      {/* INSTRUCTION SECTIONS */}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">
            Admission Instruction Sections
          </h3>

          <button
            type="button"
            onClick={addSection}
            className="btn btn-sm btn-outline btn-primary"
          >
            + Add Section
          </button>
        </div>

        {sections.map((section, index) => (
          <div
            key={section._id || `section-${index}`}
            className="space-y-3 rounded-xl border border-base-content/15 p-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Section {index + 1}</h4>

              <button
                type="button"
                onClick={() => removeSection(index)}
                className="btn btn-xs btn-error btn-outline"
                disabled={sections.length === 1}
              >
                Remove Section
              </button>
            </div>

            <input
              className="input input-bordered w-full"
              placeholder="Section title"
              value={section.title}
              onChange={(event) =>
                updateSection(index, "title", event.target.value)
              }
            />

            <textarea
              className="textarea textarea-bordered w-full"
              rows={5}
              placeholder="Write admission instructions..."
              value={section.content}
              onChange={(event) =>
                updateSection(index, "content", event.target.value)
              }
            />

            {/* SECTION ATTACHMENTS */}

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Section Attachments
              </label>

              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="file-input file-input-bordered w-full"
                onChange={(event) => {
                  handleSectionFiles(index, event.target.files);
                  event.target.value = "";
                }}
              />

              {section.newFiles.map((file, fileIndex) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className="flex items-center justify-between gap-3 rounded-md bg-base-200 p-2"
                >
                  <span className="truncate text-sm">{file.name}</span>

                  <button
                    type="button"
                    className="btn btn-xs btn-error btn-outline"
                    onClick={() => removeSectionFile(index, fileIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {section.attachment.length > 0 && (
                <div className="space-y-2 rounded-md bg-base-200 p-3">
                  <p className="text-sm font-medium">
                    Existing Section Attachments
                  </p>

                  {section.attachment.map((file) => (
                    <div
                      key={file.publicId}
                      className="flex items-center justify-between gap-3"
                    >
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-sm text-primary hover:underline"
                      >
                        {file.name}
                      </a>

                      <button
                        type="button"
                        className="btn btn-xs btn-error btn-outline"
                        onClick={() =>
                          removeExistingSectionFile(index, file.publicId)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={section.isVisible}
                onChange={(event) =>
                  updateSection(index, "isVisible", event.target.checked)
                }
              />
              Visible on public admission page
            </label>
          </div>
        ))}
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>

          <button
            type="button"
            onClick={addFAQ}
            className="btn btn-sm btn-outline btn-primary"
          >
            + Add FAQ
          </button>
        </div>

        {faqs.map((faq, index) => (
          <div
            key={faq._id || `faq-${index}`}
            className="space-y-3 rounded-xl border border-base-content/15 p-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">FAQ {index + 1}</h4>

              <button
                type="button"
                onClick={() => removeFAQ(index)}
                className="btn btn-xs btn-error btn-outline"
              >
                Remove
              </button>
            </div>

            <input
              className="input input-bordered w-full"
              placeholder="Question"
              value={faq.question}
              onChange={(event) =>
                updateFAQ(index, "question", event.target.value)
              }
            />

            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Answer"
              value={faq.answer}
              onChange={(event) =>
                updateFAQ(index, "answer", event.target.value)
              }
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={faq.isVisible}
                onChange={(event) =>
                  updateFAQ(index, "isVisible", event.target.checked)
                }
              />
              Visible on public page
            </label>
          </div>
        ))}
      </section>

      {/* GENERAL ATTACHMENTS */}

      <section className="space-y-3 rounded-xl border border-base-content/15 p-4">
        <h3 className="font-semibold">General Attachments</h3>

        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="file-input file-input-bordered w-full"
          onChange={(event) => {
            handleGeneralFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <p className="text-xs text-base-content/60">
          JPEG, PNG, WebP or PDF. Maximum 5 MB per file and 10 new files in
          total.
        </p>

        {newAttachments.map((file, index) => (
          <div
            key={`${file.name}-${file.lastModified}`}
            className="flex items-center justify-between gap-3 rounded-md bg-base-200 p-2"
          >
            <span className="truncate text-sm">{file.name}</span>

            <button
              type="button"
              className="btn btn-xs btn-error btn-outline"
              onClick={() => removeNewGeneralFile(index)}
            >
              Remove
            </button>
          </div>
        ))}

        {attachments.length > 0 && (
          <div className="space-y-2 border-t border-base-content/10 pt-3">
            <p className="text-sm font-medium">Existing General Attachments</p>

            {attachments.map((file) => (
              <div
                key={file.publicId}
                className="flex items-center justify-between gap-3"
              >
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-sm text-primary hover:underline"
                >
                  {file.name}
                </a>

                <button
                  type="button"
                  className="btn btn-xs btn-error btn-outline"
                  onClick={() => removeExistingGeneralFile(file.publicId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ERROR MESSAGE */}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* FORM ACTIONS */}

      <div className="flex sticky bottom-17 flex-wrap justify-end gap-3 border-t border-base-content/10 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          icon={LucideIcon.XCircle}
          variant="warning"
          size="sm"
        >
          Cancel
        </Button>

        <Button type="submit" disabled={submitting} size="sm">
          {submitting ? (
            <LucideIcon.Loader size={16} />
          ) : initialData ? (
            <LucideIcon.Edit size={16} />
          ) : (
            <LucideIcon.UploadCloudIcon size={16} />
          )}
          {submitting
            ? "Saving..."
            : initialData
              ? "Update Instructions"
              : "Create Instructions"}
        </Button>
      </div>
    </form>
  );
};

export default AdmissionInstructionsForm;
