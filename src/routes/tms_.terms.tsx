import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { TMS_TERMS_CONTENT } from "@/lib/tms-legal-content";

export const Route = createFileRoute("/tms_/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — The Marvellous Suspender" },
      {
        name: "description",
        content:
          "Terms of Use for The Marvellous Suspender Chrome extension. Free, open-source software distributed under GPLv2.",
      },
      { property: "og:title", content: "Terms of Use — The Marvellous Suspender" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <LegalPage content={TMS_TERMS_CONTENT} />,
});
