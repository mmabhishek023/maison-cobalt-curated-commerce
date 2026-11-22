import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: pageMeta("Shop all", "Browse the full AUREL collection of fashion and lifestyle pieces.") }),
  component: () => <ConnectionPage title="Shop all" description="Browse the full AUREL collection. Your live catalog will appear here after the existing store database is connected." />,
});