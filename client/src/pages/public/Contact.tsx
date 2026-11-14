import PublicPageContainer from "../../components/public/PublicPageContainer";
import PublicPageHeader from "../../components/public/PublicPageHeader";
import { getPublicInstitutionSettings } from "../../features/settings/settingsApi";
import QueryStateHandler from "../../components/ui/QueryStateHandler";
import { usePublicApiQuery } from "../../hooks/publicDataFetcherHooks/usePublicApiQuery";
import { PUBLIC_API_KEYS } from "../../hooks/publicDataFetcherHooks/queryKeyConstants";
import Card from "../../components/ui/Card";

const Contact = () => {
  const { data, isLoading, isPending, isError, error } = usePublicApiQuery({
    key: [...PUBLIC_API_KEYS.SETTING],
    queryFn: getPublicInstitutionSettings,
  });

  console.log("SETTINGS ON CONTACT PAGE", data);

  return (
    <PublicPageContainer>
      <PublicPageHeader
        title="Contact Us"
        breadcrumbs={[{ label: "HOME", href: "/" }, { label: "CONTACT" }]}
        description="Our contact details. Contact us unhesitatingly 24/7."
      />

      <QueryStateHandler
        isLoading={isLoading}
        isPending={isPending}
        isError={isError}
        error={error}
        loadingMessage="Loading settings..."
      >
        {/* Contact data will go here */}
        <div className="mx-auto w-full lg:max-w-7xl lg:py-6 py-4">
          <Card title="Contact Details"></Card>
        </div>
      </QueryStateHandler>
    </PublicPageContainer>
  );
};

export default Contact;
