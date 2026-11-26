export function hasAdminRole(roles: readonly { role: string }[] | null | undefined): boolean {
  return roles?.some((entry) => entry.role === "admin") ?? false;
}