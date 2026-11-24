import { useState } from "react";
import type {
  ConfiguredSubject,
  SubjectConfiguration,
} from "../../../../features/subjectConfigurations/subjectConfigurationsApi.js";
import type { Student } from "../../../../features/students/studentsApi.js";
import { LucideAlertTriangle, LucideUser } from "lucide-react";

interface ScienceAdmissionFormProps {
  configuration: SubjectConfiguration;

  initialSelection?: {
    configurationId: string;
    mainSubjectId: string;
    fourthSubjectId: string;
  };

  student?: Student | null;

  onSelectionChange: (selection: {
    configurationId: string;
    mainSubjectId: string;
    fourthSubjectId: string;
  }) => void;
}
const ScienceAdmissionForm = ({
  configuration,
  student,
  onSelectionChange,
}: ScienceAdmissionFormProps) => {
  const [selection, setSelection] = useState({
    configurationId: configuration._id,
    mainSubjectId: "",
    fourthSubjectId: "",
  });

  console.log("STUDENT IN SCIENCE ADMISSION FORM", student);
  console.log("Configuration in form", configuration);
  console.log("Selected form data", selection);

  const selectedMainSubjectId =
    selection.configurationId === configuration._id
      ? selection.mainSubjectId
      : "";
  const selectedFourthSubjectId =
    selection.configurationId === configuration._id
      ? selection.fourthSubjectId
      : "";

  // Handle populated Subject objects and string IDs.
  const getSubjectId = (item: ConfiguredSubject): string =>
    typeof item.subject === "string" ? item.subject : item.subject._id;

  const getSubjectName = (item: ConfiguredSubject): string =>
    typeof item.subject === "string" ? item.subject : item.subject.name;

  // Automatically included subjects.
  const compulsorySubjects = configuration.subjects.filter(
    (item) =>
      item.subjectType === "COMPULSORY" ||
      item.subjectType === "GROUP_MANDATORY",
  );

  // Biology and Higher Mathematics.
  const mainSubjects = configuration.subjects.filter(
    (item) =>
      item.isMainSubjectEligible && item.selectionGroup === "SCIENCE_MAIN",
  );

  // Fourth-subject options:
  // All fourth-eligible subjects except the selected main subject.
  const fourthSubjectOptions = configuration.subjects.filter(
    (item) =>
      item.isFourthSubjectEligible &&
      getSubjectId(item) !== selectedMainSubjectId,
  );

  const handleMainSubjectChange = (subjectId: string) => {
    const newSelection = {
      configurationId: configuration._id,
      mainSubjectId: subjectId,
      fourthSubjectId: "",
    };

    setSelection(newSelection);
    onSelectionChange(newSelection);
  };

  const handleFourthSubjectChange = (subjectId: string) => {
    const newSelection = {
      ...selection,
      fourthSubjectId: subjectId,
    };

    setSelection(newSelection);
    onSelectionChange(newSelection);
  };

  // EXTRACTS SUBJECTS SELECTED BY STUDENT
  const currentAcademicEntry = student?.academicHistory?.find(
    (entry) =>
      entry.academicSession === student.academicSession &&
      entry.className === student.className &&
      (entry.group || "") === (student.group || ""),
  );

  const subjectsSelected = currentAcademicEntry?.subjects ?? [];

  return (
    <div className="space-y-6">
      {subjectsSelected?.length > 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 lg:px-5 px-2 lg:py-4 py-2">
            <div className="flex items-center gap-x-2">
              <div className="">
                {student?.photo?.url ? (
                  <img
                    src={student?.photo?.url ?? ""}
                    alt={student?.name ?? ""}
                    className="lg:w-20 lg:h-20 w-12 h-12 rounded-full object-cover shadow bg-gray-300 p-0.5"
                  />
                ) : (
                  <LucideUser className="lg:w-20 lg:h-20 h-12 w-12 shadow bg-gray-300 p-0.5" />
                )}
              </div>
              <div className="space-y-1 text-gray-700">
                <h2 className="text-lg font-bold lg:flex">
                  <span className="hidden lg:flex lg:items-center gap-x-1.5">
                    Subjects Chosen by <LucideUser size={16} />{" "}
                  </span>
                  <span className="lg:font-extrabold font-bold">
                    {student?.name ?? ""}
                  </span>
                </h2>
                <p className="lg:text-sm text-xs hidden lg:flex">
                  Student's registered academic subjects
                </p>
                <p className="lg:text-sm text-xs flex items-center gap-1.5">
                  <span>Roll No: {student?.rollNumber ?? ""}</span> •
                  <span>{student?.group ?? ""}</span> •
                  <span>{student?.academicSession ?? ""}</span>
                </p>
              </div>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              {subjectsSelected.length} Subjects
            </span>
          </div>

          {/* Subject List */}
          <div className="divide-y divide-gray-100 px-5">
            {subjectsSelected.map((item, index) => (
              <div
                key={item.subjectCode}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <p className="font-medium text-gray-800">
                      {item.subjectName}
                    </p>
                    <p className="text-xs text-gray-400">{item.subjectCode}</p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.isFourthSubject
                      ? "bg-purple-100 text-purple-700"
                      : item.isElective
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.isFourthSubject
                    ? "Fourth Subject"
                    : item.isElective
                      ? "Main Elective"
                      : "Compulsory"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center gap-3 text-red-700">
            <div>
              <h2 className="font-bold flex items-center gap-x-1.5">
                {" "}
                <LucideAlertTriangle size={16} />
                No Subjects Chosen Yet!
              </h2>
              <p className="mt-1 text-sm font-medium">
                Admission is incomplete. Please select the student's subjects.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h1 className="text-base font-semibold lg:text-lg">
          Choose Subjects for Science Group {configuration.academicSession}{" "}
          Session
        </h1>

        <p className="text-sm text-gray-600">
          Select your subjects carefully. One single fault might lead to
          troubles!
        </p>
      </div>

      {/* Compulsory and group mandatory subjects */}
      <section className="space-y-3">
        <h2 className="font-semibold">Compulsory Subjects</h2>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {compulsorySubjects.map((item) => (
            <label
              key={getSubjectId(item)}
              className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3"
            >
              <input type="checkbox" checked disabled readOnly />

              <span className="text-sm font-medium">
                {getSubjectName(item)}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Main elective selection */}
      <section className="space-y-3">
        <h2 className="font-semibold">Select One Main Elective Subject</h2>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {mainSubjects.map((item) => {
            const subjectId = getSubjectId(item);

            return (
              <label
                key={subjectId}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                  selectedMainSubjectId === subjectId
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="scienceMainSubject"
                  value={subjectId}
                  checked={selectedMainSubjectId === subjectId}
                  onChange={() => handleMainSubjectChange(subjectId)}
                />

                <span className="text-sm font-medium">
                  {getSubjectName(item)}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Fourth subject selection */}
      {selectedMainSubjectId && (
        <section className="space-y-3">
          <h2 className="font-semibold">Select One Fourth Subject</h2>

          <p className="text-sm text-gray-600">
            Your unselected main elective is also available here, along with the
            additional fourth-subject options.
          </p>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {fourthSubjectOptions.map((item) => {
              const subjectId = getSubjectId(item);

              return (
                <label
                  key={subjectId}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                    selectedFourthSubjectId === subjectId
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="scienceFourthSubject"
                    value={subjectId}
                    checked={selectedFourthSubjectId === subjectId}
                    onChange={(e) => handleFourthSubjectChange(e.target.value)}
                  />

                  <span className="text-sm font-medium">
                    {getSubjectName(item)}
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ScienceAdmissionForm;
