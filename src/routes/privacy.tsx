import { createFileRoute } from "@tanstack/react-router";

import { ConnectionPage } from "@/components/connection-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: pageMeta("Privacy policy", "Read AUREL's privacy policy and data practices.") }),
  component: () => <ConnectionPage title="Privacy policy" description="A business-specific privacy policy requires review before launch. No legal promises are fabricated in this draft." />,
});