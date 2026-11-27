import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";

const AccessDenied = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <ShieldX className="mb-5 h-16 w-16 text-red-500" />

      <h1 className="text-3xl font-bold text-gray-800">403 - Access Denied</h1>

      <p className="mt-3 max-w-md text-gray-600">
        Sorry, you don't have the required role or permission to access this
        page.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default AccessDenied;
