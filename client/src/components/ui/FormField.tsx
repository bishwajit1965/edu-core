import type { ReactNode } from "react";

interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}

const FormField = ({
  label,
  htmlFor,
  error,
  description,
  required = false,
  children,
}: FormFieldProps) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-gray-700"
        >
          {label}

          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {children}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;

// Example Usage
{
  /* <FormField label="Institution Name" htmlFor="institutionName" required>
  <Input
    id="institutionName"
    name="institutionName"
    placeholder="Enter institution name"
    required
  />
</FormField>; */
}
