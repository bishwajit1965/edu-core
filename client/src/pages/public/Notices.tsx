import PublicPageHeader from "../../components/public/PublicPageHeader";
import PublicPageContainer from "../../components/public/PublicPageContainer";
import { LucideIcon } from "../../components/ui/LucideIcons";
import { getPublicNotices, type Notice } from "../../features/notice/noticeApi";
import { PUBLIC_API_KEYS } from "../../hooks/publicDataFetcherHooks/queryKeyConstants";
import { usePublicApiQuery } from "../../hooks/publicDataFetcherHooks/usePublicApiQuery";
import QueryStateHandler from "../../components/ui/QueryStateHandler";
import Card from "../../components/ui/Card";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import { normalizeDate } from "../../helpers/NormalizeDate";
import Pagination from "../../components/ui/Pagination";
import { useState } from "react";

const Notices = () => {
  const { data, isLoading, isPending, isError, error } = usePublicApiQuery({
    key: [...PUBLIC_API_KEYS.NOTICE],
    queryFn: getPublicNotices,
  });
  console.log("Notices in Notices Page", data);

  /**---> PAGINATION --->*/
  const [paginatedData, setPaginatedData] = useState<Notice[]>([]);
  const dataLength = paginatedData?.length;
  return (
    <>
      <PublicPageContainer>
        <PublicPageHeader
          title="Notice Board"
          icon={<LucideIcon.MegaphoneIcon size={25} />}
          description="Stay updated with the latest announcements, academic information and institutional activities."
          breadcrumbs={[{ label: "HOME", href: "/" }, { label: "NOTICES" }]}
          counter={data?.length ? data?.length : 0}
          actions={<div></div>}
        />

        {/* Notice listing will go here */}
        <QueryStateHandler
          isLoading={isLoading}
          isPending={isPending}
          isError={isError}
          error={error}
          loadingMessage="Loading notices..."
        >
          {/* Notice listing will go here */}
          <div className="mx-auto w-full lg:max-w-7xl lg:py-6 py-4">
            {
              <Card
                title="Latest Notices →"
                counter={paginatedData ? paginatedData?.length : 0}
              >
                {paginatedData?.map((notice) => (
                  <div
                    className="border border-gray-300 rounded-xl p-4 mb-4 shadow"
                    key={notice._id}
                  >
                    <div className="space-y-2">
                      Id: {notice?._id}
                      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <Badge color="blue">{notice?.category ?? ""}</Badge>
                        <span className="text-xs text-gray-500">
                          Published on:{" "}
                          {normalizeDate(notice?.publishedAt ?? "")}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h2 className="lg:text-xl font-bold">
                          {notice?.title ?? ""}
                        </h2>
                        <p className="text-sm leading-7 text-gray-600 whitespace-pre-line">
                          {notice?.content ?? ""}
                        </p>
                      </div>
                    </div>

                    <div className="divider"></div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span>
                          {notice?.attachments?.length && (
                            <LucideIcon.Paperclip size={16} />
                          )}
                        </span>
                        <span>
                          {notice?.attachments
                            ? notice.attachments.length > 0
                              ? notice.attachments.length +
                                `${notice.attachments.length === 1 ? " File " : " Files "} Attached`
                              : "No attachments"
                            : "No attachments"}
                        </span>
                      </div>
                      <div className="">
                        <Link
                          to={`/notices/${notice._id}`}
                          className="p-0 flex items-center gap-1 text-blue-500 hover:text-blue-800"
                        >
                          View Details <LucideIcon.ArrowBigRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ----> PAGINATION READER ---->*/}
                <div className="lg:my-8 my-4">
                  <Pagination
                    items={data ?? []}
                    dataLength={dataLength}
                    onPaginatedDataChange={setPaginatedData}
                  />
                </div>
              </Card>
            }
          </div>
        </QueryStateHandler>
      </PublicPageContainer>
    </>
  );
};

export default Notices;
