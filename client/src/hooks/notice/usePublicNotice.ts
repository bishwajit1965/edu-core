import { useQuery } from "@tanstack/react-query";
import { getPublicNotices } from "../../features/notice/noticeApi.js";

export const usePublicNotices = () => {
  return useQuery({
    queryKey: ["notices", "public"],
    queryFn: getPublicNotices,
  });
};
