import { useQuery } from "@tanstack/react-query";
import { getAllThemes } from "../../features/theme/themeApi.js";

export const useAdminThemes = () => {
  return useQuery({
    queryKey: ["themes", "admin"],
    queryFn: getAllThemes,
  });
};
