import PublicPageContainer from "../../components/public/PublicPageContainer";
import PublicPageHeader from "../../components/public/PublicPageHeader";
import Card from "../../components/ui/Card";
import QueryStateHandler from "../../components/ui/QueryStateHandler";
import { getPublicInstitutionSettings } from "../../features/settings/settingsApi";
import { PUBLIC_API_KEYS } from "../../hooks/publicDataFetcherHooks/queryKeyConstants";
import { usePublicApiQuery } from "../../hooks/publicDataFetcherHooks/usePublicApiQuery";

const About = () => {
  const { data, isLoading, isPending, isError, error } = usePublicApiQuery({
    key: [...PUBLIC_API_KEYS.ABOUT],
    queryFn: getPublicInstitutionSettings,
  });

  console.log("SETTINGS ON ABOUT PAGE", data);

  return (
    <PublicPageContainer>
      <PublicPageHeader
        title="About Us"
        breadcrumbs={[{ label: "HOME", href: "/" }, { label: "ABOUT" }]}
        description="Stay updated with our latest announcements, academic information and institutional activities."
      />

      <QueryStateHandler
        isLoading={isLoading}
        isPending={isPending}
        isError={isError}
        error={error}
        loadingMessage="Loading about data..."
      >
        {/* About data will go here */}
        <div className="mx-auto w-full lg:max-w-7xl lg:py-6 py-4">
          <Card title="About Details"></Card>
        </div>
      </QueryStateHandler>
    </PublicPageContainer>
  );
};

export default About;
