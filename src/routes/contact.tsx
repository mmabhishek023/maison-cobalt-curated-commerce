import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: pageMeta("Contact", "Contact the AUREL team for help with your order or account.") }),
  component: () => <ConnectionPage title="Contact AUREL" description="A contact destination and message service have not been configured yet." />,
});