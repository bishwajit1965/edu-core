import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  description?: string;
}

const Checkbox = ({
  label,
  description,
  id,
  name,
  className = "",
  ...props
}: CheckboxProps) => {
  const checkboxId = id ?? name;

  return (
    <div className="flex items-start gap-3">
      <input
        id={checkboxId}
        name={name}
        type="checkbox"
        className={`mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />

      <div>
        <label
          htmlFor={checkboxId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>

        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;

// Example Usage
{
  /* <Checkbox
  label="Registration Enabled"
  description="Allow new users to register."
  name="registrationEnabled"
  checked={registrationEnabled}
  onChange={(event) => setRegistrationEnabled(event.target.checked)}
/>; */
}
