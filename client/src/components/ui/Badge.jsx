const Badge = ({ color = "blue", children }) => {
  const colors = {
    blue: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-500",
    green: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-500",
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
