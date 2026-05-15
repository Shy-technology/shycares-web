// Shycares domain types
// Mirrors public schema in Supabase. Keep in sync with migrations.

// ============ Existing entities ============

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  phone: string;
  whatsapp_number: string;
  address: string | null;
  city: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  profile_photo_url: string | null;
  owner_display_name: string | null;
  manual_pets_served: number | null;
  years_in_business: number | null;
  photos: string[];
  business_hours: BusinessHours;
  currency: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type BusinessHours = {
  [day in "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"]: {
    open: string;
    close: string;
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
  default_shampoo_cost: number | null;
  default_consumable_cost: number | null;
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
  species: string;
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
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
  notes: string | null;
  cancel_token: string;
  // Salon OS additions
  platform_id: string | null;
  team_id: string | null;
  location_type: "salon" | "home";
  home_address: string | null;
  agreed_price: number | null;
  cash_or_platform: "cash" | "platform" | null;
  entered_manually: boolean;
  external_ref: string | null;
  created_at: string;
  updated_at: string;
}

export type BookingWithDetails = Booking & {
  customer: Customer;
  pet: Pet | null;
  service: Service;
  team?: Team | null;
  platform?: Platform | null;
};

// ============ Salon OS entities (Phase B) ============

export interface Platform {
  id: string;
  business_id: string;
  name: string;
  revenue_share_pct: number; // 0–100
  costs_borne_by: "platform" | "operator";
  display_color: string | null;
  is_active: boolean;
  display_order: number;
  notes: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  business_id: string;
  name: string;
  pin_hash: string;
  is_active: boolean;
  display_color: string | null;
  created_at: string;
}

export type TeamMemberRole = "groomer" | "helper" | "lead";

export interface TeamMember {
  id: string;
  team_id: string;
  name: string;
  role: TeamMemberRole;
  phone: string | null;
  created_at: string;
}

export interface ServiceLog {
  id: string;
  booking_id: string;
  team_id: string;
  business_id: string;
  travel_started_at: string | null;
  service_started_at: string | null;
  service_completed_at: string | null;
  km_traveled: number | null;
  shampoo_units_used: number | null;
  services_performed: ServicePerformedEntry[];
  complications_note: string | null;
  cash_collected: number | null;
  signed_off_by_owner_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServicePerformedEntry {
  service_id: string;
  service_name: string;
  quantity?: number;
}

// ============ Defaults ============

export const DEFAULT_HOURS: BusinessHours = {
  mon: { open: "09:00", close: "19:00", closed: false },
  tue: { open: "09:00", close: "19:00", closed: false },
  wed: { open: "09:00", close: "19:00", closed: false },
  thu: { open: "09:00", close: "19:00", closed: false },
  fri: { open: "09:00", close: "19:00", closed: false },
  sat: { open: "09:00", close: "19:00", closed: false },
  sun: { open: "10:00", close: "16:00", closed: true },
};

// Cost defaults (used by Vijay's analytics math; configurable in Phase D)
export const COST_PER_KM_RUPEES = 5;
