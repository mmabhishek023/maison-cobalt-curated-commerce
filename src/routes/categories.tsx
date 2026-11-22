import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: pageMeta("Categories", "Explore AUREL collections and category edits.") }),
  component: () => <ConnectionPage title="Categories" description="Explore AUREL collections. Live categories and their images will appear here after the existing store database is connected." />,
});