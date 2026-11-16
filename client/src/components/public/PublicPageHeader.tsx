import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PublicPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
  icon?: ReactNode;
  counter?: number;
}

const PublicPageHeader = ({
  title,
  icon,
  description,
  breadcrumbs,
  actions,
  className = "",
  counter,
}: PublicPageHeaderProps) => {
  return (
    <header
      className={`relative isolate mb-4 overflow-hidden rounded-2xl border border-blue-900/20 bg-linear-to-br from-slate-950 via-blue-950 to-indigo-950 p-5 text-white shadow-xl shadow-blue-950/10 sm:p-7 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-24 z-0 h-64 w-64 rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-16 z-0 h-48 w-48 rounded-full border border-white/10"
      />

      <div className="relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-blue-100/70 sm:text-sm"
          >
            {breadcrumbs.map((item, index) => (
              <span
                key={`${item.label}-${index}`}
                className="flex items-center gap-2"
              >
                {item.href ? (
                  <Link
                    to={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={
                      index === breadcrumbs.length - 1 ? "page" : undefined
                    }
                    className="font-semibold text-white/90"
                  >
                    {item.label}
                  </span>
                )}

                {index !== breadcrumbs.length - 1 && (
                  <span aria-hidden="true" className="text-white/30">
                    /
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 lg:max-w-3xl">
            <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-blue-200">
              Institutional website
            </p>

            <h1 className="flex flex-wrap items-center gap-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {icon && (
                <span className="shrink-0 text-teal-300" aria-hidden="true">
                  {icon}
                </span>
              )}
              <span>{title}</span>
              {counter !== undefined && (
                <Badge color="blue">{counter} Items</Badge>
              )}
            </h1>
            {description && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100/80 sm:text-base sm:leading-7">
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
      </div>
    </header>
  );
};

export default PublicPageHeader;
