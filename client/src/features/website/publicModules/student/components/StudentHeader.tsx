import { UserCircle2Icon } from "lucide-react";
import { FaBars, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

interface StudentHeaderProps {
  expanded: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
  onLogout: () => void | Promise<void>;
  student?: {
    name?: string;
    role?: string;
    photo?: { url?: string } | string | null;
    url?: string;
  } | null;
}

const StudentHeader = ({
  expanded,
  onToggleSidebar,
  onOpenMobileSidebar,
  onLogout,
  student,
}: StudentHeaderProps) => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const studentName = student?.name || "Student Name";
  const studentRole = student?.role || "STUDENT";
  const studentPhoto =
    typeof student?.photo === "string"
      ? student.photo
      : (student?.photo?.url ?? student?.url ?? "");

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-base-100 px-4 shadow-sm sm:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Desktop Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:block"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? <FaChevronLeft /> : <FaChevronRight />}
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <FaBars className="text-xl" />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-slate-800">
            Student Portal
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Access your academic information
          </p>
        </div>
      </div>

      {/* Right Section */}

      <div className="flex items-center gap-3 bg">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">
            Student Name: {studentName}
          </p>
          <p className="text-xs text-slate-500">Role: {studentRole}</p>
        </div>
        <div className="dropdown dropdown-end relative">
          <button
            type="button"
            onClick={() => setAccountMenuOpen((open) => !open)}
            aria-label="Open account menu"
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="h- w-14 rounded-full">
              {studentPhoto ? (
                <img
                  src={studentPhoto}
                  alt={studentName}
                  className="h- w-14 rounded-full border border-gray-300 bg-gray-300 p-px object-cover shadow"
                />
              ) : (
                <UserCircle2Icon
                  size={50}
                  className="bg-gray-300 p-px text-gray-400"
                />
              )}
            </div>
          </button>
          <ul
            role="menu"
            aria-label="Account menu"
            hidden={!accountMenuOpen}
            className="menu menu-sm dropdown-content absolute right-0 top-full z-50 mt-2 w-52 rounded-box bg-base-100 p-2 shadow-lg"
          >
            <li>
              <a
                href="/student-portal/student/profile"
                role="menuitem"
                onClick={() => setAccountMenuOpen(false)}
              >
                Profile
              </a>
            </li>
            <li>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setAccountMenuOpen(false);
                  void onLogout();
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
