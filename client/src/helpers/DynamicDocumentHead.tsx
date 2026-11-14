import { useEffect } from "react";

interface DynamicDocumentHeadProps {
  favicon?: string;
  siteTitle?: string;
  pageTitle?: string;
}

const DynamicDocumentHead = ({
  favicon,
  siteTitle,
  pageTitle,
}: DynamicDocumentHeadProps) => {
  useEffect(() => {
    if (favicon) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');

      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }

      link.href = favicon;
      link.type = "image/png";
    }

    if (siteTitle) {
      document.title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
    }
  }, [favicon, siteTitle, pageTitle]);

  return null;
};

export default DynamicDocumentHead;
