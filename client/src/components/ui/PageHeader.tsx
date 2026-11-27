import type { ReactNode } from "react";
import Badge from "./Badge";
import { useMatches } from "react-router-dom";
import { LucideLayoutDashboard } from "lucide-react";
import { LucideIcon } from "./LucideIcons";

interface PageHeaderProps {
  description?: string;
  actions?: ReactNode;
  countBadge?: ReactNode;
  icon?: ReactNode;
  subject?: string;
  dataLength?: number;
}

const PageHeader = ({
  description,
  actions,
  countBadge,
  icon,
  dataLength,
  subject,
}: PageHeaderProps) => {
  const matches = useMatches();

  const currentPageTitle = matches
    .map((match) => match.handle as { title?: string } | undefined)
    .filter((handle) => handle?.title)
    .at(-1)?.title;

  return (
    <header className="sticky top-16 z-20 mb-6 isolate overflow-hidden rounded-lg border border-gray-300 lg:p-4 sm:p-2 bg-gray-100 text-slate-800 shadow-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-24 z-0 h-64 w-64 rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-16 z-0 h-48 w-48 rounded-full border border-white/10"
      />

      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-x-2">
            <div className="h-1 bg-blue-500 px-4 rounded-xl"></div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-blue-600">
              Edu Core administration
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="lg:text-xl font-bold tracking-tight text-gray-900 text-sm flex items-center gap-x-2">
              {icon ? icon : <LucideLayoutDashboard size={18} />}{" "}
              {currentPageTitle}
            </h1>
            {countBadge && <Badge>{countBadge}</Badge>}
          </div>

          {description && (
            <p className="max-w-3xl text-sm leading-6 text-gray-700 sm:text-base">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
            {dataLength && (
              <div className="aura text-emerald-600">
                <div className="card bg-base-100 text-base-content">
                  <div className="card-body p-0.5">
                    <h3 className="flex items-center gap-2 rounded-md border border-gray-300 bg-base-100 px-2.5 py-0.5 text-sm font-bold lg:text-sm">
                      <LucideIcon.List size={15} />
                      {subject ? subject : ""} :
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-thin text-white">
                        {dataLength ?? 0}
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
            )}
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
