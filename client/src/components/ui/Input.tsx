import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

const Input = ({
  label,
  error,
  id,
  icon: Icon,
  iconPosition = "left",
  className = "",
  ...props
}: InputProps) => {
  const inputId = id ?? props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
              iconPosition === "left" ? "left-3" : "right-3"
            }`}
          />
        )}

        <input
          id={inputId}
          className={`w-full rounded-md border text-sm outline-none transition focus:ring-2 ${
            props.type === "color"
              ? "h-10 cursor-pointer p-1"
              : `py-2 ${
                  Icon
                    ? iconPosition === "left"
                      ? "pl-10 pr-3"
                      : "pl-3 pr-10"
                    : "px-3"
                }`
          } ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
          } ${className}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;

// Exam Usage
{
  /* <Input
  label="Institution Name"
  name="institutionName"
  placeholder="Enter institution name"
  required
/> */
}
// With error
{
  /* <Input
  label="Email"
  name="email"
  type="email"
  error="Please enter a valid email address"
/> */
}

// Usage with Icon
{
  /* <Input
  name="password"
  type="password"
  placeholder="Enter password"
  icon={Eye}
  iconPosition="right"
/> */
}
