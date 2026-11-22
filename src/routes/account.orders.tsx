import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/account/orders")({
  head: () => ({ meta: pageMeta("My orders", "View AUREL order history and tracking information.") }),
  component: () => <ConnectionPage title="My orders" description="Your own order history and tracking details will appear after account data and row access are configured." />,
});