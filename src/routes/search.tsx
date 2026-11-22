import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({ q: typeof search["q"] === "string" ? search["q"] : "" }),
  head: () => ({ meta: pageMeta("Search", "Search AUREL's live collection.") }),
  component: () => <ConnectionPage title="Search" description="Search real products from your store catalog after the existing database is connected." />,
});