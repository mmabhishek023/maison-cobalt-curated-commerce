import { useState, type FormEvent, type PropsWithChildren } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  LayoutDashboard,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { useShopState } from "@/components/shop-state";
import { STORE_ANNOUNCEMENT, STORE_NAME } from "@/lib/store-config";
import { supabase } from "@/lib/supabase";

const primaryLinks = [
  { label: "Shop all", to: "/shop" as const },
  { label: "Categories", to: "/categories" as const },
  { label: "Our story", to: "/about" as const },
];

function SearchForm({ onSearch }: { onSearch?: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    onSearch?.();
    void navigate({ to: "/search", search: { q: value } });
  }

  return (
    <form onSubmit={submitSearch} className="relative w-full">
      <label className="sr-only" htmlFor="store-search">Search the collection</label>
      <Input
        id="store-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search the collection"
        className="h-10 border-transparent bg-secondary pl-10 text-sm shadow-none placeholder:text-soft-slate focus-visible:border-cobalt focus-visible:ring-cobalt/30"
      />
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-soft-slate" aria-hidden="true" />
    </form>
  );
}

export function StorefrontHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, roleUserId } = useAuth();
  const { cartCount, wishlist } = useShopState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function signOut() {
    if (!supabase) return;
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else {
      toast.success("You have signed out.");
      await navigate({ to: "/login", replace: true });
    }
  }

  return (
    <>
      <div className="bg-midnight px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory sm:text-[11px]">
        {STORE_ANNOUNCEMENT}
      </div>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-sm">
        <div className="page-wrap flex h-[76px] items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
          <Link to="/" className="group flex shrink-0 flex-col items-center leading-none" aria-label="AUREL home">
            <span className="editorial-title text-[27px] tracking-[0.12em] text-midnight">{STORE_NAME}</span>
            <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-soft-slate">Objects of intention</span>
          </Link>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {primaryLinks.map((link) => (
              <Link key={link.to} to={link.to} className="group inline-flex items-center gap-1 py-2 text-[12px] font-semibold text-midnight transition-colors hover:text-cobalt">
                {link.label}
                {link.label === "Categories" && <ChevronDown className="size-3.5 text-soft-slate" aria-hidden="true" />}
              </Link>
            ))}
            {user && isAdmin && roleUserId === user.id && (
              <Link to="/admin/dashboard" className="inline-flex items-center gap-2 py-2 text-[12px] font-semibold text-midnight transition-colors hover:text-cobalt">
                <LayoutDashboard className="size-3.5" aria-hidden="true" /> Admin Dashboard
              </Link>
            )}
          </nav>
          <div className="hidden w-full max-w-[250px] xl:block">
            <SearchForm />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {user ? (
              <Button variant="ghost" size="icon" title="Sign out" aria-label="Sign out" onClick={() => void signOut()}>
                <UserRound />
              </Button>
            ) : (
              <Button asChild variant="ghost" size="icon" title="Sign in" aria-label="Sign in">
                <Link to="/login"><UserRound /></Link>
              </Button>
            )}
            <Button asChild variant="ghost" size="icon" title="Wishlist" aria-label={`Wishlist, ${wishlist.length} items`} className="hidden sm:inline-flex">
              <Link to="/wishlist"><Heart /></Link>
            </Button>
            <Button asChild variant="ghost" size="icon" title="Shopping bag" aria-label={`Shopping bag, ${cartCount} items`} className="relative">
              <Link to="/cart">
                <ShoppingBag />
                {cartCount > 0 && <span className="absolute -right-1 -top-1 grid size-[17px] place-items-center rounded-full bg-cobalt text-[9px] font-bold text-primary-foreground">{cartCount}</span>}
              </Link>
            </Button>
          </div>
        </div>
        {menuOpen && (
          <div className="absolute inset-x-0 top-full border-b border-border bg-background px-5 pb-6 pt-5 shadow-lg lg:hidden">
            <div className="mx-auto max-w-xl">
              <SearchForm onSearch={() => setMenuOpen(false)} />
              <nav className="mt-4 divide-y divide-border" aria-label="Mobile navigation">
                {primaryLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3.5 text-sm font-semibold text-midnight">
                    {link.label}<ArrowRight className="size-4 text-soft-slate" />
                  </Link>
                ))}
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3.5 text-sm font-semibold text-midnight">Wishlist<Heart className="size-4 text-soft-slate" /></Link>
                <Link to={user ? "/account" : "/login"} onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3.5 text-sm font-semibold text-midnight">{user ? "My account" : "Sign in"}<UserRound className="size-4 text-soft-slate" /></Link>
                {user && isAdmin && roleUserId === user.id && (
                  <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3.5 text-sm font-semibold text-midnight">Admin Dashboard<LayoutDashboard className="size-4 text-soft-slate" /></Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export function StorefrontFooter() {
  return (
    <footer className="bg-midnight text-ivory">
      <div className="page-wrap grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-20">
        <div className="max-w-xs">
          <Link to="/" className="editorial-title text-3xl tracking-[0.12em] text-ivory">{STORE_NAME}</Link>
          <p className="mt-5 text-sm leading-7 text-ivory/70">A considered collection of pieces made to stay with you.</p>
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-champagne">Thoughtfully chosen. Made to matter.</p>
        </div>
        <FooterLinkGroup title="Explore" links={[["Shop all", "/shop"], ["Categories", "/categories"], ["Wishlist", "/wishlist"]]} />
        <FooterLinkGroup title="AUREL" links={[["Our story", "/about"], ["Contact", "/contact"], ["My account", "/account"]]} />
        <FooterLinkGroup title="Information" links={[["Privacy policy", "/privacy"], ["Terms & conditions", "/terms"], ["Order tracking", "/account/orders"]]} />
      </div>
      <div className="border-t border-ivory/15">
        <div className="page-wrap flex flex-col gap-2 py-5 text-[10px] text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} AUREL. All rights reserved.</span>
          <span>Payments are secured by your chosen provider.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map(([label, to]) => (
          <li key={to}><Link to={to} className="text-sm text-ivory/70 transition-colors hover:text-ivory">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export function StorefrontShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StorefrontHeader />
      <main>{children}</main>
      <StorefrontFooter />
    </div>
  );
}