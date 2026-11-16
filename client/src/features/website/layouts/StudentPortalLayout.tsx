import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import StudentSidebar from "../publicModules/student/components/StudentSidebar.js";
import StudentHeader from "../publicModules/student/components/StudentHeader.js";

import { usePublicApiQuery } from "../../../hooks/publicDataFetcherHooks/usePublicApiQuery.js";
import { PUBLIC_API_KEYS } from "../../../hooks/publicDataFetcherHooks/queryKeyConstants.js";
import { getStudentProfile } from "../../students/studentsApi.js";
import StudentAuthNavigation from "../publicModules/student/services/StudentAuthNavigation.js";
import { logoutStudent } from "../publicModules/student/services/studentAuthApi.js";
import { useQueryClient } from "@tanstack/react-query";

const StudentPortalLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: student,
    isLoading,
    isError,
  } = usePublicApiQuery({
    key: [...PUBLIC_API_KEYS.ME],
    queryFn: getStudentProfile,
  });

  // LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await logoutStudent();

      // Remove the cached Student profile
      queryClient.removeQueries({
        queryKey: [...PUBLIC_API_KEYS.ME],
      });

      // Redirect to Student Login
      navigate("/student-portal/student/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Student logout failed:", error);
    }
  };

  console.log("STUDENT DATA IN STUDENT PORTAL LAYOUT", student);

  return (
    <>
      <StudentAuthNavigation />
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm font-medium text-slate-500">
            Loading student portal...
          </p>
        </div>
      ) : isError || !student ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm font-medium text-red-500">
            Unable to load your student profile. Please sign in again.
          </p>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50">
          <StudentSidebar
            expanded={sidebarExpanded}
            mobileOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />

          <div
            className={`min-h-screen transition-all duration-300 ${
              sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
            }`}
          >
            <StudentHeader
              student={student}
              expanded={sidebarExpanded}
              onToggleSidebar={() => setSidebarExpanded((prev) => !prev)}
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
              onLogout={handleLogout}
            />

            <main className="p-4 sm:p-6 lg:p-8">
              <Outlet context={{ student }} />
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentPortalLayout;
