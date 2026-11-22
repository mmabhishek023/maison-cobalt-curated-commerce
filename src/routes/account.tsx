import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: pageMeta("My account", "Manage your AUREL account, profile, and saved addresses.") }),
  component: () => <ConnectionPage title="My account" description="Customer profiles, saved addresses, and order history require your connected account service and existing database schema." />,
});