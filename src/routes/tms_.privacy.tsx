import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { TMS_PRIVACY_CONTENT } from "@/lib/tms-legal-content";

export const Route = createFileRoute("/tms_/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — The Marvellous Suspender" },
      {
        name: "description",
        content:
          "Privacy Policy for The Marvellous Suspender Chrome extension. Learn how TMS handles your data when using the Google Drive backup feature.",
      },
      { property: "og:title", content: "Privacy Policy — The Marvellous Suspender" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <LegalPage content={TMS_PRIVACY_CONTENT} />,
});
