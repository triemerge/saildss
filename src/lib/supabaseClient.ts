// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const url = String(import.meta.env.VITE_SUPABASE_URL ?? '')
const anonKey = String(
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  ''
)

console.log('DEBUG SUPABASE ENV ->', {
  url,
  anonKeyStartsWith: anonKey ? anonKey.slice(0, 8) + '...' : '(empty)'
})

if (!url || !anonKey) {
  console.error('Missing Supabase env vars: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  throw new Error('Missing Supabase env vars')
}

export const supabase = createClient(url, anonKey)
