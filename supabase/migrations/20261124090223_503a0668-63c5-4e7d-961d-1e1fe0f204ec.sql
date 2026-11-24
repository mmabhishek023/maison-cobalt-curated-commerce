CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data ->> 'full_name'), ''),
      NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data ->> 'name'), ''),
      NULLIF(
        pg_catalog.btrim(
          pg_catalog.concat_ws(
            ' ',
            NEW.raw_user_meta_data ->> 'first_name',
            NEW.raw_user_meta_data ->> 'last_name'
          )
        ),
        ''
      )
    ),
    NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data ->> 'phone'), '')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$;