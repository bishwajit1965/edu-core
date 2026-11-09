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
      className={`lg:mb-4 mb-3 border border-gray-300 rounded-xl p-4 ${className}`}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500"
        >
          {breadcrumbs.map((item, index) => (
            <span
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {item.href ? (
                <Link
                  to={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={
                    index === breadcrumbs.length - 1 ? "page" : undefined
                  }
                  className="font-medium text-gray-700"
                >
                  {item.label}
                </span>
              )}

              {index !== breadcrumbs.length - 1 && (
                <span aria-hidden="true">/</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="lg:max-w-3xl">
          <h1 className="lg:text-4xl text-xl font-extrabold tracking-tights text-gray-900 flex items-center gap-2">
            {icon} {title}{" "}
            {counter && <Badge color="blue">{counter} Items</Badge>}
          </h1>

          {description && (
            <p className="mt-3 text-base leading-7 text-gray-600">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        )}
      </div>
    </header>
  );
};

export default PublicPageHeader;
