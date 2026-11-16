import type { ReactNode } from "react";
import Badge from "./Badge";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  countBadge?: ReactNode;
}

const PageHeader = ({
  title,
  description,
  actions,
  countBadge,
}: PageHeaderProps) => {
  return (
    <header className="sticky top-16 z-20 mb-6 isolate overflow-hidden rounded-2xl border border-blue-900/20 bg-linear-to-br from-slate-950 via-blue-950 to-indigo-950 p-5 text-white shadow-xl shadow-blue-950/10 sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-24 z-0 h-64 w-64 rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-16 z-0 h-48 w-48 rounded-full border border-white/10"
      />

      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-blue-200">
            Campus administration
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            {countBadge && <Badge>{countBadge}</Badge>}
          </div>

          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-100/80 sm:text-base">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;

// Example Usage
{
  /* <PageHeader
  title="Institution Settings"
  description="Manage your institution's information and preferences."
  actions={
    <Button onClick={handleSave} loading={saving}>
      Save Settings
    </Button>
  }
/>; */
}
