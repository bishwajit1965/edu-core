import { createElement } from "react";
import { LucideIcon } from "./LucideIcons";

const DataState = (props: { loading: boolean; error: string | null }) => {
  const { loading } = props;
  const error = props.error;
  if (loading) {
    return createElement(
      "div",
      {
        className: "min-h-[calc(100vh-150px)] flex items-center justify-center",
      },
      createElement(
        "p",
        { className: "" },
        createElement(LucideIcon.Loader, { className: "animate-spin" }),
      ),
    );
  }

  if (error) {
    return createElement(
      "div",
      {
        className:
          "min-h-[calc(100vh-150px)] flex items-center justify-center text-red-500",
      },
      createElement(
        "p",
        { className: "flex items-center gap-1" },
        createElement(LucideIcon.AlertTriangleIcon, { size: 16 }),
        createElement("span", { className: "font-bold" }, "Error:"),
        ` ${error}`,
      ),
    );
  }

  return null;
};

export default DataState;

// Example usage:
// <DataState loading={loading} error={loadError} />
