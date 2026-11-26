import { createFileRoute } from "@tanstack/react-router";

import { AdminLoginPage } from "@/components/admin-portal";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [...pageMeta("Administrator sign in", "Secure sign in for AUREL administrators."), { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLoginPage,
});