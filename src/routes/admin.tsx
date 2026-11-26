import { Outlet, createFileRoute } from "@tanstack/react-router";

import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [...pageMeta("Administration", "AUREL administrator access."), { name: "robots", content: "noindex,nofollow" }] }),
  component: () => <Outlet />,
});