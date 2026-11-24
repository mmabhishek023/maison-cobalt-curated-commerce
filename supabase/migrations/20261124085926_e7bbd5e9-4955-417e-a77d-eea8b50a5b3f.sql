CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products (category_id);
DROP POLICY IF EXISTS categories_public_read_active ON public.categories;
DROP POLICY IF EXISTS categories_admin_manage ON public.categories;
CREATE POLICY categories_public_read_active ON public.categories FOR SELECT TO anon USING (is_active);
CREATE POLICY categories_authenticated_read ON public.categories FOR SELECT TO authenticated USING (is_active OR (SELECT private.is_admin()));
CREATE POLICY categories_admin_insert ON public.categories FOR INSERT TO authenticated WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY categories_admin_update ON public.categories FOR UPDATE TO authenticated USING ((SELECT private.is_admin())) WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY categories_admin_delete ON public.categories FOR DELETE TO authenticated USING ((SELECT private.is_admin()));