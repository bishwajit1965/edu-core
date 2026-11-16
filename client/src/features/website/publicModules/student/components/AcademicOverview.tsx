interface AcademicOverviewProps {
  student: {
    className: string;
    group: string;
    section: string;
    rollNumber: string;
  };
}

const AcademicOverview = ({ student }: AcademicOverviewProps) => {
  const items = [
    {
      label: "Class",
      value: student.className,
      icon: "📚",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Group",
      value: student.group,
      icon: "🎓",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Section",
      value: student.section,
      icon: "👥",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Roll Number",
      value: student.rollNumber,
      icon: "🪪",
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Academic Overview
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{item.label}</p>

              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}
              >
                {item.icon}
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-800">
              {item.value || "—"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AcademicOverview;
