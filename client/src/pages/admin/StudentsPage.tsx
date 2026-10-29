import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import {
  LucideCalendar,
  LucideCog,
  LucideEdit,
  LucideEye,
  LucideLoaderCircle,
  LucideMapPin,
  LucidePhoneCall,
  LucidePlusCircle,
  LucideSave,
  LucideSettings,
  LucideTrash,
  LucideUser,
  LucideX,
} from "lucide-react";
import Button from "../../components/ui/Button";
import {
  createStudent,
  getAllStudents,
  updateStudent,
  type Student,
  type CreateStudentPayload,
  type ClearanceStatus,
} from "../../features/students/studentsApi.js";
import { showSuccess, showError } from "../../utils/alert.js";
import Input from "../../components/ui/Input.js";
import Select from "../../components/ui/Select";
import Card from "../../components/ui/Card";
import Textarea from "../../components/ui/Textarea.js";
import Modal from "../../components/ui/Modal.js";
import Avatar from "../../assets/AvatarSM.jpg";

const occupationOptions = [
  { value: "Government Service", label: "Government Service" },
  { value: "Private Service", label: "Private Service" },
  { value: "Business", label: "Business" },
  { value: "Agriculture", label: "Agriculture / Farming" },
  { value: "Teaching", label: "Teaching" },
  { value: "Day Labour", label: "Day Labour" },
  { value: "Skilled Worker", label: "Skilled Worker / Technician" },
  { value: "Driver", label: "Driver" },
  { value: "Expatriate", label: "Expatriate / Overseas Worker" },
  { value: "Retired", label: "Retired" },
  { value: "Unemployed", label: "Unemployed" },
  { value: "Other", label: "Other" },
];

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [editingClearanceId, setEditingClearanceId] = useState<string | null>(
    null,
  );
  const [savingClearance, setSavingClearance] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentPhoto, setStudentPhoto] = useState<File | null>(null);
  const [guardianPhoto, setGuardianPhoto] = useState<File | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  console.log("Editing Student", editingStudent);

  const [clearanceForm, setClearanceForm] = useState({
    duesStatus: "pending" as ClearanceStatus,
    duesVerifiedBy: "",
    libraryStatus: "pending" as ClearanceStatus,
    libraryVerifiedBy: "",
  });

  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    fatherName: "",
    motherName: "",
    guardianName: "",
    guardianRelationship: "Father",
    guardianPhone: "",
    guardianEmail: "",
    presentAddress: "",
    permanentAddress: "",
    fatherOccupation: "",
    fatherOccupationOther: "",
    yearlyFamilyIncome: "",
    admissionDate: new Date().toISOString().slice(0, 10),
    admissionType: "regular" as "regular" | "tc",
    academicSession: String(new Date().getFullYear()),
    className: "",
    group: "",
    section: "",
    rollNumber: "",
    educationBoard: "",
    tcNumber: "",
    tcIssueDate: "",
    previousInstitutionName: "",
    previousInstitutionAddress: "",
    previousInstitutionEiin: "",
    previousClass: "",
    previousRollNumber: "",
  });
  const resetStudentForm = () => {
    setForm({
      name: "",
      dateOfBirth: "",
      gender: "",
      fatherName: "",
      motherName: "",
      guardianName: "",
      guardianRelationship: "Father",
      guardianPhone: "",
      guardianEmail: "",
      presentAddress: "",
      permanentAddress: "",
      fatherOccupation: "",
      fatherOccupationOther: "",
      yearlyFamilyIncome: "",
      admissionDate: new Date().toISOString().slice(0, 10),
      admissionType: "regular",
      academicSession: String(new Date().getFullYear()),
      className: "",
      group: "",
      section: "",
      rollNumber: "",
      educationBoard: "",
      tcNumber: "",
      tcIssueDate: "",
      previousInstitutionName: "",
      previousInstitutionAddress: "",
      previousInstitutionEiin: "",
      previousClass: "",
      previousRollNumber: "",
    });

    setStudentPhoto(null);
    setGuardianPhoto(null);
    setEditingStudent(null);
  };

  console.log("Students", students);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch {
        setLoadError("Failed to load students data.");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const handleFormChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleTableToggle = () => {
    setShowForm((prev) => !prev);
    setShowTable((prev) => !prev);
    setEditingStudent(null);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      const payload: CreateStudentPayload = {
        name: form.name.trim(),
        ...(form.dateOfBirth && { dateOfBirth: form.dateOfBirth }),
        ...(form.gender && { gender: form.gender }),
        ...(form.fatherName.trim() && { fatherName: form.fatherName.trim() }),
        ...(form.motherName.trim() && { motherName: form.motherName.trim() }),
        ...(form.fatherOccupation === "Other"
          ? {
              fatherOccupation: form.fatherOccupationOther.trim(),
            }
          : form.fatherOccupation && {
              fatherOccupation: form.fatherOccupation,
            }),
        ...(form.yearlyFamilyIncome.trim() && {
          yearlyFamilyIncome: Number(form.yearlyFamilyIncome),
        }),

        guardians: [
          {
            name: form.guardianName.trim(),
            relationship: form.guardianRelationship,
            phone: form.guardianPhone.trim(),
            ...(form.guardianEmail.trim() && {
              email: form.guardianEmail.trim(),
            }),
            ...(form.presentAddress.trim() && {
              address: form.presentAddress.trim(),
            }),
          },
        ],

        ...(form.presentAddress.trim() && {
          presentAddress: form.presentAddress.trim(),
        }),
        ...(form.permanentAddress.trim() && {
          permanentAddress: form.permanentAddress.trim(),
        }),

        admissionDate: form.admissionDate,
        admissionType: form.admissionType,

        ...(form.admissionType === "tc" && {
          tcDetails: {
            number: form.tcNumber.trim(),
            issueDate: form.tcIssueDate,
            previousInstitution: {
              name: form.previousInstitutionName.trim(),
              address: form.previousInstitutionAddress.trim(),
              ...(form.previousInstitutionEiin.trim() && {
                eiin: form.previousInstitutionEiin.trim(),
              }),
              ...(form.previousClass.trim() && {
                previousClass: form.previousClass.trim(),
              }),
              ...(form.previousRollNumber.trim() && {
                previousRollNumber: form.previousRollNumber.trim(),
              }),
            },
          },
        }),

        academicSession: form.academicSession.trim(),
        className: form.className.trim(),
        ...(form.group.trim() && { group: form.group.trim() }),
        ...(form.section.trim() && { section: form.section.trim() }),
        ...(form.rollNumber.trim() && { rollNumber: form.rollNumber.trim() }),
        ...(form.educationBoard && { educationBoard: form.educationBoard }),

        duesClearance: { status: "pending" },
        libraryClearance: { status: "pending" },
        status: "active",
      };

      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));

      if (studentPhoto) {
        formData.append("photo", studentPhoto);
      }
      if (guardianPhoto) {
        formData.append("guardianPhoto_0", guardianPhoto);
      }

      if (editingStudent) {
        await updateStudent(editingStudent._id, formData);
      } else {
        await createStudent(formData);
      }

      const updatedStudents = await getAllStudents();
      setStudents(updatedStudents);

      showSuccess("Student admitted successfully.");
      setShowForm(false);
      setShowTable(false);
      resetStudentForm();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to admit student.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClearance = (student: Student) => {
    setClearanceForm({
      duesStatus: student.duesClearance.status,
      duesVerifiedBy: student.duesClearance.verifiedBy ?? "",
      libraryStatus: student.libraryClearance.status,
      libraryVerifiedBy: student.libraryClearance.verifiedBy ?? "",
    });

    setEditingClearanceId(student._id);
  };

  const handleSaveClearance = async (student: Student) => {
    if (savingClearance) return;

    const duesVerifiedBy = clearanceForm.duesVerifiedBy.trim();
    const libraryVerifiedBy = clearanceForm.libraryVerifiedBy.trim();

    if (clearanceForm.duesStatus === "cleared" && !duesVerifiedBy) {
      showError("Enter the dues clearance verifier's name.");
      return;
    }

    if (clearanceForm.libraryStatus === "cleared" && !libraryVerifiedBy) {
      showError("Enter the library clearance verifier's name.");
      return;
    }

    setSavingClearance(true);

    try {
      const updatedStudent = await updateStudent(student._id, {
        duesClearance: {
          ...student.duesClearance,
          status: clearanceForm.duesStatus,
          verifiedBy:
            clearanceForm.duesStatus === "cleared" ? duesVerifiedBy : "",
        },
        libraryClearance: {
          ...student.libraryClearance,
          status: clearanceForm.libraryStatus,
          verifiedBy:
            clearanceForm.libraryStatus === "cleared" ? libraryVerifiedBy : "",
        },
      });

      setStudents((current) =>
        current.map((item) =>
          item._id === updatedStudent._id ? updatedStudent : item,
        ),
      );

      setEditingClearanceId(null);
      showSuccess("Clearance details updated!");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Failed to update clearance details.",
      );
    } finally {
      setSavingClearance(false);
    }
  };

  const chosenStudentToView = (studentId?: string | number): Student | null => {
    if (!studentId) return null;
    return students.find((student) => student._id === studentId) ?? null;
  };

  const handleToggleModal = (studentId?: string | number) => {
    const student = studentId ? chosenStudentToView(studentId) : null;
    setSelectedStudent(student);
    setIsModalOpen((prev) => !prev);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  const chosenStudentToUpdate = (
    editingStudentId?: string | number,
  ): Student | null => {
    if (!editingStudentId) return null;
    return students.find((student) => student._id === editingStudentId) ?? null;
  };

  const handleToggleEditStudentDataLoader = (
    editingStudentId?: string | number,
  ) => {
    const student = editingStudentId
      ? chosenStudentToUpdate(editingStudentId)
      : null;

    if (!student) {
      showError("Student not found.");
      return;
    }

    const guardian = student.guardians?.[0];
    const fatherOccupation =
      typeof student.fatherOccupation === "string"
        ? student.fatherOccupation
        : "";
    setEditingStudent(student);

    setForm({
      name: student.name ?? "",
      dateOfBirth: student.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().slice(0, 10)
        : "",
      gender: student.gender ?? "",
      fatherName: student.fatherName ?? "",
      motherName: student.motherName ?? "",
      guardianName: guardian?.name ?? "",
      guardianRelationship: guardian?.relationship ?? "Father",
      guardianPhone: guardian?.phone ?? "",
      guardianEmail: guardian?.email ?? "",
      presentAddress: student.presentAddress ?? guardian?.address ?? "",
      permanentAddress: student.permanentAddress ?? "",
      fatherOccupation: occupationOptions.some(
        (option) => option.value === fatherOccupation,
      )
        ? fatherOccupation
        : fatherOccupation
          ? "Other"
          : "",
      fatherOccupationOther: occupationOptions.some(
        (option) => option.value === fatherOccupation,
      )
        ? ""
        : fatherOccupation,
      yearlyFamilyIncome:
        (
          student as Student & {
            yearlyFamilyIncome?: number | string | null;
          }
        ).yearlyFamilyIncome != null
          ? String(
              (
                student as Student & {
                  yearlyFamilyIncome?: number | string | null;
                }
              ).yearlyFamilyIncome,
            )
          : "",
      admissionDate: student.admissionDate
        ? new Date(student.admissionDate).toISOString().slice(0, 10)
        : "",
      admissionType: student.admissionType,
      academicSession: student.academicSession ?? "",
      className: student.className ?? "",
      group: student.group ?? "",
      section: student.section ?? "",
      rollNumber: student.rollNumber ?? "",
      educationBoard: student.educationBoard ?? "",
      tcNumber: student.tcDetails?.number ?? "",
      tcIssueDate: student.tcDetails?.issueDate
        ? new Date(student.tcDetails.issueDate).toISOString().slice(0, 10)
        : "",
      previousInstitutionName:
        student.tcDetails?.previousInstitution?.name ?? "",
      previousInstitutionAddress:
        student.tcDetails?.previousInstitution?.address ?? "",
      previousInstitutionEiin:
        student.tcDetails?.previousInstitution?.eiin ?? "",
      previousClass:
        student.tcDetails?.previousInstitution?.previousClass ?? "",
      previousRollNumber:
        student.tcDetails?.previousInstitution?.previousRollNumber ?? "",
    });

    setStudentPhoto(null);
    setGuardianPhoto(null);
    setShowForm(true);
    setShowTable(true);
    setIsModalOpen(false);
  };

  // Loading status & Error message
  if (loading) {
    return <p className="p-6">Loading students...</p>;
  }

  if (loadError) {
    return <p className="p-6 text-red-600">{loadError}</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Management"
        description="Manage student records, admissions, academic placement, and clearances."
        actions={
          <Button
            onClick={handleTableToggle}
            icon={showForm ? LucideX : LucidePlusCircle}
            variant={`${showForm ? "warning" : "primary"}`}
          >
            {editingStudent
              ? "Cancel Update"
              : showForm
                ? "Cancel Admission"
                : "Add Student"}
          </Button>
        }
      />

      {/* Students Add Form */}

      {showForm && (
        <form
          onSubmit={handleSave}
          className="space-y-6"
          method="post"
          encType="multipart/form-data"
        >
          <Card
            title="Personal Information"
            description="Enter the student's personal and family details."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Student Name"
                name="name"
                value={form.name}
                onChange={(event) => handleFormChange(event)}
                placeholder="Enter student's full name"
                required
              />

              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleFormChange}
              />

              <Select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleFormChange}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
                placeholder="Select gender"
              />

              <Input
                label="Father's Name"
                name="fatherName"
                value={form.fatherName}
                onChange={handleFormChange}
                placeholder="Enter father's name"
              />

              <Input
                label="Mother's Name"
                name="motherName"
                value={form.motherName}
                onChange={handleFormChange}
                placeholder="Enter mother's name"
              />

              <Select
                label="Father's Occupation"
                name="fatherOccupation"
                value={form.fatherOccupation}
                onChange={handleFormChange}
                options={occupationOptions}
              />

              {form.fatherOccupation === "Other" && (
                <div className="animate-pulse">
                  <Input
                    label="Specify Father's exact Occupation (Needed)"
                    name="fatherOccupationOther"
                    value={form.fatherOccupationOther}
                    onChange={handleFormChange}
                    placeholder="e.g. Tailor, Rickshaw Puller"
                    className="border border-red-500 bg-amber-100"
                    required
                  />
                </div>
              )}

              <Input
                label="Yearly Family Income (৳)"
                name="yearlyFamilyIncome"
                type="number"
                value={form.yearlyFamilyIncome}
                onChange={handleFormChange}
                min={0}
                step={1}
                placeholder="Enter annual income in BDT"
              />

              <div className="flex items-center gap-2">
                <Input
                  label="Student Photo"
                  id="studentPhoto"
                  name="studentPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setStudentPhoto(event.target.files?.[0] ?? null)
                  }
                />

                <img
                  src={
                    studentPhoto
                      ? URL.createObjectURL(studentPhoto)
                      : editingStudent?.photo?.url || Avatar
                  }
                  alt="Student preview"
                  className="h-10 w-10 mt-6 rounded-lg border border-gray-300 object-cover lg:hover:scale-150"
                />
              </div>
            </div>
          </Card>
          <Card
            title="Guardian Information"
            description="Provide the primary guardian's contact details."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Guardian Name"
                name="guardianName"
                value={form.guardianName}
                onChange={handleFormChange}
                placeholder="Enter guardian's name"
                required
              />

              <Select
                label="Relationship"
                name="guardianRelationship"
                value={form.guardianRelationship}
                onChange={handleFormChange}
                options={[
                  { label: "Father", value: "Father" },
                  { label: "Mother", value: "Mother" },
                  { label: "Guardian", value: "Guardian" },
                  { label: "Other", value: "Other" },
                ]}
                required
              />

              <Input
                label="Guardian Phone"
                name="guardianPhone"
                type="tel"
                value={form.guardianPhone}
                onChange={handleFormChange}
                placeholder="Enter contact number"
                required
              />

              <Input
                label="Guardian Email"
                name="guardianEmail"
                type="email"
                value={form.guardianEmail}
                onChange={handleFormChange}
                placeholder="Enter email address"
              />

              <div className="flex items-center gap-2 mt-">
                <Input
                  label="Guardian Photo"
                  id="guardianPhoto"
                  name="guardianPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setGuardianPhoto(event.target.files?.[0] ?? null)
                  }
                />
                <img
                  src={
                    guardianPhoto
                      ? URL.createObjectURL(guardianPhoto)
                      : editingStudent?.guardians?.[0]?.photo?.url || Avatar
                  }
                  alt="Guardian preview"
                  className="h-10 w-10 rounded-lg border border-gray-300 object-cover mt-6 lg:hover:scale-150"
                />
              </div>
            </div>
          </Card>
          <Card
            title="Address Information"
            description="Enter the student's present and permanent addresses."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Textarea
                label="Present Address"
                name="presentAddress"
                value={form.presentAddress}
                onChange={handleFormChange}
                placeholder="Enter present address"
                rows={3}
              />

              <Textarea
                label="Permanent Address"
                name="permanentAddress"
                value={form.permanentAddress}
                onChange={handleFormChange}
                placeholder="Enter permanent address"
                rows={3}
              />
            </div>
          </Card>
          <Card
            title="Admission and Academic Placement"
            description="Record the admission type and current academic placement."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Admission Date"
                name="admissionDate"
                type="date"
                value={form.admissionDate}
                onChange={handleFormChange}
                required
              />

              <Select
                label="Admission Type"
                name="admissionType"
                value={form.admissionType}
                onChange={handleFormChange}
                options={[
                  { label: "Regular Admission", value: "regular" },
                  { label: "Transfer Certificate (TC)", value: "tc" },
                ]}
                required
              />

              <Input
                label="Academic Session"
                name="academicSession"
                value={form.academicSession}
                onChange={handleFormChange}
                placeholder="e.g. 2026"
                required
              />

              <Input
                label="Class / Year"
                name="className"
                value={form.className}
                onChange={handleFormChange}
                placeholder="e.g. Class 9"
                required
              />

              <Select
                label="Group"
                name="group"
                value={form.group}
                onChange={handleFormChange}
                options={[
                  { value: "Science", label: "Science" },
                  { value: "Humanities", label: "Humanities" },
                  { value: "Business Studies", label: "Business Studies" },
                ]}
              />

              <Input
                label="Section"
                name="section"
                value={form.section}
                onChange={handleFormChange}
                placeholder="e.g. A"
              />

              <Input
                label="Class Roll Number"
                name="rollNumber"
                value={form.rollNumber}
                onChange={handleFormChange}
                placeholder="Enter roll number"
              />

              <Select
                label="Education Board"
                name="educationBoard"
                value={form.educationBoard}
                onChange={handleFormChange}
                placeholder="Select education board"
                options={[
                  {
                    label: "Barisal",
                    value:
                      "Board of Intermediate and Secondary Education, Barisal",
                  },
                  {
                    label: "Chattogram",
                    value:
                      "Board of Intermediate and Secondary Education, Chattogram",
                  },
                  {
                    label: "Cumilla",
                    value:
                      "Board of Intermediate and Secondary Education, Cumilla",
                  },
                  {
                    label: "Dhaka",
                    value:
                      "Board of Intermediate and Secondary Education, Dhaka",
                  },
                  {
                    label: "Dinajpur",
                    value:
                      "Board of Intermediate and Secondary Education, Dinajpur",
                  },
                  {
                    label: "Jashore",
                    value:
                      "Board of Intermediate and Secondary Education, Jashore",
                  },
                  {
                    label: "Mymensingh",
                    value:
                      "Board of Intermediate and Secondary Education, Mymensingh",
                  },
                  {
                    label: "Rajshahi",
                    value:
                      "Board of Intermediate and Secondary Education, Rajshahi",
                  },
                  {
                    label: "Sylhet",
                    value:
                      "Board of Intermediate and Secondary Education, Sylhet",
                  },
                  {
                    label: "Bangladesh Madrasah Education Board",
                    value: "Bangladesh Madrasah Education Board",
                  },
                  {
                    label: "Bangladesh Technical Education Board",
                    value: "Bangladesh Technical Education Board",
                  },
                ]}
              />
            </div>
          </Card>

          {/* TC */}

          {form.admissionType === "tc" && (
            <Card
              title="Transfer Certificate Details"
              description="Enter the previous institution and transfer certificate information."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="TC Number"
                  name="tcNumber"
                  value={form.tcNumber}
                  onChange={handleFormChange}
                  placeholder="Enter TC number"
                  required
                />

                <Input
                  label="TC Issue Date"
                  name="tcIssueDate"
                  type="date"
                  value={form.tcIssueDate}
                  onChange={handleFormChange}
                  required
                />

                <Input
                  label="Previous Institution Name"
                  name="previousInstitutionName"
                  value={form.previousInstitutionName}
                  onChange={handleFormChange}
                  placeholder="Enter institution name"
                  required
                />

                <Input
                  label="Previous Institution EIIN"
                  name="previousInstitutionEiin"
                  value={form.previousInstitutionEiin}
                  onChange={handleFormChange}
                  placeholder="Enter EIIN, if available"
                />

                <Input
                  label="Previous Class"
                  name="previousClass"
                  value={form.previousClass}
                  onChange={handleFormChange}
                  placeholder="Enter previous class"
                />

                <Input
                  label="Previous Roll Number"
                  name="previousRollNumber"
                  value={form.previousRollNumber}
                  onChange={handleFormChange}
                  placeholder="Enter previous roll number"
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Previous Institution Address"
                    name="previousInstitutionAddress"
                    value={form.previousInstitutionAddress}
                    onChange={handleFormChange}
                    placeholder="Enter full institution address"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end sticky bottom-16 pr-4">
            <Button
              type="submit"
              loading={submitting}
              icon={
                submitting
                  ? LucideLoaderCircle
                  : editingStudent
                    ? LucideEdit
                    : LucideSave
              }
              className="cursor-pointer"
            >
              {editingStudent
                ? "Update Student"
                : submitting
                  ? "Saving Student..."
                  : "Save Student"}
              {/* {submitting ? "Saving Student..." : "Save Student"} */}
            </Button>
          </div>
        </form>
      )}

      {/*Students Table */}
      {!showTable && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="table table-xs">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3">Admission</th>
                <th className="px-4 py-3">Dues</th>
                <th className="px-4 py-3">Library</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <>
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {student.studentId}
                      </td>
                      <td>
                        <img
                          src={student?.photo?.url}
                          alt=""
                          className="w-16 h-12 rounded-md"
                        />
                      </td>
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">{student.className}</td>
                      <td className="px-4 py-3">{student.section || "—"}</td>
                      <td className="px-4 py-3">{student.rollNumber || "—"}</td>
                      <td className="px-4 py-3 capitalize">
                        {student.admissionType}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {student.duesClearance.status.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {student.libraryClearance.status.replace("_", " ")}
                      </td>
                      <td>
                        <Button
                          onClick={() =>
                            handleToggleEditStudentDataLoader(student._id)
                          }
                          size="xs"
                          title="Edit"
                          icon={LucideEdit}
                        >
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          onClick={() => handleToggleModal(student._id)}
                          size="xs"
                          title="View"
                          icon={LucideEye}
                        >
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          size="xs"
                          variant="danger"
                          title="Delete"
                          icon={LucideTrash}
                        >
                          <span className="sr-only">Delete</span>
                        </Button>
                        <Button
                          size="xs"
                          variant="success"
                          onClick={() => handleEditClearance(student)}
                          icon={LucideSettings}
                          title="Manage Clearance"
                        >
                          <span className="sr-only"> Manage Clearance</span>
                        </Button>
                      </td>
                    </tr>

                    {editingClearanceId === student._id && (
                      <tr>
                        <td colSpan={10} className="bg-gray-50 p-4">
                          <div className="grid gap-6 md:grid-cols-2">
                            {/* Dues Clearance */}
                            <div className="space-y-3 rounded-lg border border-gray-300 p-4">
                              <h3 className="font-semibold">Dues Clearance</h3>
                              <Select
                                label="Status"
                                value={clearanceForm.duesStatus}
                                onChange={(event) =>
                                  setClearanceForm((current) => ({
                                    ...current,
                                    duesStatus: event.target
                                      .value as ClearanceStatus,
                                  }))
                                }
                                options={[
                                  { label: "Pending", value: "pending" },
                                  { label: "Paid", value: "cleared" },
                                  {
                                    label: "Not Applicable",
                                    value: "not_applicable",
                                  },
                                ]}
                                placeholder="Select clearance status"
                              />

                              <Input
                                label="Verified By"
                                value={clearanceForm.duesVerifiedBy}
                                placeholder="Enter verifier's name"
                                onChange={(event) =>
                                  setClearanceForm((current) => ({
                                    ...current,
                                    duesVerifiedBy: event.target.value,
                                  }))
                                }
                                required={
                                  clearanceForm.duesStatus === "cleared"
                                }
                              />
                            </div>

                            {/* Library Clearance */}
                            <div className="space-y-3 rounded-lg border border-gray-300 p-4">
                              <h3 className="font-semibold">
                                Library Clearance
                              </h3>

                              <Select
                                label="Status"
                                value={clearanceForm.libraryStatus}
                                onChange={(event) =>
                                  setClearanceForm((current) => ({
                                    ...current,
                                    libraryStatus: event.target
                                      .value as ClearanceStatus,
                                  }))
                                }
                                options={[
                                  { label: "Pending", value: "pending" },
                                  { label: "Paid", value: "cleared" },
                                  {
                                    label: "Not Applicable",
                                    value: "not_applicable",
                                  },
                                ]}
                                placeholder="Select clearance status"
                              />

                              <Input
                                label="Verified By"
                                value={clearanceForm.libraryVerifiedBy}
                                placeholder="Enter verifier's name"
                                onChange={(event) =>
                                  setClearanceForm((current) => ({
                                    ...current,
                                    libraryVerifiedBy: event.target.value,
                                  }))
                                }
                                required={
                                  clearanceForm.libraryStatus === "cleared"
                                }
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="warning"
                              size="sm"
                              onClick={() => setEditingClearanceId(null)}
                              icon={LucideX}
                            >
                              Cancel
                            </Button>

                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              icon={LucideCog}
                              loading={savingClearance}
                              onClick={() => handleSaveClearance(student)}
                            >
                              Save Clearance
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Modal */}

      {/* Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Student & Guardian Details"
      >
        {selectedStudent && (
          <div className="space-y-6">
            {/* Student & Guardian profile */}
            <section className="grid lg:grid-cols-12 grid-cols-2 items-start justify-between lg:gap-4 gap-2 border-gray-300 lg:space-y-0 space-y-4">
              <div className="lg:col-span-6 col-span-12 bg-base-200 lg:text-left text-center border border-gray-300 rounded-xl shadow-sm p-2 lg:min-h-80 space-y-2">
                <h2 className="lg:text-xl text-lg font-bold border-b border-gray-300">
                  Student Details
                </h2>
                <div className="flex lg:justify-center justify-center">
                  {selectedStudent.photo?.url ? (
                    <div className="flex lg:justify-center justify-center">
                      <img
                        src={selectedStudent.photo.url}
                        alt={selectedStudent.name}
                        className="h-28 w-28 rounded-full object-cover object-center border border-gray-300"
                      />
                    </div>
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-500">
                      <img
                        src={Avatar}
                        alt={selectedStudent.name}
                        className="h-28 w-28 rounded-full object-cover object-center border border-gray-300"
                      />
                    </div>
                  )}
                </div>

                <div className="flex lg:justify-start justify-center">
                  <div className="">
                    <h3 className="text-lg font-bold flex items-center gap-1 text-gray-900">
                      <LucideUser size={15} /> {selectedStudent.name}
                    </h3>
                    <div className="text-sm text-left text-gray-500">
                      <p>Gender: {selectedStudent.gender || "--"}</p>
                      <p>Father: {selectedStudent.fatherName}</p>
                      <p>Mother: {selectedStudent.motherName}</p>
                      <p className="text-gray-900">
                        Student ID: {selectedStudent.studentId || "—"}
                      </p>
                      <p className="flex items-center gap-1">
                        <LucideCalendar size={14} /> Date of Birth:{" "}
                        {selectedStudent.dateOfBirth
                          ? new Date(
                              selectedStudent.dateOfBirth,
                            ).toLocaleDateString()
                          : "--"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Profile */}
              <div className="lg:col-span-6 col-span-12 bg-base-200 lg:text-left text-center border border-gray-300 rounded-xl shadow-sm p-2 lg:min-h-80 space-y-2">
                <h2 className="lg:text-xl text-lg font-bold border-b border-gray-300">
                  Guardian Details
                </h2>

                <div className="flex lg:justify-center justify-center">
                  {selectedStudent.guardians?.[0]?.photo?.url ? (
                    <img
                      src={selectedStudent.guardians?.[0]?.photo?.url}
                      alt={selectedStudent.guardians?.[0]?.name}
                      className="h-28 w-28 rounded-full object-cover object-center border border-gray-300"
                    />
                  ) : (
                    <img
                      src={Avatar}
                      alt={selectedStudent.name}
                      className="h-28 w-28 rounded-full object-cover object-center border border-gray-300"
                    />
                  )}
                </div>

                <div className="flex lg:justify-start justify-center">
                  <div className="">
                    <h3 className="text-lg font-bold flex items-center gap-1 text-gray-900">
                      <LucideUser size={15} />{" "}
                      {selectedStudent.guardians?.[0]?.name || "—"}
                    </h3>
                    <div className="text-sm text-left text-gray-500">
                      <p className="lg:text-left text-center">
                        <span className="flex items-center gap-1 text-sm">
                          <LucidePhoneCall size={14} />{" "}
                          {selectedStudent.guardians?.[0]?.phone}
                        </span>
                      </p>
                      <address className="lg:text-xs text-sm flex items-center gap-1">
                        <LucideMapPin size={14} />{" "}
                        {selectedStudent.guardians?.[0]?.address || "N/A"}
                      </address>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Academic details */}
            <section className="border border-gray-300 rounded-xl shadow p-2">
              <h4 className="mb-3 font-semibold text-gray-800">
                Academic Information
              </h4>

              <div className="grid lg:grid-cols-12 grid-cols-1 justify-between gap-4">
                <div className="lg:col-span-6 col-span-12">
                  <div className="grid lg:grid-cols-12 grid-cols-1 justify-between gap-4">
                    <div className="lg:col-span-6 col-span-12">
                      <p className="text-sm text-gray-500">Class</p>
                      <p className="text-sm font-medium">
                        {selectedStudent.className || "—"}
                      </p>
                    </div>

                    <div className="lg:col-span-6 col-span-12">
                      <p className="text-sm text-gray-500">Section</p>
                      <p className="text-sm font-medium">
                        {selectedStudent.section || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 col-span-12 flex justify-between">
                  <div className="grid lg:grid-cols-12 grid-cols-1 justify-between gap-4">
                    <div className="lg:col-span-6 col-span-12">
                      <p className="text-sm text-gray-500">Roll Number</p>
                      <p className="text-sm font-medium">
                        {selectedStudent.rollNumber || "—"}
                      </p>
                    </div>

                    <div className="lg:col-span-6 col-span-12">
                      <p className="text-sm text-gray-500">Admission Type</p>
                      <p className="text-sm font-medium capitalize">
                        {selectedStudent.admissionType || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Clearance details */}
            <section className="pt-5 border border-gray-300 rounded-xl shadow p-2">
              <h4 className="mb-3 font-semibold text-gray-800">
                Clearance Information
              </h4>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Dues Clearance</p>
                  <p className="text-sm font-medium capitalize">
                    {selectedStudent.duesClearance.status.replaceAll("_", " ")}
                  </p>
                  {selectedStudent.duesClearance.verifiedBy && (
                    <p className="mt-1 text-sm text-gray-500">
                      Verified by: {selectedStudent.duesClearance.verifiedBy}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500">Library Clearance</p>
                  <p className="text-sm font-medium capitalize">
                    {selectedStudent.libraryClearance.status.replaceAll(
                      "_",
                      " ",
                    )}
                  </p>
                  {selectedStudent.libraryClearance.verifiedBy && (
                    <p className="mt-1 text-sm text-gray-500">
                      Verified by: {selectedStudent.libraryClearance.verifiedBy}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentsPage;
