import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { hasAdminRole } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  roleLoading: boolean;
  roleUserId: string | null;
};

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
  roleLoading: false,
  roleUserId: null,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleUserId, setRoleUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
        setLoading(false);
      }
    });
    void supabase.auth.getSession().then(({ data: result }) => {
      if (active) {
        setSession(result.session);
        setLoading(false);
      }
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      setRoleLoading(false);
      setRoleUserId(null);
      return;
    }

    let active = true;
    setRoleLoading(true);
    void supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data, error }) => {
        if (active) {
          setIsAdmin(!error && hasAdminRole(data ? [data] : null));
          setRoleUserId(userId);
          setRoleLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [userId]);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, isAdmin, roleLoading, roleUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}