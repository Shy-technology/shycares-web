import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
}

export function whatsappLink(phone: string, message: string) {
  // Strip non-digits, keep country code
  const cleaned = phone.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

// "Reserved" slugs that can't be used as business slugs (collide with app routes)
export const RESERVED_SLUGS = new Set([
  "api",
  "auth",
  "login",
  "logout",
  "signup",
  "dashboard",
  "onboarding",
  "admin",
  "settings",
  "about",
  "contact",
  "pricing",
  "terms",
  "privacy",
  "support",
  "help",
  "blog",
  "_next",
  "static",
  "public",
  "shycares",
  "www",
]);
