import {
  FaBookOpen,
  FaCalendarAlt,
  FaClipboardList,
  FaChartBar,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";
import { usePublicApiQuery } from "../../../../../hooks/publicDataFetcherHooks/usePublicApiQuery";
import { getPublicNotices } from "../../../../notice/noticeApi";

type QuickAccessItem = {
  label: string;
  description: string;
  path: string;
  icon: IconType;
  color: string;
  length?: number;
};

const quickAccessItems: QuickAccessItem[] = [
  {
    label: "Notices",
    description: "Read the latest institutional announcements",
    path: "/student-portal/student/notices",
    icon: FaBookOpen,
    color: "bg-blue-50 text-blue-700",
  },
  {
    label: "Class Routine",
    description: "Check your daily class schedule",
    path: "/student-portal/student/routine",
    icon: FaCalendarAlt,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "Examinations",
    description: "View examination information",
    path: "/student-portal/student/examinations",
    icon: FaClipboardList,
    color: "bg-purple-50 text-purple-700",
  },
  {
    label: "Results",
    description: "Access your examination results",
    path: "/student-portal/student/results",
    icon: FaChartBar,
    color: "bg-amber-50 text-amber-700",
  },
];

const QuickAccess = () => {
  const { data: notices } = usePublicApiQuery({
    key: ["student-dashboard", "public-notices"],
    queryFn: getPublicNotices,
  });

  const accessItems = quickAccessItems.map((item) =>
    item.label === "Notices" ? { ...item, length: notices?.length ?? 0 } : item,
  );

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Quick Access
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {accessItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={20} />
                </span>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                {item.label}
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {item.description}
              </p>

              {item.label === "Notices" && (
                <span className="mt-3 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {item?.length} {item?.length === 1 ? "notice" : "notices"}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default QuickAccess;
