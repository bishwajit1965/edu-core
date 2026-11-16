type BadgeColor =
  | "blue"
  | "green"
  | "orange"
  | "gray"
  | "amber"
  | "purple"
  | "gray"
  | "red";

type BadgeProps = {
  color?: BadgeColor;
  children: React.ReactNode;
};

const Badge = ({ color = "blue", children }: BadgeProps) => {
  const colors = {
    blue: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-500",
    green: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-500",
    orange:
      "bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-500",
    amber: "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-500",
    purple:
      "bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-500",
    gray: "bg-gray-300 text-red-800 dark:bg-red-800 dark:text-red-500",
    red: "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-500",
  };

  return (
    <span
      className={`px-1.75 py-0.75 mr-2 shadow-sm rounded-full text-xs font-normal border border-base-content/10 ${colors[color]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
