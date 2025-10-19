import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  try {
    const { data, error } = await client
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch messages'
      })
    }
    
    return {
      success: true,
      data: data || []
    }
    
  } catch (error) {
    console.error('Messages API error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching messages'
    })
  }
})
