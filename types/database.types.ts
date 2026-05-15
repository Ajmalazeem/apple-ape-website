// types/database.types.ts
// Hand-stubbed types. Regenerate with:
//   npx supabase gen types typescript --linked > types/database.types.ts
// once your project is linked. The shapes below match 0001_init.sql.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type GameStatus = "live" | "coming_soon" | "archived";
export type Web3Status = "live" | "testnet" | "coming_soon" | "archived";
export type EmploymentType = "full_time" | "part_time" | "contract" | "internship";

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          slug: string;
          title: string;
          tagline: string | null;
          description: string | null;
          genre: string | null;
          platforms: string[];
          status: GameStatus;
          hero_image_url: string | null;
          trailer_url: string | null;
          screenshots: Json;
          play_store_url: string | null;
          app_store_url: string | null;
          release_date: string | null;
          downloads_count: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["games"]["Row"]> & {
          slug: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["games"]["Row"]>;
        Relationships: [];
      };
      web3_projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          chains: string[];
          live_url: string | null;
          contract_addresses: Json;
          audit_url: string | null;
          supported_wallets: string[];
          status: Web3Status;
          hero_image_url: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["web3_projects"]["Row"]> & {
          slug: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["web3_projects"]["Row"]>;
        Relationships: [];
      };
      apps: {
        Row: {
          id: string;
          slug: string;
          title: string;
          tagline: string | null;
          description: string | null;
          category: string | null;
          platforms: string[];
          status: GameStatus;
          hero_image_url: string | null;
          screenshots: Json;
          play_store_url: string | null;
          app_store_url: string | null;
          release_date: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["apps"]["Row"]> & {
          slug: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["apps"]["Row"]>;
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string | null;
          photo_url: string | null;
          socials: Json;
          display_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["team_members"]["Row"]> & {
          name: string;
          role: string;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Row"]>;
        Relationships: [];
      };
      job_openings: {
        Row: {
          id: string;
          slug: string;
          title: string;
          department: string | null;
          location: string | null;
          employment_type: EmploymentType | null;
          description: string | null;
          requirements: string | null;
          perks: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["job_openings"]["Row"]> & {
          slug: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["job_openings"]["Row"]>;
        Relationships: [];
      };
      job_applications: {
        Row: {
          id: string;
          job_id: string;
          name: string;
          email: string;
          resume_url: string | null;
          cover_letter: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["job_applications"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["job_applications"]["Row"]>;
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content_mdx: string;
          cover_image_url: string | null;
          author_id: string | null;
          tags: string[];
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["posts"]["Row"]> & {
          slug: string;
          title: string;
          content_mdx: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Row"]>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          confirmed: boolean;
          confirm_token: string;
          created_at: string;
        };
        Insert: { email: string; confirmed?: boolean; confirm_token?: string };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Row"]>;
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          ip_hash?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["contact_submissions"]["Row"]>;
        Relationships: [];
      };
      studio_stats: {
        Row: {
          id: string;
          key: string;
          label: string;
          value: string;
          display_order: number;
        };
        Insert: { key: string; label: string; value: string; display_order?: number };
        Update: Partial<Database["public"]["Tables"]["studio_stats"]["Row"]>;
        Relationships: [];
      };
      rate_limit_buckets: {
        Row: { ip_hash: string; action: string; window_start: string; count: number };
        Insert: { ip_hash: string; action: string; window_start: string; count?: number };
        Update: Partial<{ ip_hash: string; action: string; window_start: string; count: number }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      check_rate_limit: {
        Args: {
          p_ip_hash: string;
          p_action: string;
          p_max_count: number;
          p_window_seconds: number;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
