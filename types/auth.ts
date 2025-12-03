/**
 * Authentication & Session Types
 * Shared types for auth flow between API and frontend
 */

export type BrandingConfig = {
  logoUrl?: string;
  primaryColor?: string;
  companyName?: string;
};

export type DashboardButton = {
  label: string;
  icon?: string;
  link: string;
  description?: string;
};

export type AuthUser = {
  id: string;
  name: string | null;
  email: string | null;
  app_role: 'admin' | 'user';
};

export type AuthAgency = {
  id: string;
  name: string | null;
  branding_config: BrandingConfig;
  dashboard_buttons: DashboardButton[];
  billing_status: 'active' | 'past_due' | 'canceled';
};

export type AuthLocation = {
  id: string;
  name: string | null;
} | null;

export type AuthSessionResponse = {
  supabaseAccessToken: string;
  user: AuthUser;
  agency: AuthAgency;
  location: AuthLocation;
};

