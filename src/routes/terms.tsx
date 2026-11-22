import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: pageMeta("Terms and conditions", "Read the terms for shopping with AUREL.") }),
  component: () => <ConnectionPage title="Terms and conditions" description="Business-specific purchase, delivery, and returns terms require your review before launch." />,
});