import { UserCircle2Icon } from "lucide-react";
import type { Student } from "../../../../students/studentsApi.js";

interface DashboardWelcomeProps {
  student: Student;
}

const DashboardWelcome = ({ student }: DashboardWelcomeProps) => {
  return (
    <div className="mb-8 rounded-2xl bg-linear-to-r from-blue-950 to-blue-800 p-6 text-white shadow-sm sm:p-8">
      <div className="flex items-center lg:gap-4 gap-2">
        <div className="">
          {student?.photo?.url ? (
            <img
              src={student?.photo?.url ?? ""}
              alt={student?.name}
              className="w-28 h-28 rounded-full object-cover"
            />
          ) : (
            <UserCircle2Icon size={32} />
          )}
        </div>

        <div className="">
          <p className="mb-2 text-sm font-medium text-blue-200">
            EDUCORE STUDENT PORTAL
          </p>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome, {student?.name}!
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100">
            <p>
              <span className="font-semibold">Student ID:</span>{" "}
              {student?.studentId}
            </p>
            <p>
              <span className="font-semibold">Student Roll:</span>{" "}
              {student?.rollNumber}
            </p>

            <p>
              <span className="font-semibold">Class:</span> {student.className}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcome;
