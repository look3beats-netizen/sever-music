'use client'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key must be provided in .env.local")
}

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
