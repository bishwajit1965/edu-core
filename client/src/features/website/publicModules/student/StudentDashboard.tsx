import { useOutletContext } from "react-router-dom";
import type { Student } from "../../../students/studentsApi";
import DashboardWelcome from "./components/DashboardWelcome";
import AcademicOverview from "./components/AcademicOverview";
import QuickAccess from "./components/QuickAccess";
import ParentsInformation from "./components/ParentsInformation";

const StudentDashboard = () => {
  const { student } = useOutletContext<{ student: Student }>();
  console.log("Student Name", student?.name);

  const academicStudent = {
    className: student?.className ?? "",
    group: student?.group ?? "",
    section: student?.section ?? "",
    rollNumber: student?.rollNumber ?? "",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <DashboardWelcome student={student} />

      <AcademicOverview student={academicStudent} />

      <ParentsInformation student={student} />

      <QuickAccess />
    </div>
  );
};

export default StudentDashboard;
