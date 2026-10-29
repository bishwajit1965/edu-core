import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: ReactNode;
}

const Card = ({
  title,
  description,
  children,
  className = "",
  ...props
}: CardProps) => {
  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}

          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}

      {children}
    </section>
  );
};

export default Card;

// Example Usage
{
  /* <Card
  title="Institution Information"
  description="Manage your institution's basic details."
>
  <p>Institution settings form goes here.</p>
</Card> */
}
