import { useState } from "react";
import { normalizeDate } from "../../../helpers/NormalizeDate";
import type { Notice } from "../../notice/noticeApi";
import Modal from "../../../components/ui/Modal";
import { LucideIcon } from "../../../components/ui/LucideIcons";
import { FileText } from "lucide-react";

const bgColors = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-amber-400",
  "bg-amber-600",
  "bg-purple-600",
  "bg-pink-600",
];
const NoticesSection = ({ notices }: { notices: Notice[] }) => {
  const [notice, setNotice] = useState<Notice | null>(null);

  const handleViewNotice = (noticeId: string) => {
    const selectedNotice = notices.find((notice) => notice._id === noticeId);
    setNotice(selectedNotice ?? null);
  };

  console.log("Notice in theme", notice);
  return (
    <div className="space-y-4">
      {notices.map((notice, index) => {
        const colorClass = bgColors[index % bgColors.length];

        return (
          <article
            key={notice._id}
            className="flex gap-4 border-b border-slate-300 pb-4"
          >
            <div
              className={`${colorClass} flex h-28 w-20 shrink-0 flex-col items-center justify-center rounded-xl text-white shadow-sm space-y-1`}
            >
              <span className="text-xl font-extrabold leading-none">
                {notice.publishedAt
                  ? new Date(notice.publishedAt).toLocaleString("en-US", {
                      day: "2-digit",
                    })
                  : ""}
              </span>
              <span className="mt-1 text-sm">
                {notice.publishedAt
                  ? new Date(notice.publishedAt).toLocaleString("en-US", {
                      month: "short",
                    })
                  : ""}
              </span>

              <span className="text-xl font-extrabold leading-none">
                {notice.publishedAt
                  ? new Date(notice.publishedAt).toLocaleString("en-US", {
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-extrabold leading-none line-clamp-2">
                {notice.title}
              </h3>
              <p className="mt-1 text-sm leading-6 line-clamp-2 text-slate-500">
                {notice.content}
              </p>
              <p className="text-sm font-bold leading-none">
                Last date: {normalizeDate(notice.expiresAt)}
              </p>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleViewNotice(notice._id)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  View Details →
                </button>
              </div>
            </div>
          </article>
        );
      })}

      {/* View Notice Modal */}
      <Modal isOpen={!!notice} onClose={() => setNotice(null)} title="Notice">
        <div className="space-y-2">
          <h1 className="lg:text-xl text-lg font-bold">
            {notice?.title ?? ""}
          </h1>
          <p className="flex items-center gap-1">
            <LucideIcon.CalendarClock size={16} />
            Published on: {normalizeDate(notice?.publishedAt)}
          </p>
          <p>{notice?.content ?? ""}</p>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <LucideIcon.List size={16} />
              {notice?.category}
            </span>
            <span className="flex items-center gap-1">
              <LucideIcon.User size={16} /> {notice?.audience}
            </span>
          </div>
          <p className="flex items-center gap-1">
            <span className="text-red-600">Deadline:</span>{" "}
            <LucideIcon.CalendarClock size={16} />
            {normalizeDate(notice?.expiresAt ?? "")}
          </p>

          <div className="">
            {notice?.attachments
              ? notice.attachments?.map((attachment) => (
                  <div className="flex items-center justify-between gap-2 border border-gray-300 shadow p-2 rounded-md">
                    <div className=" ">
                      {attachment.resourceType === "image" ? (
                        <img
                          src={attachment?.url}
                          alt=""
                          className="h-16 w-16 object-covers rounded-md hover:scale-125"
                        />
                      ) : (
                        <FileText className="h-8 w-8 text-gray-500" />
                      )}
                    </div>
                    <div className="">
                      {(attachment.bytes / 1024).toFixed(2)} KB
                    </div>
                    <div className="">
                      <a
                        href={attachment.url}
                        target="_blank"
                        className="flex text-sm text-blue-600 hover:underline items-center justify-center gap-1"
                      >
                        View Attachment <LucideIcon.ArrowBigRight size={16} />
                      </a>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NoticesSection;
