import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: pageMeta("Shopping bag", "Review items in your AUREL shopping bag.") }),
  component: () => <ConnectionPage title="Shopping bag" description="Your bag will show real product details and availability. Checkout will remain unavailable until secure order and payment services are configured." />,
});