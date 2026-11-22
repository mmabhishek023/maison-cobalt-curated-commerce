import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useShopState } from "@/components/shop-state";
import { getProduct, listCategories, listProducts, type Category, type Product } from "@/lib/catalog";
import { formatRupees } from "@/lib/store-config";

export function useCatalogProducts(options: { search?: string; categoryId?: string; newestFirst?: boolean } = {}) {
  const search = options.search ?? "";
  const categoryId = options.categoryId ?? "";
  const newestFirst = options.newestFirst ?? true;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void listProducts({ ...(search ? { search } : {}), ...(categoryId ? { categoryId } : {}), newestFirst }).then((result) => {
      if (!active) return;
      setProducts(result.data);
      setError(result.error);
      setLoading(false);
    });
    return () => { active = false; };
  }, [search, categoryId, newestFirst]);

  return { products, loading, error };
}

export function useCatalogCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void listCategories().then((result) => {
      if (!active) return;
      setCategories(result.data);
      setError(result.error);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);
  return { categories, loading, error };
}

export function useCatalogProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setLoading(true);
    void getProduct(slug).then((result) => {
      if (!active) return;
      setProduct(result.data);
      setError(result.error);
      setLoading(false);
    });
    return () => { active = false; };
  }, [slug]);
  return { product, loading, error };
}

export function PageHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cobalt">{eyebrow}</p>}
      <h1 className="editorial-title mt-3 text-4xl leading-tight text-midnight sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-sm leading-7 text-soft-slate sm:text-base">{description}</p>}
    </div>
  );
}

export function CatalogNotice({ message, loading = false }: { message?: string | null | undefined; loading?: boolean }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center border border-dashed border-border bg-card/60 px-6 py-10 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-secondary text-cobalt">
        {loading ? <span className="size-5 animate-spin rounded-full border-2 border-cobalt/25 border-t-cobalt" /> : <Sparkles className="size-5" />}
      </span>
      <h3 className="mt-4 text-sm font-bold text-midnight">{loading ? "Gathering the collection" : "Your collection is taking shape"}</h3>
      <p className="mt-2 max-w-sm text-xs leading-6 text-soft-slate">{loading ? "AUREL’s latest pieces will appear here." : message ?? "There are no matching pieces at the moment."}</p>
    </div>
  );
}

export function ProductGrid({ products, loading, emptyMessage, columns = 4 }: { products: Product[]; loading?: boolean; emptyMessage?: string; columns?: 3 | 4 }) {
  if (loading) return <CatalogNotice loading />;
  if (!products.length) return <CatalogNotice message={emptyMessage} />;
  return (
    <div className={`grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-11 ${columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShopState();
  const image = product.images[0]?.url;
  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-sm bg-secondary">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="block aspect-[4/5] overflow-hidden" aria-label={`View ${product.name}`}>
          {image ? (
            <img src={image} alt={product.name} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
          ) : (
            <div className="grid size-full place-items-center bg-gradient-to-br from-secondary via-ivory to-accent/40"><ShoppingBag className="size-8 text-soft-slate/45" /></div>
          )}
        </Link>
        {product.discountPercentage > 0 && <span className="absolute left-3 top-3 bg-midnight px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-ivory">-{Math.round(product.discountPercentage)}%</span>}
        <Button
          variant="ghost"
          size="icon"
          title={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-2.5 top-2.5 size-9 rounded-full bg-background/90 text-midnight shadow-sm backdrop-blur-sm hover:bg-background"
        >
          <Heart className={`size-4 ${isWishlisted(product.id) ? "fill-cobalt text-cobalt" : ""}`} />
        </Button>
        <Button
          variant="default"
          size="icon"
          title="Add to bag"
          aria-label={`Add ${product.name} to bag`}
          disabled={product.stock < 1}
          onClick={() => addToCart(product)}
          className="absolute bottom-3 right-3 size-10 translate-y-2 rounded-full opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
        >
          <ShoppingBag className="size-4" />
        </Button>
      </div>
      <div className="pt-3">
        {product.categoryName && <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-soft-slate">{product.categoryName}</p>}
        <Link to="/product/$slug" params={{ slug: product.slug }} className="mt-1 block truncate text-sm font-semibold text-midnight transition-colors hover:text-cobalt">{product.name}</Link>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-bold text-midnight">{formatRupees(product.price)}</span>
          {product.originalPrice > product.price && <span className="text-xs text-soft-slate line-through">{formatRupees(product.originalPrice)}</span>}
          {product.stock < 1 && <span className="text-[10px] font-semibold uppercase tracking-wide text-soft-slate">Sold out</span>}
        </div>
      </div>
    </article>
  );
}