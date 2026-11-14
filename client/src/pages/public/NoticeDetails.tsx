import { useNavigate, useParams } from "react-router-dom";
import {
  downloadAllNoticeAttachments,
  getNoticeById,
  type MediaReference,
} from "../../features/notice/noticeApi";
import { usePublicApiQuery } from "../../hooks/publicDataFetcherHooks/usePublicApiQuery";
import { PUBLIC_API_KEYS } from "../../hooks/publicDataFetcherHooks/queryKeyConstants";
import QueryStateHandler from "../../components/ui/QueryStateHandler";
import PublicPageContainer from "../../components/public/PublicPageContainer";
import PublicPageHeader from "../../components/public/PublicPageHeader";
import Card from "../../components/ui/Card";
import { LucideIcon } from "../../components/ui/LucideIcons";
import Badge from "../../components/ui/Badge";
import { normalizeDate } from "../../helpers/NormalizeDate";
import Button from "../../components/ui/Button";
import { useState } from "react";

const getAttachmentFilename = (attachment: MediaReference) => {
  const filename = attachment.publicId.split("/").pop() || "attachment";

  // First preference: Cloudinary format
  let extension: string | undefined = attachment.format?.toLowerCase();

  // Fallback: Extract extension from URL
  if (!extension || extension === "file") {
    const match = attachment.url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    extension = match?.[1]?.toLowerCase() ?? undefined;
  }

  return extension ? `${filename}.${extension}` : filename;
};

const downloadAttachment = async (attachment: MediaReference) => {
  try {
    const response = await fetch(attachment.url);

    if (!response.ok) {
      throw new Error("Unable to download attachment.");
    }

    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = getAttachmentFilename(attachment);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Attachment download failed:", error);
  }
};

const NoticeDetails = () => {
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const { noticeId } = useParams();
  const navigate = useNavigate();

  // FETCH THE SPECIFIC NOTICE BY ID
  const { data, isLoading, isPending, isError, error } = usePublicApiQuery({
    key: PUBLIC_API_KEYS.NOTICE_DETAILS(noticeId ?? ""),
    queryFn: () => getNoticeById(noticeId ?? ""),
  });

  // Navigation handler
  const handleNavigate = () => {
    navigate("/notices");
  };

  const handleDownloadAll = async () => {
    if (!noticeId) return;

    try {
      setIsDownloadingAll(true);

      const blob = await downloadAllNoticeAttachments(noticeId);

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `notice-${noticeId}-attachments.zip`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);
    } catch (error) {
      console.error("Failed to download notice attachments:", error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  console.log("NoticeId in Notice Details Page", noticeId);
  console.log("Notice data", data);
  return (
    <PublicPageContainer>
      <PublicPageHeader
        title="Notice In Detail"
        breadcrumbs={[
          { label: "HOME", href: "/" },
          { label: "NOTICES / NOTICE" },
        ]}
        description="Stay updated with the latest announcements, academic information and institutional activities."
      />

      <QueryStateHandler
        isLoading={isLoading}
        isPending={isPending}
        isError={isError}
        error={error}
        loadingMessage="Loading notice..."
      >
        {/* Notice data will go here */}
        <div>
          <Card>
            <div className="lg:space-y-6 space-y-4">
              <div className="lg:space-y-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between lg:gap-1 gap-1 border-b border-gray-300 pb-4">
                  <span className="flex items-center gap-1">
                    <Badge color="blue">{data?.category ?? ""}</Badge>
                    <span className="text-xs -ml-2">FOR</span>{" "}
                    <Badge color="green">{data?.audience ?? ""}</Badge>
                  </span>

                  <span className="text-xs text-gray-500">
                    Pub: {normalizeDate(data?.publishedAt ?? "")}
                  </span>
                </div>
                <div className="space-y-2">
                  <h1 className="flex items-start gap-2 text-xl lg:text-2xl font-extrabold text-gray-700">
                    <LucideIcon.MegaphoneIcon size={25} /> {data?.title ?? ""}
                  </h1>
                  <p className="flex items-center gap-1.5 font-bold text-sm text-gray-600">
                    <LucideIcon.UserCog2Icon
                      size={20}
                      className="shrink-0 mt-1"
                    />{" "}
                    Published By:{" "}
                    {typeof data?.approvedBy === "object"
                      ? (data.approvedBy?.name ?? "")
                      : ""}
                    , PRINCIPAL
                  </p>
                  <p className="text-gray-700 leading-8 whitespace-pre-line text-justify">
                    {data?.content ?? ""}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="">
                {data?.attachments && data.attachments.length > 0 && (
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-700">
                      Attachments ({data.attachments.length})
                    </h3>

                    <div className="grid gap-2">
                      {data.attachments.map((attachment) => (
                        <div
                          key={attachment.publicId}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 p-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <LucideIcon.Paperclip size={14} />

                            <span className="truncate text-xs">
                              {attachment.publicId.split("/").pop()}
                              {attachment.format ? `.${attachment.format}` : ""}
                            </span>
                          </div>
                          <div className="">
                            <Button
                              size="xs"
                              variant="outline"
                              icon={LucideIcon.Download}
                              onClick={() => downloadAttachment(attachment)}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Download all attachments */}
                      <div className="flex items-center justify-between pt-2">
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          icon={LucideIcon.Download}
                          disabled={isDownloadingAll}
                          onClick={handleDownloadAll}
                        >
                          {isDownloadingAll
                            ? "Preparing ZIP..."
                            : "Download All (ZIP)"}
                        </Button>

                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          onClick={handleNavigate}
                          className="flex items-center gap-1.5 text-gray-800 hover:text-base-100 text-sm"
                        >
                          GO BACK <LucideIcon.ArrowBigRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </QueryStateHandler>
    </PublicPageContainer>
  );
};

export default NoticeDetails;
