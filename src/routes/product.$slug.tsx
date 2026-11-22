import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({ meta: pageMeta("Product details", "View product details and availability from AUREL's live catalog.") }),
  component: () => <ConnectionPage title="Product details" description="Product information, images, and stock status will appear from your connected catalog." />,
});