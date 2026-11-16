import { useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaIdCard } from "react-icons/fa";
import axiosInstance from "../../../../lib/axios.js";

const StudentLogin = () => {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedStudentId = studentId.trim();

    if (!trimmedStudentId) {
      setError("Please enter your Student ID.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await axiosInstance.post("/student-auth/request-otp", {
        studentId: trimmedStudentId,
      });

      navigate("/student-portal/student/verify-otp", {
        state: { studentId: trimmedStudentId },
      });
    } catch (error: unknown) {
      setError(
        (isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "") || "Unable to process your request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="studentId"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Student ID
        </label>

        <div className="relative">
          <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter your Student ID"
            autoComplete="username"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#12304A] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        {isSubmitting ? "Please wait..." : "Continue with Student ID"}
        {!isSubmitting && <FaArrowRight />}
      </button>

      <p className="text-center text-xs leading-5 text-slate-400">
        A one-time verification code will be sent to your registered student
        email address.
      </p>
    </form>
  );
};

export default StudentLogin;
