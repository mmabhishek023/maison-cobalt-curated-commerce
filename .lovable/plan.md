# Premium Commerce Storefront

## Build
- Create a polished, mobile-first storefront for home, browsing, categories, search, product details, cart, checkout, contact, about, privacy, and terms.
- Add email sign-up, login, verification and password recovery, plus customer pages for editable profile details, addresses, wishlist, orders, and tracking.
- Add a distinct admin workspace for overview, product and image management, categories, coupons, orders, and customer records.
- Use the supplied brand palette, editorial typography, premium product imagery, accessible controls, and restrained motion.
- Keep products, categories, account details, and orders empty or unavailable rather than inventing sample records. Checkout must never claim payment succeeded without a configured provider.

## Integration and safety
- The project currently has no connected data service or shopping implementation. I cannot inspect an existing database until your existing project is connected in Lovable under Settings → General → External Supabase.
- Prepare the official Supabase client around `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (also accept the publishable-key name). Once connected, inspect the real schema before wiring queries; list missing tables/functions and required SQL rather than assuming or seeding a schema.
- Keep customer records scoped to the signed-in customer and admin screens behind the `user_roles` admin check; secure writes, order totals, stock, and coupons must remain enforced by database policies/functions.
- Use the project's supported TanStack Start routing; the requested React/Tailwind frontend is already on this stack.

## Technical details
- Add route-level metadata, shared reusable storefront/admin layouts, typed service boundaries, and accessible loading/error/empty states.
- Use `place_order` and `admin_update_order_status` only if present and confirmed; otherwise expose the missing secure database function as a setup requirement.
- Verify route coverage, responsive presentation, core local UI interactions, shipping rule, tests, and preview health. Full data/auth/order verification remains blocked until the existing project is connected and its required schema is available.
