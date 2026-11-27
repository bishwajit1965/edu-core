import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LucideEye,
  LucideEyeClosed,
  LucideHome,
  LucideKeyRound,
  LucideLogIn,
  LucideMail,
  LucideUsers,
} from "lucide-react";

type LoginResponse = {
  success: boolean;
  message?: string;
  passwordResetMessage?: string;
  user?: {
    roles?: {
      name?: string;
      key?: string;
    }[];
  };
};

const Login = () => {
  const location = useLocation();
  const verifiedEmail =
    (location.state as { email?: string } | null)?.email ?? "";

  const passwordResetMessage =
    (location.state as { message?: string } | null)?.message ?? "";
  const [email, setEmail] = useState(verifiedEmail);
  const [password, setPassword] = useState("");
  const [readPassword, setReadPassword] = useState(false);
  const [message, setMessage] = useState(passwordResetMessage);
  const [messageType, setMessageType] = useState<"success" | "error">(
    passwordResetMessage ? "success" : "error",
  );
  const [requiresVerification, setRequiresVerification] = useState(false);
  const navigate = useNavigate();

  const auth = useAuth() as {
    authReady?: boolean;
    login: (credentials: {
      email: string;
      password: string;
    }) => Promise<LoginResponse>;

    user?: {
      name?: string;
      email?: string;
      roles?: {
        name?: string;
        key?: string;
      }[];
    };

    logout: () => Promise<void>;
  };

  const { authReady, login } = auth;
  console.log("AUTH CONTEXT:", auth);

  const toggleReadPassword = () => {
    setReadPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setRequiresVerification(false);

    try {
      const response = await login({
        email,
        password,
      });

      if (response.success) {
        setEmail("");
        setPassword("");
        setMessageType("success");

        const isAdmin = response.user?.roles?.some(
          (role) => role.key === "ADMIN",
        );

        if (isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setMessageType("error");
        setMessage(response.message || "Login failed. Please try again.");
      }
    } catch (error: unknown) {
      setMessageType("error");

      const errorMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      setMessage(errorMessage || "Login failed. Please try again.");

      const needsVerification =
        errorMessage === "Please verify your email address.";

      setRequiresVerification(needsVerification);
      setMessage(
        needsVerification
          ? "Your email address has not been verified. Please verify your email before logging in."
          : errorMessage || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="lg:min-w-sm min-w-full border border-gray-200 rounded-2xl lg:p-8 p-4 space-y-4 shadow-xl">
      {!authReady && (
        <p className="text-red-500 font-bold">
          Authentication is not ready yet. Please wait...
        </p>
      )}

      <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
        <LucideLogIn className="w-4 h-4" />
        Edu Core Login
      </h1>
      <div className="lg:max-w-xs cursor-pointer mx-auto">
        {message && (
          <div
            className={`rounded-lg p-3 text-xs font-medium ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="lg:max-w-xs cursor-pointer mx-auto">
        {requiresVerification && (
          <Link
            to="/auth/verify-email"
            state={{ email }}
            className="btn btn-sm btn-outline btn-primary w-full flex items-center cursor-pointer lg:max-w-xl"
          >
            <LucideMail size={14} /> Verify Your Email
          </Link>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="lg:max-w-xs mx-auto w-full space-y-4"
      >
        <div className="w-full space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
        </div>

        <div className="w-full relative">
          <input
            type={readPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={toggleReadPassword}
          >
            {readPassword ? (
              <LucideEyeClosed size={16} />
            ) : (
              <LucideEye size={16} />
            )}
          </button>
        </div>
        <div className="grid gap-2 w-full">
          <div className="w-full">
            <button type="submit" className="btn btn-sm btn-primary w-full">
              <LucideLogIn className="w-5 h-5" /> Login
            </button>
          </div>
          <div className="lg:flex grid items-center justify-between gap-2">
            <Link
              to="/auth/forgot-password"
              className="m-0 text-xs text-indigo-500 hover:link flex items-center gap-0.5"
            >
              Forgot Password ? <LucideKeyRound size={14} />
              Change
            </Link>{" "}
            <Link
              to="/"
              className="m-0 text-xs text-indigo-500 hover:link flex items-center gap-0.5"
            >
              <LucideHome size={14} />
              Home
            </Link>
            <Link
              to="/auth/register"
              className="m-0 text-xs text-indigo-500 hover:link flex items-center gap-0.5"
            >
              <LucideUsers className="w-4 h-4" />
              Register
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
