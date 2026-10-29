import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = ({
  label,
  error,
  id,
  name,
  options,
  placeholder = "Select an option",
  className = "",
  ...props
}: SelectProps) => {
  const selectId = id ?? name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
        } ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;

// Example Usage
{
  /* <Select
  label="Institution Type"
  name="type"
  value={institutionType}
  onChange={(event) => setInstitutionType(event.target.value)}
  options={[
    { label: "School", value: "SCHOOL" },
    { label: "College", value: "COLLEGE" },
    { label: "School & College", value: "SCHOOL_COLLEGE" },
  ]}
  required
/> */
}
