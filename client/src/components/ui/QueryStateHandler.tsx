import { createElement, type ReactNode } from "react";
import { LucideIcon } from "./LucideIcons";

interface QueryStateHandlerProps {
  isLoading: boolean;
  isPending: boolean;
  isError: boolean;
  error?: unknown;
  errorMessage?: string;
  children: ReactNode;
  loadingMessage?: string;
}

const QueryStateHandler = ({
  isLoading,
  isPending,
  isError,
  error,
  children,
  loadingMessage = "Loading...",
  errorMessage = error instanceof Error
    ? error.message
    : "Something went wrong.",
}: QueryStateHandlerProps) => {
  if (isLoading) {
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
  if (isPending) {
    return <div className="flex justify-center">{loadingMessage}</div>;
  }

  if (isError) {
    const message =
      errorMessage ??
      (error instanceof Error ? error.message : "Something went wrong.");

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
        ` ${message}`,
      ),
    );
  }

  return <>{children}</>;
};

export default QueryStateHandler;
