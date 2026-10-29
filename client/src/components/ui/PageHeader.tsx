import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
  return (
    <div className="sticky top-16 z-20 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white rounded-md border border-gray-300 p-4 shadow">
      <div>
        <h1 className="lg:text-2xl text-xl font-bold text-gray-900">{title}</h1>

        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
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
