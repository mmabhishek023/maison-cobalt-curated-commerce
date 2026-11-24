import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/lib/supabase";

export type CustomerAddress = Database["public"]["Tables"]["customer_addresses"]["Row"];

export type AddressDraft = {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: string;
  is_default: boolean;
};

export async function listCustomerAddresses(userId: string) {
  return supabase
    .from("customer_addresses")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
}

export async function saveCustomerAddress(draft: AddressDraft, addressId?: string) {
  const args = {
    p_address_id: addressId ?? null,
    p_full_name: draft.full_name,
    p_phone: draft.phone,
    p_address_line1: draft.address_line1,
    p_address_line2: draft.address_line2,
    p_city: draft.city,
    p_state: draft.state,
    p_postal_code: draft.postal_code,
    p_country: draft.country,
    p_latitude: null,
    p_longitude: null,
    p_address_type: draft.address_type,
    p_is_default: draft.is_default,
  };

  // The database accepts NULL for a new address, while its generated RPC type omits that nullability.
  return supabase.rpc(
    "save_delivery_address",
    args as unknown as Database["public"]["Functions"]["save_delivery_address"]["Args"],
  );
}

export async function deleteCustomerAddress(addressId: string) {
  return supabase.rpc("delete_delivery_address", { p_address_id: addressId });
}

export async function updateCustomerProfile(userId: string, fullName: string, phone: string) {
  return supabase.from("profiles").update({ full_name: fullName, phone }).eq("id", userId);
}

export async function placeCustomerOrder(
  lines: Array<{ productId: string; quantity: number }>,
  addressId: string | null,
  newAddress: AddressDraft | null,
  couponCode: string,
) {
  const p_items = lines.map((line) => ({ product_id: line.productId, quantity: line.quantity }));
  const p_coupon_code = couponCode.trim() || undefined;
  if (addressId) {
    return supabase.rpc("checkout_with_delivery_address", {
      p_items,
      p_address_id: addressId,
      ...(p_coupon_code ? { p_coupon_code } : {}),
    });
  }
  return supabase.rpc("checkout_with_delivery_address", {
    p_items,
    p_new_address: newAddress as AddressDraft,
    ...(p_coupon_code ? { p_coupon_code } : {}),
  });
}

export async function listCustomerOrders(userId: string) {
  return supabase
    .from("orders")
    .select(
      "id,order_number,status,payment_status,subtotal,coupon_discount,total_amount,created_at,shipped_at,delivered_at,courier_name,tracking_number,delivery_address_snapshot,order_items(product_name,product_image,sku,quantity,unit_price,product_discount_percentage,discounted_unit_price,line_total)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function getCustomerOrderNumber(orderId: string, userId: string) {
  return supabase
    .from("orders")
    .select("order_number")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();
}