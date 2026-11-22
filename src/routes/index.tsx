import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CatalogNotice, ProductGrid, useCatalogCategories, useCatalogProducts } from "@/components/catalog-ui";
import { StorefrontShell } from "@/components/storefront-shell";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({ meta: pageMeta("A considered collection", "AUREL brings together enduring fashion and lifestyle pieces chosen with intention.") }),
  component: Index,
});

function Index() {
  const { products, loading: productsLoading, error: productsError } = useCatalogProducts({ newestFirst: true });
  const { categories, loading: categoriesLoading, error: categoriesError } = useCatalogCategories();
  const trending = products.slice(0, 4);
  const newArrivals = products.slice(4, 8).length ? products.slice(4, 8) : products.slice(0, 4);

  return (
    <StorefrontShell>
      <section className="overflow-hidden bg-midnight text-ivory">
        <div className="page-wrap grid min-h-[590px] items-center gap-10 py-10 md:min-h-[650px] md:grid-cols-[0.86fr_1.14fr] md:py-14">
          <div className="reveal-up relative z-10 max-w-xl py-6 md:py-12">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-champagne"><span className="h-px w-8 bg-champagne" />A new point of view</p>
            <h1 className="editorial-title mt-7 text-5xl leading-[1.08] text-ivory sm:text-6xl lg:text-7xl">AUREL.<br /><span className="text-champagne">Made to matter.</span></h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-ivory/75 sm:text-base">An edit of beautiful things for the everyday — considered in detail, chosen to stay.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="min-h-12 rounded-sm bg-cobalt px-6 text-ivory shadow-none transition-transform hover:-translate-y-0.5 hover:bg-cobalt/90">
                <Link to="/shop">Shop the edit <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-12 rounded-sm border-ivory/35 bg-transparent px-6 text-ivory shadow-none hover:bg-ivory/10 hover:text-ivory">
                <Link to="/about">Discover AUREL <ArrowUpRight className="size-4" /></Link>
              </Button>
            </div>
            <div className="mt-12 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory/60"><span className="grid size-8 place-items-center rounded-full border border-ivory/25"><ArrowDownRight className="size-4" /></span>Good things, thoughtfully found</div>
          </div>
          <div className="relative min-h-[330px] overflow-hidden rounded-sm md:h-[520px]">
            <img src="/images/storefront-editorial.jpg" alt="Cobalt leather bag and champagne gold details arranged on ivory stone" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-midnight/35 via-transparent to-transparent md:from-midnight/25" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 border border-ivory/45 bg-midnight/55 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-ivory backdrop-blur-sm"><span className="size-1.5 rounded-full bg-champagne" />The new signature</div>
          </div>
        </div>
      </section>

      <section className="section-space page-wrap">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cobalt">Find your point of view</p><h2 className="editorial-title mt-2 text-4xl text-midnight">Explore the edit</h2></div>
          <Button asChild variant="link" className="px-0 text-midnight"><Link to="/categories">All categories <MoveRight className="size-4" /></Link></Button>
        </div>
        {categories.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 3).map((category) => (
              <Link key={category.id} to="/category/$slug" params={{ slug: category.slug }} className="group relative min-h-[300px] overflow-hidden rounded-sm bg-secondary">
                {category.imageUrl && <img src={category.imageUrl} alt={category.name} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-ivory"><p className="editorial-title text-3xl">{category.name}</p><p className="mt-1 line-clamp-2 text-xs text-ivory/75">{category.description}</p></div>
              </Link>
            ))}
          </div>
        ) : <CatalogNotice loading={categoriesLoading} message={categoriesError ?? "Live categories from your store will appear here once connected."} />}
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="page-wrap section-space">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cobalt">AUREL selects</p><h2 className="editorial-title mt-2 text-4xl text-midnight">Pieces in focus</h2></div>
            <Button asChild variant="link" className="px-0 text-midnight"><Link to="/shop">Shop all <MoveRight className="size-4" /></Link></Button>
          </div>
          <ProductGrid products={trending} loading={productsLoading} emptyMessage={productsError ?? "Live products from your store will appear here once connected."} />
        </div>
      </section>

      <section className="page-wrap py-7 sm:py-10">
        <div className="grid items-center gap-6 bg-royal-blue px-6 py-8 text-ivory sm:grid-cols-[1fr_auto] sm:px-10 sm:py-9">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne">A little extra, on us</p><p className="editorial-title mt-2 text-3xl sm:text-4xl">Delivery is complimentary above ₹999.</p></div>
          <Button asChild variant="outline" className="w-fit border-ivory/50 bg-transparent text-ivory hover:bg-ivory/10 hover:text-ivory"><Link to="/shop">Explore the collection <ArrowRight className="size-4" /></Link></Button>
        </div>
      </section>

      <section className="section-space page-wrap">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="relative min-h-[350px] overflow-hidden rounded-sm bg-secondary">
            <img src="/images/storefront-editorial.jpg" alt="A close view of the AUREL edit in cobalt, ivory, and gold" loading="lazy" className="absolute inset-0 size-full object-cover md:object-[63%_50%]" />
          </div>
          <div className="max-w-xl md:pl-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cobalt">The AUREL point of view</p>
            <h2 className="editorial-title mt-4 text-4xl leading-tight text-midnight sm:text-5xl">Less, but more considered.</h2>
            <p className="mt-5 text-sm leading-7 text-soft-slate">We believe the best things earn their place. AUREL is a thoughtful edit of fashion and lifestyle — chosen for honest materials, lasting character, and the way a well-made object can make an ordinary day feel different.</p>
            <Button asChild variant="link" className="mt-5 h-auto p-0 text-midnight"><Link to="/about">More about AUREL <ArrowRight className="size-4" /></Link></Button>
          </div>
        </div>
      </section>

      <section className="bg-secondary/70">
        <div className="page-wrap section-space">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cobalt">Just arrived</p><h2 className="editorial-title mt-2 text-4xl text-midnight">New to AUREL</h2></div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-midnight hover:text-cobalt">See the full edit <ArrowRight className="size-4" /></Link>
          </div>
          <ProductGrid products={newArrivals} loading={productsLoading} emptyMessage={productsError ?? "New arrivals will appear here as your live catalog grows."} />
        </div>
      </section>

      <section className="page-wrap section-space">
        <div className="grid gap-10 border-t border-border pt-10 md:grid-cols-[0.9fr_1.1fr]">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cobalt">AUREL letters</p><h2 className="editorial-title mt-3 text-4xl text-midnight">A note from us,<br />now and then.</h2></div>
          <NewsletterForm />
        </div>
      </section>
    </StorefrontShell>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); }}>
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="h-12 min-w-0 flex-1 border-0 border-b border-border bg-transparent px-2 text-sm outline-none transition-colors placeholder:text-soft-slate focus:border-cobalt" />
      <Button type="submit" variant="default" className="h-12 rounded-sm px-6" onClick={(event) => { event.preventDefault(); }}>
        Subscribe <ArrowRight className="size-4" />
      </Button>
      <span className="sr-only">Newsletter signup requires a configured subscription table.</span>
    </form>
  );
}
