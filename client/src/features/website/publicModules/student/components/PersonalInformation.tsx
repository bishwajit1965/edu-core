import {
  LucideCalendar,
  LucideList,
  LucideMail,
  LucideUser,
  UserCircle2Icon,
  VenusAndMars,
} from "lucide-react";
import type { Student } from "../../../../students/studentsApi";
import { FormatDate } from "../../../../../helpers/FormatDate";
import { FaAddressCard } from "react-icons/fa";

interface PersonalInformationProps {
  student: Student;
}

const PersonalInformation = ({ student }: PersonalInformationProps) => {
  return (
    <div className="mb-8 rounded-2xl bg-linear-to-r from-blue-950 to-blue-800 p-6 text-white shadow-sm sm:p-8">
      <div className="grid lg:grid-cols-12 grid-cols-1  items-center justify-between lg:gap-4 gap-2">
        <div className="lg:col-span-8 col-span-12 lg:flex grid items-center gap-4 lg:border-r border-blue-300">
          <div className="flex lg:justify-start justify-center">
            {student?.photo?.url ? (
              <img
                src={student?.photo?.url ?? ""}
                alt={student?.name}
                className="w-40 h-40 rounded-full object-cover"
              />
            ) : (
              <UserCircle2Icon size={32} />
            )}
          </div>

          <div className="space-y-2">
            <div className="text-sm space-y-1">
              <p className="mb-2 text-sm font-medium text-blue-200 ">
                EDUCORE STUDENT PORTAL
              </p>
              <h1 className="lg:text-2xl text-xl font-bold sm:text-3xl flex items-center gap-1.5">
                <LucideUser size={20} /> Welcome ! {student?.name}
              </h1>
              <p className="flex items-center gap-1.5"></p>
              <p className="lg:flex grid flex-wrap gap-2 items-center lg:gap-x-8 gap-x-0">
                <span className="flex items-center gap-1.5">
                  <LucideCalendar size={16} />
                  Date of Birth: {FormatDate(student?.dateOfBirth)}
                </span>

                <span className="flex items-center gap-1.5">
                  <VenusAndMars size={16} /> Gender: {student?.gender}
                </span>
              </p>
              <p className="flex items-center gap-1.5">
                <LucideMail size={14} /> {student?.studentEmail}
              </p>
              <p className="lg:flex grid gap-2 items-center lg:gap-x-5 gap-x-4">
                <span className="flex items-center gap-1.5">
                  <LucideCalendar size={14} /> Admission Date:{" "}
                  {FormatDate(student?.admissionDate)}{" "}
                </span>

                <span className="flex items-center gap-1.5 capitalize">
                  <LucideCalendar size={14} /> Admission Type:{" "}
                  {student?.admissionType}
                </span>
              </p>{" "}
            </div>

            <div className="flex items-center flex-wrap gap-x-1.5 space-y-2 text-sm text-blue-100">
              <div className="hidden lg:flex">
                <LucideList size={14} />
              </div>
              <div className="lg:flex gap gap-2 flex-wrap lg:gap-x-6 space-y-2 text-sm text-blue-100">
                <p>
                  <span className="font-semibold">Student ID: </span>
                  {student?.studentId}
                </p>

                <p>
                  <span className="font-semibold">Student Roll: </span>
                  {student?.rollNumber}
                </p>

                <p>
                  <span className="font-semibold">Class: </span>
                  {student.className}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <p className="mb-2 text-sm font-medium text-blue-200 ">
            EDUCORE STUDENT ADDRESS
          </p>
          <div className="space-y-2">
            <div className="">
              <h2 className="font-bold italic flex items-center gap-1.5">
                <FaAddressCard size={16} /> Present Address:
              </h2>

              <address>{student?.presentAddress}</address>
            </div>
            <div className="">
              <h2 className="font-bold italic flex items-center gap-1.5">
                {" "}
                <FaAddressCard size={16} />
                Permanent Address:
              </h2>
              <address>{student?.permanentAddress}</address>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
