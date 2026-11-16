import { GraduationCap } from "lucide-react";
import Card from "../../../../../components/ui/Card";
import type { Student } from "../../../../students/studentsApi";
import Badge from "../../../../../components/ui/Badge";

interface AcademicInformationProps {
  student: Student;
}

interface InfoItemProps {
  label: string;
  value?: string | number;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-1 font-medium text-slate-800">{value ?? "Not provided"}</p>
  </div>
);

const AcademicInformation = ({ student }: AcademicInformationProps) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 flex items-center justify-between gap-2 text-lg font-semibold text-slate-800">
        <span>
          <GraduationCap />
          Academic Information
        </span>
        <Badge
          color={
            student?.status === "active"
              ? "green"
              : student?.status === "transferred"
                ? "amber"
                : student?.status === "graduated"
                  ? "blue"
                  : student?.status === "passed-out"
                    ? "purple"
                    : "red"
          }
        >
          <span className="capitalize">
            {student?.status || "Not provided"}
          </span>
        </Badge>
      </h2>

      <Card>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Academic Session" value={student.academicSession} />

          <InfoItem label="Class" value={student.className} />

          <InfoItem label="Group" value={student.group} />

          <InfoItem label="Section" value={student.section} />

          <InfoItem label="Roll Number" value={student.rollNumber} />

          <InfoItem label="Education Board" value={student.educationBoard} />

          <InfoItem
            label="Board Registration Number"
            value={student.boardRegistrationNumber}
          />

          <InfoItem
            label="Registration Year"
            value={student.registrationYear}
          />

          <InfoItem label="Board Roll Number" value={student.boardRollNumber} />
        </div>
      </Card>
    </section>
  );
};

export default AcademicInformation;
