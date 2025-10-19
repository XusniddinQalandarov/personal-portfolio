import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
  
  try {
    const { data, error } = await client
      .from('education')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch education'
      })
    }
    
    return {
      success: true,
      data: data || []
    }
    
  } catch (error: any) {
    console.error('Education API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching education'
    })
  }
})
