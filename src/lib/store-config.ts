export const STORE_NAME = "AUREL";
export const STORE_ANNOUNCEMENT = "Complimentary shipping on orders above ₹999";
export const FREE_SHIPPING_THRESHOLD = 999;

export function formatRupees(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function qualifiesForFreeShipping(subtotal: number): boolean {
  return subtotal > FREE_SHIPPING_THRESHOLD;
}