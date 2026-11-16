import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setStudentAuthFailureHandler } from "../../../../../lib/studentAxios.js";

const StudentAuthNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setStudentAuthFailureHandler(() => {
      if (
        !location.pathname.includes("/student/login") &&
        !location.pathname.includes("/student/verify-otp")
      ) {
        navigate("/student-portal/student/login", {
          replace: true,
        });
      }
    });

    return () => {
      setStudentAuthFailureHandler(() => {});
    };
  }, [navigate, location.pathname]);

  return null;
};

export default StudentAuthNavigation;
