import { useState } from "react";
import Button from "../../components/ui/Button";
import { LucideIcon } from "../../components/ui/LucideIcons";

const Test = () => {
  // 1. Initialize state with one default field object
  const [fields, setFields] = useState([
    { id: crypto.randomUUID(), value: "" },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  // 2. Add a new object to the state array
  const handleAddField = () => {
    setFields([...fields, { id: crypto.randomUUID(), value: "" }]);
  };

  // 3. Update the specific field's value in state
  const handleChange = (id: string, newValue: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, value: newValue } : field,
      ),
    );
  };

  // 4. Remove a field by filtering out its ID
  const handleRemoveField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Submitted state:", fields);
  };

  const handleClear = () => {
    setFields([]);
    setIsOpen(false);
  };

  return (
    <div className="flex lg:max-w-2xl mx-auto border rounded-xl bg-base-200 border-gray-300 lg:p-8 p-4 shadow-lg">
      <div className="lg:space-y-8 space-y-4 mx-auto">
        <h2 className="lg:text-3xl font-bold border-b-2 border-gray-300 pb-2.5 flex items-center gap-x-2">
          <LucideIcon.List /> Dynamic Form Input Test
        </h2>
        <div className="">
          {isOpen ? (
            fields.map((field) => (
              <div key={field.id} className="space-y-4">
                <p className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-bold">Id: {field.id}</span>
                  <span className="text-sm font-bold">
                    Value: {field.value}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <div className="">
              <p>Insert data & click submit button to view data</p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div
              key={field.id}
              style={{ marginBottom: "8px" }}
              className="flex gap-4"
            >
              <input
                type="text"
                placeholder={`Item ${index + 1}`}
                value={field.value}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="input input-sm"
              />
              {fields.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(field.id)}
                  className="btn btn-sm cursor-pointer btn-secondary"
                >
                  −
                </button>
              )}
            </div>
          ))}

          {/* Make sure type="button" is set so clicking + doesn't submit the form */}
          <div className="flex items-center gap-4 mt-4">
            <Button
              size="sm"
              variant="primary"
              type="button"
              onClick={handleAddField}
              icon={LucideIcon.Plus}
            >
              Add field
            </Button>

            <Button
              onClick={() => setIsOpen(true)}
              type="submit"
              size="sm"
              variant="success"
              icon={LucideIcon.UploadCloud}
            >
              Submit
            </Button>
            <Button
              onClick={handleClear}
              type="submit"
              size="sm"
              icon={LucideIcon.RefreshCcw}
              variant="warning"
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Test;
