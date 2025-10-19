import { createClient } from '@supabase/supabase-js'

// Composable for client-side Supabase operations
export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  return supabase
}
