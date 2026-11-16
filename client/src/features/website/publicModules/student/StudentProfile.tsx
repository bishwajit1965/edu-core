import { useOutletContext } from "react-router-dom";
import type { Student } from "../../../students/studentsApi";
import ParentsInformation from "./components/ParentsInformation";
import PersonalInformation from "./components/PersonalInformation";
import AcademicOverview from "./components/AcademicOverview";
import AcademicInformation from "./components/AcademicInformation";

const StudentProfile = () => {
  const { student } = useOutletContext<{ student: Student }>();
  const academicStudent = {
    ...student,
    className: student.className ?? "",
    group: student.group ?? "",
    section: student.section ?? "",
    rollNumber: student.rollNumber ?? "",
  };

  return (
    <div className="space-y-6">
      <PersonalInformation student={student} />
      <ParentsInformation student={student} />
      <AcademicInformation student={student} />
      <AcademicOverview student={academicStudent} />
    </div>
  );
};

export default StudentProfile;
