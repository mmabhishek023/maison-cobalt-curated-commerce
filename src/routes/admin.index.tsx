import { createFileRoute } from "@tanstack/react-router";

import { AdminIndexPage } from "@/components/admin-portal";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [...pageMeta("Admin access", "AUREL administrator workspace access."), { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminIndexPage,
});