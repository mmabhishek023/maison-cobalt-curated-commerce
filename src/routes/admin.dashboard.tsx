import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboardPage } from "@/components/admin-portal";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [...pageMeta("Admin dashboard", "AUREL private administration workspace."), { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminDashboardPage,
});