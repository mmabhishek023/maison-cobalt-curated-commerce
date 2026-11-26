import type { Database } from "@/integrations/supabase/types";
import { listAdminCategories, listProducts, type Category, type Product } from "@/lib/catalog";
import { supabase } from "@/lib/supabase";

export type ProductDraft = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  discountPercentage: number;
  stock: number;
  categoryId: string;
  isActive: boolean;
};

export type CategoryDraft = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
};

export type CouponDraft = {
  id?: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number | null;
  usageLimit: number | null;
  usageLimitPerUser: number | null;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
};

export async function listAdminProducts() {
  return listProducts({ includeInactive: true, newestFirst: true });
}

export async function saveAdminProduct(draft: ProductDraft): Promise<{ id: string; error: string | null }> {
  const record = {
    name: draft.name.trim(),
    slug: draft.slug.trim(),
    sku: draft.sku.trim(),
    description: draft.description.trim() || null,
    price: draft.price,
    discount_percentage: draft.discountPercentage,
    discounted_price: draft.discountPercentage > 0 ? draft.price * (1 - draft.discountPercentage / 100) : null,
    stock_quantity: draft.stock,
    category_id: draft.categoryId || null,
    is_active: draft.isActive,
  };

  const result = draft.id
    ? await supabase.from("products").update(record).eq("id", draft.id).select("id").single()
    : await supabase.from("products").insert(record).select("id").single();
  return { id: result.data?.id ?? draft.id ?? "", error: result.error?.message ?? null };
}

export async function uploadAdminProductImages(product: Product, files: File[]) {
  if (!files.length) return null;
  const { data: currentImages, error: listError } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: false });
  if (listError) return listError.message;
  const startingOrder = currentImages?.[0]?.sort_order ?? -1;
  const uploadedPaths: string[] = [];

  for (const [index, file] of files.entries()) {
    if (!file.type.startsWith("image/")) return "Choose image files only.";
    const extension = file.type.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "img";
    const path = `${product.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) {
      if (uploadedPaths.length) await supabase.storage.from("product-images").remove(uploadedPaths);
      return uploadError.message;
    }
    uploadedPaths.push(path);
    const { error: imageError } = await supabase.from("product_images").insert({
      product_id: product.id,
      storage_path: path,
      alt_text: product.name,
      sort_order: startingOrder + index + 1,
    });
    if (imageError) {
      await supabase.storage.from("product-images").remove(uploadedPaths);
      return imageError.message;
    }
    if (!product.images.length && index === 0) {
      const publicUrl = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
      const { error: primaryError } = await supabase
        .from("products")
        .update({ primary_image_path: path, image_url: publicUrl })
        .eq("id", product.id);
      if (primaryError) return primaryError.message;
    }
  }
  return null;
}

export async function deleteAdminProductImage(imageId: string, storagePath: string) {
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) return error.message;
  const { error: storageError } = await supabase.storage.from("product-images").remove([storagePath]);
  return storageError?.message ?? null;
}

export async function saveAdminCategory(draft: CategoryDraft) {
  const record = {
    name: draft.name.trim(),
    slug: draft.slug.trim(),
    description: draft.description.trim() || null,
    image_url: draft.imageUrl.trim() || null,
    is_active: draft.isActive,
  };
  return draft.id
    ? supabase.from("categories").update(record).eq("id", draft.id)
    : supabase.from("categories").insert(record);
}

export async function saveAdminCoupon(draft: CouponDraft) {
  const record: Database["public"]["Tables"]["coupons"]["Insert"] = {
    code: draft.code.trim().toUpperCase(),
    description: draft.description.trim() || null,
    discount_type: draft.discountType,
    discount_value: draft.discountValue,
    minimum_order_amount: draft.minimumOrderAmount,
    maximum_discount_amount: draft.maximumDiscountAmount,
    usage_limit: draft.usageLimit,
    usage_limit_per_user: draft.usageLimitPerUser,
    starts_at: draft.startsAt,
    expires_at: draft.expiresAt,
    is_active: draft.isActive,
  };
  return draft.id
    ? supabase.from("coupons").update(record).eq("id", draft.id)
    : supabase.from("coupons").insert(record);
}

export async function listAdminOrders(search: string) {
  const searchTerm = search.trim();
  return supabase.rpc("admin_search_orders", {
    ...(searchTerm ? { p_search: searchTerm } : {}),
    p_limit: 100,
    p_offset: 0,
  });
}

export async function updateAdminOrder(
  orderId: string,
  status: string,
  courierName: string,
  trackingNumber: string,
) {
  return supabase.rpc("admin_update_order_status", {
    p_order_id: orderId,
    p_new_status: status,
    ...(courierName ? { p_courier_name: courierName } : {}),
    ...(trackingNumber ? { p_tracking_number: trackingNumber } : {}),
  });
}

export async function listAdminCustomers() {
  return supabase
    .from("profiles")
    .select("id,full_name,email,phone,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
}

export async function listAdminCoupons() {
  return supabase.from("coupons").select("*").order("created_at", { ascending: false });
}

export async function setCouponActive(couponId: string, isActive: boolean) {
  return supabase.from("coupons").update({ is_active: isActive }).eq("id", couponId);
}

export async function setCategoryActive(categoryId: string, isActive: boolean) {
  return supabase.from("categories").update({ is_active: isActive }).eq("id", categoryId);
}

export type AdminProduct = Product;
export type AdminCategory = Category;
export type AdminCoupon = Database["public"]["Tables"]["coupons"]["Row"];