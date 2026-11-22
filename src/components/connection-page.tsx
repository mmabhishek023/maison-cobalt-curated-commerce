import { Link } from "@tanstack/react-router";
import { ArrowRight, Database } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StorefrontShell } from "@/components/storefront-shell";

export function ConnectionPage({ title, description }: { title: string; description: string }) {
  return (
    <StorefrontShell>
      <section className="page-wrap min-h-[55vh] py-16 sm:py-24">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cobalt">AUREL / {title}</p>
        <h1 className="editorial-title mt-3 text-4xl text-midnight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-soft-slate">{description}</p>
        <div className="mt-10 max-w-xl border border-border bg-card px-6 py-7">
          <Database className="size-5 text-cobalt" aria-hidden="true" />
          <h2 className="mt-4 text-sm font-bold text-midnight">Live store connection needed</h2>
          <p className="mt-2 text-xs leading-6 text-soft-slate">Connect your existing Supabase project in Lovable to load real store records. No products, account data, or orders are invented here.</p>
          <Button asChild variant="outline" className="mt-5 rounded-sm">
            <Link to="/">Return to AUREL <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>
    </StorefrontShell>
  );
}