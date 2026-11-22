import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: pageMeta("Sign in", "Sign in to your AUREL customer account.") }),
  component: () => <ConnectionPage title="Sign in" description="Email sign-in, verification, and password recovery require your connected authentication service." />,
});