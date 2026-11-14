export const FormatDate = (v: unknown) => {
  try {
    const raw =
      typeof v === "string"
        ? v
        : typeof v === "object" && v !== null && "$date" in v
          ? (v as { $date?: string | number }).$date
          : typeof v === "object" && v !== null && "_seconds" in v
            ? (v as { _seconds?: number })._seconds! * 1000
            : null;

    if (!raw) return "-";

    const d = new Date(raw);

    return isNaN(d.getTime())
      ? "-"
      : d.toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          //   hour: "numeric",
          //   minute: "2-digit",
          //   hour12: true,
        });
  } catch {
    return "-";
  }
};
