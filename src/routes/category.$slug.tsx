import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/category/$slug")({
  head: () => ({ meta: pageMeta("Category", "Browse AUREL pieces in this collection.") }),
  component: () => <ConnectionPage title="Category" description="Products in this category will appear from your live store catalog after connection." />,
});