import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client singleton.
 *
 * ENV vars diambil otomatis dari `.env.local` (lokal) atau
 * Environment Variables Vercel (production).
 *
 * Kalau ENV kosong, `supabase` = null → app tetap jalan dengan
 * localStorage (mode offline / demo). Cek dengan `isSupabaseReady()`.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseReady = () => supabase !== null;

/* ── Table names (match SQL schema) ── */
export const TABLES = {
  menu: "menu_items",
  orders: "orders",
  settings: "settings",
} as const;
