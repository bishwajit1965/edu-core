import type { HTMLAttributes, ReactNode } from "react";
import Badge from "./Badge";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children?: ReactNode;
  counter?: string | number;
}

const Card = ({
  title,
  description,
  counter,
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
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 justify-between">
              <span>{title}</span>
              {counter && <Badge>{counter} Items</Badge>}
            </h2>
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
