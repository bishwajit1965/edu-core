interface CountBadgeProps {
  dataLength: unknown[] | string | number;
  color?: string;
  border?: string;
}

const CountBadge = ({
  dataLength,
  color = "emerald-500",
  border = "emerald-600",
}: CountBadgeProps) => {
  const count =
    Array.isArray(dataLength) || typeof dataLength === "string"
      ? dataLength.length
      : typeof dataLength === "number"
        ? dataLength
        : 0;

  if (count === 0) {
    return (
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-thin text-base-100 border shadow bg-emerald-500 border-emerald-600">
        0
      </span>
    );
  }

  return (
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-thin border shadow ${color ? `bg-${color}` : "bg-emerald-500"} ${border ? `border-${border}` : "border-emerald-600"}`}
    >
      {count}
    </div>
  );
};

export default CountBadge;
