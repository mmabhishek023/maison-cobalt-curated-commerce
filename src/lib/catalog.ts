import { supabase } from "@/lib/supabase";

export type ProductImage = {
  id: string;
  url: string;
  storagePath: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stock: number;
  sku: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  createdAt: string;
  images: ProductImage[];
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
};

export type CatalogResult<T> = { data: T; error: string | null };

type ProductQuery = {
  search?: string;
  categoryId?: string;
  newestFirst?: boolean;
  includeInactive?: boolean;
};

const PRODUCT_SELECT =
  "id,name,slug,description,price,discount_percentage,discounted_price,stock_quantity,sku,category_id,created_at,primary_image_path,image_url,product_images(id,storage_path,alt_text,sort_order),categories(name,slug)";

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function numberValue(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function errorMessage(value: unknown): string | null {
  if (typeof value !== "object" || value === null || !("message" in value)) return null;
  const message = value["message"];
  return typeof message === "string" ? message : null;
}

function imageUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("https://") || pathOrUrl.startsWith("http://")) return pathOrUrl;
  return pathOrUrl ? supabase.storage.from("product-images").getPublicUrl(pathOrUrl).data.publicUrl : "";
}

function mapProduct(value: unknown): Product {
  const row = asRecord(value);
  const categoryValue = row["categories"];
  const category = asRecord(Array.isArray(categoryValue) ? categoryValue[0] : categoryValue);
  const primaryPath = stringValue(row["primary_image_path"]);
  const rawImages = Array.isArray(row["product_images"]) ? row["product_images"] : [];
  const images = rawImages
    .map((value) => {
      const image = asRecord(value);
      const storagePath = stringValue(image["storage_path"]);
      return {
        id: stringValue(image["id"]),
        url: imageUrl(storagePath),
        storagePath,
        altText: stringValue(image["alt_text"]),
        sortOrder: numberValue(image["sort_order"]),
        isPrimary: Boolean(primaryPath && primaryPath === storagePath),
      };
    })
    .filter((image) => image.url)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder);
  const price = numberValue(row["price"]);
  const discountPercentage = numberValue(row["discount_percentage"]);
  const discountedPrice = numberValue(
    row["discounted_price"],
    price * (1 - discountPercentage / 100),
  );
  const directImage = imageUrl(stringValue(row["image_url"]));
  if (images.length === 0 && directImage) {
    images.push({
      id: "primary-image",
      url: directImage,
      storagePath: primaryPath,
      altText: stringValue(row["name"]),
      sortOrder: 0,
      isPrimary: true,
    });
  }
  return {
    id: stringValue(row["id"]),
    slug: stringValue(row["slug"], stringValue(row["id"])),
    name: stringValue(row["name"]),
    description: stringValue(row["description"]),
    price: Math.max(0, discountedPrice),
    originalPrice: price,
    discountPercentage,
    stock: Math.max(0, numberValue(row["stock_quantity"])),
    sku: stringValue(row["sku"]),
    categoryId: stringValue(row["category_id"]),
    categoryName: stringValue(category["name"]),
    categorySlug: stringValue(category["slug"]),
    createdAt: stringValue(row["created_at"]),
    images,
  };
}

export async function listProducts(filters: ProductQuery = {}): Promise<CatalogResult<Product[]>> {
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: !filters.newestFirst });
  if (!filters.includeInactive) query = query.eq("is_active", true);
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  const { data, error } = await query;
  return { data: (data ?? []).map(mapProduct), error: error?.message ?? null };
}

export async function getProduct(slug: string): Promise<CatalogResult<Product | null>> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return { data: data ? mapProduct(data) : null, error: error?.message ?? null };
}

export async function listCategories(): Promise<CatalogResult<Category[]>> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,slug,name,description,image_url")
    .eq("is_active", true)
    .order("name", { ascending: true });
  const categories = (data ?? []).map((value) => {
    const row = asRecord(value);
    return {
      id: stringValue(row["id"]),
      slug: stringValue(row["slug"]),
      name: stringValue(row["name"]),
      description: stringValue(row["description"]),
      imageUrl: stringValue(row["image_url"]),
    };
  });
  return { data: categories, error: error?.message ?? null };
}

export async function listAdminCategories(): Promise<CatalogResult<Category[]>> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,slug,name,description,image_url")
    .order("name", { ascending: true });
  const categories = (data ?? []).map((value) => {
    const row = asRecord(value);
    return {
      id: stringValue(row["id"]),
      slug: stringValue(row["slug"]),
      name: stringValue(row["name"]),
      description: stringValue(row["description"]),
      imageUrl: stringValue(row["image_url"]),
    };
  });
  return { data: categories, error: error?.message ?? null };
}

export async function getCategory(slug: string): Promise<CatalogResult<Category | null>> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,slug,name,description,image_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (!data) return { data: null, error: errorMessage(error) };
  const row = asRecord(data);
  return {
    data: {
      id: stringValue(row["id"]),
      slug: stringValue(row["slug"]),
      name: stringValue(row["name"]),
      description: stringValue(row["description"]),
      imageUrl: stringValue(row["image_url"]),
    },
    error: errorMessage(error),
  };
}