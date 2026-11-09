import { Link, useParams } from "react-router-dom";
import { getNoticeById } from "../../features/notice/noticeApi";
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

const NoticeDetails = () => {
  const { noticeId } = useParams();

  const { data, isLoading, isPending, isError, error } = usePublicApiQuery({
    key: PUBLIC_API_KEYS.NOTICE_DETAILS(noticeId ?? ""),
    queryFn: () => getNoticeById(noticeId!),
  });
  console.log("NoticeId in Notice Details Page", noticeId);
  console.log("Notice data", data);
  return (
    <div>
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
                  <div className="lg:flex grid items-center justify-between gap-2 space-y-4">
                    <span className="flex items-center gap-2">
                      <Badge color="blue">{data?.category ?? ""}</Badge>
                      <span className="text-xs"> FOR </span>
                      <Badge color="green">{data?.audience ?? ""}</Badge>
                    </span>

                    <span>
                      Published on: {normalizeDate(data?.publishedAt ?? "")}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h1 className="lg:text-2xl text-xl font-extrabold text-gray-700 flex items-center gap-2">
                      <LucideIcon.MegaphoneIcon size={25} /> {data?.title ?? ""}
                    </h1>
                    <p className="flex items-center gap-1.5 font-bold">
                      <LucideIcon.UserCog2Icon size={20} /> Published By:{" "}
                      {typeof data?.approvedBy === "object"
                        ? (data.approvedBy?.name ?? "")
                        : ""}
                      , PRINCIPAL
                    </p>
                    <p>{data?.content ?? ""}</p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="lg:flex grid gap-4 items-center lg:justify-between">
                  <div className="lg:flex grid gap-2 items-center text-sm">
                    <span className="flex items-center gap-1.5 text-sm">
                      <LucideIcon.Paperclip size={16} />{" "}
                      {data?.attachments
                        ? data?.attachments?.length > 0
                          ? data?.attachments?.length + " Files Attached"
                          : "No attachments"
                        : "No attachments"}
                    </span>

                    <span className="flex items-center gap-2">
                      {data?.attachments && data.attachments.length > 0 && (
                        <span className="">
                          <Button
                            size="xs"
                            variant="outline"
                            icon={LucideIcon.Download}
                          >
                            Download
                          </Button>
                        </span>
                      )}
                      <span className="">
                        <Button
                          size="xs"
                          variant="outline"
                          icon={LucideIcon.Download}
                        >
                          Download Pdf
                        </Button>
                      </span>
                      <span></span>
                    </span>
                  </div>
                  <Link
                    to="/notices"
                    className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700 hover:link text-sm"
                  >
                    GO BACK <LucideIcon.ArrowBigRight size={16} />
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </QueryStateHandler>
      </PublicPageContainer>
    </div>
  );
};

export default NoticeDetails;
