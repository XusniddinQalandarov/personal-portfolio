import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export const getServerSupabaseClient = (event: H3Event) => {
  const config = useRuntimeConfig()
  
  // Use anon key for server operations (RLS policies will still apply)
  const supabase = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  return supabase
}
