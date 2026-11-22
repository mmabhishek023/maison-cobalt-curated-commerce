import { supabase } from "@/lib/supabase";

export type ProductImage = {
  id: string;
  url: string;
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
};

const PRODUCT_SELECT =
  "id,name,slug,description,price,discount_percentage,stock_quantity,sku,category_id,created_at,product_images(id,storage_path,image_url,sort_order,is_primary),categories(name,slug)";

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function numberValue(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function imageUrl(image: Record<string, unknown>): string {
  const directUrl = stringValue(image["image_url"]);
  if (directUrl.startsWith("https://") || directUrl.startsWith("http://")) return directUrl;
  const path = stringValue(image["storage_path"]);
  if (path && supabase) {
    return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }
  return directUrl || path;
}

function mapProduct(value: unknown): Product {
  const row = asRecord(value);
  const category = asRecord(row["categories"]);
  const rawImages = Array.isArray(row["product_images"]) ? row["product_images"] : [];
  const images = rawImages
    .map((value) => {
      const image = asRecord(value);
      return {
        id: stringValue(image["id"]),
        url: imageUrl(image),
        sortOrder: numberValue(image["sort_order"]),
        isPrimary: image["is_primary"] === true,
      };
    })
    .filter((image) => image.url)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder);
  const price = numberValue(row["price"]);
  const discountPercentage = numberValue(row["discount_percentage"]);
  return {
    id: stringValue(row["id"]),
    slug: stringValue(row["slug"], stringValue(row["id"])),
    name: stringValue(row["name"]),
    description: stringValue(row["description"]),
    price: Math.max(0, price * (1 - discountPercentage / 100)),
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
  if (!supabase) return { data: [], error: "Connect your Supabase project to load the live catalog." };
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: !filters.newestFirst });
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  const { data, error } = await query;
  return { data: (data ?? []).map(mapProduct), error: error?.message ?? null };
}

export async function getProduct(slug: string): Promise<CatalogResult<Product | null>> {
  if (!supabase) return { data: null, error: "Connect your Supabase project to load product details." };
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return { data: data ? mapProduct(data) : null, error: error?.message ?? null };
}

export async function listCategories(): Promise<CatalogResult<Category[]>> {
  if (!supabase) return { data: [], error: "Connect your Supabase project to load categories." };
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