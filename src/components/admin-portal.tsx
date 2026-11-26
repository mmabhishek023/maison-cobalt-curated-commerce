import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, LayoutDashboard, LockKeyhole, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hasAdminRole } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

function hasVerifiedAdminRole(userId: string | undefined, roleUserId: string | null, isAdmin: boolean) {
  return Boolean(userId && userId === roleUserId && isAdmin);
}

function isRoleCheckPending(
  userId: string | undefined,
  roleUserId: string | null,
  roleLoading: boolean,
) {
  return Boolean(userId && (roleLoading || roleUserId !== userId));
}

function AdminLoadingState() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div>
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-border border-t-cobalt" aria-hidden="true" />
        <p className="mt-4 text-sm text-muted-foreground">Checking administrator access</p>
      </div>
    </main>
  );
}

export function AdminLoginPage() {
  const { user, loading, isAdmin, roleLoading, roleUserId } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verifiedAdmin = hasVerifiedAdminRole(user?.id, roleUserId, isAdmin);
  const rolePending = isRoleCheckPending(user?.id, roleUserId, roleLoading);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError || !data.user) {
        setError("We couldn’t sign you in. Check your details and try again.");
        return;
      }

      const { data: role, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError || !hasAdminRole(role ? [role] : null)) {
        await supabase.auth.signOut();
        setError(
          roleError
            ? "Administrator access couldn’t be verified. Please try again or contact your system administrator."
            : "This account doesn’t have administrator access. Contact your system administrator.",
        );
        return;
      }

      await navigate({ to: "/admin/dashboard", replace: true });
    } catch {
      setError("Administrator sign-in is temporarily unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || rolePending) return <AdminLoadingState />;
  if (verifiedAdmin) return <Navigate to="/admin/dashboard" replace />;

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1.1fr)_minmax(400px,0.9fr)]">
      <section className="relative flex min-h-[250px] items-end overflow-hidden bg-midnight px-6 py-8 text-ivory sm:min-h-[300px] sm:px-10 lg:min-h-screen lg:px-14 lg:py-12">
        <img
          src="/images/storefront-editorial.jpg"
          alt="AUREL's cobalt and champagne editorial still life"
          className="absolute inset-0 size-full object-cover opacity-60"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-midnight/55" />
        <div className="relative z-10 max-w-xl">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-ivory/80 transition-colors hover:text-ivory">
            <ArrowLeft className="size-4" /> Return to AUREL
          </Link>
          <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-champagne sm:mt-16">AUREL / Private access</p>
          <h1 className="editorial-title mt-3 text-4xl leading-tight sm:text-5xl lg:text-6xl">The edit,<br />behind the scenes.</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-ivory/75">Administrator access for the people who care for the AUREL collection.</p>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-14">
        <div className="w-full max-w-[420px]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cobalt">
            <ShieldCheck className="size-4" /> Administrator sign in
          </div>
          <h2 className="editorial-title mt-4 text-4xl text-midnight">Welcome back.</h2>
          <p className="mt-3 text-sm leading-6 text-soft-slate">Sign in with your authorized AUREL administrator account.</p>

          {user && !isAdmin && (
            <div className="mt-6 border border-border bg-card px-4 py-3 text-xs leading-5 text-muted-foreground">
              You’re signed in as {user.email ?? "a customer account"}, which doesn’t have administrator access.
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={(event) => void submit(event)}>
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-xs font-semibold text-midnight">Email address</label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                inputMode="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                className="h-12 rounded-sm bg-card text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-xs font-semibold text-midnight">Password</label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-12 rounded-sm bg-card text-sm"
              />
            </div>

            {error && (
              <p role="alert" className="border border-destructive/25 bg-destructive/5 px-4 py-3 text-xs leading-5 text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={busy} className="h-12 w-full rounded-sm bg-midnight text-ivory hover:bg-royal-blue">
              {busy ? "Verifying access…" : "Sign in to administration"}
              {!busy && <ArrowRight className="size-4" />}
            </Button>
          </form>

          <div className="mt-7 flex items-start gap-3 border-t border-border pt-5 text-xs leading-5 text-soft-slate">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-cobalt" />
            <p>Administrator access is assigned separately. Public account registration cannot create an administrator account.</p>
          </div>
          <p className="mt-7 text-center text-xs text-soft-slate">
            Customer? <Link to="/login" className="font-semibold text-midnight underline-offset-4 hover:underline">Use customer sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export function AdminIndexPage() {
  const { user, loading, isAdmin, roleLoading, roleUserId } = useAuth();
  const rolePending = isRoleCheckPending(user?.id, roleUserId, roleLoading);

  if (loading || rolePending) return <AdminLoadingState />;
  if (hasVerifiedAdminRole(user?.id, roleUserId, isAdmin)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/" replace />;
}

export function AdminDashboardPage() {
  const { user, loading, isAdmin, roleLoading, roleUserId } = useAuth();
  const rolePending = isRoleCheckPending(user?.id, roleUserId, roleLoading);

  if (loading || rolePending) return <AdminLoadingState />;
  if (!hasVerifiedAdminRole(user?.id, roleUserId, isAdmin)) return <Navigate to="/" replace />;
  return <AdminWorkspace email={user?.email ?? ""} />;
}

function AdminWorkspace({ email }: { email: string }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("You couldn’t be signed out. Please try again.");
      setSigningOut(false);
      return;
    }
    toast.success("You have signed out.");
    await navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col bg-midnight px-7 py-8 text-ivory lg:flex">
        <Link to="/" className="editorial-title text-3xl tracking-[0.12em]">AUREL</Link>
        <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-ivory/60">Administration</p>
        <div className="mt-14 flex items-center gap-3 border-l-2 border-champagne pl-3 text-sm font-semibold text-ivory">
          <LayoutDashboard className="size-4 text-champagne" /> Dashboard
        </div>
        <Link to="/" className="mt-auto inline-flex items-center gap-2 text-xs text-ivory/70 transition-colors hover:text-ivory">
          <ArrowLeft className="size-4" /> Return to storefront
        </Link>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex min-h-[76px] flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-5 sm:px-8">
          <div className="lg:hidden">
            <Link to="/" className="editorial-title text-2xl tracking-[0.12em] text-midnight">AUREL</Link>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-soft-slate">Administration</p>
          </div>
          <div className="hidden text-xs text-soft-slate sm:block">{email}</div>
          <Button variant="outline" size="sm" disabled={signingOut} onClick={() => void signOut()} className="ml-auto rounded-sm">
            <LogOut className="size-4" /> {signingOut ? "Signing out…" : "Sign out"}
          </Button>
        </header>

        <main className="page-wrap py-10 sm:py-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cobalt">Private workspace</p>
          <h1 className="editorial-title mt-3 text-4xl text-midnight sm:text-5xl">AUREL Administration</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-soft-slate">Welcome back{email ? `, ${email}` : ""}. Your administrator access is verified.</p>

          <section className="mt-10 flex max-w-2xl items-start gap-4 border-y border-border py-6" aria-label="Administrator access status">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cobalt" />
            <div>
              <h2 className="text-sm font-semibold text-midnight">Administrator session active</h2>
              <p className="mt-1 text-xs leading-5 text-soft-slate">You are signed in with an account authorized to access AUREL administration.</p>
            </div>
          </section>

          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-midnight transition-colors hover:text-cobalt">
            Continue to the storefront <ArrowRight className="size-4" />
          </Link>
        </main>
      </div>
    </div>
  );
}