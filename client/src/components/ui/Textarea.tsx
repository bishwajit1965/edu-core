import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = ({
  label,
  error,
  id,
  className = "",
  rows = 4,
  ...props
}: TextareaProps) => {
  const textareaId = id ?? props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
        } ${className}`}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;

// Example Usage
{
  /* <Textarea
  label="Institution Address"
  name="address"
  value={address}
  onChange={(event) => setAddress(event.target.value)}
  placeholder="Enter the full institution address"
  rows={3}
  required
/>; */
}
