import { NavLink } from "react-router-dom";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaChartBar,
  FaClipboardList,
  FaHome,
  FaUser,
  FaTimes,
} from "react-icons/fa";

interface StudentSidebarProps {
  expanded: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    label: "Dashboard",
    path: "/student-portal/student/dashboard",
    icon: FaHome,
  },
  {
    label: "My Profile",
    path: "/student-portal/student/profile",
    icon: FaUser,
  },
  {
    label: "Notices",
    path: "/student-portal/student/notices",
    icon: FaBookOpen,
  },
  {
    label: "Class Routine",
    path: "/student-portal/student/routine",
    icon: FaCalendarAlt,
  },
  {
    label: "Examinations",
    path: "/student-portal/student/examinations",
    icon: FaClipboardList,
  },
  {
    label: "Results",
    path: "/student-portal/student/results",
    icon: FaChartBar,
  },
];

const StudentSidebar = ({
  expanded,
  mobileOpen,
  onClose,
}: StudentSidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#12304A] text-white transition-all duration-300
        ${expanded ? "w-64" : "w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Branding */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          {expanded && (
            <div>
              <h2 className="text-lg font-bold">Institution Name</h2>
              <p className="text-xs text-slate-300">Student Portal</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-3">
          {navigationItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              title={!expanded ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-lg px-4 py-3 transition-colors
                ${
                  isActive
                    ? "bg-white text-[#12304A] font-semibold"
                    : "text-slate-200 hover:bg-white/10"
                }`
              }
            >
              <Icon className="shrink-0 text-lg" />

              {expanded && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {expanded && (
          <div className="border-t border-white/10 p-4 text-xs text-slate-300">
            Powered by EduCore
          </div>
        )}
      </aside>
    </>
  );
};

export default StudentSidebar;
