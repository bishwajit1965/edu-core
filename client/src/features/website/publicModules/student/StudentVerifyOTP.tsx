import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import axiosInstance from "../../../../lib/axios";

const OTP_LENGTH = 6;

const StudentVerifyOTP = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const studentId = location.state?.studentId;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateOTP = (value: string, index: number) => {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      const updatedOTP = [...otp];
      updatedOTP[index] = "";
      setOtp(updatedOTP);
      return;
    }

    const updatedOTP = [...otp];

    // Support multi-digit input and OTP autofill.
    digits
      .split("")
      .slice(0, OTP_LENGTH - index)
      .forEach((digit, i) => {
        updatedOTP[index + i] = digit;
      });

    setOtp(updatedOTP);
    setError("");

    const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);

    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updatedOTP = [...otp];
        updatedOTP[index] = "";
        setOtp(updatedOTP);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }

      setError("");
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedDigits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    const updatedOTP = Array(OTP_LENGTH).fill("");

    pastedDigits.split("").forEach((digit, index) => {
      updatedOTP[index] = digit;
    });

    setOtp(updatedOTP);
    setError("");

    inputRefs.current[Math.min(pastedDigits.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const completeOTP = otp.join("");

    if (!/^\d{6}$/.test(completeOTP)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await axiosInstance.post("/student-auth/verify-otp", {
        studentId,
        otp: completeOTP,
      });

      if (response) {
        navigate("/student-portal/student/dashboard", {
          replace: true,
        });
      }

      console.log("Student verification response:", response.data);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(
        axiosError.response?.data?.message ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!studentId) {
    return (
      <div className="text-center">
        <p className="text-slate-600">
          Student ID is missing. Please start again.
        </p>

        <button
          onClick={() => navigate("/student-portal/student/login")}
          className="mt-5 font-semibold text-teal-700 hover:underline"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700">
        <FaShieldAlt />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800">Verify your email</h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          We have sent a six-digit verification code to the registered email
          address for Student ID:
          <span className="ml-1 font-semibold text-slate-700">{studentId}</span>
        </p>
      </div>

      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Verification Code
        </label>

        <div className="flex justify-between gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={OTP_LENGTH}
              value={digit}
              disabled={isSubmitting}
              onChange={(e) => updateOTP(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              aria-label={`OTP digit ${index + 1}`}
              className="h-12 min-w-0 w-full rounded-xl border border-slate-200 bg-slate-50 text-center text-xl font-bold text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 disabled:opacity-60 sm:h-14"
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || otp.join("").length !== OTP_LENGTH}
        className="w-full cursor-pointer rounded-xl bg-[#12304A] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Verifying..." : "Verify OTP"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/student-portal/student/login")}
        className="flex w-full cursor-pointer items-center justify-center gap-2 py-2 text-sm font-medium text-slate-500 hover:text-teal-700"
      >
        <FaArrowLeft />
        Back to Student Login
      </button>
    </form>
  );
};

export default StudentVerifyOTP;

// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
// import axiosInstance from "../../../../lib/axios";

// const StudentVerifyOTP = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const studentId = location.state?.studentId;

//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!/^\d{6}$/.test(otp)) {
//       setError("Please enter a valid 6-digit OTP.");
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       setError("");

//       const response = await axiosInstance.post("/student-auth/verify-otp", {
//         studentId,
//         otp,
//       });

//       if (response) {
//         navigate("/student-portal/student/dashboard", {
//           replace: true,
//         });
//       }

//       console.log("Student verification response:", response.data);

//       // Session handling will be connected after confirming
//       // the exact access-token response structure.
//     } catch (error: unknown) {
//       const axiosError = error as {
//         response?: {
//           data?: {
//             message?: string;
//           };
//         };
//       };

//       setError(
//         axiosError.response?.data?.message ||
//           "OTP verification failed. Please try again.",
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!studentId) {
//     return (
//       <div className="text-center">
//         <p className="text-slate-600">
//           Student ID is missing. Please start again.
//         </p>

//         <button
//           onClick={() => navigate("/student-portal/student/login")}
//           className="mt-5 font-semibold text-teal-700 hover:underline"
//         >
//           Back to Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700">
//         <FaShieldAlt />
//       </div>

//       <div>
//         <h2 className="text-2xl font-bold text-slate-800">Verify your email</h2>

//         <p className="mt-3 text-sm leading-6 text-slate-500">
//           We have sent a six-digit verification code to the registered email
//           address for Student ID:
//           <span className="ml-1 font-semibold text-slate-700">{studentId}</span>
//         </p>
//       </div>

//       <div>
//         <label
//           htmlFor="otp"
//           className="mb-2 block text-sm font-semibold text-slate-700"
//         >
//           Verification Code
//         </label>

//         <input
//           id="otp"
//           type="text"
//           inputMode="numeric"
//           autoComplete="one-time-code"
//           maxLength={6}
//           value={otp}
//           onChange={(e) => {
//             setOtp(e.target.value.replace(/\D/g, ""));
//             setError("");
//           }}
//           placeholder="Enter 6-digit OTP"
//           className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-xl font-bold tracking-[0.5em] text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
//         />
//       </div>

//       {error && (
//         <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
//           {error}
//         </p>
//       )}

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full rounded-xl bg-[#12304A] px-5 py-3.5 text-sm cursor-pointer font-semibold text-white shadow-lg transition hover:bg-teal-700"
//       >
//         Verify OTP
//       </button>

//       <button
//         type="button"
//         onClick={() => navigate("/student-portal/student/login")}
//         className="flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-slate-500 hover:text-teal-700 cursor-pointer"
//       >
//         <FaArrowLeft />
//         Back to Student Login
//       </button>
//     </form>
//   );
// };

// export default StudentVerifyOTP;
