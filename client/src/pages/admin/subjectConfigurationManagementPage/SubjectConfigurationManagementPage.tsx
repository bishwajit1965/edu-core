import { useEffect, useState } from "react";
import {
  createSubjectConfiguration,
  getAllSubjectConfigurations,
  updateSubjectConfiguration,
  deleteSubjectConfiguration,
  type SubjectConfiguration,
  type CreateSubjectConfigurationPayload,
  type ConfiguredSubject,
  type ConfiguredSubjectPayload,
  type SubjectSelectionGroup,
} from "../../../features/subjectConfigurations/subjectConfigurationsApi.js";

import {
  getAllSubjects,
  type Subject,
} from "../../../features/subjectConfigurations/subjectsApi.js";
import PageHeader from "../../../components/ui/PageHeader.js";
import Button from "../../../components/ui/Button.js";

const COMMON_COMPULSORY_CODES = ["BAN", "ENG", "ICT"];

const GROUP_MANDATORY_CODES: Record<string, string[]> = {
  Science: ["PHY", "CHE"],
  "Business Studies": ["ACC", "BOM"],
  Humanities: [],
};

// The two alternatives for the HSC Science third optional subject.
const SCIENCE_THIRD_OPTIONAL_CODES = ["BIO", "HMA"];

// Additional fourth-subject offerings configured by the college.
const SCIENCE_FOURTH_OPTION_CODES = [
  "STA",
  "PSY",
  "AGE",
  "GEO",
  "SOS",
  "EDW",
  "SPT",
];

const initialForm = {
  programme: "HSC",
  academicSession: "",
  className: "Class 11",
  group: "Science",
};

const getSubjectId = (subject: string | Subject): string =>
  typeof subject === "string" ? subject : subject._id;

const getScienceSelectionGroups = (): SubjectSelectionGroup[] => [
  {
    code: "SCIENCE_MAIN",
    label: "Science Third Optional",
    minSelections: 1,
    maxSelections: 1,
  },
  {
    code: "SCIENCE_FOURTH",
    label: "Additional Fourth Subject Options",
    minSelections: 0,
    maxSelections: 1,
  },
];

const getAutomaticSubjects = (
  subjects: Subject[],
  group: string,
): ConfiguredSubject[] => {
  const mandatoryCodes = GROUP_MANDATORY_CODES[group] || [];

  return subjects
    .filter(
      (subject) =>
        COMMON_COMPULSORY_CODES.includes(subject.code) ||
        mandatoryCodes.includes(subject.code),
    )
    .map((subject) => ({
      subject: subject._id,
      subjectType: COMMON_COMPULSORY_CODES.includes(subject.code)
        ? "COMPULSORY"
        : "GROUP_MANDATORY",
      isMainSubjectEligible: false,
      isFourthSubjectEligible: false,
    }));
};

const getScienceThirdOptionalSubjects = (
  subjects: Subject[],
): ConfiguredSubject[] =>
  subjects
    .filter((subject) => SCIENCE_THIRD_OPTIONAL_CODES.includes(subject.code))
    .map((subject) => ({
      subject: subject._id,
      subjectType: "CHOICE",
      isMainSubjectEligible: true,
      isFourthSubjectEligible: true,
      selectionGroup: "SCIENCE_MAIN",
    }));

const SubjectConfigurationManagementPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [configurations, setConfigurations] = useState<SubjectConfiguration[]>(
    [],
  );

  const [form, setForm] = useState(initialForm);
  const [selectedSubjects, setSelectedSubjects] = useState<ConfiguredSubject[]>(
    [],
  );

  const [selectionGroups, setSelectionGroups] = useState<
    SubjectSelectionGroup[]
  >(getScienceSelectionGroups());

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [subjectData, configurationData] = await Promise.all([
          getAllSubjects(),
          getAllSubjectConfigurations(),
        ]);

        if (cancelled) return;

        setSubjects(subjectData);
        setConfigurations(configurationData);

        setSelectedSubjects([
          ...getAutomaticSubjects(subjectData, initialForm.group),
          ...getScienceThirdOptionalSubjects(subjectData),
        ]);
      } catch (err) {
        if (cancelled) return;

        console.error(err);
        setError("Failed to load subject configuration data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadConfigurations = async () => {
    const data = await getAllSubjectConfigurations();
    setConfigurations(data);
  };

  const getSubjectDetails = (item: ConfiguredSubject) =>
    subjects.find((subject) => subject._id === getSubjectId(item.subject));

  const isScience = form.group === "Science";

  const automaticSubjects = selectedSubjects.filter(
    (item) =>
      item.subjectType === "COMPULSORY" ||
      item.subjectType === "GROUP_MANDATORY",
  );

  const scienceThirdOptionalSubjects = selectedSubjects.filter(
    (item) => item.selectionGroup === "SCIENCE_MAIN",
  );

  const selectedScienceFourthSubjects = selectedSubjects.filter(
    (item) => item.selectionGroup === "SCIENCE_FOURTH",
  );

  const handleGroupChange = (group: string) => {
    setForm((prev) => ({ ...prev, group }));

    const automatic = getAutomaticSubjects(subjects, group);

    if (group === "Science") {
      setSelectedSubjects([
        ...automatic,
        ...getScienceThirdOptionalSubjects(subjects),
      ]);

      setSelectionGroups(getScienceSelectionGroups());
    } else {
      setSelectedSubjects(automatic);
      setSelectionGroups([]);
    }

    setError("");
  };

  const toggleScienceFourthSubject = (subject: Subject) => {
    setSelectedSubjects((prev) => {
      const exists = prev.some(
        (item) =>
          getSubjectId(item.subject) === subject._id &&
          item.selectionGroup === "SCIENCE_FOURTH",
      );

      if (exists) {
        return prev.filter(
          (item) => getSubjectId(item.subject) !== subject._id,
        );
      }

      const configuredSubject: ConfiguredSubject = {
        subject: subject._id,
        subjectType: "CHOICE",
        isMainSubjectEligible: false,
        isFourthSubjectEligible: true,
        selectionGroup: "SCIENCE_FOURTH",
      };

      return [...prev, configuredSubject];
    });
  };

  const resetForm = () => {
    setForm(initialForm);

    setSelectedSubjects([
      ...getAutomaticSubjects(subjects, "Science"),
      ...getScienceThirdOptionalSubjects(subjects),
    ]);

    setSelectionGroups(getScienceSelectionGroups());
    setEditingId(null);
    setError("");
  };

  const handleEdit = (configuration: SubjectConfiguration) => {
    const configuredSubjects = configuration.subjects.map((item) => ({
      subject: getSubjectId(item.subject),
      subjectType: item.subjectType,
      isMainSubjectEligible: item.isMainSubjectEligible,
      isFourthSubjectEligible: item.isFourthSubjectEligible,
      ...(item.selectionGroup ? { selectionGroup: item.selectionGroup } : {}),
    }));

    setForm({
      programme: configuration.programme,
      academicSession: configuration.academicSession,
      className: configuration.className,
      group: configuration.group || "",
    });

    setSelectedSubjects(configuredSubjects);

    setSelectionGroups(
      configuration.selectionGroups?.map((group) => ({ ...group })) || [],
    );

    setEditingId(configuration._id);
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateForm = (): string | null => {
    if (!form.academicSession.trim()) {
      return "Academic session is required.";
    }

    if (!form.group) {
      return "Please select an academic group.";
    }

    if (isScience) {
      const thirdOptionalIds = scienceThirdOptionalSubjects.map((item) =>
        getSubjectId(item.subject),
      );

      const expectedThirdOptionalSubjects = subjects.filter((subject) =>
        SCIENCE_THIRD_OPTIONAL_CODES.includes(subject.code),
      );

      if (
        expectedThirdOptionalSubjects.length !== 2 ||
        thirdOptionalIds.length !== 2
      ) {
        return "Biology and Higher Mathematics must both be available in the Subject Master.";
      }

      if (
        selectedScienceFourthSubjects.some(
          (item) => !item.isFourthSubjectEligible || item.isMainSubjectEligible,
        )
      ) {
        return "Additional fourth subjects must be fourth-subject eligible only.";
      }
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: CreateSubjectConfigurationPayload = {
      programme: form.programme,
      academicSession: form.academicSession.trim(),
      className: form.className,
      group: form.group,

      subjects: selectedSubjects.map(
        (item): ConfiguredSubjectPayload => ({
          subject: getSubjectId(item.subject),
          subjectType: item.subjectType,
          isMainSubjectEligible: item.isMainSubjectEligible,
          isFourthSubjectEligible: item.isFourthSubjectEligible,
          ...(item.selectionGroup
            ? { selectionGroup: item.selectionGroup }
            : {}),
        }),
      ),

      selectionGroups: selectionGroups,
    };

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await updateSubjectConfiguration(editingId, payload);
      } else {
        await createSubjectConfiguration(payload);
      }

      resetForm();
      await loadConfigurations();
    } catch (err) {
      console.error(err);
      setError(
        "Failed to save configuration. Please check the configuration and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this subject configuration?")) return;

    try {
      setError("");
      await deleteSubjectConfiguration(id);
      await loadConfigurations();
    } catch (err) {
      console.error(err);
      setError("Failed to delete configuration.");
    }
  };

  const renderSubjectCards = (items: ConfiguredSubject[], label: string) => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">
          No subjects available in this category.
        </p>
      ) : (
        items.map((item) => {
          const subject = getSubjectDetails(item);

          return (
            <div
              key={getSubjectId(item.subject)}
              className="rounded-lg border border-green-200 bg-green-50 p-3"
            >
              <p className="font-medium text-gray-800">
                {subject?.name || "Subject"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {subject?.code || ""}
              </p>
              <p className="mt-2 text-xs font-medium text-green-700">{label}</p>
            </div>
          );
        })
      )}
    </div>
  );

  if (loading) {
    return <div className="p-6">Loading subject configurations...</div>;
  }

  const availableScienceFourthSubjects = subjects.filter((subject) =>
    SCIENCE_FOURTH_OPTION_CODES.includes(subject.code),
  );

  return (
    <>
      <PageHeader
        description="Manage subjects and configure for the session."
        subject="Total Subjects"
        dataLength={subjects?.length ?? 0}
        actions={
          <div className="lg:flex flex-1 grid items-center gap-2">
            <Button size="xs">Configure Me</Button>
          </div>
        }
      />
      <div className="space-y-8 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            HSC Subject Configuration
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure the subjects offered by your college for each academic
            session, class and group.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-xl border bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              {editingId ? "Update Configuration" : "Create Configuration"}
            </h2>

            {editingId && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                Editing existing configuration
              </span>
            )}
          </div>

          {/* Configuration details */}

          <section className="space-y-4">
            <h3 className="font-semibold text-gray-800">
              1. Configuration Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Programme</span>
                <input
                  value="HSC"
                  disabled
                  className="w-full rounded-lg border bg-gray-100 p-2.5"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium">Academic Session</span>
                <input
                  required
                  value={form.academicSession}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      academicSession: e.target.value,
                    }))
                  }
                  placeholder="2026-2027"
                  className="w-full rounded-lg border p-2.5"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium">Class</span>
                <select
                  value={form.className}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      className: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border p-2.5"
                >
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium">Group</span>
                <select
                  value={form.group}
                  onChange={(e) => handleGroupChange(e.target.value)}
                  className="w-full rounded-lg border p-2.5"
                >
                  <option value="Science">Science</option>
                  <option value="Business Studies">Business Studies</option>
                  <option value="Humanities">Humanities</option>
                </select>
              </label>
            </div>
          </section>

          <hr />

          {/* Automatic subjects */}

          <section className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">
                2. Compulsory Subjects
              </h3>
              <p className="text-sm text-gray-500">
                Common HSC subjects included automatically.
              </p>
            </div>

            {renderSubjectCards(
              automaticSubjects.filter(
                (item) => item.subjectType === "COMPULSORY",
              ),
              "Automatically included",
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">
                3. Group-Mandatory Subjects
              </h3>
              <p className="text-sm text-gray-500">
                Included automatically according to the selected group.
              </p>
            </div>

            {renderSubjectCards(
              automaticSubjects.filter(
                (item) => item.subjectType === "GROUP_MANDATORY",
              ),
              "Automatically included",
            )}
          </section>

          {isScience ? (
            <>
              <hr />

              {/* Science third optional pair */}

              <section className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    4. Third Optional Subjects
                  </h3>
                  <p className="text-sm text-gray-500">
                    Both alternatives are included in the configuration. Each
                    student will choose one during admission.
                  </p>
                </div>

                {renderSubjectCards(
                  scienceThirdOptionalSubjects,
                  "Third optional — student chooses one",
                )}
              </section>

              <hr />

              {/* Additional fourth subjects */}

              <section className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    5. Additional Fourth Subject Offerings
                  </h3>
                  <p className="text-sm text-gray-500">
                    Select only the additional fourth subjects your college is
                    authorized to offer. The unselected third optional subject
                    will be added automatically during student admission.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {availableScienceFourthSubjects.map((subject) => {
                    const checked = selectedScienceFourthSubjects.some(
                      (item) => getSubjectId(item.subject) === subject._id,
                    );

                    return (
                      <label
                        key={subject._id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                          checked
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleScienceFourthSubject(subject)}
                          className="mt-1"
                        />

                        <span>
                          <span className="block font-medium text-gray-800">
                            {subject.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {subject.code}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                {availableScienceFourthSubjects.length === 0 && (
                  <p className="text-sm text-red-600">
                    The seven Science fourth-subject options are not all
                    available in the Subject Master. Check the subject codes.
                  </p>
                )}

                <div className="rounded-lg border bg-gray-50 p-4">
                  <h4 className="mb-3 font-medium text-gray-800">
                    Selected additional fourth subjects (
                    {selectedScienceFourthSubjects.length})
                  </h4>

                  {selectedScienceFourthSubjects.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No additional fourth subjects selected.
                    </p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {selectedScienceFourthSubjects.map((item) => {
                        const subject = getSubjectDetails(item);

                        return (
                          <li key={getSubjectId(item.subject)}>
                            {subject?.name} ({subject?.code})
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-semibold text-amber-900">
                {form.group} configuration
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                The group-specific optional subject structure has not yet been
                configured in this page. We will define its mandatory, main and
                fourth-subject categories separately rather than assume Science
                rules apply to it.
              </p>
            </section>
          )}

          {/* Actions */}

          <div className="flex flex-wrap gap-3 border-t pt-5">
            <button
              type="submit"
              disabled={saving || !isScience}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Configuration"
                  : "Save Configuration"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border px-5 py-2.5 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Existing configurations */}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            Existing Configurations ({configurations.length})
          </h2>

          {configurations.length === 0 ? (
            <p className="rounded-lg border bg-white p-5 text-sm text-gray-500">
              No subject configurations created yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3">Programme</th>
                    <th className="p-3">Session</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Group</th>
                    <th className="p-3">Subjects</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {configurations.map((configuration) => (
                    <tr key={configuration._id} className="border-t">
                      <td className="p-3">{configuration.programme}</td>
                      <td className="p-3">{configuration.academicSession}</td>
                      <td className="p-3">{configuration.className}</td>
                      <td className="p-3">{configuration.group || "—"}</td>
                      <td className="p-3">{configuration.subjects.length}</td>
                      <td className="space-x-3 p-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(configuration)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(configuration._id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default SubjectConfigurationManagementPage;
