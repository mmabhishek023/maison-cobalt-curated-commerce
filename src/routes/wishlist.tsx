import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: pageMeta("Wishlist", "Return to pieces saved from AUREL's collection.") }),
  component: () => <ConnectionPage title="Wishlist" description="Your saved products will appear here after the live catalog is connected." />,
});