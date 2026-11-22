import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: pageMeta("Our story", "Learn about the AUREL point of view and thoughtfully selected collection.") }),
  component: () => <ConnectionPage title="Our story" description="AUREL is a thoughtful edit of fashion and lifestyle, chosen for lasting character and the way a well-made object can make an ordinary day feel different." />,
});