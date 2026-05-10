// Domain types — match the Supabase schema in supabase/migrations/0001_init.sql

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Profile {
  id: string; // matches auth.users.id
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  slug: string; // path segment for shycares.in/[slug]
  name: string;
  tagline: string | null;
  description: string | null;
  phone: string;
  whatsapp_number: string;
  address: string | null;
  city: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  photos: string[]; // gallery image URLs
  business_hours: BusinessHours;
  currency: string; // ISO 4217, default 'INR'
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type BusinessHours = {
  [day in "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"]: {
    open: string; // "09:00"
    close: string; // "18:00"
    closed: boolean;
  };
};

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  duration_min: number;
  price: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
}

export interface Pet {
  id: string;
  customer_id: string;
  name: string;
  species: string; // dog, cat, etc.
  breed: string | null;
  age_years: number | null;
  weight_kg: number | null;
  notes: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  business_id: string;
  customer_id: string;
  pet_id: string | null;
  service_id: string;
  starts_at: string; // ISO timestamp
  ends_at: string;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Joined views (handy for UI)
export type BookingWithDetails = Booking & {
  customer: Customer;
  pet: Pet | null;
  service: Service;
};

export const DEFAULT_HOURS: BusinessHours = {
  mon: { open: "09:00", close: "19:00", closed: false },
  tue: { open: "09:00", close: "19:00", closed: false },
  wed: { open: "09:00", close: "19:00", closed: false },
  thu: { open: "09:00", close: "19:00", closed: false },
  fri: { open: "09:00", close: "19:00", closed: false },
  sat: { open: "09:00", close: "19:00", closed: false },
  sun: { open: "10:00", close: "16:00", closed: true },
};
