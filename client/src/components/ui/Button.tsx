import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentType,
  ReactNode,
} from "react";
import { LoaderCircle } from "lucide-react";

type ButtonVariant = "primary" | "success" | "secondary" | "warning" | "danger";
type IconPosition = "left" | "right";
type ButtonSize = "xs" | "sm" | "md" | "lg";

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-0.75 py-0.5 text-xs gap-0.5",
  sm: "px-2 py-1.5 text-xs gap-1.5",
  md: "px-3 py-2 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2.5",
};

type IconComponent = ComponentType<{ size?: number; className?: string }>;

interface SharedButtonProps {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: IconComponent;
  iconPosition?: IconPosition;
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
}

type ButtonAsButton = SharedButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: never;
  };

type ButtonAsLink = SharedButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
  success:
    "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
  secondary:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400",
  warning:
    "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 shadow:2xl mx-0.5 cursor-pointer";

const Button = (props: ButtonProps) => {
  const {
    variant = "primary",
    loading = false,
    icon: Icon,
    iconPosition = "left",
    children,
    className = "",
    size = "md",
  } = props;

  const content = (
    <>
      {loading ? (
        <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && iconPosition === "left" && <Icon size={16} aria-hidden="true" />
      )}

      {children}

      {!loading && Icon && iconPosition === "right" && (
        <Icon size={16} aria-hidden="true" />
      )}
    </>
  );

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    const {
      href,
      loading,
      icon: _icon,
      iconPosition: _iconPosition,
      variant: _variant,
      children: _children,
      className: _className,
      ...linkProps
    } = props;

    void [_icon, _iconPosition, _variant, _children, _className];

    return (
      <a
        {...linkProps}
        href={href}
        aria-disabled={loading || undefined}
        tabIndex={loading ? -1 : linkProps.tabIndex}
        className={`${classes} ${loading ? "pointer-events-none opacity-60" : ""}`}
      >
        {content}
      </a>
    );
  }

  const {
    loading: _loading,
    icon: _icon,
    iconPosition: _iconPosition,
    variant: _variant,
    children: _children,
    className: _className,
    ...buttonProps
  } = props;

  void [_loading, _icon, _iconPosition, _variant, _children, _className];

  return (
    <button
      {...buttonProps}
      disabled={buttonProps.disabled || loading}
      className={classes}
    >
      {content}
    </button>
  );
};

export default Button;

// Example Usage
{
  /* <Button
  onClick={handleSave}
  loading={saving}
  variant="success"
  icon={saving ? LoaderCircle : Save}
>
  {saving ? "Saving..." : "Save Settings"}
</Button>; */
}
