import { Link } from "react-router-dom";
import { getPublicNotices, type Notice } from "../../../notice/noticeApi";
import { usePublicApiQuery } from "../../../../hooks/publicDataFetcherHooks/usePublicApiQuery";

const StudentNotices = () => {
  const {
    data: notices,
    isLoading,
    isError,
  } = usePublicApiQuery({
    key: ["student-dashboard", "public-notices"],
    queryFn: getPublicNotices,
  });

  const recentNotices = [...(notices ?? [])]
    .filter((notice: Notice) => notice.status === "PUBLISHED")
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  const formatDate = (date?: string) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Recent Notices</h2>

        <Link
          to="/student-portal/student/notices"
          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          View All →
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <p className="p-6 text-sm text-slate-500">Loading notices...</p>
        ) : isError ? (
          <p className="p-6 text-sm text-red-500">Unable to load notices.</p>
        ) : recentNotices.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            No published notices available.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentNotices.map((notice) => (
              <Link
                key={notice._id}
                to="/student-portal/student/notices"
                className="block p-5 transition hover:bg-slate-50"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-800">
                      {notice.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                      {notice.content}
                    </p>

                    {notice.attachments?.length > 0 && (
                      <p className="mt-2 text-xs font-medium text-blue-700">
                        📎 {notice.attachments.length} attachment(s)
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {notice.category}
                    </span>

                    <span className="text-xs text-slate-400">
                      {formatDate(notice.publishedAt || notice.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentNotices;
