import type { ReactNode } from "react";

interface PublicPageContainerProps {
  children: ReactNode;
  className?: string;
}

const PublicPageContainer = ({
  children,
  className = "",
}: PublicPageContainerProps) => {
  return <main className={`mx-auto max-w-7xl ${className}`}>{children}</main>;
};

export default PublicPageContainer;
